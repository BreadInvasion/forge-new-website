import React from 'react';
import { ExclamationTriangleIcon, Component1Icon } from '@radix-ui/react-icons';
import {
    Card,
    Cover, Info, ListIcon, ListInfo, ListItem, MachineName, OtherMachines, Progress, ProgressBar, Prusas, StatusText,
} from './StatusComponents';
import { machines, otherMachines } from './generateMockStatusData';

const getEndTime = (startTime: string, totalTime: number) => {
    const start = new Date(startTime);
    const end = new Date(start.getTime() + totalTime * 60000);
    return end.toLocaleString('en-US', {month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true});
}

const getProgress = (startTime: string | undefined, totalTime: number | undefined) => {
    if (!startTime || !totalTime) return 0;
    const start = new Date(startTime);
    const end = new Date(start.getTime() + totalTime * 60000);
    const now = new Date();
    return 75;
}

export interface MachineProps {
    name: string;
    icon?: string;
    user: string | undefined;
    material: string;
    weight: number | undefined;
    startTime: string | undefined;
    totalTime: number | undefined;
}

const MachineCard = (props: MachineProps) => {

    const { name, icon, user, material, weight, startTime, totalTime } = props;

    return (

    <Card symbol={icon ? icon : name}>
        <Info>
            <MachineName>{name}</MachineName>
            <StatusText>User: {user ? user : 'N/A'}</StatusText>
            <StatusText>Material: {material}</StatusText>
            <StatusText>Weight: {weight ? weight+'g' : 'N/A'}</StatusText>
            <StatusText area="date">Est. Completion<br/> {startTime && totalTime ? getEndTime(startTime, totalTime) : 'N/A'}</StatusText>
        </Info>
        <ProgressBar>
            {startTime && totalTime && <Progress progress={getProgress(startTime, totalTime)}/>}
        </ProgressBar>
    </Card>
    );
}

export default MachineCard;
