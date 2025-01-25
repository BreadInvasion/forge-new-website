import React from 'react';
import Table from '../components/Table';
import { User } from 'src/interfaces';

import '../styles/TabStyles.scss';


const Users: React.FC = () => {

    const [data, setData] = React.useState<User[]>([]);

    //change this to fix gender id
    const columns: (keyof User)[] = data.length > 0 ? Object.keys(data[0]).filter((key) => !key.includes('_id') && key !== 'id') : [];

    React.useEffect(() => {
        fetch('http://localhost:3000/api/users', {
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
                console.log('Users:', data);
                if (Array.isArray(data)) {
                    setData(data);
                } else {
                    throw new Error('Data is not of type User');
                }
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, []);

    return (
        <div className='tab-column-cover align-center'>
            <h2>Users</h2>
            <button className='add-button'>
                <a href='/myforge/users/add'>Add User</a>
            </button>
            <Table<User>
                columns={columns}
                data={data}
                editPath='/myforge/users/edit'
            />
        </div>
    );
};

export default Users;