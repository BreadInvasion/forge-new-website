import React, { ReactNode, useMemo, useState } from 'react';
import Table, { TableHead, features } from '../components/Table';
import { Machine, MachineGroup } from 'src/interfaces/machines';

import '../styles/TabStyles.scss';

import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { UserPermission } from 'src/enums';
import useAuth from '../../Auth/useAuth';
import { useMachineGroupDelete, useMachineGroupNewEdit, useMachineGroups, useMachineGroupsLength, useMachines } from 'src/hooks/useMachines';
import { OmniAPI } from 'src/apis/OmniAPI';
import { createColumnHelper } from '@tanstack/react-table';

interface aemenuprops {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    machineGroup: MachineGroup | null;
    setMachineGroup: (machine: MachineGroup | null) => void;
}

const aemenu = (props: aemenuprops): [ReactNode, (state: boolean, mach: MachineGroup | null) => void] => {
    const { hasPermission } = useAuth();
    const canCreate = hasPermission(UserPermission.CAN_CREATE_MACHINE_GROUPS);
    const canEdit = hasPermission(UserPermission.CAN_EDIT_MACHINE_GROUPS);
    const canSeeTables = hasPermission(UserPermission.CAN_SEE_TABLES);

    let { isDialogOpen, setIsDialogOpen, machineGroup, setMachineGroup} = props;

    const [name, setName] = useState("");
    const {data: machines} = useMachines();
    const [machineIds, setMachineIds] = useState<string[]>([]);
    const aeMutation = useMachineGroupNewEdit();
    
    const handleCheckboxChange = (value: string) => {
        // handle potential null previous state by defaulting to an empty array
        setMachineIds(prev => {
            const p = prev ?? [];
            return p.includes(value)
                ? p.filter(item => item !== value) // remove
                : [...p, value]; // add
        });
    };
    
    function setOpenExtra (state: boolean, mach: MachineGroup | null) {
        setMachineGroup(mach);
        if (mach != null) {
            setName(mach.name);
            setMachineIds(mach.machine_ids);
            setIsDialogOpen(state);
        } else {
            setName("");
            setMachineIds([]);
            setIsDialogOpen(state);
        }
    }


    function create() {
        if (!canCreate) {
            alert("You do not have the permissions to create machine groups");
            return;
        }
        if (!name) {
            alert("Name must be populated!");
            return;
        }

        aeMutation.mutate({name, machineIds}, {onSuccess: () => setOpenExtra(false, null)});
    }

    function edit() {
        if (!machineGroup) return;
        if (!canEdit) {
            alert("You do not have the permissions to edit machine groups");
            return;
        }
        if (!name) {
            alert("Name must be populated!");
            return;
        }

        aeMutation.mutate({id: machineGroup.id, name, machineIds}, {onSuccess: () => setOpenExtra(false, null)});
    }

    if (!canSeeTables || (!canCreate && !canEdit)) return [null, setOpenExtra];
    return [(
        <Dialog.Root open={isDialogOpen} onOpenChange={(e: boolean) => { setOpenExtra(e, machineGroup); }}>
            {canCreate && (
                <button className="addbtn" onClick={() => { setOpenExtra(true, null); }}><PlusIcon /></button>
            )}
            {(canCreate || canEdit) ? (
                <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay" />
                    <Dialog.Content className="DialogContent">
                        <Dialog.Close asChild>
                            <button className="IconButton" aria-label="Close">
                                <Cross2Icon />
                            </button>
                        </Dialog.Close>
                        <Dialog.Title className="DialogTitle">{machineGroup == null ? "Adding" : "Editing"} Machine Group</Dialog.Title>
                        <fieldset className="Fieldset">
                            <label className="Label" htmlFor="name">Name</label>
                            <input className="Input" id="name" value={name} onChange={e => setName(e.target.value)} maxLength={100} />

                            <label className="Label" htmlFor="machines">Machines</label>
                            {machines.map((machine: Machine) => (
                                <div className="checkbox-labels" key={machine.id}>
                                    <input
                                        className='styled-checkbox'
                                        type="checkbox"
                                        id={machine.id}
                                        checked={machineIds == null ? false : machineIds.includes(machine.id)}
                                        onChange={() => handleCheckboxChange(machine.id)}
                                    />
                                    <label htmlFor={machine.id} className='checkbox-label'>
                                        {machine.name}
                                    </label>
                                </div>
                            ))}
                        </fieldset>
                        <Dialog.Close asChild>
                            <button className="Button SaveBtn" onClick={machineGroup == null ? create : edit}>Save</button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            ) : null}
        </Dialog.Root>
    ), setOpenExtra];
};

const columnHelper = createColumnHelper<typeof features, MachineGroup>();
const columns = columnHelper.columns([
    columnHelper.accessor('name', {
        header: 'Name'
    }),
    columnHelper.accessor(row => row.machine_names.join(', '), {
        header: 'Machines'
    })
])

const MachineGroups: React.FC = () => {
    const { hasPermission } = useAuth();
    const canDelete = hasPermission(UserPermission.CAN_DELETE_MACHINE_GROUPS);
    const canEdit = hasPermission(UserPermission.CAN_EDIT_MACHINE_GROUPS);

    const {data: rowCount} = useMachineGroupsLength();

    const deleteMutation = useMachineGroupDelete();
    const onDelete = (id: string) => {
        if (!canDelete) {
            alert("You do not have the permissions to delete machine groups");
            return;
        }
        deleteMutation.mutate(id);
    };

    let [machineGroup, setMachineGroup] = useState<MachineGroup | null>(null);
    let [isDialogOpen, setIsDialogOpen] = useState(false);
    let [ae, setOpen] = aemenu({isDialogOpen, setIsDialogOpen, machineGroup, setMachineGroup});

    return (
        <div className='tab-column-cover align-center'>
            <TableHead
                heading="Machine Groups"
                type="machinegroup"
                aemenu={ae}
            />
            <Table<MachineGroup>
                columns={columns}
                queryFn={useMachineGroups}
                onDelete={onDelete}
                onEdit={(e) => setOpen(true, e)}
                canEdit={canEdit}
                canDelete={canDelete}
                rowCount={rowCount}
            />
        </div>
    );
};

export default MachineGroups;