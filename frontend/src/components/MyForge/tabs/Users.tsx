import React from 'react';
import { OmniAPI } from 'src/apis/OmniAPI';
import Table, {DeleteItem} from '../components/Table';
import { TableHead } from '../components/Table';
import { User } from 'src/interfaces';

import '../styles/TabStyles.scss';


const Users: React.FC = () => {

    const [data, setData] = React.useState<User[]>([]);

    //change this to fix gender id
    const columns: (keyof User)[] = data.length > 0 ? (Object.keys(data[0]) as (keyof User)[]).filter((key) => !key.includes('_id') && key !== 'id') : [];

    React.useEffect(() => {
        OmniAPI.getAll("users")
            .then((data) => {
                console.log('Users:', data);
                if (Array.isArray(data)) {
                    setData(data);
                } else {
                    throw new Error('Data is not of type User');
                }
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, []);

    return (
        <div className='tab-column-cover align-center'>
            <TableHead
                heading="Users"
            />
            <Table<User>
                columns={columns}
                data={data}
            />
        </div>
    );
};

export default Users;