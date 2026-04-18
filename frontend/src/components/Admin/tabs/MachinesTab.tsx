import React from 'react';
import { Machine } from 'src/interfaces';
import AdminTable from './AdminTable';
import { useOmniList } from './useOmniList';
import { machineColumns } from './tableDefs';

const MachinesTab: React.FC = () => {
    const { rows, loading, error } = useOmniList<Machine>('machines', 'machines');

    return (
        <AdminTable<Machine>
            title="Machines"
            columns={machineColumns}
            rows={rows}
            rowKey={(m) => m.id}
            loading={loading}
            error={error}
            emptyMessage="No machines found."
        />
    );
};

export default MachinesTab;
