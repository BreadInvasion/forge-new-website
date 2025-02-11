import React from 'react';
import styled from 'styled-components';


interface MachineCardProps {
    machine: string;
    icon: string;
    status: string;
    user: string | undefined;
    filament: string | undefined;
    quantity: number | undefined;
    usageDuration: number | undefined;
    startTime: string | undefined;
    totalTime: number | undefined;
    timeRemaining: number | undefined;

    minimized?: boolean;
    highlight?: boolean;
}

const CardContainer = styled.div<{ minimized?: boolean; highlight?:boolean} >` 
    background-color: #f5f5f5;
    border-radius: 5px;
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    width: 9vw;
    height: 9vw;
    aspect-ratio: 1 / 1;
    flex-shrink: 0;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    border: 1px solid #999;
`;

const MachineName = styled.h3<{minimized?: boolean}>`
    font-size: ${({ minimized }) => (minimized ? "3.5vh" : "4.5vh")};
    color: #000000;
    font-weight: 600;
    text-transform: uppercase;
    font-family: Montserrat;
    text-align: center;
`;

const StatusText = styled.p<{minimized?: boolean}>`
    font-size: ${({ minimized }) => (minimized ? "2.5vh" : "3.5vh")};
    color: #000000;
    text-align: center;
    text-jusitfy: center;
    font-family: Montserrat;
    font-weight: 600;
`;

const ExtraDetails = styled.p`
    font-size: 3.5vh;
    color: #000000;
    text-align: center;
    text-jusitfy: center;
    font-family: Montserrat;
    font-weight: 600;
`;

const MachineCard: React.FC<MachineCardProps> = ({
    machine, icon, status, user, filament, quantity,
    usageDuration, startTime, totalTime, timeRemaining,
    minimized = true,
    highlight = false
}) => {
    return(
        <CardContainer
				symbol={icon ? icon : machine} 
				progress={getProgress(startTime, totalTime)}
				highlight={highlight}
		>
        <MachineName>{machine}</MachineName>
        {user && <StatusText>User: <br/>{user}</StatusText>}
        {!user && <StatusText>Available</StatusText>}
        {!minimized && 
            <ExtraDetails>
                {status}{filament}{quantity}{usageDuration}{timeRemaining}
            </ExtraDetails>
        }
    </CardContainer>
    );
}

export default MachineCard;

