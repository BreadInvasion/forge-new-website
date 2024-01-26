import React from 'react';
import styled from 'styled-components';
import {Printer} from './Printer';
import { useRecoilState } from 'recoil';
import { machinesState } from 'src/GlobalAtoms';

const StatusContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    overflow: hidden;
`;

const Mk3Shelf = styled.div`
    display: grid;
    grid-auto-columns: calc(calc(65vw - 60px) / 4);
    grid-auto-rows: calc(calc(100vh - 3.25rem - 40px) / 3);
    grid-gap: 0.5rem;
    padding: 1rem 1rem;
    background: rgba(0,0,0,0.2);
    overflow: hidden;
`;

const OtherMachines = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: calc(calc(100vh - 2rem) / 10));
    grid-gap: 0.5rem;
    padding: 1rem 1rem;
    background: rgba(0,0,0,0.2);
`;

export default function Status() {

    const [machines, setMachines] = useRecoilState(machinesState);



    return (
        <StatusContainer>
            <Mk3Shelf>
                {machines.map((machine, index) => {
                    return (
                        <Printer 
                            key={machine.machineName.concat(String(index))} 
                            col={(index % 4 + 1) + ''}
                            row={(Math.floor(index / 4) + 1) + ''}
                            printerName={machine.machineName}
                            userName={machine.user}
                            startTime={machine.start}
                            endTime={machine.end}
                            status={machine.status}
                        />
                    );
                })}
            </Mk3Shelf>
            <OtherMachines>
                
            </OtherMachines>
        </StatusContainer>

    );
}
