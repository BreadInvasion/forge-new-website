import React from 'react';
import Table from '../components/Table';
import { MachineUsage } from 'src/interfaces';

import '../styles/TabStyles.scss';

const Usages: React.FC = () => {
    const [data, setData] = React.useState<MachineUsage[]>([]);
    const columns: (keyof MachineUsage)[] = data.length > 0 ? Object.keys(data[0]).filter((key) => !key.includes('_id') && key !== 'time_started') : [];
    
    const hmsify = (seconds: number): string => {
        const hours = Math.round(seconds / 3600);
        const minutes = Math.round((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    React.useEffect(() => {
        fetch('http://localhost:3000/api/usages/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data) && data.every(item => 'time_started' in item && 'machine_name' in item)) {
                    console.log('Usages:', data);
                    for (let usage of data) {
                        usage.duration = hmsify(usage.duration as unknown as number);
                        usage.cost = `$${(+usage.cost).toFixed(2)}`;
                    }
                    setData(data);
                } else {
                    throw new Error('Data is not of type MachineUsage');
                }
            })
            .catch(error => {
                console.error('Error fetching usages:', error);
            });
    }, []);

    return (
        <div className='tab-column-cover align-center'>
            <h2>My Usages</h2>
            <Table<MachineUsage>
                columns={columns}
                data={data}
            />
        </div>
    );
};

export default Usages;