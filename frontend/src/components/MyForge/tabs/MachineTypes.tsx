import React, { ReactNode, useState } from 'react';
import Table, { DeleteItem, ITEMS_PER_PAGE } from '../components/Table';
import { TableHead } from '../components/Table';

import '../styles/TabStyles.scss';
import { emptyMachine, MachineType, ResourceSlot } from 'src/interfaces';

import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import * as Dialog from '@radix-ui/react-dialog';
import ResourceSlots from './ResourceSlots';
import { OmniAPI } from 'src/apis/OmniAPI';

interface aemenuprops {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    machineType: MachineType | null;
    setMachineType: (machine: MachineType | null) => void;
    refresh: () => void;
}

const aemenu = (props: aemenuprops): [ReactNode, (state: boolean, mach: MachineType | null) => void] => {
    let { isDialogOpen, setIsDialogOpen, machineType, setMachineType, refresh} = props;

    const [name, setName] = useState("");
    const [resourceSlots, setResourceSlots] = useState<ResourceSlot[]>([]);

    React.useEffect(() => {
        OmniAPI.getAll("resourceslots").then(rs =>{
            setResourceSlots(rs);
        });
    }, []);

    const [resourceSlotIDS, setResourceSlotIDS] = useState<string[]>([]);
    const [cost, setCost] = useState<number>(0.0);
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
        if (!name || cost == null) {
            alert("All fields must be populated!");
            return;
        }

        OmniAPI.create("machinetypes", {
            name,
            resource_slot_ids: resourceSlots
                .filter(r => resourceSlotIDS.includes(r.id))
                .map(r => r.id),
            cost_per_hour: cost.toString(),
        }).then(() => {
            refresh();
            setOpenExtra(false, null);
        });
    }

    function edit() {
        if (!machineType) return;
        if (!name || cost == null) {
            alert("All fields must be populated!");
            return;
        }

        OmniAPI.edit("machinetypes", machineType.id, {
            name,
            resource_slot_ids: resourceSlots
                .filter(r => resourceSlotIDS.includes(r.id))
                .map(r => r.id),
            cost_per_hour: cost.toString(),
        }).then(() => {
            refresh();
            setOpenExtra(false, null);
        });
    }

    return [(
        <Dialog.Root open={isDialogOpen} onOpenChange={handleOpenChange}>
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
        </Dialog.Root>
    ), setOpenExtra];
};

const MachineTypes: React.FC = () => {

    const [data, setData] = React.useState<MachineType[]>([]);
    const columns: (keyof MachineType)[] = data.length > 0 ? (Object.keys(data[0]) as (keyof MachineType)[]).filter( (key) => !key.includes('_id') && key !== 'id' ) : [];
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    
    const fetchPage = (page: number) => {
        const offset = (page - 1) * ITEMS_PER_PAGE;
        OmniAPI.getAll("machinetypes", { limit: ITEMS_PER_PAGE, offset }).then( (mt) => {
            setData(mt);
            setCurrentPage(page);
        });
    };

    React.useEffect(() => {
        fetchPage(1);
    }, []);

    const refreshPage = () => fetchPage(currentPage);

    const onDelete = (index_local: number) => {
        DeleteItem("machinetypes", data[index_local], refreshPage);
    };

    const [machineType, setMachineType] = useState<MachineType | null>(null);
    let [isDialogOpen, setIsDialogOpen] = useState(false);
    let [ae, setOpen] = aemenu({isDialogOpen, setIsDialogOpen, machineType, setMachineType, refresh: refreshPage});

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
                currentPage={currentPage}
                onPageChange={(p) => fetchPage(p)}
                resourceType={"machinetypes"}
            />
        </div>
    );
};

export default MachineTypes;