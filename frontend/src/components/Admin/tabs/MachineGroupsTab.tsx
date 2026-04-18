import React from 'react';
import { MachineGroup } from 'src/interfaces';
import AdminTable from './AdminTable';
import { useOmniList } from './useOmniList';
import { machineGroupColumns } from './tableDefs';

const MachineGroupsTab: React.FC = () => {
    const { rows, loading, error } = useOmniList<MachineGroup>(
        'machine_groups',
        'machine groups',
    );

    return (
        <AdminTable<MachineGroup>
            title="Machines Groups"
            columns={machineGroupColumns}
            rows={rows}
            rowKey={(g) => g.id}
            loading={loading}
            error={error}
            emptyMessage="No machine groups found."
        />
    );
};

export default MachineGroupsTab;
