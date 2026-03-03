import React, { ReactNode, useEffect, useState } from 'react';
import Table, { DeleteItem, TableHead, ITEMS_PER_PAGE } from '../components/Table';
import { Machine, MachineGroup, MachineType } from 'src/interfaces';

import '../styles/TabStyles.scss';

import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { OmniAPI } from 'src/apis/OmniAPI';
import { UserPermission } from 'src/enums';
import useAuth from '../../Auth/useAuth';

interface aemenuprops {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    machineGroup: MachineGroup | null;
    setMachineGroup: (machine: MachineGroup | null) => void;
    refresh: () => void;
}

const aemenu = (props: aemenuprops): [ReactNode, (state: boolean, mach: MachineGroup | null) => void] => {
    const { user } = useAuth();
    const canCreate = user.permissions.includes(UserPermission.CAN_CREATE_MACHINE_GROUPS) || user.permissions.includes(UserPermission.IS_SUPERUSER);
    const canEdit = user.permissions.includes(UserPermission.CAN_EDIT_MACHINE_GROUPS) || user.permissions.includes(UserPermission.IS_SUPERUSER);

    let { isDialogOpen, setIsDialogOpen, machineGroup, setMachineGroup, refresh} = props;

    const [name, setName] = useState("");
    const [machines, setMachines] = useState<Machine[]>([]);
    const [machineIDS, setMachineIDS] = useState<string[]>([]);

    useEffect(() => {
        OmniAPI.getAll("machines")
            .then((data: Machine[]) => setMachines(data))
            .catch(err => console.error("Error fetching machines:", err));
    }, []);
    
    const handleCheckboxChange = (value: string) => {
        // handle potential null previous state by defaulting to an empty array
        setMachineIDS(prev => {
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
            OmniAPI.get("machinegroups", mach.id).then((m) => {
                setMachineIDS(m.machine_ids);
                setIsDialogOpen(state);
            });
        } else {
            setName("");
            setMachineIDS([]);
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

        // Send API request
        OmniAPI.create("machinegroups", {
            name,
            machine_ids: machines.filter(m => machineIDS.includes(m.id)).map(m => m.id)
        }).then(() => {
            refresh();
            setOpenExtra(false, null);
        }).catch(err => {
            alert("Failed to create machine group: " + err.response?.data?.detail);
        });
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

        OmniAPI.edit("machinegroups", machineGroup.id, {
            name,
            machine_ids: machineIDS
        }).then(() => {
            refresh();
            setOpenExtra(false, null);
        }).catch(err => {
            alert("Failed to edit machine group: " + err.response?.data?.detail);
        });
    }

    if (!canCreate && !canEdit) return [null, setOpenExtra];
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
                                        checked={machineIDS == null ? false : machineIDS.includes(machine.id)}
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

const MachineGroups: React.FC = () => {
    const { user } = useAuth();
    const canDelete = user.permissions.includes(UserPermission.CAN_DELETE_MACHINE_GROUPS) || user.permissions.includes(UserPermission.IS_SUPERUSER);
    const canEdit = user.permissions.includes(UserPermission.CAN_EDIT_MACHINE_GROUPS) || user.permissions.includes(UserPermission.IS_SUPERUSER);

    const [data, setData] = React.useState<MachineGroup[]>([]);
    const columns: (keyof MachineGroup)[] = data.length > 0 ? (Object.keys(data[0]) as (keyof MachineGroup)[]).filter((key) => key !== 'id') : [];
    const [currentPage, setCurrentPage] = useState(1);

    const fetchPage = (page: number) => {
        const offset = (page - 1) * ITEMS_PER_PAGE;
        let mappings: Record<string, string> = {};
        OmniAPI.getAll("machines")
            .then((machines: Machine[]) => {
                machines.forEach(m => mappings[m.id] = m.name);
                return OmniAPI.getAll("machinegroups", { limit: ITEMS_PER_PAGE, offset });
            })
            .then(groups => {
                const newData: MachineGroup[] = groups.map((g: any) => ({
                    id: g.id,
                    name: g.name,
                    machines: g.machine_ids.map((id: string) => mappings[id])
                }));
                setData(newData);
                setCurrentPage(page);
            })
            .catch(err => console.error("Error fetching machine groups:", err));
    };

    React.useEffect(() => {
        fetchPage(1);
    }, []);

    const refreshPage = () => fetchPage(currentPage);

    const onDelete = (index_local: number, index_real: number) => {
        if (!canDelete) {
            alert("You do not have the permissions to delete machine groups");
            return;
        }
        DeleteItem("machinegroups", data[index_real],  refreshPage);
    };

    let [machineGroup, setMachineGroup]:[MachineGroup | null, (machineGroup: any) => void] = useState(null);
    let [isDialogOpen, setIsDialogOpen] = useState(false);
    let [ae, setOpen] = aemenu({isDialogOpen, setIsDialogOpen, machineGroup, setMachineGroup, refresh: refreshPage});

    return (
        <div className='tab-column-cover align-center'>
            <TableHead
                heading="Machine Groups"
                type="machinegroup"
                aemenu={ae}
            />
            <Table<MachineGroup>
                key={`mg-${currentPage}-${data.length}`}
                columns={columns}
                data={data}
                onDelete={onDelete}
                onEdit={(e) => setOpen(true, e)}
                canEdit={canEdit}
                currentPage={currentPage}
                onPageChange={fetchPage}
                resourceType="machinegroups"
            />
        </div>
    );
};

export default MachineGroups;