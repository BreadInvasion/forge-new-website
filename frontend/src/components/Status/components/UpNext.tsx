import React, { useMemo } from 'react';
import styled from 'styled-components';
import { StatusText } from '../StatusComponents';
import { formatTime, getTimeOffset } from 'src/utils/time';
import { useMachineStatus } from 'src/hooks/useMachines';

const UpNextContainer = styled.div`
    padding: 1rem;
    background-color:rgb(138, 138, 138);
    border-radius: 0.5rem;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    max-height: 300px;
    overflow-y: auto;
    font-family: Montserrat;
    font-size: 2.0vh;
`;

const MachineItem = styled.div`
    margin-bottom: 0.5rem;
    margin-top: 0.5rem; 
    padding: 0.5rem; 
    border-bottom: 2px solid rgba(0, 0, 0, 0.1); 
    background-color:rgba(255, 255, 255, 0.58);
    border-radius: 0.5rem;
    border-color: rgb(110, 110, 110);
`;

const ItemHeader = styled.div`
    display: flex; 
    justify-content: space-between;
    align-items: center;
    @media screen and (max-width: 850px) {
        flex-direction: column;
        align-items: flex-start;
        }
`;

const MachineName = styled.h3`
    font-size: 2.5vh;
    font-weight: 600;
    text-transform: uppercase;
`;

const Countdown = styled.div`
    display: flex;
    align-items: center; 
    gap: 0.1rem;
    padding: 0.2rem;
    font-size: 1.5vh;
    font-weight: 700;
    background-color: rgba(0, 0, 0, 0.17);
    max-width: 100px;
    text-align: center;
    border-radius: 0.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    border-color: rgb(72, 72, 72);

`;

const UserName = styled.p`
    font-size: 2.0vh;
    font-weight: 400;
`;

const EstTime = styled(StatusText)`
    font-size: 2.0vh;
    font-weight: 500;
    text-align: left;
`;

const MAX_TIME_MINUTES = 30;

const UpNext: React.FC = () => {
    const {data: machines} = useMachineStatus();
    const now = Date.now();

    const upNextMachines = useMemo(() => machines
        .filter((machine) => machine.in_use)
        .sort((a, b) => {
            const endA = getTimeOffset(a.usage_start!, a.usage_duration).getTime();
            const endB = getTimeOffset(b.usage_start!, b.usage_duration).getTime();
            return endA - endB;
        }).filter((machine) => {
            const endTime = getTimeOffset(machine.usage_start!, machine.usage_duration).getTime();
            return endTime > now && endTime - now <= MAX_TIME_MINUTES * 60 * 1000; // Ends within 30 minutes
        })
    , [machines]);

    if (upNextMachines.length === 0) {
        return (
            <UpNextContainer>
                <h2>MACHINES UP NEXT:</h2>
                <p>No machines to be completed in the next {MAX_TIME_MINUTES} minutes.</p>
            </UpNextContainer>
        );
    }

    return (
        <UpNextContainer>
            <h2>MACHINES UP NEXT:</h2>
            {upNextMachines.map((machine, index) => (
                <MachineItem key={index}>
                    <ItemHeader>
                        <MachineName> {machine.name}</MachineName> 
                        <Countdown>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.50009 0.877014C3.84241 0.877014 0.877258 3.84216 0.877258 7.49984C0.877258 11.1575 3.8424 14.1227 7.50009 14.1227C11.1578 14.1227 14.1229 11.1575 14.1229 7.49984C14.1229 3.84216 11.1577 0.877014 7.50009 0.877014ZM1.82726 7.49984C1.82726 4.36683 4.36708 1.82701 7.50009 1.82701C10.6331 1.82701 13.1729 4.36683 13.1729 7.49984C13.1729 10.6328 10.6331 13.1727 7.50009 13.1727C4.36708 13.1727 1.82726 10.6328 1.82726 7.49984ZM8 4.50001C8 4.22387 7.77614 4.00001 7.5 4.00001C7.22386 4.00001 7 4.22387 7 4.50001V7.50001C7 7.63262 7.05268 7.7598 7.14645 7.85357L9.14645 9.85357C9.34171 10.0488 9.65829 10.0488 9.85355 9.85357C10.0488 9.65831 10.0488 9.34172 9.85355 9.14646L8 7.29291V4.50001Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                        {machine.usage_start && machine.usage_duration
                            ? `${(((getTimeOffset(machine.usage_start!, machine.usage_duration!).getTime() - now) / 1000) / 60).toFixed(1)} min`
                            : 'N/A'}
                        </Countdown>
                    </ItemHeader>
                    <UserName> Being used by: {machine.user ? machine.user : 'N/A'}</UserName>
                    <EstTime $area="date">Est. Completion: {formatTime(getTimeOffset(machine.usage_start!, machine.usage_duration!))}</EstTime>
                </MachineItem>
            ))}
        </UpNextContainer>
    );
};

export default UpNext;