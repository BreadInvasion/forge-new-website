import React, { ReactNode, useMemo, useState } from 'react';
import Table, { DeleteItem, ITEMS_PER_PAGE } from '../components/Table';
import { TableHead } from '../components/Table';

import '../styles/TabStyles.scss';

import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import * as Dialog from '@radix-ui/react-dialog';
import { UserPermission } from 'src/enums';
import useAuth from '../../Auth/useAuth';
import { useResourceSlots } from 'src/hooks/useResources';
import { useMachineTypeDelete, useMachineTypeNewEdit, useMachineTypes } from 'src/hooks/useMachines';
import { MachineType } from 'src/interfaces/machines';

interface aemenuprops {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    machineType: MachineType | null;
    setMachineType: (machine: MachineType | null) => void;
}

const aemenu = (props: aemenuprops): [ReactNode, (state: boolean, mach: MachineType | null) => void] => {
    let { isDialogOpen, setIsDialogOpen, machineType, setMachineType} = props;

    const { hasPermission } = useAuth();
    const canCreate = hasPermission(UserPermission.CAN_CREATE_MACHINE_TYPES);
    const canEdit = hasPermission(UserPermission.CAN_EDIT_MACHINE_TYPES);
    const canSeeTables = hasPermission(UserPermission.CAN_SEE_TABLES);
        
    const [name, setName] = useState("");
    const {data: resourceSlots} = useResourceSlots();

    const [resourceSlotIDS, setResourceSlotIDS] = useState<string[]>([]);
    const [cost, setCost] = useState<number>(0.0);

    const aeMutation = useMachineTypeNewEdit();

    const handleCheckboxChange = (value: string) => {
        setResourceSlotIDS(prev =>
            prev.includes(value)
            ? prev.filter(item => item !== value) // remove
            : [...prev, value] // add
        );
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) setOpenExtra(false, null);
    };

    const setOpenExtra = (state: boolean, mach: MachineType | null) => {
        setMachineType(mach);
        if (mach != null) {
            setName(mach.name);
            setResourceSlotIDS(mach.resource_slot_ids);
            setCost(mach.cost_per_hour);
        } else {
            setName("");
            setResourceSlotIDS([]);
            setCost(0);
        }
        if (isDialogOpen != state) setIsDialogOpen(state);
    };

    function create() {
        if (!canCreate) {
            alert("You do not have the permissions to create machine types");
            return;
        }
        if (!name || cost == null) {
            alert("All fields must be populated!");
            return;
        }

        aeMutation.mutate({
            name,
            slots: resourceSlots
                .filter(r => resourceSlotIDS.includes(r.id))
                .map(r => r.id),
            cost
        }, {onSuccess: () => setOpenExtra(false, null)});
    }

    function edit() {
        if (!machineType) return;
        if (!canEdit) {
            alert("You do not have the permissions to edit machine types");
            return;
        }
        if (!name || cost == null) {
            alert("All fields must be populated!");
            return;
        }

        aeMutation.mutate({
            id: machineType.id,
            name,
            slots: resourceSlots
                .filter(r => resourceSlotIDS.includes(r.id))
                .map(r => r.id),
            cost
        }, {onSuccess: () => setOpenExtra(false, null)});
    }

    if (!canSeeTables || (!canCreate && !canEdit)) return [<></>, () => {}]; 
    return [(
        <Dialog.Root open={isDialogOpen} onOpenChange={handleOpenChange}>
            {canCreate && (
                <button className="addbtn" onClick={() => { setOpenExtra(true, null); }}><PlusIcon /></button>
            )}
            {(canCreate || canEdit) && (
                <Dialog.Portal>
                    <div className='AEdiv'>
                        <Dialog.Overlay className="DialogOverlay" />
                        <Dialog.Content className="DialogContent">
                            <Dialog.Close asChild>
                                <button className="IconButton" aria-label="Close">
                                    <Cross2Icon />
                                </button>
                            </Dialog.Close>
                            <Dialog.Title className="DialogTitle">{machineType == null ? "Adding" : "Editing"}  Machine Type</Dialog.Title>
                            <fieldset className="Fieldset">
                                <label className="Label" htmlFor="name">Name</label>
                                <input className="Input" id="name" value={name} onChange={e => setName(e.target.value)} maxLength={100} />

                                <label className="Label" htmlFor="resourceSlots">Resource Slots</label>
                                {resourceSlots.map(resourceSlot => (
                                    <div className="checkbox-labels" key={resourceSlot.id}>
                                        <input
                                            className='styled-checkbox'
                                            type="checkbox"
                                            checked={resourceSlotIDS.includes(resourceSlot.id)}
                                            onChange={() => handleCheckboxChange(resourceSlot.id)}
                                        />
                                        <label htmlFor='checkbox-layer-shift' className='checkbox-label'>
                                            {resourceSlot.display_name}
                                        </label>
                                    </div>
                                ))}

                                <label className="Label" htmlFor="cost">Cost</label>
                                <input className="Input" placeholder={cost + ""} id="cost" type="number" value={cost} min={0} pattern="[0-9]*" onChange={e => setCost(Math.max(0, e.target.valueAsNumber))} />
                            </fieldset>
                            <Dialog.Close asChild>
                                <button className="Button SaveBtn" onClick={machineType == null ? create : edit}>Save</button>
                            </Dialog.Close>
                        </Dialog.Content>
                    </div>
                </Dialog.Portal>
            )}
        </Dialog.Root>
    ), setOpenExtra];
};

const MachineTypes: React.FC = () => {
    const { hasPermission } = useAuth();
    const canDelete = hasPermission(UserPermission.CAN_DELETE_MACHINE_TYPES);
    const canEdit = hasPermission(UserPermission.CAN_EDIT_MACHINE_TYPES);

    const [page, setPage] = React.useState<number>(1);
    const {data: types} = useMachineTypes(page, ITEMS_PER_PAGE);
    const columns: (keyof MachineType)[] = useMemo(() => {
        if (types.length === 0) return [];
        return (Object.keys(types[0]) as (keyof MachineType)[])
            .filter((key) => !key.includes('_id') && key !== 'id' )
    }, [types]);

    const deleteMutation = useMachineTypeDelete();
    const onDelete = (index_local: number) => {
        if (!canDelete) {
            alert("You do not have the permissions to delete machine types");
            return;
        }

        deleteMutation.mutate(types[index_local].id);
    };

    const [machineType, setMachineType] = useState<MachineType | null>(null);
    let [isDialogOpen, setIsDialogOpen] = useState(false);
    let [ae, setOpen] = aemenu({isDialogOpen, setIsDialogOpen, machineType, setMachineType});

    return (
        <div className='tab-column-cover align-center'>
            <TableHead
                heading="Machine Types"
                type="machinetypes"
                aemenu={ae}
            />
            <Table<MachineType>
                columns={columns}
                data={types}
                onDelete={onDelete}
                onEdit={(e) => setOpen(true, e)}
                canEdit={canEdit}
                canDelete={canDelete}
                currentPage={page}
                onPageChange={setPage}
                resourceType={"machinetypes"}
            />
        </div>
    );
};

export default MachineTypes;