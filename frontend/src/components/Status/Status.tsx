import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { GridContainer, StatusWrapper} from './StatusComponents';
import { SelectedMachineProvider } from './SelectedMachineContext';
import UpNext from './components/UpNext';
import Highlight from './components/Highlight';
import Toolbar from './components/Toolbar';
import MachineCard,{ getProgress } from './MachineCard';
import { useMachines } from 'src/hooks/useMachines';
import Info from 'src/components/Info';

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
    gap: 0.5rem;
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
        padding: 0.5rem 1rem;
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
        height: 40vh;
        box-sizing: border-box;
        overflow-y: auto;
    }
`;

export const Status : React.FC = () => {
    const [highlightFailed, setHighlightFailed] = useState(false);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const STATUS_FILTERS = ["In Progress", "Completed", "Available", "Failed", "Maintenance"];
    
    const {data: machines, error, isError, isLoading, refetch} = useMachines();

    const filteredMachines = useMemo(() => {
        if (activeFilters.length === 0) return machines;

        return machines.filter((machine) => {    
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
    }, [machines, activeFilters]);

    if (isLoading) return (<Info>Loading...</Info>);
    if (isError) return (<Info><p>Error: {error.message}</p><button onClick={() => refetch()}>Retry</button></Info>);

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