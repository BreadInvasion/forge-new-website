import React from 'react';
import { ExclamationTriangleIcon, Component1Icon } from '@radix-ui/react-icons';
import {
    Card,
    Cover, Info, ListIcon, ListInfo, ListItem, MachineName, OtherMachines, Progress, ProgressBar, Prusas, StatusText,
} from './StatusComponents';
import { machines, otherMachines } from './generateMockStatusData';
import MachineCard from './MachineCard';

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
    return 75;
}

export default function Status() {

    return (
        <Cover>
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
                />
            ))}
            </Prusas>
            {/* <OtherMachines>
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
            </OtherMachines> */}
        </Cover>
    );
}
