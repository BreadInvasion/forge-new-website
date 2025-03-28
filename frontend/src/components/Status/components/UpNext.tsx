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
    margin-top: 1rem;
    max-height: 300px;
    overflow-y: auto;
`;

const MachineItem = styled.div`
    margin-bottom: 0.5rem; 
    padding: 0.5rem; 
    border-bottom: 1px solid rgba(0, 0, 0, 0.1); 
`;

const EstCompletion = styled(StatusText)`
    font-size: 1rem;
    font-weight: bold;
`;

const UpNext: React.FC = () => {
    const [machines, setMachines] = useState<MachineStatus[]>([]);
    
    useEffect(() => {
            const fetchMachines = async () => {
                try {
                    const response = await OmniAPI.getPublic("machinestatus");

                    const flattenedMachines = [
                        ...response.loners,
                        ...response.groups.flatMap((group: { machines: MachineStatus[] }) => group.machines),
                    ];
                    setMachines(flattenedMachines);
                } catch (error) {
                    console.error('Error fetching machines:', error);
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
                <h2>Machines Up Next</h2>
                <p>All machines are available</p>
            </UpNextContainer>
        );
    }

    return (
        <UpNextContainer>
            <h2>Machines Up Next</h2>
            {inProgressMachines.map((machine, index) => (
                <MachineItem key={index}>
                    <StatusText>{index + 1}. {machine.name} : being used by {machine.user ? machine.user : 'N/A'}<br/></StatusText>
                    <EstCompletion $area="date">Est. Completion: {getEndTime(machine.usage_start!, machine.usage_duration!)}</EstCompletion>
                </MachineItem>
            ))}
        </UpNextContainer>
    );
};

export default UpNext;