import React, { useEffect, useState } from 'react';
import { OmniAPI } from 'src/apis/OmniAPI';
import { MachineType } from 'src/interfaces';
import AdminTable, { AdminTableColumn } from './AdminTable';

const formatCost = (cost: number | undefined | null): string => {
    if (cost === undefined || cost === null || Number.isNaN(Number(cost))) return '0.000000';
    return Number(cost).toFixed(6);
};

const joinList = (items: unknown): string => {
    if (!Array.isArray(items) || items.length === 0) return '';
    return items.filter(Boolean).join(', ');
};

const columns: AdminTableColumn<MachineType>[] = [
    {
        label: 'NAME',
        width: '18%',
        render: (t) => t.name,
    },
    {
        label: 'NUM MACHINES',
        width: '16%',
        render: (t) => (t.count ?? 0).toString(),
    },
    {
        label: 'RESOURCE NAMES',
        width: '24%',
        render: (t) => joinList(t.resource_types),
    },
    {
        label: 'RESOURCE SLOT NAMES',
        width: '24%',
        render: (t) => joinList(t.resource_slot_ids),
    },
    {
        label: 'COST BY HOUR',
        width: '18%',
        render: (t) => formatCost(t.cost_per_hour),
    },
];

const MachineTypesTab: React.FC = () => {
    const [types, setTypes] = useState<MachineType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await OmniAPI.getAll('machine_types');
                if (cancelled) return;
                setTypes(Array.isArray(data) ? data : []);
            } catch (err) {
                if (cancelled) return;
                console.error('Failed to load machine types:', err);
                setError('Unable to load machine types. Please try again later.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <AdminTable<MachineType>
            title="Machine Types"
            columns={columns}
            rows={types}
            rowKey={(t) => t.id}
            loading={loading}
            error={error}
            emptyMessage="No machine types found."
        />
    );
};

export default MachineTypesTab;
