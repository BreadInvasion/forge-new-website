import React from 'react';
import { User } from 'src/interfaces';
import AdminTable from './AdminTable';
import { useOmniList } from './useOmniList';
import { userColumns } from './tableDefs';

const UsersTab: React.FC = () => {
    const { rows, loading, error } = useOmniList<User>('users', 'users');

    return (
        <AdminTable<User>
            title="Users"
            columns={userColumns}
            rows={rows}
            rowKey={(u) => u.id}
            loading={loading}
            error={error}
            emptyMessage="No users found."
        />
    );
};

export default UsersTab;
