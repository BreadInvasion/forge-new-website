import React, { ReactNode, useState } from 'react';
import Table, { DEFAULT_PAGINATION, TableHead, features } from '../components/Table';
import { Machine, MachineGroup, MachineType } from 'src/interfaces/machines';

import '../styles/TabStyles.scss';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { UserPermission } from 'src/enums';
import useAuth from '../../Auth/useAuth';
import { createColumnHelper, PaginationState } from '@tanstack/react-table';
import { useMachineDelete, useMachineGroups, useMachineNewEdit, useMachines, useMachinesCount, useMachineTypes } from 'src/hooks/useMachines';

interface aemenuprops {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    machine: Machine | null;
    setMachine: (machine: Machine | null) => void;
}

const aemenu = (props: aemenuprops) : [ReactNode, (state: boolean, mach: Machine | null) => void] => {
    const { hasPermission } = useAuth();
    const canCreate = hasPermission(UserPermission.CAN_CREATE_MACHINES);
    const canEdit = hasPermission(UserPermission.CAN_EDIT_MACHINES);
    const canSeeTables = hasPermission(UserPermission.CAN_SEE_TABLES);
    
    let { isDialogOpen, setIsDialogOpen, machine, setMachine } = props;

    const [name, setName] = useState("");
    const [selectedMachineGroupId, setSelectedMachineGroupId] = useState<string>("_");
    const [selectedMachineTypeId, setSelectedMachineTypeId] = useState<string>("_");
    const {data: machineGroups} = useMachineGroups();
    const {data: machineTypes} = useMachineTypes();

    const [disabled, setDisabled] = useState<boolean>(false);
    const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);

    const aeMutation = useMachineNewEdit();

    function setOpenExtra (state: boolean, mach: Machine | null) {
        setMachine(mach);
        if (mach != null) {
            setName(mach.name);
            setSelectedMachineGroupId(mach.group_id);
            setSelectedMachineTypeId(mach.type_id);
            setDisabled(mach.disabled);
            setMaintenanceMode(mach.maintenance_mode);
            setIsDialogOpen(state);
        } else {
            setName("");
            setSelectedMachineGroupId("_");
            setSelectedMachineTypeId("_");
            setDisabled(false);
            setMaintenanceMode(false);
            setIsDialogOpen(state);
        }
    }

    function create() {
        if (name == "" || selectedMachineGroupId == "_" || selectedMachineTypeId == "_") {
            alert("All fields must be populated!");
            return;
        }

        aeMutation.mutate({
            name,
            groupId: selectedMachineGroupId,
            typeId: selectedMachineTypeId,
        }, {onSuccess: () => {
            setIsDialogOpen(false);
            setMachine(null);
        }});

    };

    function edit() {
        if (!machine || selectedMachineGroupId === "_" || selectedMachineTypeId === "_" ){
            alert("Invalid machine state");
            return;
        }
        aeMutation.mutate({
            id: machine.id,
            name,
            groupId: selectedMachineGroupId,
            typeId: selectedMachineTypeId,
            maintenance: maintenanceMode,
            disabled
        }, {onSuccess: () => {
            setIsDialogOpen(false);
            setMachine(null);
        }});
    }
    
    const handleSelectMachineGroup = (id: string) => {
        if (id === "_") {
            return;
        }
        setSelectedMachineGroupId(id);
    };
    const handleSelectMachineType = (id: string) => {
        if (id === "_") {
            return;
        }
        setSelectedMachineTypeId(id);
    };

    if (!canSeeTables || (!canCreate && !canEdit)) return [null, setOpenExtra];
    return [(
        <Dialog.Root open={isDialogOpen} onOpenChange={(open) => { if (!open) setMachine(null); setIsDialogOpen(open); }}>
            {canCreate && (
                <button className="addbtn" onClick={() => { setMachine(null); setIsDialogOpen(true); }}>
                    <PlusIcon />
                </button>
            )}
            {(canCreate || canEdit) ? (
                <Dialog.Portal>
                    <div className='AEdiv'>
                        <Dialog.Overlay className="DialogOverlay" />
                        <Dialog.Content className="DialogContent" aria-describedby={undefined}>
                            <Dialog.Close asChild>
                                <button className="IconButton" aria-label="Close">
                                    <Cross2Icon />
                                </button>
                            </Dialog.Close>
                            <Dialog.Title className="DialogTitle">{machine == null ? "Adding" : "Editing"} Machine</Dialog.Title>
                            <fieldset className="Fieldset">
                                <label className="Label" htmlFor="name">Name</label>
                                <input className="Input" id="name" value={name} onChange={e => setName(e.target.value)} maxLength={100} />

                                <label className="Label" htmlFor="machineGroup">Machine Group</label>
                                <select
                                    className='styled-dropdown'
                                    value={selectedMachineGroupId}
                                    onChange={(e) => handleSelectMachineGroup(e.target.value)}
                                    required
                                >
                                    <option className='styled-dropdown-placeholder' hidden>Select Machine Group</option>
                                    {machineGroups.map((machineGroup: MachineGroup) => (
                                        <option className='styled-dropdown-option' key={machineGroup.id} value={machineGroup.id}>{machineGroup.name}</option>
                                    ))}
                                </select>

                                <label className="Label" htmlFor="machineType">Machine Type</label>
                                <select
                                    className='styled-dropdown'
                                    value={selectedMachineTypeId}
                                    onChange={(e) => handleSelectMachineType(e.target.value)}
                                    required
                                >
                                    <option className='styled-dropdown-placeholder' value="_" hidden>Select Machine Type</option>
                                    {machineTypes.map((machineType: MachineType) => (
                                        <option className='styled-dropdown-option' key={machineType.id} value={machineType.id}>{machineType.name}</option>
                                    ))}
                                </select>

                                {machine != null ? <>
                                <div className="checkbox-row">
                                    <div className="checkbox-labels">
                                        <label className="Label" htmlFor="maintenance">Maintenance Mode</label>
                                        <input className="Checkbox" type="checkbox" id="maintenance" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} />
                                    </div>
                                    <div className="checkbox-labels">
                                        <label className="Label" htmlFor="disabled">Disabled</label>
                                        <input className="Checkbox" type="checkbox" id="disabled" checked={disabled} onChange={(e) => setDisabled(e.target.checked)} />
                                    </div>
                                </div>
                                </> : null}

                            </fieldset>
                            <button className="Button SaveBtn" onClick={machine == null ? create : edit}>Save</button>
                        </Dialog.Content>
                    </div>
                </Dialog.Portal>
            ) : null}
        </Dialog.Root>
    ), setOpenExtra];
};

const columnHelper = createColumnHelper<typeof features, Machine>();
const columns = columnHelper.columns([
    columnHelper.accessor('name', {
        header: 'Name'
    }),
    columnHelper.accessor('group_name', {
        header: 'Group'
    }),
    columnHelper.accessor('type_name', {
        header: 'Type'
    }),
    columnHelper.accessor('maintenance_mode', {
        header: 'Maintenance'
    }),
    columnHelper.accessor('disabled', {
        header: 'Disabled'
    }),
])

const Machines: React.FC = () => {
    const { hasPermission } = useAuth();
    const canDelete = hasPermission(UserPermission.CAN_DELETE_MACHINES);
    const canEdit = hasPermission(UserPermission.CAN_EDIT_MACHINES);

    const [page, setPage] = useState<PaginationState>(DEFAULT_PAGINATION);
    const {data} = useMachines(page);
    const {data: rowCount} = useMachinesCount();

    const deleteMutation = useMachineDelete();
    const onDelete = (id: string) => {
        if (!canDelete) {
            alert("You do not have the permissions to delete machines");
            return;
        }
        deleteMutation.mutate(id);
    };

    let [machine, setMachine]:[Machine | null, (machine: any) => void] = useState(null);
    let [isDialogOpen, setIsDialogOpen] = useState(false);
    let [ae, setOpen] = aemenu({isDialogOpen, setIsDialogOpen, machine, setMachine});

    return (
        <div className='tab-column-cover align-center'>
            <TableHead
                heading="Machines"
                type="machines"
                aemenu={ae}
            />
            <Table<Machine>
                columns={columns}
                data={data}
                pagination={page}
                onPaginationChange={setPage}
                rowCount={rowCount}
                onDelete={onDelete}
                onEdit={(e) => setOpen(true, e)}
                canEdit={canEdit}
                canDelete={canDelete}
            />
        </div>
    );
};

export default Machines;