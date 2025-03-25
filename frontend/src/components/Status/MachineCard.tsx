import React from 'react';
import styled from 'styled-components';
import { Card, MachineName, StatusText } from './StatusComponents';
import { useSelectedMachine } from './SelectedMachineContext';
import { Status } from './generateMockStatusData';

export const getEndTime = (startTime: string, totalTime: number) => {
    const start = new Date(startTime);
    const end = new Date(start.getTime() + totalTime * 60000);
    return end.toLocaleString('en-US', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
}

const getProgress = (startTime: string | undefined, totalTime: number | undefined) => {
    if (!startTime || !totalTime) return 0;
    const start = new Date(startTime);
    const end = new Date(start.getTime() + totalTime * 60000);
    const now = new Date();
    return Math.random() * 100;
}

export interface MachineProps {
    name: string;
    icon?: string;
    user?: string;
    material: string | undefined;
    weight?: number;
    startTime?: string;
    totalTime?: number;
    status: Status;
}

export interface MachineCardProps extends MachineProps {
    machine: MachineProps;
    $highlightFailed: boolean;
    $minimized: boolean;
    $clear: boolean;
}

export const statusToString = (status: Status): string => {
    switch (status) {
        case Status.Idle:
            return 'Idle';
        case Status.InProgress:
            return 'In Progress';
        case Status.Failed:
            return 'Failed';
        case Status.Maintenance:
            return 'Maintenance';
        default:
            return 'Unknown';
    }
};

const StyledButton = styled.button`
    background-color:rgb(228, 23, 19); 
    color: white;
    border: none;
    border-radius: 4px;
    padding: 1px 6px;
    font-size: 2.0vh; 
    text-align: center;
    cursor: pointer; 
    transition: background-color 0.2s ease;
    z-index: 10;
    position: relative;
    &:hover {
        background-color:rgb(186, 7, 7);
    }
`;

const MachineCard: React.FC<MachineCardProps> = ({ machine, $minimized, $highlightFailed}) => {
    const { name, icon, user, material, weight, startTime, totalTime, status } = machine;

    const {setSelectedMachine } = useSelectedMachine();

    const handleClick = () => {
        setSelectedMachine({ name, icon, user, material, weight, startTime, totalTime, status });
    };

const handleClearClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (status === Status.Failed) {
            machine.status = Status.Idle; 
            machine.user = undefined;
            machine.material = undefined;   
            machine.weight = undefined;
            machine.startTime = undefined;
            machine.totalTime = undefined;
            setSelectedMachine({ name, icon, user, material, weight, startTime, totalTime, status });
        }
    };
    

    return (
        <Card 
            $symbol={icon ? icon : name} 
            $minimized={$minimized} 
            $highlightFailed={$highlightFailed && status === Status.Failed}
            progress={$minimized ? getProgress(startTime, totalTime) : 0}
            onClick={handleClick}
        >
                <MachineName>{name}</MachineName>
                <StatusText>User: {user ? user : 'N/A'}</StatusText>
                {!$minimized && <StatusText $minimized={$minimized}>Material: {material}</StatusText>}
                {!$minimized && <StatusText $minimized={$minimized}>Weight: {weight ? weight + 'g' : 'N/A'}</StatusText>}
                {!$minimized && <StatusText $minimized={$minimized}>Start Time: {startTime} </StatusText>}
                {!$minimized && <StatusText $minimized={$minimized}>Total Time: {totalTime} </StatusText>}
                {!$minimized && <StatusText $minimized={$minimized}>Progress: {Math.round(getProgress(startTime, totalTime) * 100) / 100} % </StatusText>}
                <StatusText $area="date" $minimized={$minimized}>Est. Completion<br /> {startTime && totalTime ? getEndTime(startTime, totalTime) : 'N/A'}</StatusText>
                {!$minimized && <StatusText $minimized={$minimized}>Status: {statusToString(status)}</StatusText>}
                {$highlightFailed && status === Status.Failed && $minimized && <StyledButton onClick={handleClearClick}>Clear</StyledButton>}
        </Card>
    );
}

export default MachineCard;
