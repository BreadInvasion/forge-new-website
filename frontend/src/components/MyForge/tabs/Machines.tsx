import React, { useState } from 'react';
import Table, { DeleteItem } from '../components/Table';
import { TableHead } from '../components/Table';
import { Machine, MachineGroup, MachineType } from 'src/interfaces';

import '../styles/TabStyles.scss';
import { Dialog } from 'radix-ui';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';


const aemenu = (updateExisting: boolean) => {
    const [name, setName] = useState("");
    const [selectedMachineGroupId, setSelectedMachineGroupId] = useState<string>("_");
    const [machineGroups, setMachineGroups] = useState<MachineGroup[]>([]);
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
                        console.log('Machine Groups:', data);
                        if (Array.isArray(data) && data.every(item => 'id' in item && 'machine_ids' in item)) {
                            console.log('Machine groups:', data);
                            setMachineGroups(data);
                        } else {
                            throw new Error('Data is not of type machine group');
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching machine group:', error);
                    });
            }, []);

    const [selectedMachineTypeId, setSelectedMachineTypeId] = useState<string>("_");
    const [machineTypes, setMachineTypes] = useState<MachineType[]>([]);
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
                        console.log('Machine Types:', data);
                        if (Array.isArray(data) && data.every(item => 'id' in item && 'resource_slot_ids' in item)) {
                            console.log('Machine types:', data);
                            setMachineTypes(data);
                        } else {
                            throw new Error('Data is not of type machine type');
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching machine type:', error);
                    });
            }, []);

    function req() {
        fetch(`http://localhost:3000/api/machines/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: JSON.stringify({
                name: name,
                group_id: selectedMachineGroupId,
                type_id: selectedMachineTypeId,
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
                        <Dialog.Title className="DialogTitle">Adding Machine</Dialog.Title>
                        <fieldset className="Fieldset">
                            <label className="Label" htmlFor="name">Name</label>
                            <input className="Input" id="name" value={name} onChange={e => setName(e.target.value)} />

                            <label className="Label" htmlFor="machineGroup">Machine Group</label>
                            <select
                                className='styled-dropdown'
                                defaultValue="_"
                                onChange={(e) => handleSelectMachineGroup(e.target.value)}
                                required
                            >
                                <option className='styled-dropdown-placeholder' value="_" hidden>{"Select Machine Group"}</option>
                                {machineGroups.map((machineGroup: MachineGroup) => (
                                    <option className='styled-dropdown-option' key={machineGroup.id} value={machineGroup.id}>{machineGroup.name}</option>
                                ))}
                            </select>

                            <label className="Label" htmlFor="machineType">Machine Type</label>
                            <select
                                className='styled-dropdown'
                                defaultValue="_"
                                onChange={(e) => handleSelectMachineType(e.target.value)}
                                required
                            >
                                <option className='styled-dropdown-placeholder' value="_" hidden>{"Select Machine Type"}</option>
                                {machineTypes.map((machineType: MachineType) => (
                                    <option className='styled-dropdown-option' key={machineType.id} value={machineType.id}>{machineType.name}</option>
                                ))}
                            </select>
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

const Machines: React.FC = () => {

    const [data, setData] = React.useState<Machine[]>([]);
    const columns: (keyof Machine)[] = data.length > 0 ? (Object.keys(data[0]) as (keyof Machine)[]).filter((key) => !key.includes('_id') && key !== 'id') : [];

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
                if (Array.isArray(data) && data.every(item => 'id' in item && 'name' in item)) {
                    console.log('Machines:', data);
                    setData(data);
                } else {
                    throw new Error('Data is not of type Machine');
                }
            })
            .catch(error => {
                console.error('Error fetching machines:', error);
            });
    }, []);

    const onDelete = (index_local: number, index_real: number) => {
        DeleteItem("machines", data[index_real], index_local, setData);
    };

    return (
        <div className='tab-column-cover align-center'>
            <TableHead
                heading="Machines"
                type="machines"
                aemenu={aemenu(false)}
            />
            <Table<Machine>
                columns={columns}
                data={data}
                onDelete={onDelete}
                canEdit
            />
        </div>
    );
};

export default Machines;