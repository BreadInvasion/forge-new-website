import React from 'react';
import styled from 'styled-components';
import { Card, MachineName, StatusText } from './StatusComponents';
import { useSelectedMachine } from './SelectedMachineContext';

export const getEndTime = (usage_start: string, usage_duration: number) => {
    const start = new Date(usage_start);
    const end = new Date(start.getTime() + usage_duration * 60000);
    return end.toLocaleString('en-US', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
}

const getProgress = (usage_start: string | undefined, usage_duration: number | undefined) => {
    if (!usage_start || !usage_duration) return 0;
    const start = new Date(usage_start);
    const end = new Date(start.getTime() + usage_duration * 60000);
    const now = new Date();
    return Math.random() * 100;
}

export interface MachineProps {
    id: string;     //id
    name: string;   //machine name
    in_use: boolean;    //status
    usage_start?: string;   //start time
    usage_duration?: number; //total time
    user?: string; //user -> need to get from id
    maintenance_mode: boolean; //status
    disabled: boolean;  //status
    failed: boolean;    //status
    failed_at?: string; //failed time
    material?: string;  //material -> need to get from id
    weight?: number;   //weight -> need to get from id
}

export interface MachineCardProps extends MachineProps {
    machine: MachineProps;
    $highlightFailed: boolean;
    $minimized: boolean;
}

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
    const { id, name, user, material, weight, usage_start, usage_duration, failed } = machine;

    const {setSelectedMachine } = useSelectedMachine();

    const handleClick = () => {
        setSelectedMachine({ name, user, material, weight, usage_start, usage_duration, failed });
    };

    const handleClearClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (failed) {
            machine.failed = false; 
            machine.user = undefined;
            machine.material = undefined;   
            machine.weight = undefined;
            machine.usage_start = undefined;
            machine.usage_duration= undefined;
            setSelectedMachine({ name, user, material, weight, usage_start, usage_duration, failed });
        }
    };
    

    return (
        <Card 
            $symbol={name} 
            $minimized={$minimized} 
            $highlightFailed={$highlightFailed && failed}
            progress={$minimized ? getProgress(usage_start, usage_duration) : 0}
            onClick={handleClick}
        >
                <MachineName>{name}</MachineName>
                <StatusText>User: {user ? user : 'N/A'}</StatusText>
                {!$minimized && <StatusText $minimized={$minimized}>Material: {material}</StatusText>}
                {!$minimized && <StatusText $minimized={$minimized}>Weight: {weight ? weight + 'g' : 'N/A'}</StatusText>}
                {!$minimized && <StatusText $minimized={$minimized}>Start Time: {usage_start} </StatusText>}
                {!$minimized && <StatusText $minimized={$minimized}>Total Time: {usage_duration} </StatusText>}
                {!$minimized && <StatusText $minimized={$minimized}>Progress: {Math.round(getProgress(usage_start, usage_duration) * 100) / 100} % </StatusText>}
                <StatusText $area="date" $minimized={$minimized}>Est. Completion<br /> {usage_start && usage_duration ? getEndTime(usage_start, usage_duration) : 'N/A'}</StatusText>
                {!$minimized && <StatusText $minimized={$minimized}>Status: {failed}</StatusText>}
                {$highlightFailed && failed && $minimized && <StyledButton onClick={handleClearClick}>Clear</StyledButton>}
        </Card>
    );
}

export default MachineCard;
