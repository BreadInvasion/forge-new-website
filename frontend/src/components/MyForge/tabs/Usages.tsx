import React from 'react';
import { OmniAPI } from 'src/apis/OmniAPI';
import Table,  { ITEMS_PER_PAGE, TableHead } from '../components/Table';
import { MachineUsage } from 'src/interfaces';

import '../styles/TabStyles.scss';

const Usages: React.FC = () => {
    const [data, setData] = React.useState<MachineUsage[]>([]);
    const columns: (keyof MachineUsage)[] = data.length > 0 ? (Object.keys(data[0]) as (keyof MachineUsage)[]).filter(key => !key.includes('_id') && key !== 'time_started') : [];
    const [currentPage, setCurrentPage] = React.useState(1);

    const hmsify = (seconds: number): string => {
        const hours = Math.round(seconds / 3600);
        const minutes = Math.round((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    const fetchPage = (page: number) => {
        const offset = (page - 1) * ITEMS_PER_PAGE;

        OmniAPI.getAll('usages/me', { limit: ITEMS_PER_PAGE, offset })
            .then((res) => {
                if (!Array.isArray(res)) {
                    setData([]);
                    return;
                }

                const formatted = res.map(u => ({
                    ...u,
                    duration: hmsify(Number(u.duration)),
                    cost: `$${(+u.cost).toFixed(2)}`
                }));

                setData(formatted);
                setCurrentPage(page);
            });
    };

    React.useEffect(() => {
        fetchPage(1);
    }, []);

    return (
        <div className='tab-column-cover align-center'>
            <TableHead heading="My Usages" />
            <Table<MachineUsage>
                columns={columns}
                data={data}
                currentPage={currentPage}
                onPageChange={fetchPage}
                resourceType="usages/me"
            />
        </div>
    );
};

export default Usages;