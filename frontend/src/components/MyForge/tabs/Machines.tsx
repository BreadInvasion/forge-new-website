import React from 'react';
import Table, { DeleteItem } from '../components/Table';
import { TableHead } from '../components/Table';
import { Machine } from 'src/interfaces';

import '../styles/TabStyles.scss';


const Machines: React.FC = () => {

    const [data, setData] = React.useState<Machine[]>([]);
    const columns: (keyof Machine)[] = data.length > 0 ? Object.keys(data[0]).filter((key) => !key.includes('_id') && key !== 'id') : [];

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