import React, { useEffect, useState } from 'react';
import { OmniAPI } from 'src/apis/OmniAPI';
import { ResourceSlot } from 'src/interfaces';
import AdminTable, { AdminTableColumn } from './AdminTable';

const joinList = (items: unknown): string => {
    if (!Array.isArray(items) || items.length === 0) return '—';
    return items.filter(Boolean).join(', ');
};

const columns: AdminTableColumn<ResourceSlot>[] = [
    {
        label: 'NAME',
        width: '24%',
        render: (s) => s.display_name || s.name || '—',
    },
    {
        label: 'VALID RESOURCES',
        width: '36%',
        render: (s) => joinList(s.valid_resource_ids),
    },
    {
        label: 'ALLOW OWN MATERIAL',
        width: '20%',
        render: (s) => (s.allow_own_material ? 'Yes' : 'No'),
    },
    {
        label: 'ALLOW EMPTY',
        width: '20%',
        render: (s) => (s.allow_empty ? 'Yes' : 'No'),
    },
];

const ResourceSlotsTab: React.FC = () => {
    const [slots, setSlots] = useState<ResourceSlot[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await OmniAPI.getAll('resourceslots');
                if (cancelled) return;
                setSlots(Array.isArray(data) ? data : []);
            } catch (err) {
                if (cancelled) return;
                console.error('Failed to load resource slots:', err);
                setError('Unable to load resource slots. Please try again later.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <AdminTable<ResourceSlot>
            title="Resource Slots"
            columns={columns}
            rows={slots}
            rowKey={(s) => s.id}
            loading={loading}
            error={error}
            emptyMessage="No resource slots found."
        />
    );
};

export default ResourceSlotsTab;
