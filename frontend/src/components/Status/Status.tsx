import React, { useEffect, useState } from 'react';
import { OmniAPI } from "src/apis/OmniAPI";
import styled from 'styled-components';
import { GridContainer, StatusWrapper} from './StatusComponents';
import { SelectedMachineProvider } from './SelectedMachineContext';
import UpNext from './components/UpNext';
import Highlight from './components/Highlight';
import Toolbar from './components/Toolbar';
import MachineCard,{ getProgress } from './MachineCard';
import { Machine, AllMachinesStatusResponse } from "src/interfaces";

const Page = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 3fr 1fr;
    grid-template-rows: auto 1fr auto; 
    grid-template-areas:
        "tools highlight"
        "status highlight"
        "status up-next"
        "status up-next";
    padding: 0.5rem 1rem;
    gap: 0.5 rem;
    overflow-y: auto;
    scrollbar-color: rgba(0, 0, 0, 0.2) transparent; 
    @media screen and (max-width: 850px) {
        display: flex;
        flex-direction: column;
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr auto;
        grid-template-areas:
            "tools"
            "sidebar"
            "status";
    }
`;

const Sidebar = styled.div`
    grid-area: highlight;
    display: flex;
    flex-direction: column; 
    padding-top: 1rem;
    padding-right: 2rem;
    gap: 0;
    min-width: 250px;
    overflow: visible;
    @media screen and (max-width: 850px) {
        padding: 0.5rem;
        padding-top: 1rem;
        box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.2);
        display: grid;
        grid-template-columns: 2fr 1fr;
        grid-template-rows: auto;
        gap: 1rem;
        grid-template-areas:
            "highlight up-next";
    }
`;

export const Status : React.FC = () => {
    const [MachinesResponse, setAllMachinesResponse] = useState<AllMachinesStatusResponse | null>(null);
    const [machines, setMachines] = useState<Machine[]>([]);
    
    const [highlightFailed, setHighlightFailed] = useState(false);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    
    useEffect(() => {
            const fetchMachines = async () => {
                try {
                    const response = await OmniAPI.getPublic("machinestatus");
                    // console.log(response);
    
                    const data: AllMachinesStatusResponse = response;
                    setAllMachinesResponse(data);

                    const groups = [...data.groups.map(g => ({ id: g.machines[0].group_id, name: g.name }))];
                    const types = [0]; // yeah this is fucked for now
                    
                    const flattenedMachines = [
                        ...data.loners,
                        ...data.groups.flatMap((group) => group.machines),
                    ];

                    // console.log("Flattened Machines:", flattenedMachines);
    
                    const transformedMachines = flattenedMachines.map((machine) => ({
                        ...machine,
                        group_id: machine.group_id,
                        group: machine.group_id ? (groups.find(g => g.id === String(machine.group_id))?.name ?? 'Unknown Group') : 'No Group',
                        type_id: machine.type_id,
                        type: "Unknown Type",
                        id: machine.id,
                        name: machine.name,
                        in_use: machine.in_use,
                        usage_start: machine.usage_start ? new Date(machine.usage_start) : undefined, 
                        usage_duration: machine.usage_duration,
                        user: machine.user_id,
                        maintenance_mode: machine.maintenance_mode,
                        disabled: machine.disabled,
                        failed: machine.failed,
                        failed_at: machine.failed_at ? new Date(machine.failed_at) : undefined,
                    }));
    
                    // console.log("Machines:", transformedMachines);
                    setMachines(transformedMachines);
                } catch (error) {
                    console.error("Error fetching machines:", error);
                }
            };
    
            fetchMachines();
        }, []);

    const STATUS_FILTERS = ["In Progress", "Completed", "Available", "Failed", "Maintenance"];

    const filteredMachines = machines.filter((machine) => {
        if (activeFilters.length === 0) return true;

        const statusFilters = activeFilters.filter((f) => STATUS_FILTERS.includes(f));
        const otherFilters = activeFilters.filter((f) => !STATUS_FILTERS.includes(f));

        let statusOk = true;
        if (statusFilters.length > 0) {
            const progress = getProgress(machine.usage_start, machine.usage_duration);
            statusOk = statusFilters.some((filter) => {
                switch (filter) {
                    case "In Progress":
                        return progress < 100 && progress > 0;
                    case "Completed":
                        return progress === 100;
                    case "Available":
                        return !machine.in_use && !machine.failed && !machine.maintenance_mode;
                    case "Failed":
                        return machine.failed;
                    case "Maintenance":
                        return machine.maintenance_mode;
                    default:
                        return true;
                }
            });
        }

        let otherOk = true;
        if (otherFilters.length > 0) {
            otherOk = otherFilters.every((filter) => filter === machine.type || filter === machine.group);
        }

        return statusOk && otherOk;
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
                <StatusWrapper>
                    <GridContainer>
                    {filteredMachines.map((machine, index) => {
                        return (
                            <MachineCard
                                key={`${machine.name}-${index}`}  
                                id={machine.id}
                                name={machine.name}
                                in_use={machine.in_use}
                                usage_start={machine.usage_start} 
                                usage_duration={machine.usage_duration} 
                                user={machine.user}
                                maintenance_mode={machine.maintenance_mode} 
                                disabled={machine.disabled}
                                failed={machine.failed}
                                failed_at={machine.failed_at}
                                material={(machine as any).material} 
                                weight={(machine as any).weight}
                                machine={(machine as any)}
                                $highlightFailed={highlightFailed}
                                $minimized={true}
                            />
                        );
                    })}
                        </GridContainer>
                    </StatusWrapper>
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