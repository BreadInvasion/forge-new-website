import React from 'react';
import { Resource } from 'src/interfaces';
import AdminTable from './AdminTable';
import { useOmniList } from './useOmniList';
import { resourceColumns } from './tableDefs';

const ResourcesTab: React.FC = () => {
    const { rows, loading, error } = useOmniList<Resource>('resources', 'resources');

    return (
        <AdminTable<Resource>
            title="Resources"
            columns={resourceColumns}
            rows={rows}
            rowKey={(r) => r.id}
            loading={loading}
            error={error}
            emptyMessage="No resources found."
        />
    );
};

export default ResourcesTab;
