import React from 'react';
import styled from 'styled-components';
import { ExclamationTriangleIcon, Component1Icon } from '@radix-ui/react-icons';
import { Card, Info, ListIcon, ListInfo, ListItem, MachineName, OtherMachines, Progress, ProgressBar, Prusas, StatusText } from './StatusComponents';
import { machines, otherMachines } from './generateMockStatusData';
import { SelectedMachineProvider } from './SelectedMachineContext';
import MachineCard from './MachineCard';
import { HighlightProvider } from './components/HighlightContext';
import Highlight from './components/Highlight';
import UpNext from './components/UpNext';

const Container = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 1rem;
    padding: 1rem;
`;

const Sidebar = styled.div`
    display: flex;
    flex-direction: column;
    padding-right: 2rem;
`;
const getEndTime = (startTime: string, totalTime: number) => {
    const start = new Date(startTime);
    const end = new Date(start.getTime() + totalTime * 60000);
    return end.toLocaleString('en-US', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
}

const getProgress = (startTime: string | undefined, totalTime: number | undefined) => {
    if (!startTime || !totalTime) return 0;
    const start = new Date(startTime);
    const end = new Date(start.getTime() + totalTime * 60000);
    const now = new Date();
    return 75;
}

export default function Status() {
    return (
        <SelectedMachineProvider>
            <HighlightProvider>
                <Container>
                    <Prusas>
                    {machines.map((machine, index) => (
                        <MachineCard
                            key={index}
                            name={machine.name}
                            icon={machine.icon}
                            user={machine.user}
                            material={machine.material}
                            weight={machine.weight}
                            startTime={machine.startTime}
                            totalTime={machine.totalTime}
                            status={machine.status}
                            />
                    ))}
                    </Prusas>
                    <Sidebar>
                        <Highlight />
                        <UpNext />
                    </Sidebar>
                </Container>
            </HighlightProvider>     
        </SelectedMachineProvider>
    );
}
/*
{ <OtherMachines>
                {otherMachines.map((machine, index) => (
                    <ListItem key={index}>
                        <ListIcon symbol={machine.icon} />
                        <ListInfo>
                            <MachineName>{machine.name}</MachineName>
                            <StatusText>User: {machine.user ? machine.user : 'N/A'}</StatusText>
                        </ListInfo>
                        <ListInfo>
                            <StatusText>Material: {machine.material}</StatusText>
                            <StatusText>Weight: {machine.weight ? machine.weight+'g' : 'N/A'}</StatusText>
                        </ListInfo>
                        <ListInfo>
                            <StatusText area="date">Est. Completion<br/> {machine.startTime && machine.totalTime ? getEndTime(machine.startTime, machine.totalTime) : 'N/A'}</StatusText>
                            <ProgressBar horizontal="true">
                                <Progress progress={getProgress(machine.startTime, machine.totalTime)} horizontal={true}/>
                            </ProgressBar>
                        </ListInfo>
                    </ListItem>
                ))}
            </OtherMachines> }*/