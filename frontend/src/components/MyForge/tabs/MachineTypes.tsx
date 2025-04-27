import React, { useState } from 'react';
import Table, { DeleteItem } from '../components/Table';
import { TableHead } from '../components/Table';

import '../styles/TabStyles.scss';
import { emptyMachine, MachineType, ResourceSlot } from 'src/interfaces';

import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { Dialog } from 'radix-ui';

const aemenu = (updateExisting: boolean) => {
    const [name, setName] = useState("");
    const [resourceSlots, setResourceSlots] = useState<ResourceSlot[]>([]);
        React.useEffect(() => {
                fetch('http://localhost:3000/api/resourceslots?limit=100', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                })
                    .then(res => {
                        if (!res.ok) {
                            throw new Error(`HTTP error! status: ${res.status}`);
                        }
                        return res.json();
                    })
                    .then(data => {
                        console.log('ResourceSlots:', data);
                        if (Array.isArray(data) && data.every(item => 'id' in item && 'db_name' in item)) {
                            console.log('ResourceSlot:', data);
                            setResourceSlots(data);
                        } else {
                            throw new Error('Data is not of type ResourceSlot');
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching resource slots:', error);
                    });
            }, []);
    const [resourceSlotIDS, setResourceSlotIDS] = useState<string[]>([]);
    const [cost, setCost] = useState<number>(0);
    const handleCheckboxChange = (value: string) => {
        // console.log("new: " + );
        setResourceSlotIDS(prev =>
            prev.includes(value)
            ? prev.filter(item => item !== value) // remove
            : [...prev, value] // add
        );
    };

    function req() {
        fetch(`http://localhost:3000/api/machinetypes/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: JSON.stringify({
                name: name,
                resource_slot_ids: resourceSlots.filter(r => resourceSlotIDS.includes(r.id)).map(m => m.id),
                cost_per_hour: cost,
            })
        })
        .then(res => {
            if (res.status !== 200) {
                res.text().then((json) => {
                    alert(JSON.parse(json)['detail']);
                });
            }
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            // setData(prev => [...prev, data]);
            document.location.reload(); // Optionally, reload only the table
        })
        .catch(error => {
            console.error(`Error adding machine type:`, error);
        });
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button className="addbtn"><PlusIcon /></button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <div className='AEdiv'>
                    <Dialog.Overlay className="DialogOverlay" />
                    <Dialog.Content className="DialogContent">
                        <Dialog.Close asChild>
                            <button className="IconButton" aria-label="Close">
                                <Cross2Icon />
                            </button>
                        </Dialog.Close>
                        <Dialog.Title className="DialogTitle">Adding Machine Type</Dialog.Title>
                        <fieldset className="Fieldset">
                            <label className="Label" htmlFor="name">Name</label>
                            <input className="Input" id="name" value={name} onChange={e => setName(e.target.value)} />

                            <label className="Label" htmlFor="resourceSlots">Resource Slots</label>
                            {resourceSlots.map((resourceSlot: ResourceSlot) => (
                                <div className="checkbox-labels">
                                    <input
                                        id='checkbox-layer-shift'
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
                            <input className="Input" id="cost" type="number" value={cost} onChange={e => setCost(Number(e.target.value))} />
                        </fieldset>
                        <Dialog.Close asChild>
                            <button className="Button SaveBtn" onClick={req}>Save</button>
                        </Dialog.Close>
                    </Dialog.Content>
                </div>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

const MachineTypes: React.FC = () => {

    const [data, setData] = React.useState<MachineType[]>([]);
    const columns: (keyof MachineType)[] = data.length > 0 ? (Object.keys(data[0]) as (keyof MachineType)[]).filter( (key) => !key.includes('_id') && key !== 'id' ) : [];

    React.useEffect(() => {
        fetch('http://localhost:3000/api/machinetypes?limit=100', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data) && data.every(item => 'id' in item && 'name' in item)) {
                    console.log('MachineTypes:', data);
                    setData(data);
                } else {
                    throw new Error('Data is not of type MachineType');
                }
            })
            .catch(error => {
                console.error('Error fetching machine types:', error);
            });
    }, []);

    const onDelete = (index_local: number, index_real: number) => {
        DeleteItem("machinetypes", data[index_real], index_local, setData);
    };

    return (
        <div className='tab-column-cover align-center'>
            <TableHead
                heading="Machine Types"
                type="machinetypes"
                aemenu={aemenu(false)}
            />
            <Table<MachineType>
                columns={columns}
                data={data}
                onDelete={onDelete}
                canEdit
            />
        </div>
    );
};

export default MachineTypes;