import React, { ReactNode, useEffect, useState } from 'react';
import Table, { DeleteItem } from '../components/Table';
import { TableHead } from '../components/Table';
import { Machine, MachineGroup, MachineType } from 'src/interfaces';
import { v4 } from 'uuid';

import '../styles/TabStyles.scss';

import { Dialog } from 'radix-ui';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { OmniAPI } from 'src/apis/OmniAPI';

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

interface aemenuprops {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    machineGroup: MachineGroup | null;
    setMachineGroup: (machine: MachineGroup | null) => void;
    dataSetter: (data: MachineGroup[]) => void;
}

const aemenu = (props: aemenuprops): [ReactNode, (state: boolean, mach: MachineGroup | null) => void] => {
    let { isDialogOpen, setIsDialogOpen, machineGroup, setMachineGroup, dataSetter} = props;

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
                // console.log('Machines:', data);
                if (Array.isArray(data) && data.every(item => 'id' in item && 'name' in item)) {
                    // console.log('Machines:', data);
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
        // handle potential null previous state by defaulting to an empty array
        setMachineIDS(prev => {
            const p = prev ?? [];
            return p.includes(value)
                ? p.filter(item => item !== value) // remove
                : [...p, value]; // add
        });
    };

    // function req() {
    //     fetch(`http://localhost:3000/api/machinegroups/new`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    //         },
    //         body: JSON.stringify({
    //             name: name,
    //             machine_ids: machines.filter(r => machineIDS.includes(r.id)).map(m => m.id),
    //         })
    //     })
    //     .then(res => {
    //         if (res.status !== 200) {
    //             res.text().then((json) => {
    //                 alert(JSON.parse(json)['detail']);
    //             });
    //         }
    //         if (!res.ok) {
    //             throw new Error(`HTTP error! status: ${res.status}`);
    //         }
    //         return res.json();
    //     })
    //     .then(data => {
    //         // setData(prev => [...prev, data]);
    //         document.location.reload(); // Optionally, reload only the table
    //     })
    //     .catch(error => {
    //         console.error(`Error adding machine type:`, error);
    //     });
    // }

    
        function setOpenExtra (state: boolean, mach: MachineGroup | null) {
            setMachineGroup(mach);
            if (mach != null) {
                // console.log("machineGROUP not null");
                setName(mach.name);
                OmniAPI.get("machinegroups", mach.id).then((m) => {
                    setMachineIDS(m.machine_ids);
                    setIsDialogOpen(state);
                });
            } else {
                // console.log("machineGROUP is null");
                setName("");
                setMachineIDS([]);
                setIsDialogOpen(state);
            }
        }
    
        function create() {
            if (name == "" || machines == null) {
                alert("All fields must be populated!");
                return;
            }
            OmniAPI.create("machinegroups", {name: name, machine_ids: machines.filter(r => machineIDS.includes(r.id)).map(m => m.id)}).then( () => {
                let mappings: {[key: string]: string} = {};
                OmniAPI.getAll("machines").then(m => {
                    m.map((m2: Machine) => mappings[m2.id] = m2.name);
                    // console.log(m);
                }).then(() => {
                OmniAPI.getAll("machinegroups").then(d => {
                        // console.log('Machine groups:', d);
                        if (Array.isArray(d) && d.every(item => 'id' in item && 'name' in item)) {
                            let newData: MachineGroup[] = [];
                            for (const item of d) {
                                newData.push({
                                    id: item.id,
                                    name: item.name,
                                    machines: item.machine_ids.map((m:string) => mappings[m]),
                                });
                            }
                            dataSetter(newData);
                        } else {
                            throw new Error('Data is not of type MachineGroup');
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching machine groups:', error);
                    });
                });
                setOpenExtra(false, null);
            });
            return;
        }
    
        function edit() {
            if (machineGroup == null) return;
            if (name == "" || machines == null) {
                alert("All fields must be populated!");
                return;
            }
            OmniAPI.edit("machinegroups", machineGroup.id, {name: name, machine_ids: machineIDS}).then( () => {
                let mappings: {[key: string]: string} = {};
                OmniAPI.getAll("machines").then(m => {
                    m.map((m2: Machine) => mappings[m2.id] = m2.name);
                    // console.log(m);
                }).then(() => {
                OmniAPI.getAll("machinegroups").then(d => {
                        // console.log('Machine groups:', d);
                        if (Array.isArray(d) && d.every(item => 'id' in item && 'name' in item)) {
                            let newData: MachineGroup[] = [];
                            for (const item of d) {
                                newData.push({
                                    id: item.id,
                                    name: item.name,
                                    machines: item.machine_ids.map((m:string) => mappings[m]),
                                });
                            }
                            dataSetter(newData);
                        } else {
                            throw new Error('Data is not of type MachineGroup');
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching machine groups:', error);
                    });
                });
                setOpenExtra(false, null);
            });
            return;
        }

    return [(
        <Dialog.Root open={isDialogOpen} onOpenChange={(e: boolean) => { setOpenExtra(e, machineGroup); }}>
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
                        <Dialog.Title className="DialogTitle">{machineGroup == null ? "Adding" : "Editing"} Machine Group</Dialog.Title>
                        <fieldset className="Fieldset">
                            <label className="Label" htmlFor="name">Name</label>
                            <input className="Input" id="name" value={name} onChange={e => setName(e.target.value)} />

                            <label className="Label" htmlFor="machines">Machines</label>
                            {machines.map((machine: Machine) => (
                                <div className="checkbox-labels">
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
                </div>
            </Dialog.Portal>
        </Dialog.Root>
    ), setOpenExtra];
};

// let initialMachGroups: MachineGroup[] = await OmniAPI.getAll("machinegroups");



const MachineGroups: React.FC = () => {

    const [data, setData] = React.useState<MachineGroup[]>([]);
    const columns: (keyof MachineGroup)[] = data.length > 0 ? (Object.keys(data[0]) as (keyof MachineGroup)[]).filter((key) => key !== 'id') : [];

    React.useEffect(() => {
        let mappings: {[key: string]: string} = {};
        OmniAPI.getAll("machines").then(m => {
            m.map((m2: Machine) => mappings[m2.id] = m2.name);
            // console.log(m);
        }).then(() => {
        OmniAPI.getAll("machinegroups").then(d => {
                // console.log('Machine groups:', d);
                if (Array.isArray(d) && d.every(item => 'id' in item && 'name' in item)) {
                    let newData: MachineGroup[] = [];
                    for (const item of d) {
                        newData.push({
                            id: item.id,
                            name: item.name,
                            machines: item.machine_ids.map((m:string) => mappings[m]),
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
        });
    }, []);

    const onDelete = (index_local: number, index_real: number) => {
        DeleteItem("machinegroups", data[index_real], index_local, data, setData);
    };

    let [machineGroup, setMachineGroup]:[MachineGroup | null, (machineGroup: any) => void] = useState(null);
    let [isDialogOpen, setIsDialogOpen] = useState(false);
    let [ae, setOpen] = aemenu({isDialogOpen, setIsDialogOpen, machineGroup, setMachineGroup, dataSetter: setData});

    return (
        <div className='tab-column-cover align-center'>
            <TableHead
                heading="Machine Groups"
                type="machinegroup"
                aemenu={ae}
            />
            <Table<MachineGroup>
                key={data.map((mg: MachineGroup) => mg.machines.join(" ")).join(" ")}
                columns={columns}
                data={data}
                onDelete={onDelete}
                onEdit={(e) => setOpen(true, e)}
                canEdit
            />
        </div>
    );
};

export default MachineGroups;