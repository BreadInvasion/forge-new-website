import React, { ReactNode, useState } from 'react';
import Table, { DeleteItem } from '../components/Table';
import { TableHead } from '../components/Table';

import '../styles/TabStyles.scss';
import { emptyMachine, MachineType, ResourceSlot } from 'src/interfaces';

import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { Dialog } from 'radix-ui';
import ResourceSlots from './ResourceSlots';
import { OmniAPI } from 'src/apis/OmniAPI';

interface aemenuprops {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    machineType: MachineType | null;
    setMachineType: (machine: MachineType | null) => void;
    dataSetter: (data: MachineType[]) => void;
}

let initialResSlots: ResourceSlot[] = await OmniAPI.getAll("resourceslots");

const aemenu = (props: aemenuprops): [ReactNode, (state: boolean, mach: MachineType | null) => void] => {
    let { isDialogOpen, setIsDialogOpen, machineType, setMachineType, dataSetter} = props;

    const [name, setName] = useState("");
    const [resourceSlots, setResourceSlots] = useState<ResourceSlot[]>(initialResSlots);
    const [resourceSlotIDS, setResourceSlotIDS] = useState<string[]>([]);
    const [cost, setCost] = useState<number>(0.0);
    const handleCheckboxChange = (value: string) => {
        setResourceSlotIDS(prev =>
            prev.includes(value)
            ? prev.filter(item => item !== value) // remove
            : [...prev, value] // add
        );
    };

    const setOpenExtra = (state: boolean, mach: MachineType | null) => {
            setMachineType(mach);
            if (mach != null) {
                console.log("machine not null");
                setName(mach.name);
                setResourceSlotIDS(mach.resource_slot_ids);
                setCost(mach.cost_per_hour);
            } else {
                console.log("machine is null");
                setName("");
                setResourceSlotIDS([]);
                setCost(Number());
            }
            if (isDialogOpen != state) setIsDialogOpen(state);
        };

    function create() {
        if (name == "" || resourceSlots == null || cost == null) {
            alert("All fields must be populated!");
            return;
        }
        OmniAPI.create("machinetypes", {name: name, resource_slot_ids: resourceSlots.filter(r => resourceSlotIDS.includes(r.id)).map(m => m.id), cost_per_hour: cost.toString(),}).then( () => {
            OmniAPI.getAll("machinetypes").then(res => {dataSetter(res)});
            setOpenExtra(false, null);
        });
        return;
    }

    function edit() {
        if (machineType == null) return;
        if (name == "" || resourceSlots == null || cost == null) {
            alert("All fields must be populated!");
            return;
        }
        OmniAPI.edit("machinetypes", machineType.id, {name: name, resource_slot_ids: resourceSlots.filter(r => resourceSlotIDS.includes(r.id)).map(m => m.id), cost_per_hour: cost.toString(),}).then( () => {
            OmniAPI.getAll("machinetypes").then(res => {dataSetter(res)});
            setOpenExtra(false, null);
        });
        return;
    }

    return [(
        <Dialog.Root open={isDialogOpen} onOpenChange={(e: boolean) => { setOpenExtra(e, machineType); }}>
            <button className="addbtn" onClick={() => { setOpenExtra(true, null); }}><PlusIcon /></button>
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
                            <input className="Input" id="name" value={name} onChange={e => setName(e.target.value)} />

                            <label className="Label" htmlFor="resourceSlots">Resource Slots</label>
                            {resourceSlots.map((resourceSlot: ResourceSlot) => (
                                <div className="checkbox-labels">
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
                            <input className="Input" placeholder={cost + ""} id="cost" type="number" value={cost} pattern="[0-9]*" onChange={e => setCost(e.target.valueAsNumber)} />
                        </fieldset>
                        <Dialog.Close asChild>
                            <button className="Button SaveBtn" onClick={machineType == null ? create : edit}>Save</button>
                        </Dialog.Close>
                    </Dialog.Content>
                </div>
            </Dialog.Portal>
        </Dialog.Root>
    ), setOpenExtra];
};

let initialMachTypes: MachineType[] = await OmniAPI.getAll("machinetypes");

const MachineTypes: React.FC = () => {

    const [data, setData] = React.useState<MachineType[]>(initialMachTypes);
    const columns: (keyof MachineType)[] = data.length > 0 ? (Object.keys(data[0]) as (keyof MachineType)[]).filter( (key) => !key.includes('_id') && key !== 'id' ) : [];

    const onDelete = (index_local: number, index_real: number) => {
        DeleteItem("machinetypes", data[index_real], index_local, data, setData);
    };
    let [machineType, setMachineType]:[MachineType | null, (machineType: any) => void] = useState(null);
    let [isDialogOpen, setIsDialogOpen] = useState(false);
    let [ae, setOpen] = aemenu({isDialogOpen, setIsDialogOpen, machineType, setMachineType, dataSetter: setData});

    return (
        <div className='tab-column-cover align-center'>
            <TableHead
                heading="Machine Types"
                type="machinetypes"
                aemenu={ae}
            />
            <Table<MachineType>
                columns={columns}
                data={data}
                onDelete={onDelete}
                onEdit={(e) => setOpen(true, e)}
                canEdit
            />
        </div>
    );
};

export default MachineTypes;