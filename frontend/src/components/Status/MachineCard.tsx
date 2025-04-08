import React from 'react';
import styled from 'styled-components';
import { Card, MachineName, StatusText } from './StatusComponents';
import { useSelectedMachine } from './SelectedMachineContext';
import Status from './Status';

export const getEndTime = (usage_start: Date, usage_duration: number) => {
    const start = typeof usage_start === 'string' ? new Date(usage_start) : usage_start; // Convert to Date if it's a string
    const end = new Date(start.getTime() + usage_duration * 60000);
    return end.toLocaleString('en-US', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
}

const getProgress = (usage_start: Date | undefined, usage_duration: number | undefined) => {
    if (!usage_start || !usage_duration) return 0;
    const start = typeof usage_start === 'string' ? new Date(usage_start) : usage_start; // Convert to Date if it's a string
    const end = new Date(start.getTime() + usage_duration * 60000);
    const now = new Date();
    return Math.min(1, Math.max(0, (now.getTime() - start.getTime()) / (end.getTime() - start.getTime())));
}

export interface MachineProps {
    id: string;     //id
    name: string;   //machine name
    in_use?: boolean;    //status
    usage_start?: Date;   //start time
    usage_duration?: number; //total time
    user?: string; //user -> need to get from id
    maintenance_mode?: boolean; //status
    disabled?: boolean;  //status
    failed?: boolean;    //status
    failed_at?: Date; //failed time
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
    const {id, name, in_use, usage_start, usage_duration, user, maintenance_mode, disabled, failed, failed_at, weight, material} = machine;

    const {setSelectedMachine } = useSelectedMachine();

    const handleClick = () => {
        setSelectedMachine({ id, name, in_use, usage_start, usage_duration, user, maintenance_mode, disabled, failed, failed_at, weight, material});
    };

    const handleClearClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (failed) {
            try {
                const response = await fetch(`http://localhost:3000/api/clear/${machine.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                if (!response.ok) {
                    if (response.status === 404) {
                        alert('Machine not found. Please check the machine ID.');
                    } else {
                        throw new Error(`Failed to clear machine: ${response.statusText}`);
                    }
                }
                machine.failed = false; 
                machine.in_use = false;
                machine.maintenance_mode = false;
                machine.disabled = false;
    
                setSelectedMachine({ id, name, in_use, usage_start, usage_duration, user, maintenance_mode, disabled, failed, failed_at, weight, material });
            } catch (error) {
                console.error('Error clearing machine:', error);
                alert('Failed to clear the machine. Please try again.');
            }
        }
    };

    const getStatusText = (in_use?: boolean, failed?: boolean, maintenance_mode?: boolean, disabled?: boolean) => {
        const statuses = [];
        if (in_use) statuses.push("In Use");
        if (failed) statuses.push("Failed");
        if (maintenance_mode) statuses.push("Under Maintenance");
        if (disabled) statuses.push("Disabled");
        if (!in_use && !failed && !maintenance_mode && !disabled) statuses.push("Available");
        return statuses.length > 0 ? statuses.join(", ") : "Operational";
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
                {!$minimized && <StatusText $minimized={$minimized}>Material: {material ? material : 'N/A'}</StatusText>}
                {!$minimized && <StatusText $minimized={$minimized}>Weight: {weight ? weight + 'g' : 'N/A'}</StatusText>}
                {!$minimized && in_use && <StatusText $minimized={$minimized}>Start Time<br /> {usage_start?.toLocaleString('en-US', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })} </StatusText>}
                {!$minimized && in_use && <StatusText $minimized={$minimized}>Total Time: {usage_duration} </StatusText>}
                {!$minimized && in_use && <StatusText $minimized={$minimized}>Progress: {Math.round(getProgress(usage_start, usage_duration) * 100) / 100} % </StatusText>}
                <StatusText $area="date" $minimized={$minimized}>Est. Completion<br /> {usage_start && usage_duration ? getEndTime(usage_start, usage_duration) : 'N/A'}</StatusText>
                {!$minimized && <StatusText $minimized={$minimized}>Status: {getStatusText(in_use, failed, maintenance_mode, disabled)}</StatusText>}
                {!$minimized && failed && <StatusText $minimized={$minimized}>Failed at: {failed_at?.toDateString()}</StatusText>}
                {/*if failed, show fail message*/}
                {$highlightFailed && failed && $minimized && <StyledButton onClick={handleClearClick}>Clear</StyledButton>}
       </Card>
    );
}

export default MachineCard;
