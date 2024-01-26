import './Status.scss';
import React from 'react';
import { PrinterStatus } from 'src/Constants';
import styled from 'styled-components';


const ProgressContainer = styled.div`
    position: absolute;
    bottom: 5%;
    right: 5%;

    width: 8%;
    height: 90%;
    border-radius: 1.25rem;
    display: flex;
    flex-direction: column-reverse;
    
    overflow: hidden;
    background: #FFFFFF77;
    outline: 2px solid #000000AA;
`;

const Progress = styled.div.attrs((props: any) => ({
    ...props,
    now: props.now,
    status: props.status,
}))<{now?: number, status?: PrinterStatus}>`
    height: ${props => props.now}%;
    max-height: 100%;
    width: auto;


    background-image: ${props => props.status === PrinterStatus.FAILED ?
        `repeating-linear-gradient(
            45deg,
            #770000,
            #770000 25%,
            #CC0000 25%,
            #CC0000 50%,
            #770000 50%,
            #770000 75%,
            #CC0000 75%,
            #CC0000 100%
            );` :
        `repeating-linear-gradient(
            45deg,
            #007700,
            #007700 25%,
            #00CC00 25%,
            #00CC00 50%,
            #007700 50%,
            #007700 75%,
            #00CC00 75%,
            #00CC00 100%
            );` 
    };
    background-size: 50px 50px;
    animation: progress 2s linear infinite;

    @keyframes progress {
        0% {
            background-position: 0 0;
        }
        100% {
            background-position: 0 50px;
        }
    }
`;

interface ProgressProps {
    startTime?: number;
    endTime?: number;
    status?: PrinterStatus;
}

export const ProgressBar = (props: ProgressProps) => {

    const { startTime, endTime, status } = props;

    const getProgressFromTime = () => {
        if (startTime === undefined || endTime === undefined) return 0;

        const elapsed = Date.now() - startTime;
        const total = endTime - startTime;
        return Math.min(Math.floor((elapsed / total) * 100), 100);
    }

    return (
        <ProgressContainer>
            <Progress now={getProgressFromTime()} status={status}/>
        </ProgressContainer>
    );
}
