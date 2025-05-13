import React from 'react';
import styled from 'styled-components';
import { Card, MachineName, StatusText, BigCardAttribute, BigCardText, BigCardInfo} from './StatusComponents';
import { useSelectedMachine } from './SelectedMachineContext';

export const getEndTime = (usage_start: Date, usage_duration: number) => {
    const start = usage_start; 
    const end = new Date(start.getTime() + usage_duration * 1000);
    return end.toLocaleString('en-US', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
}

export const getProgress = (usage_start: Date | undefined, usage_duration: number | undefined) => {
    if (!usage_start || !usage_duration) return 0;
    const start = usage_start; 
    const end = new Date(start.getTime() + usage_duration * 600);
    const now = new Date();
    const progress = (now.getTime() - start.getTime()) / (end.getTime() - start.getTime());
    return Math.min(100, Math.max(0, progress * 100));
}

export interface MachineProps {
    id: string;    
    name: string;  
    in_use?: boolean;  
    usage_start?: Date;  
    usage_duration?: number;
    user?: string;
    maintenance_mode?: boolean;
    disabled?: boolean;
    failed?: boolean; 
    failed_at?: Date;
    material?: string; 
    weight?: number;  
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
                machine.failed_at = undefined;
    
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
                <MachineName $minimized={$minimized}>{name}</MachineName>
                <BigCardText $minimized={$minimized}>USER <br/ >{user ? user : 'N/A'} </BigCardText>
                {!$minimized && (
                    <>
                        <BigCardAttribute>
                            <BigCardText>MATERIAL: </BigCardText><BigCardInfo>{material ? material : 'N/A'}</BigCardInfo>
                        </BigCardAttribute>
                        <BigCardAttribute>
                            <BigCardText>WEIGHT: </BigCardText><BigCardInfo>{weight ? weight + 'g' : 'N/A'}</BigCardInfo>
                        </BigCardAttribute>
                        {in_use && (
                            <>
                            <BigCardText>START TIME</BigCardText><BigCardInfo>{usage_start?.toLocaleString('en-US', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}</BigCardInfo>
                            <BigCardAttribute>
                                <BigCardText>TOTAL TIME: </BigCardText><BigCardInfo>{usage_duration}</BigCardInfo>
                            </BigCardAttribute>
                            <BigCardAttribute>
                                <BigCardText>PROGRESS: </BigCardText><BigCardInfo>{getProgress(usage_start, usage_duration).toFixed(2)}%</BigCardInfo>
                            </BigCardAttribute>
                            </>
                        )}
                        <BigCardText>Status</BigCardText><BigCardInfo>{getStatusText(in_use, failed, maintenance_mode, disabled)}</BigCardInfo>
                        {failed &&(
                            <BigCardAttribute>
                                <BigCardText>Failed at: </BigCardText><BigCardInfo>{failed_at?.toDateString()}</BigCardInfo>
                            </BigCardAttribute>
                        )}
                    </>
                )}
                <BigCardText $minimized={$minimized}>Est. Completion <br/ >{usage_start && usage_duration ? getEndTime(usage_start, usage_duration) : 'N/A'}</BigCardText>
                {$highlightFailed && failed && $minimized && <StyledButton onClick={handleClearClick}>Clear</StyledButton>}
       </Card>
    );
}

export default MachineCard;
