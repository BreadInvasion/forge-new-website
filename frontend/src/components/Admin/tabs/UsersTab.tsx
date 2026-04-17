import React, { useEffect, useState } from 'react';
import { OmniAPI } from 'src/apis/OmniAPI';
import { User } from 'src/interfaces';
import AdminTable, { AdminTableColumn } from './AdminTable';

const columns: AdminTableColumn<User>[] = [
    {
        label: 'IS RPI STAFF',
        width: '12%',
        render: (u) => (u.is_rpi_staff ? 'Yes' : 'No'),
    },
    {
        label: 'RCSID',
        width: '10%',
        render: (u) => u.RCSID || '—',
    },
    {
        label: 'RIN',
        width: '10%',
        render: (u) => u.RIN || '—',
    },
    {
        label: 'FIRST NAME',
        width: '10%',
        render: (u) => u.first_name || '—',
    },
    {
        label: 'LAST NAME',
        width: '10%',
        render: (u) => u.last_name || '—',
    },
    {
        label: 'MAJOR',
        width: '10%',
        render: (u) => u.major || '—',
    },
    {
        label: 'PRONOUNS',
        width: '10%',
        render: (u) => u.pronouns || '—',
    },
    {
        label: 'DISPLAY ROLE',
        width: '10%',
        render: (u) => u.display_role || '—',
    },
    {
        label: 'IS GRADUATING',
        width: '10%',
        render: (u) => (u.is_graduating ? 'Yes' : 'No'),
    },
    {
        label: 'SEMESTER BALANCE',
        width: '8%',
        render: (u) => u.semester_balance ?? '—',
    },
];

const UsersTab: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await OmniAPI.getAll('users');
                if (cancelled) return;
                setUsers(Array.isArray(data) ? data : []);
            } catch (err) {
                if (cancelled) return;
                console.error('Failed to load users:', err);
                setError('Unable to load users. Please try again later.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <AdminTable<User>
            title="Users"
            columns={columns}
            rows={users}
            rowKey={(u) => u.id}
            loading={loading}
            error={error}
            emptyMessage="No users found."
        />
    );
};

export default UsersTab;
