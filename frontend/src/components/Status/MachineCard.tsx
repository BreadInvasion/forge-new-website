import React from 'react';
import { ExclamationTriangleIcon, Component1Icon } from '@radix-ui/react-icons';
import styled from 'styled-components';
import {Card, Info, ListIcon, ListInfo, ListItem, MachineName, OtherMachines, Progress, ProgressBar, Prusas, StatusText,
} from './StatusComponents';
import { machines, otherMachines } from './generateMockStatusData';
import Status from './Status';
import { useHighlight } from './components//HighlightContext';


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
    material: string | undefined;
    weight: number | undefined;
    startTime: string | undefined;
    totalTime: number | undefined;
    status: string;
}

export interface MachineCardProps{
    minimized?: boolean;
    highlight?: boolean;
}

const MachineCard = (props: MachineProps, any: MachineCardProps) => {

    const { name, icon, user, material, weight, startTime, totalTime, status} = props;
    const {minimized = true, highlight = false} = any;

    const { highlight: globalHighlight } = useHighlight();

    const [clearToggle, setClearToggle] = React.useState(false);
    const handleClearToggle = () => setClearToggle(!clearToggle);

    const shouldHighlight = minimized && clearToggle && status === "Failed" && globalHighlight;

    return (

    <Card symbol={icon ? icon : name} minimized={minimized} highlight={shouldHighlight}>
        <Info>
            <MachineName>{name}</MachineName>
            <StatusText>User: {user ? user : 'N/A'}</StatusText>
            {!minimized && <StatusText>Material: {material}</StatusText>}
            {!minimized && <StatusText>Weight: {weight ? weight+'g' : 'N/A'}</StatusText>}
            <StatusText area="date">Est. Completion<br/> {startTime && totalTime ? getEndTime(startTime, totalTime) : 'N/A'}</StatusText>
            
        </Info>
        <ProgressBar>
            {startTime && totalTime && <Progress progress={getProgress(startTime, totalTime)}/>}
        </ProgressBar>
        <button onClick={handleClearToggle}>Clear</button>
    </Card>
    );
}

export default MachineCard;
