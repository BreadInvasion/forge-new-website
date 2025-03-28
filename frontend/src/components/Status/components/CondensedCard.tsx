import React from 'react';
import styled from 'styled-components';

const getEndTime = (usage_start: string, usage_duration: number) => {
    const start = new Date(usage_start);
    const end = new Date(start.getTime() + usage_duration * 60000);
    return end.toLocaleString('en-US', {month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true});
}

const getProgress = (usage_start: string | undefined, usage_duration: number | undefined) => {
    if (!usage_start || !usage_duration) return 0;
    const start = new Date(usage_start);
    const end = new Date(start.getTime() + usage_duration * 60000);
    const now = new Date();
    return Math.random() * 100;
}

export interface MachineProps {
    name: string;
    icon?: string;
    user: string | undefined;
    usage_start: string | undefined;
    usage_duration: number | undefined;
}

const Card = styled.div<{symbol: string, progress: number}>`
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
    ${props => props?.symbol && `
        background-image: url(src/assets/img/symbols/${props.symbol}.svg);
        background-size: auto 90%;
        background-repeat: no-repeat;
        background-position: center;
    `}
    position: relative;

    &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: ${props => props.progress}%;
        background-color: rgba(0, 255, 0, 0.2);
        border-radius: 5px;
    }
`;

const MachineName = styled.h3`
    font-size: 3.5vh;
    font-weight: 600;
    color: #000;
    text-transform: uppercase;
    font-family: Montserrat;
    text-align: center;
`;

const StatusText = styled.p`
    font-size: 2.5vh;
    color: #000;
    text-align: center;
    text-jusitfy: center;
    font-family: Montserrat;
    font-weight: 600;
`;

const CondensedCard = (props: MachineProps) => {

    const { name, user, usage_start, usage_duration } = props;

    return (

    <Card symbol={name} progress={getProgress(usage_start, usage_duration)}>
        <MachineName>{name}</MachineName>
        {user && <StatusText>User: <br/>{user}</StatusText>}
        {!user && <StatusText>Available</StatusText>}
    </Card>
    );
}

export default CondensedCard;