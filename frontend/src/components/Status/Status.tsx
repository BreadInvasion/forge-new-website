import React, { useEffect, useState } from 'react';
import { OmniAPI } from "src/apis/OmniAPI";
import styled from 'styled-components';
import { GridContainer } from './StatusComponents';
import { machines } from './generateMockStatusData';
import { SelectedMachineProvider } from './SelectedMachineContext';
import MachineCard, { statusToString} from './MachineCard';
import UpNext from './components/UpNext';
import Highlight from './components/Highlight';
import Toolbar from './components/Toolbar';
import { Machine, AllMachinesStatusResponse } from "src/interfaces";

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

export const Status : React.FC = () => {
    const [MachinesResponse, setAllMachinesResponse] = useState<AllMachinesStatusResponse | null>(null);
    const [machines, setMachines] = useState<Machine[]>([]);
    
    const [highlightFailed, setHighlightFailed] = useState(false);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    
    useEffect(() => {
            const fetchMachines = async () => {
                try {
                    const response = await OmniAPI.getAll("machinestatus");
                    console.log(response);
    
                    const data: AllMachinesStatusResponse = response;
                    setAllMachinesResponse(data);
                    
                    const flattenedMachines = [
                        ...data.loners,
                        ...data.groups.flatMap((group) => group.machines),
                    ];
    
                    const transformedMachines = flattenedMachines.map((machine) => ({
                        ...machine,
                        group: machine.group || null,
                        group_id: machine.group_id || null,
                        type: machine.type || null,
                        type_id: machine.type_id || null,
                    }));
    
                    console.log("Machines:", transformedMachines);
                    setMachines(transformedMachines);
    
                } catch (error) {
                    console.error("Error fetching machines:", error);
                }
            };
    
            fetchMachines();
        }, []);


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
                   {/* {filteredMachines.map((machine, index) => (
                        <MachineCard
                            key={`${machine.name}-${index}`} //mchines id 
                            name={machine.name}
                            icon={machine.icon} //
                            user={machine.user} //
                            material={machine.material} // 
                            weight={machine.weight}
                            startTime={machine.startTime} 
                            totalTime={machine.totalTime} 
                            status={machine.status}// in use and failed (disabled?)
                            machine={machine} 
                            $highlightFailed={highlightFailed}
                            $minimized={true}
                            />
                    ))} */}
                    </GridContainer>
                    <Sidebar>
                        <Highlight />
                        <UpNext />
                    </Sidebar>
                </Page>
        </SelectedMachineProvider>
    );
};

export default Status;
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