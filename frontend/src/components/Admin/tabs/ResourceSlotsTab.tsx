import React from 'react';
import { ResourceSlot } from 'src/interfaces';
import AdminTable from './AdminTable';
import { useOmniList } from './useOmniList';
import { resourceSlotColumns } from './tableDefs';

const ResourceSlotsTab: React.FC = () => {
    const { rows, loading, error } = useOmniList<ResourceSlot>(
        'resourceslots',
        'resource slots',
    );

    return (
        <AdminTable<ResourceSlot>
            title="Resource Slots"
            columns={resourceSlotColumns}
            rows={rows}
            rowKey={(s) => s.id}
            loading={loading}
            error={error}
            emptyMessage="No resource slots found."
        />
    );
};

export default ResourceSlotsTab;
