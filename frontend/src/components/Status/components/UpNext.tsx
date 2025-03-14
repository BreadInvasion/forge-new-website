import React from 'react';
import styled from 'styled-components';
import { getEndTime, MachineProps } from '../MachineCard';
import { machines } from '../generateMockStatusData';
import { StatusText } from '../StatusComponents';
import { Status } from '../generateMockStatusData';

const UpNextContainer = styled.div`
    padding: 1rem;
    background-color: #f5f5f5;
    border-radius: 0.5rem;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    margin-top: 1rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: #000000;
`;

const Header = styled.h2`
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 1rem;
`;

const MachineItem = styled.div`
    margin-bottom: 1rem;
`;

const EstCompletion = styled(StatusText)`
    font-size: 1rem;
    font-weight: bold;
`;

const UpNext: React.FC = () => {
    const inProgressMachines = machines
        .filter(machine => machine.status === Status.InProgress)
        .sort((a, b) => {
            const endA = new Date(a.startTime!).getTime() + a.totalTime! * 60000;
            const endB = new Date(b.startTime!).getTime() + b.totalTime! * 60000;
            return endA - endB;
        })
        .slice(0, 3);

    if (inProgressMachines.length === 0) {
        return (
            <UpNextContainer>
                <Header>Machines Up Next</Header>
                <p>All machines are available</p>
            </UpNextContainer>
        );
    }

    return (
        <UpNextContainer>
            <Header>Machines Up Next</Header>
            {inProgressMachines.map((machine, index) => (
                <MachineItem key={index}>
                    <StatusText>{index + 1}. {machine.name} : being used by {machine.user ? machine.user : 'N/A'}<br/></StatusText>
                    <EstCompletion $area="date">Est. Completion: {getEndTime(machine.startTime!, machine.totalTime!)}</EstCompletion>
                </MachineItem>
            ))}
        </UpNextContainer>
    );
};

export default UpNext;