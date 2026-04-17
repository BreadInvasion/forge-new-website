import React, { useEffect, useState } from 'react';
import { OmniAPI } from 'src/apis/OmniAPI';
import { Machine } from 'src/interfaces';
import AdminTable, { AdminTableColumn } from './AdminTable';

const columns: AdminTableColumn<Machine>[] = [
    {
        label: 'NAME',
        width: '18%',
        render: (m) => m.name,
    },
    {
        label: 'GROUP NAME',
        width: '20%',
        render: (m) => m.group || '—',
    },
    {
        label: 'TYPE NAME',
        width: '22%',
        render: (m) => m.type || '—',
    },
    {
        label: 'MAINTENANCE MODE',
        width: '22%',
        render: (m) => String(Boolean(m.maintenance_mode)),
    },
    {
        label: 'DISABLED',
        width: '18%',
        render: (m) => String(Boolean(m.disabled)),
    },
];

const MachinesTab: React.FC = () => {
    const [machines, setMachines] = useState<Machine[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await OmniAPI.getAll('machines');
                if (cancelled) return;
                setMachines(Array.isArray(data) ? data : []);
            } catch (err) {
                if (cancelled) return;
                console.error('Failed to load machines:', err);
                setError('Unable to load machines. Please try again later.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <AdminTable<Machine>
            title="Machines"
            columns={columns}
            rows={machines}
            rowKey={(m) => m.id}
            loading={loading}
            error={error}
            emptyMessage="No machines found."
        />
    );
};

export default MachinesTab;
