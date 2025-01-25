import React from 'react';
import Table from '../components/Table';
import { MachineGroup } from 'src/interfaces';

import '../styles/TabStyles.scss';


const MachineGroups: React.FC = () => {

    const [data, setData] = React.useState<MachineGroup[]>([]);
    const columns: (keyof MachineGroup)[] = data.length > 0 ? Object.keys(data[0]).filter((key) => key !== 'id') : [];

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

    React.useEffect(() => {
        fetch('http://localhost:3000/api/machinegroups', {
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

    const onDelete = (index: number) => {
        const id = data[index].id;
        fetch(`http://localhost:3000/api/machinegroups/${id}`, {
            method: 'DELETE',
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
                console.log('Machine group deleted:', data);
                const newData = [...data];
                newData.splice(index, 1);
                setData(newData);
            })
            .catch(error => {
                console.error('Error deleting machine group:', error);
            });
    };

    return (
        <div className='tab-column-cover align-center'>
            <h2>Machine Groups</h2>
            <button className='add-button'>
                <a href='/myforge/machinegroups/add'>Add Machine Group</a>
            </button>
            <Table<MachineGroup>
                columns={columns}
                data={data}
                editPath='/myforge/machinegroups/edit'
                onDelete={onDelete}
            />
        </div>
    );
};

export default MachineGroups;