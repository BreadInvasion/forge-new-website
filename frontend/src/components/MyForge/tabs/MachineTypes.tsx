import React from 'react';
import Table from '../components/Table';
import { TableHead } from '../components/Table';

import '../styles/TabStyles.scss';
import { MachineType } from 'src/interfaces';


const MachineTypes: React.FC = () => {

    const [data, setData] = React.useState<MachineType[]>([]);
    const columns: (keyof MachineType)[] = data.length > 0 ? Object.keys(data[0]).filter((key) => !key.includes('_id') && key !== 'id') : [];

    React.useEffect(() => {
        fetch('http://localhost:3000/api/machinetypes', {
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

    return (
        <div className='tab-column-cover align-center'>
            <TableHead
                heading="Machine Types"
                addPath='/myforge/machinetypes/add'
            />
            <Table<MachineType>
                columns={columns}
                data={data}
                editPath='/myforge/machines/edit'
            />
        </div>
    );
};

export default MachineTypes;