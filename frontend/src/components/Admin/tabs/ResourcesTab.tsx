import React, { useEffect, useState } from 'react';
import { OmniAPI } from 'src/apis/OmniAPI';
import { Resource } from 'src/interfaces';
import AdminTable, { AdminTableColumn } from './AdminTable';

const formatCost = (cost: number | undefined | null): string => {
    if (cost === undefined || cost === null || Number.isNaN(Number(cost))) return '0.000000';
    return Number(cost).toFixed(6);
};

const columns: AdminTableColumn<Resource>[] = [
    {
        label: 'NAME',
        width: '22%',
        render: (r) => r.name,
    },
    {
        label: 'BRAND',
        width: '20%',
        render: (r) => r.brand || '—',
    },
    {
        label: 'COLOR',
        width: '18%',
        render: (r) => r.color || '—',
    },
    {
        label: 'UNITS',
        width: '20%',
        render: (r) => r.units || '—',
    },
    {
        label: 'COST',
        width: '20%',
        render: (r) => formatCost(r.cost),
    },
];

const ResourcesTab: React.FC = () => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await OmniAPI.getAll('resources');
                if (cancelled) return;
                setResources(Array.isArray(data) ? data : []);
            } catch (err) {
                if (cancelled) return;
                console.error('Failed to load resources:', err);
                setError('Unable to load resources. Please try again later.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <AdminTable<Resource>
            title="Resources"
            columns={columns}
            rows={resources}
            rowKey={(r) => r.id}
            loading={loading}
            error={error}
            emptyMessage="No resources found."
        />
    );
};

export default ResourcesTab;
