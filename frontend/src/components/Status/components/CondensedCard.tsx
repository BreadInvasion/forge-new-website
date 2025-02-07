import React from 'react';
import styled from 'styled-components';
import Toggle from "@radix-ui/react-toggle"
import { useState } from 'react';
import { EraserIcon } from "@radix-ui/react-icons";
import {useToggle} from "./ToggleContext";


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
    return Math.random() * 100;
}

export interface MachineProps {
    name: string;
    icon?: string;
    user: string | undefined;
    startTime: string | undefined;
    totalTime: number | undefined;
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

    const { name, icon, user, startTime, totalTime} = props;
    const { highlight } = useToggle();

    return (
    <Card 
				symbol={icon ? icon : name} 
				progress={getProgress(startTime, totalTime)}
				highlight={highlight}
		>
        <MachineName>{name}</MachineName>
        {user && <StatusText>User: <br/>{user}</StatusText>}
        {!user && <StatusText>Available</StatusText>}
    </Card>
    );
}

export default CondensedCard;
