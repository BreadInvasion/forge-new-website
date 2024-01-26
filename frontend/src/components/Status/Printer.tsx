import './Status.scss';
import {ReactComponent as MK3Prusa} from 'src/assets/img/PrusaMk3.svg';
import React from 'react';
import styled from 'styled-components';
import { PrinterStatus } from 'src/Constants';
import { ProgressBar } from './Progress';
import { Prusa } from './Prusa';

const PrinterBlock = styled.div.attrs((props: any) => ({
    ...props,
    col: props.col,
    row: props.row,
    status: props.status,
}))<{col?: string, row?: string, status?: PrinterStatus}>`
    grid-column: ${props => props.col};
    grid-row: ${props => props.row};
    display: flex;
    flex-direction: column;
    position: relative;

    outline: 1px solid rgba(0,0,0,0.4);
    filter: drop-shadow(0px 5px 5px rgba(0,0,0, 0.7));
    background-color: #EEE;
    background-image: ${props => {
        switch (props.status) {
            case PrinterStatus.IDLE:
                return 'radial-gradient(circle at 50% 0, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.7) 80%)';
            case PrinterStatus.BROKEN:
                return 'linear-gradient(to right, #FFD000, #EEE 80%)';
            case PrinterStatus.FAILED:
                return 'linear-gradient(to right, rgba(255, 0, 0, 0.8), rgba(255,255,255,0.1) 90%)';
            case PrinterStatus.SUCCESS:
                return 'linear-gradient(to right, rgba(0, 255, 0, 0.8), rgba(255,255,255,0.1) 90%)';
            default:
                return '#EEE';
        }
    }};
    overflow: hidden;
    font-family: Tw Cen MT Condensed;
    text-transform: uppercase;
    
`;

const MK3 = styled(MK3Prusa).attrs((props: any) => ({
    ...props,
    status: props.status,
}))<{status?: PrinterStatus}>`
    width: 75%;
    filter: ${props => props.status === PrinterStatus.IDLE ? 'brightness(70%) drop-shadow(0px -5px 4px rgba(0,0,0,0.3))' : 'drop-shadow(0px -5px 4px rgba(0,0,0,0.3))'};
    position: relative;
    margin: auto auto 1% 10%;
`;

const PrinterName = styled.div`
    transform-origin: 0 0;
    transform: translateY(180px) rotate(-90deg);
    position: relative;
    width: 180px;
    height: 50px;
    left: 2%;
    top: 2%;

    line-height: 2rem;
    font-size: 3rem;

    font-weight: bolder;
    text-align: end;
    color: #00000099;
`;

const Title = styled.div`
    font-size: 1.25rem;
    font-weight: bold;
    color: #000;
    position: absolute;
    left: 45px;
    top: 5px;
`;

const Subtitle = styled.div`
    font-size: 1rem;
    filter: drop-shadow(-10px 0px 10px rgba(256, 256, 256, 0.8));
`;

interface PrinterProps {
    col: string;
    row: string;
    printerName: string;
    userName?: string;
    startTime?: number;
    endTime?: number;
    status: PrinterStatus;
}

export const Printer = (props: PrinterProps) => {

    const {col, row, printerName, userName, startTime, endTime, status} = props;

    const ConvertSecondsToString = () => {
        if (startTime === undefined || endTime === undefined || Date.now() > endTime) return '0h 0m Remaining';

        const seconds = (Date.now() - startTime) / 1000;

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m Remaining`;
    };

    const getTitle = () => {
        switch (status) {
            case PrinterStatus.IDLE:
                return "Available";
            case PrinterStatus.BROKEN:
                return "Out of Order";
            default:
                return userName;
        }
    };

    const getSubtitle = () => {
        switch (status) {
            case PrinterStatus.BUSY:
                return ConvertSecondsToString();
            case PrinterStatus.SUCCESS:
                return "Print Complete";
            case PrinterStatus.FAILED:
                return "Print Failed";
            default:
                return "";
        }
    };

    // const moveZGantry = () => {
        
    // };

    return (
        <PrinterBlock col={col} row={row} status={status}>
            <PrinterName>{printerName}</PrinterName>
            {/* {status !== PrinterStatus.BROKEN && <MK3 status={status}/>} */}
            <Prusa progress={0} status={status}/>
            <Title>
                {getTitle()}
                <br/>
                <Subtitle>
                    {getSubtitle()}
                </Subtitle>
            </Title>
            <ProgressBar startTime={startTime} endTime={endTime} status={status} />
        </PrinterBlock>

    );
}
