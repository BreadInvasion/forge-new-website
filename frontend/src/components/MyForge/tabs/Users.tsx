import React, { useState, useEffect } from 'react';
import { OmniAPI } from 'src/apis/OmniAPI';
import Table, { DeleteItem, ITEMS_PER_PAGE, TableHead } from '../components/Table';
import { User } from 'src/interfaces';
import { UserPermission } from 'src/enums';
import useAuth from '../../Auth/useAuth';

import '../styles/TabStyles.scss';


const Users: React.FC = () => {

    const { user } = useAuth();
    const canSeeUsers = user.permissions.includes(UserPermission.CAN_SEE_USERS) || user.permissions.includes(UserPermission.IS_SUPERUSER);

    const [data, setData] = React.useState<User[]>([]);
    //change this to fix gender id
    const columns: (keyof User)[] = data.length > 0 ? (Object.keys(data[0]) as (keyof User)[]).filter((key) => !key.includes('_id') && key !== 'id') : [];
    const [currentPage, setCurrentPage] = useState(1);

    const fetchPage = (page: number) => {
        const offset = (page - 1) * ITEMS_PER_PAGE;
        OmniAPI.getAll('users', { limit: ITEMS_PER_PAGE, offset }).then((res) => {
            setData(Array.isArray(res) ? res : []);
            setCurrentPage(page);
        });
    };

    React.useEffect(() => {
        fetchPage(1);
    }, []);

    const refreshPage = () => fetchPage(currentPage);

    const onDelete = (index_local: number, index_real: number) => {
        DeleteItem('users', data[index_real], refreshPage);
    };

    if (!canSeeUsers) return null;
    return (
        <div className='tab-column-cover align-center'>
            <TableHead
                heading="Users"
            />
            <Table<User>
                columns={columns}
                data={data}
                currentPage={currentPage}
                onPageChange={fetchPage}
                resourceType="users"
            />
        </div>
    );
};

export default Users;