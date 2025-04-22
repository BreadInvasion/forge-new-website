import React from 'react';
import Table, { DeleteItem } from '../components/Table';
import { TableHead } from '../components/Table';

import '../styles/TabStyles.scss';
import { emptyMachine, MachineType } from 'src/interfaces';


const MachineTypes: React.FC = () => {

    const [data, setData] = React.useState<MachineType[]>([]);
    const columns: (keyof MachineType)[] = data.length > 0 ? Object.keys(data[0]).filter((key) => !key.includes('_id') && key !== 'id') : [];

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
                // type="machinetypes"
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