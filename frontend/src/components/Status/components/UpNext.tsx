import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getEndTime } from '../MachineCard';
import { OmniAPI } from 'src/apis/OmniAPI';
import { MachineStatus } from 'src/interfaces';
import { StatusText, ProgressBar, Progress, BigCardInfo } from '../StatusComponents';

const UpNextContainer = styled.div`
    background: #ffffff;
    border: 1px solid #2d4a80;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(17,28,54,0.10);
    flex-shrink: 0;
`;

const UpNextHeader = styled.div`
    background: #2d4a80;
    padding: 10px 14px;

    h2 {
        font-family: var(--font-display, 'Funnel Display', sans-serif);
        font-weight: 700;
        font-size: 13px;
        color: #ffffff;
        letter-spacing: 1px;
        text-transform: uppercase;
        margin: 0;
    }
`;

const UpNextBody = styled.div`
    padding: 10px 12px;
    max-height: 280px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(0,0,0,0.15) transparent;

    p {
        font-family: var(--font-display, 'Funnel Display', sans-serif);
        font-size: 12px;
        color: #64748b;
        margin: 0;
        padding: 6px 0;
    }
`;

const MachineItem = styled.div`
    padding: 8px 0;
    border-bottom: 1px solid #e2e8f0;
    &:last-child { border-bottom: none; }
`;

const ItemHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 2px;
`;

const MachineName = styled.h3`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: 13px;
    font-weight: 700;
    color: #111c36;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0;
`;

const Countdown = styled.div`
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 2px 6px;
    font-size: 11px;
    font-weight: 700;
    color: #2d4a80;
    background: rgba(45,74,128,0.08);
    border: 1px solid rgba(45,74,128,0.2);
    border-radius: 4px;
    white-space: nowrap;
`;

const UserName = styled.p`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: 11px;
    font-weight: 500;
    color: #64748b;
    margin: 0 0 2px 0;
`;

const EstTime = styled(StatusText)`
    font-size: 11px;
    text-align: left;
`;

const UpNext: React.FC = () => {
    const [machines, setMachines] = useState<{ name: string; in_use: Boolean; failed?: boolean; user: string | undefined; usage_start?: Date; usage_duration?: number }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMachines = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await OmniAPI.getPublic("machinestatus");

                const flattenedMachines = [
                    ...response.loners,
                    ...response.groups.flatMap((group: { machines: MachineStatus[] }) => group.machines),
                ];

                const transformedMachines = flattenedMachines.map((machine) => ({
                    name: machine.name,
                    in_use: machine.in_use,
                    failed: machine.failed,
                    user: machine.user_name,
                    usage_start: machine.usage_start ? new Date(machine.usage_start) : undefined,
                    usage_duration: machine.usage_duration,
                }));

                setMachines(transformedMachines);
            } catch (error) {
                console.error('Error fetching machines:', error);
                setError('Failed to fetch machine data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchMachines();
        // Poll every 10 s to pick up failures and completions
        const poll = setInterval(fetchMachines, 10000);
        return () => clearInterval(poll);
    }, []);

    const inProgressMachines = machines
    .filter((machine) => machine.in_use && !machine.failed)
    .sort((a, b) => {
            const endA = new Date(a.usage_start!).getTime() + a.usage_duration! * 1000;
            const endB = new Date(b.usage_start!).getTime() + b.usage_duration! * 1000;
            return endA - endB;
        })


    const now = Date.now();
    const upNextMachines = inProgressMachines.filter((machine) => {
        const endTime = new Date(machine.usage_start!).getTime() + machine.usage_duration! * 1000;
        return endTime - now <= 30 * 60000 && endTime > now; 
    });


    if (upNextMachines.length === 0) {
        return (
            <UpNextContainer>
                <UpNextHeader><h2>Machines Up Next</h2></UpNextHeader>
                <UpNextBody><p>Nothing finishing in the next 30 min.</p></UpNextBody>
            </UpNextContainer>
        );
    }

    return (
        <UpNextContainer>
            <UpNextHeader><h2>Machines Up Next</h2></UpNextHeader>
            <UpNextBody>
            {upNextMachines.map((machine, index) => (
                <MachineItem key={index}>
                    <ItemHeader>
                        <MachineName> {machine.name}</MachineName> 
                        <Countdown>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.50009 0.877014C3.84241 0.877014 0.877258 3.84216 0.877258 7.49984C0.877258 11.1575 3.8424 14.1227 7.50009 14.1227C11.1578 14.1227 14.1229 11.1575 14.1229 7.49984C14.1229 3.84216 11.1577 0.877014 7.50009 0.877014ZM1.82726 7.49984C1.82726 4.36683 4.36708 1.82701 7.50009 1.82701C10.6331 1.82701 13.1729 4.36683 13.1729 7.49984C13.1729 10.6328 10.6331 13.1727 7.50009 13.1727C4.36708 13.1727 1.82726 10.6328 1.82726 7.49984ZM8 4.50001C8 4.22387 7.77614 4.00001 7.5 4.00001C7.22386 4.00001 7 4.22387 7 4.50001V7.50001C7 7.63262 7.05268 7.7598 7.14645 7.85357L9.14645 9.85357C9.34171 10.0488 9.65829 10.0488 9.85355 9.85357C10.0488 9.65831 10.0488 9.34172 9.85355 9.14646L8 7.29291V4.50001Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                        {machine.usage_start && machine.usage_duration
                            ? `${(((new Date(machine.usage_start!).getTime() + machine.usage_duration! * 1000 - now) / 1000) / 60).toFixed(1)} min`
                            : 'N/A'}
                        </Countdown>
                    </ItemHeader>
                    <UserName> Being used by: {machine.user ? machine.user : 'N/A'}</UserName>
                    <EstTime $area="date">Est. Completion: {getEndTime(machine.usage_start!, machine.usage_duration!)}</EstTime>
                </MachineItem>
            ))}
            </UpNextBody>
        </UpNextContainer>
    );
};

export default UpNext;