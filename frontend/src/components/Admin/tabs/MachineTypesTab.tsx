import React from 'react';
import { MachineType } from 'src/interfaces';
import AdminTable from './AdminTable';
import { useOmniList } from './useOmniList';
import { machineTypeColumns } from './tableDefs';

const MachineTypesTab: React.FC = () => {
    const { rows, loading, error } = useOmniList<MachineType>(
        'machine_types',
        'machine types',
    );

    return (
        <AdminTable<MachineType>
            title="Machine Types"
            columns={machineTypeColumns}
            rows={rows}
            rowKey={(t) => t.id}
            loading={loading}
            error={error}
            emptyMessage="No machine types found."
        />
    );
};

export default MachineTypesTab;
