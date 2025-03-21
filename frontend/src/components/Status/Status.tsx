import React, { useState } from 'react';
import styled from 'styled-components';
import { GridContainer } from './StatusComponents';
import { machines } from './generateMockStatusData';
import { SelectedMachineProvider } from './SelectedMachineContext';
import MachineCard, { statusToString} from './MachineCard';
import UpNext from './components/UpNext';
import Highlight from './components/Highlight';
import Toolbar from './components/Toolbar';
const Page = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 3fr 1fr;
    grid-template-areas:
        "tools highlight"
        "status highlight"
        "status up-next"
        "status up-next";
    padding: 0.5rem 1rem;
`;

const Sidebar = styled.div`
    grid-area: highlight; //
    display: flex;
    flex-direction: column; 
    padding-right: 2rem;
   
`;

/*
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
*/

export default function Status() {
    const [highlightFailed, setHighlightFailed] = useState(false);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    
    const filteredMachines = machines.filter((machine) => {
        if (activeFilters.length === 0) return true;

        return activeFilters.some((filter) => {
            return (
                filter === machine.name || // Match machine name
                filter === statusToString(machine.status) // Match machine status
            );
        });
    });

    return (
        <SelectedMachineProvider>
            <Page>
                <Toolbar 
                    highlightFailed={highlightFailed} 
                    setHighlightFailed={setHighlightFailed} 
                    activeFilters={activeFilters}
                    setActiveFilters={setActiveFilters}
                />
                   <GridContainer>
                   {filteredMachines.map((machine, index) => (
                        <MachineCard
                            key={`${machine.name}-${index}`}
                            name={machine.name}
                            icon={machine.icon}
                            user={machine.user}
                            material={machine.material}
                            weight={machine.weight}
                            startTime={machine.startTime}
                            totalTime={machine.totalTime}
                            status={machine.status}
                            machine={machine}
                            $highlightFailed={highlightFailed}
                            $minimized={true}
                            />
                    ))}
                    </GridContainer>
                    <Sidebar>
                        <Highlight />
                        <UpNext />
                    </Sidebar>
                </Page>
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