import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getEndTime} from '../MachineCard';
import { OmniAPI } from 'src/apis/OmniAPI';
import { MachineStatus } from 'src/interfaces';
import { StatusText } from '../StatusComponents';

const UpNextContainer = styled.div`
    padding: 1rem;
    background-color:rgb(57, 153, 62);
    border-radius: 0.5rem;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    max-height: 300px;
    overflow-y: auto;
`;

const MachineItem = styled.div`
    margin-bottom: 0.5rem; 
    padding: 0.5rem; 
    border-bottom: 1px solid rgba(0, 0, 0, 0.1); 
`;

const UpNext: React.FC = () => {
    const [machines, setMachines] = useState<{ name: string; in_use: Boolean, user: string | undefined; usage_start?: Date; usage_duration?: number }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMachines = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await OmniAPI.getPublic("machinestatus");

                const flattenedMachines = [
                    ...response.loners,
                    ...response.groups.flatMap((group: { machines: MachineStatus[] }) => group.machines),
                ];

                const transformedMachines = flattenedMachines.map((machine) => ({
                    name: machine.name,
                    in_use: machine.in_use,
                    user: machine.user_name, // Map user_name to user
                    usage_start: machine.usage_start ? new Date(machine.usage_start) : undefined,
                    usage_duration: machine.usage_duration,
                }));

                setMachines(transformedMachines);
            } catch (error) {
                console.error('Error fetching machines:', error);
                setError('Failed to fetch machine data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchMachines();
    }, []);

    const inProgressMachines = machines
    .filter((machine) => machine.in_use)
    .sort((a, b) => {
            const endA = new Date(a.usage_start!).getTime() + a.usage_duration! * 60000;
            const endB = new Date(b.usage_start!).getTime() + b.usage_duration! * 60000;
            return endA - endB;
        })

    if (inProgressMachines.length === 0) {
        return (
            <UpNextContainer>
                <h2>Machines Up Next:</h2>
                <p>All machines are available!</p>
            </UpNextContainer>
        );
    }

    return (
        <UpNextContainer>
            <h2>Machines Up Next:</h2>
            {inProgressMachines.map((machine, index) => (
                <MachineItem key={index}>
                    <StatusText>{index + 1}. {machine.name} : being used by <br/>{machine.user ? machine.user : 'N/A'}</StatusText>
                    <StatusText $area="date">Est. Completion: {getEndTime(machine.usage_start!, machine.usage_duration!)}</StatusText>
                </MachineItem>
            ))}
        </UpNextContainer>
    );
};

export default UpNext;