import React, { ReactNode, useEffect, useState } from 'react';
import Table, { DeleteItem, TableHead, ITEMS_PER_PAGE } from '../components/Table';
import { Machine, MachineGroup, MachineType } from 'src/interfaces';

import '../styles/TabStyles.scss';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { OmniAPI } from 'src/apis/OmniAPI';

interface aemenuprops {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    machine: Machine | null;
    setMachine: (machine: Machine | null) => void;
    refresh: () => void;
}

const AEMenu: React.FC<aemenuprops> = ({ isDialogOpen, setIsDialogOpen, machine, setMachine, refresh,}) => {
    const [name, setName] = useState("");

    const [selectedMachineGroupId, setSelectedMachineGroupId] = useState<string>("_");
    const [machineGroups, setMachineGroups] = useState<MachineGroup[]>([]);
    React.useEffect(() => { OmniAPI.getAll("machinegroups").then(res => {setMachineGroups(res);} ); }, []);

    const [selectedMachineTypeId, setSelectedMachineTypeId] = useState<string>("_");
    const [machineTypes, setMachineTypes] = useState<MachineType[]>([]);
    React.useEffect(() => { OmniAPI.getAll("machinetypes").then(res => {setMachineTypes(res);} ); }, []);

    const [disabled, setDisabled] = useState<boolean>(false);
    const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);

    useEffect(() => {
        if (machine) {
            setName(machine.name);
            setSelectedMachineGroupId(machine.group_id);
            setSelectedMachineTypeId(machine.type_id);
            setDisabled(machine.disabled);
            setMaintenanceMode(machine.maintenance_mode);
        } else {
            setName("");
            setSelectedMachineGroupId("_");
            setSelectedMachineTypeId("_");
            setDisabled(false);
            setMaintenanceMode(false);
        }
    }, [machine]);

    function create() {
        if (name == "" || selectedMachineGroupId == "_" || selectedMachineTypeId == "_") {
            alert("All fields must be populated!");
            return;
        }
        OmniAPI.create("machines", {name: name, group_id: selectedMachineGroupId, type_id: selectedMachineTypeId,}).then( () => {
            refresh();
            setIsDialogOpen(false);
        });
    };

    function edit() {
        if (!machine || selectedMachineGroupId === "_" || selectedMachineTypeId === "_" ){
            alert("Invalid machine state");
            return;
        }
        OmniAPI.edit("machines", machine.id, {name: name, group_id: selectedMachineGroupId, type_id: selectedMachineTypeId, maintenance_mode: maintenanceMode, disabled: disabled,}).then( () => {
            refresh();
            setIsDialogOpen(false);
        });
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

    return (
        <Dialog.Root open={isDialogOpen} onOpenChange={(open) => { if (!open) setMachine(null); setIsDialogOpen(open); }}>
            <button className="addbtn" onClick={() => { setMachine(null); setIsDialogOpen(true); }}>
                <PlusIcon />
            </button>
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
                            <input className="Input" type="checkbox" id="disabled" checked={disabled} onChange={(e) => setDisabled(e.target.checked)} />
                            <label className="Label" htmlFor="machineType">Disabled</label>
                            <br />
                            <input className="Input" type="checkbox" id="maintenance" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} />
                            <label className="Label" htmlFor="machineType">Maintenance Mode</label>
                            
                            </> : null}

                        </fieldset>
                        <button className="Button SaveBtn" onClick={machine == null ? create : edit}>Save</button>
                    </Dialog.Content>
                </div>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

const Machines: React.FC = () => {

    const [data, setData] = React.useState<Machine[]>([]);
    const columns: (keyof Machine)[] = data.length > 0 ? (Object.keys(data[0]) as (keyof Machine)[]).filter((key) => !key.includes('_id') && key !== 'id') : [];
    const [currentPage, setCurrentPage] = useState(1);

    const fetchPage = (page: number) => {
        const offset = (page - 1) * ITEMS_PER_PAGE;
        OmniAPI.getAll("machines", { limit: ITEMS_PER_PAGE, offset }).then( (data) => {
            setData(data);
            setCurrentPage(page);
        });
    };

    React.useEffect(() => {
        fetchPage(1);
    }, []);

    const refreshPage = () => fetchPage(currentPage);

    const onDelete = (index_local: number, index_real: number) => {
        DeleteItem("machines", data[index_real], refreshPage);
    };

    let [machine, setMachine]:[Machine | null, (machine: any) => void] = useState(null);
    let [isDialogOpen, setIsDialogOpen] = useState(false);

    const onEdit = (mach: Machine) => {
        setMachine(mach);
        setIsDialogOpen(true);
    };

    return (
        <div className='tab-column-cover align-center'>
            <TableHead
                heading="Machines"
                type="machines"
                aemenu={
                    <AEMenu
                        isDialogOpen={isDialogOpen}
                        setIsDialogOpen={setIsDialogOpen}
                        machine={machine}
                        setMachine={setMachine}
                        refresh={refreshPage}
                    />
                }
            />
            <Table<Machine>
                columns={columns}
                data={data}
                onDelete={onDelete}
                onEdit={onEdit}
                canEdit
                currentPage={currentPage}
                onPageChange={fetchPage}
                resourceType="machines"
            />
        </div>
    );
};

export default Machines;