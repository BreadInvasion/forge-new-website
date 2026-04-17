import React, { useEffect, useState } from 'react';
import { OmniAPI } from 'src/apis/OmniAPI';
import { MachineGroup } from 'src/interfaces';
import AdminTable, { AdminTableColumn } from './AdminTable';

const joinMachines = (machines: unknown): string => {
    if (!Array.isArray(machines) || machines.length === 0) return '';
    return machines.filter(Boolean).join(', ');
};

const columns: AdminTableColumn<MachineGroup>[] = [
    {
        label: 'NAME',
        width: '30%',
        render: (g) => g.name || 'None',
    },
    {
        label: 'MACHINES',
        width: '70%',
        render: (g) => joinMachines(g.machines),
    },
];

const MachineGroupsTab: React.FC = () => {
    const [groups, setGroups] = useState<MachineGroup[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await OmniAPI.getAll('machine_groups');
                if (cancelled) return;
                setGroups(Array.isArray(data) ? data : []);
            } catch (err) {
                if (cancelled) return;
                console.error('Failed to load machine groups:', err);
                setError('Unable to load machine groups. Please try again later.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <AdminTable<MachineGroup>
            title="Machines Groups"
            columns={columns}
            rows={groups}
            rowKey={(g) => g.id}
            loading={loading}
            error={error}
            emptyMessage="No machine groups found."
        />
    );
};

export default MachineGroupsTab;
