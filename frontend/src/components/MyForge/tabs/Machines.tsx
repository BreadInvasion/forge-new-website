import React, { ReactNode, useEffect, useState } from 'react';
import Table, { DeleteItem } from '../components/Table';
import { TableHead } from '../components/Table';
import { Machine, MachineGroup, MachineType } from 'src/interfaces';

import '../styles/TabStyles.scss';
import { Dialog } from 'radix-ui';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { OmniAPI } from 'src/apis/OmniAPI';

interface aemenuprops {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    machine: Machine | null;
    setMachine: (machine: Machine | null) => void;
    dataSetter: (data: Machine[]) => void;
}

const aemenu = (props: aemenuprops): [ReactNode, (state: boolean, mach: Machine | null) => void] =>  {
    let { isDialogOpen, setIsDialogOpen, machine, setMachine, dataSetter} = props;
    const [name, setName] = useState("");

    const [selectedMachineGroupId, setSelectedMachineGroupId] = useState<string>("_");
    const [machineGroups, setMachineGroups] = useState<MachineGroup[]>([]);
    React.useEffect(() => { OmniAPI.getAll("machinegroups").then(res => {setMachineGroups(res);} ); }, []);

    const [selectedMachineTypeId, setSelectedMachineTypeId] = useState<string>("_");
    const [machineTypes, setMachineTypes] = useState<MachineType[]>([]);
    React.useEffect(() => { OmniAPI.getAll("machinetypes").then(res => {setMachineTypes(res);} ); }, []);

    const [disabled, setDisabled] = useState<boolean>(false);
    const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);

    const setOpenExtra = (state: boolean, mach: Machine | null) => {
        setMachine(mach);
        if (mach != null) {
            console.log("machine not null");
            setName(mach.name);
            setSelectedMachineGroupId(mach.group_id);
            setSelectedMachineTypeId(mach.type_id);
            setDisabled(mach.disabled);
            setMaintenanceMode(mach.maintenance_mode);
        } else {
            console.log("machine is null");
            setName("");
            setSelectedMachineGroupId("_");
            setSelectedMachineTypeId("_");
            setDisabled(false);
            setMaintenanceMode(false);
        }
        if (isDialogOpen != state) setIsDialogOpen(state);
    };

    function create() {
        if (name == "" || selectedMachineGroupId == "_" || selectedMachineTypeId == "_") {
            alert("All fields must be populated!");
            return;
        }
        OmniAPI.create("machines", {name: name, group_id: selectedMachineGroupId, type_id: selectedMachineTypeId,}).then( () => {
            OmniAPI.getAll("machines").then(res => {dataSetter(res)});
            setOpenExtra(false, null);
        });
    };

    function edit() {
        if (machine == null) {return}
        OmniAPI.edit("machines", machine.id, {name: name, group_id: selectedMachineGroupId, type_id: selectedMachineTypeId, maintenance_mode: maintenanceMode, disabled: disabled,}).then( () => {
            OmniAPI.getAll("machines").then(res => {dataSetter(res)});
            setOpenExtra(false, null);
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

    return [(
        <Dialog.Root open={isDialogOpen} onOpenChange={(e: boolean) => { setOpenExtra(e, machine); }}>
            <button className="addbtn" onClick={() => { setOpenExtra(true, null); }}><PlusIcon /></button>
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
                            <input className="Input" id="name" value={name} onChange={e => setName(e.target.value)} />

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
    ), setOpenExtra];
};

const Machines: React.FC = () => {

    const [data, setData] = React.useState<Machine[]>([]);
    const columns: (keyof Machine)[] = data.length > 0 ? (Object.keys(data[0]) as (keyof Machine)[]).filter((key) => !key.includes('_id') && key !== 'id') : [];

    React.useEffect(() => { OmniAPI.getAll("machines").then(res => {setData(res);} ); }, []);        

    const onDelete = (index_local: number, index_real: number) => {
        DeleteItem("machines", data[index_real], index_local, setData);
    };

    let [machine, setMachine]:[Machine | null, (machine: any) => void] = useState(null);
    let [isDialogOpen, setIsDialogOpen] = useState(false);
    let [ae, setOpen] = aemenu({isDialogOpen, setIsDialogOpen, machine, setMachine, dataSetter: setData});

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
                onDelete={onDelete}
                onEdit={(e) => { setOpen(true, e);}}
                canEdit
            />
        </div>
    );
};

export default Machines;