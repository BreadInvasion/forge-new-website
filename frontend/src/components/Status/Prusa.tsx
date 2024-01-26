import {ReactComponent as MK3Frame} from 'src/assets/img/PrusaMk3.svg';
import {ReactComponent as MK3Z_Gantry} from 'src/assets/img/Z_Gantry.svg';
import {ReactComponent as MK3Broken_Z_Gantry} from 'src/assets/img/PrusaMk3.svg';
import React from 'react';
import styled from 'styled-components';
import { PrinterStatus } from 'src/Constants';

const Frame = styled(MK3Frame).attrs((props: any) => ({
    ...props,
    status: props.status,
}))<{status?: PrinterStatus}>`
    width: 75%;
    filter: ${props => props.status === PrinterStatus.IDLE ? 'brightness(70%) drop-shadow(0px -5px 4px rgba(0,0,0,0.3))' : 'drop-shadow(0px -5px 4px rgba(0,0,0,0.3))'};
    position: relative;
    margin: auto auto 1% 10%;
`;

const Z_Gantry = styled(MK3Z_Gantry).attrs((props: any) => ({
    ...props,
    status: props.status,
}))<{status?: PrinterStatus}>`
    width: 75%;
    filter: ${props => props.status === PrinterStatus.IDLE ? 'brightness(70%) drop-shadow(0px -5px 4px rgba(0,0,0,0.3))' : 'drop-shadow(0px -5px 4px rgba(0,0,0,0.3))'};
    position: absolute;
    margin: auto auto 1% 10%;
`;

const Broken_Z_Gantry = styled(MK3Broken_Z_Gantry).attrs((props: any) => ({
    ...props,
    status: props.status,
}))<{status?: PrinterStatus}>`
    width: 75%;
    filter: ${props => props.status === PrinterStatus.IDLE ? 'brightness(70%) drop-shadow(0px -5px 4px rgba(0,0,0,0.3))' : 'drop-shadow(0px -5px 4px rgba(0,0,0,0.3))'};
    position: relative;
    margin: auto auto 1% 10%;
`;

interface PrusaProps {
    progress: number;
    status: PrinterStatus;
}

export const Prusa = (props: PrusaProps) => {

    const {progress, status} = props;



    return (
        <>
            <Frame status={status}/>
            <Z_Gantry status={status}/>
        </>

    );
}
