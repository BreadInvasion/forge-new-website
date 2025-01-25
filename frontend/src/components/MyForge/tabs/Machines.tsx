import React from 'react';
import Table from '../components/Table';
import { Machine } from 'src/interfaces';

import '../styles/TabStyles.scss';


const Machines: React.FC = () => {

    const [data, setData] = React.useState<Machine[]>([]);
    const columns: (keyof Machine)[] = data.length > 0 ? Object.keys(data[0]).filter((key) => !key.includes('_id') && key !== 'id') : [];

    React.useEffect(() => {
        fetch('http://localhost:3000/api/machines', {
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
            <h2>All Machines</h2>
            <button className='add-button'>
                <a href='/myforge/machines/add'>Add Machine</a>
            </button>
            <Table<Machine>
                columns={columns}
                data={data}
                editPath='/myforge/machines/edit'
            />
        </div>
    );
};

export default Machines;