import React, { useState } from 'react';
import Table, { DeleteItem } from '../components/Table';
import { TableHead } from '../components/Table';
import { Machine, MachineGroup } from 'src/interfaces';

import '../styles/TabStyles.scss';

import { Dialog } from 'radix-ui';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';

const fetchMachines = (machineIds: string[]) => {
    const machines: string[] = [];
    for (const machineId of machineIds) {
        fetch(`http://localhost:3000/api/machines/${machineId}`, {
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
                if ('id' in data && 'name' in data) {
                    // console.log('Machine:', data);
                    machines.push(data.name);
                } else {
                    throw new Error('Data is not of type Machine');
                }
            })
            .catch(error => {
                console.error('Error fetching machine:', error);
            });
    }
    return machines;
}

const aemenu = (updateExisting: boolean) => {
    const [name, setName] = useState("");
    const [machines, setMachines] = useState<Machine[]>([]);
        React.useEffect(() => {
                fetch('http://localhost:3000/api/machines?limit=100', {
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
                        console.log('Machines:', data);
                        if (Array.isArray(data) && data.every(item => 'id' in item && 'name' in item)) {
                            console.log('Machines:', data);
                            setMachines(data);
                        } else {
                            throw new Error('Data is not of type Machine');
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching machines:', error);
                    });
            }, []);
    const [machineIDS, setMachineIDS] = useState<string[]>([]);
    const handleCheckboxChange = (value: string) => {
        // console.log("new: " + );
        setMachineIDS(prev =>
            prev.includes(value)
            ? prev.filter(item => item !== value) // remove
            : [...prev, value] // add
        );
    };

    function req() {
        fetch(`http://localhost:3000/api/machinegroups/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: JSON.stringify({
                name: name,
                machine_ids: machines.filter(r => machineIDS.includes(r.id)).map(m => m.id),
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
                        <Dialog.Title className="DialogTitle">Adding Machine Group</Dialog.Title>
                        <fieldset className="Fieldset">
                            <label className="Label" htmlFor="name">Name</label>
                            <input className="Input" id="name" value={name} onChange={e => setName(e.target.value)} />

                            <label className="Label" htmlFor="resourceSlots">Machines</label>
                            {machines.map((machine: Machine) => (
                                <div className="checkbox-labels">
                                    <input
                                        className='styled-checkbox'
                                        type="checkbox"
                                        checked={machineIDS.includes(machine.id)}
                                        onChange={() => handleCheckboxChange(machine.id)}
                                    />
                                    <label htmlFor='checkbox-layer-shift' className='checkbox-label'>
                                        {machine.name}
                                    </label>
                                </div>
                            ))}
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

const MachineGroups: React.FC = () => {

    const [data, setData] = React.useState<MachineGroup[]>([]);
    const columns: (keyof MachineGroup)[] = data.length > 0 ? (Object.keys(data[0]) as (keyof MachineGroup)[]).filter((key) => key !== 'id') : [];

    React.useEffect(() => {
        fetch('http://localhost:3000/api/machinegroups?limit=100', {
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
                    // console.log('Machine groups:', data);
                    const newData: MachineGroup[] = [];
                    for (const item of data) {
                        const machines = fetchMachines(item.machine_ids);
                        newData.push({
                            id: item.id,
                            name: item.name,
                            machines: machines,
                        });
                    }
                    setData(newData);
                } else {
                    throw new Error('Data is not of type MachineGroup');
                }
            })
            .catch(error => {
                console.error('Error fetching machine groups:', error);
            });
    }, []);

    // const onDelete = (index: number) => {
    //     const id = data[index].id;
    //     fetch(`http://localhost:3000/api/machinegroups/${id}`, {
    //         method: 'DELETE',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    //         },
    //     })
    //         .then(res => {
    //             if (!res.ok) {
    //                 throw new Error(`HTTP error! status: ${res.status}`);
    //             }
    //             return res.json();
    //         })
    //         .then(data => {
    //             console.log('Machine group deleted:', data);
    //             const newData = [...data];
    //             newData.splice(index, 1);
    //             setData(newData);
    //         })
    //         .catch(error => {
    //             console.error('Error deleting machine group:', error);
    //         });
    // };
    const onDelete = (index_local: number, index_real: number) => {
        DeleteItem("machinegroups", data[index_real], index_local, setData);
    };

    return (
        <div className='tab-column-cover align-center'>
            <TableHead
                heading="Machine Groups"
                type="machinegroup"
                aemenu={aemenu(false)}
            />
            <Table<MachineGroup>
                columns={columns}
                data={data}
                onDelete={onDelete}
                canEdit
            />
        </div>
    );
};

export default MachineGroups;