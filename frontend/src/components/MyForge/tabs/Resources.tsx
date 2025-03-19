import React from 'react';
import Table from '../components/Table';
import { TableHead } from '../components/Table';
import { Resource } from 'src/interfaces';

import '../styles/TabStyles.scss';


const Resources: React.FC = () => {

    const [data, setData] = React.useState<Resource[]>([]);
    const columns: (keyof Resource)[] = data.length > 0 ? Object.keys(data[0]).filter((key) => !key.includes('_id') && key !== 'id') : [];

    React.useEffect(() => {
        fetch('http://localhost:3000/api/resources', {
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
                console.log('Resources:', data);
                if (Array.isArray(data) && data.every(item => 'id' in item && 'name' in item)) {
                    console.log('Resources:', data);
                    setData(data);
                } else {
                    throw new Error('Data is not of type Resource');
                }
            })
            .catch(error => {
                console.error('Error fetching resources:', error);
            });
    }, []);

    return (
        <div className='tab-column-cover align-center'>
            <TableHead
                heading="Resources"
                addPath='/myforge/resources/add'
            />
            <Table<Resource>
                columns={columns}
                data={data}
                editPath='/myforge/resources/edit'
            />
        </div>
    );
};

export default Resources;