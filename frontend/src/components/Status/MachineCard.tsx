import React from 'react';
import { ExclamationTriangleIcon, Component1Icon } from '@radix-ui/react-icons';
import styled from 'styled-components';
import { Card, Info, ListIcon, ListInfo, ListItem, MachineName, OtherMachines, Progress, ProgressBar, Prusas, StatusText } from './StatusComponents';
import { machines, otherMachines } from './generateMockStatusData';
import { useHighlight } from './components/HighlightContext';
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
    const progress = ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100;
    return Math.min(Math.max(progress, 0), 100);
}

export interface MachineProps {
    name: string;
    icon?: string;
    user: string | undefined;
    material: string | undefined;
    weight: number | undefined;
    startTime: string | undefined;
    totalTime: number | undefined;
    status: Status;
    minimized?: boolean;
    highlight?: boolean;
    clear?: boolean;
    onClear?: () => void;
}

const statusToString = (status: Status): string => {
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

const StyledCard = styled(Card)<{ minimized?: boolean, highlight?: boolean, clear?: boolean }>`
    border-radius: ${({ minimized }) => (minimized ? '0.5rem' : '0.2rem')}; 
    border: ${({ clear, highlight }) => (clear && highlight ? '2px solid red' : 'none')};
`;

const MachineCard = (props: MachineProps) => {
    const { name, icon, user, material, weight, startTime, totalTime, status, minimized = true, highlight = false, clear = false, onClear } = props;

    const { setSelectedMachine } = useSelectedMachine();

    const handleClick = () => {
        setSelectedMachine({ name, icon, user, material, weight, startTime, totalTime, status });
    };

    const handleClearClick = () => {
        if (onClear) {
            onClear();
        }
    };

    return (
        <StyledCard symbol={icon ? icon : name} minimized={minimized} highlight={highlight} clear={clear} onClick={handleClick}>
            <Info>
                <MachineName>{name}</MachineName>
                <StatusText>User: {user ? user : 'N/A'}</StatusText>
                {!minimized && <StatusText>Material: {material}</StatusText>}
                {!minimized && <StatusText>Weight: {weight ? weight + 'g' : 'N/A'}</StatusText>}
                <StatusText area="date">Est. Completion<br /> {startTime && totalTime ? getEndTime(startTime, totalTime) : 'N/A'}</StatusText>
                {!minimized && <StatusText>Status: {statusToString(status)}</StatusText>}
            </Info>
            {minimized && (
                <ProgressBar horizontal>
                    {startTime && totalTime && <Progress progress={getProgress(startTime, totalTime)} horizontal />}
                </ProgressBar>
            )}
            {minimized && <button onClick={handleClearClick}>Clear</button>}
        </StyledCard>
    );
}

export default MachineCard;
