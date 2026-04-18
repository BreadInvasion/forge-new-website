import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card, MachineName, BigCardAttribute, BigCardText, BigCardInfo, StatusText, ProgressBar, Progress } from './StatusComponents';
import { OmniAPI } from "src/apis/OmniAPI";
import { useSelectedMachine } from './SelectedMachineContext';

export const getEndTime = (usage_start: Date, usage_duration: number) => {
    const start = usage_start;
    const end = new Date(start.getTime() + usage_duration * 1000);
    return end.toLocaleString('en-US', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
}

export const getProgress = (usage_start: Date | undefined, usage_duration: number | undefined) => {
    if (!usage_start || !usage_duration) return 0;
    const end = new Date(usage_start.getTime() + usage_duration * 1000);
    const now = new Date();
    const progress = (now.getTime() - usage_start.getTime()) / (end.getTime() - usage_start.getTime());
    return Math.min(100, Math.max(0, progress * 100));
}

// Progress frozen at the exact moment the machine failed
const getProgressAtTime = (
    usage_start: Date | undefined,
    usage_duration: number | undefined,
    at: Date | undefined
): number => {
    if (!usage_start || !usage_duration || !at) return 0;
    const end = new Date(usage_start.getTime() + usage_duration * 1000);
    const progress = (at.getTime() - usage_start.getTime()) / (end.getTime() - usage_start.getTime());
    return Math.min(100, Math.max(0, progress * 100));
};

export interface MachineProps {
    id: string;
    name: string;
    in_use?: boolean;
    usage_start?: Date;
    usage_duration?: number;
    user?: string;
    maintenance_mode?: boolean;
    disabled?: boolean;
    failed?: boolean;
    failed_at?: Date;
    percent_completed?: number;
    material?: string;
    weight?: number;
}

export interface MachineCardProps extends MachineProps {
    machine: MachineProps;
    $highlightFailed: boolean;
    $minimized: boolean;
}

const StyledButton = styled.button`
    background-color:rgb(228, 23, 19);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 1px 6px;
    font-size: 2.0vh;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.2s ease;
    z-index: 10;
    position: relative;
    &:hover {
        background-color:rgb(186, 7, 7);
    }
`;

/* ── Minimized card field rows ─────────────────────────────────────── */
const FieldRow = styled.div`
    display: flex;
    justify-content: center;
    align-items: baseline;
    gap: 4px;
    width: 100%;
`;

const FieldLabel = styled.span`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    text-align: right;
    white-space: nowrap;
`;

const FieldValue = styled.span`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: 11px;
    font-weight: 400;
    color: #111c36;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 110px;
`;

/* ── Expanded card (Selected Machine panel) ────────────────────────── */
const DetailsGrid = styled.div`
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr);
    column-gap: 12px;
    row-gap: 8px;
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
    padding: 4px 0 2px 0;
`;

const DLabel = styled.span`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    text-align: right;
    white-space: nowrap;
    line-height: 1.4;
`;

const DValue = styled.span<{ $failed?: boolean }>`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: 13px;
    font-weight: 500;
    color: ${p => p.$failed ? '#a51c1c' : '#111c36'};
    text-align: left;
    line-height: 1.4;
    word-break: break-word;
`;

const DividerLine = styled.div`
    grid-column: 1 / -1;
    height: 1px;
    background: #e2e8f0;
    margin: 2px 0;
`;

const EstLine = styled.p`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: 11px;
    color: #64748b;
    font-weight: 400;
    margin: 6px 0 0 0;
    text-align: center;
    width: 100%;
`;

const ProgressPillTrack = styled.div<{ $failed?: boolean }>`
    width: calc(100% - 8px);
    height: 22px;
    background: ${p => p.$failed ? '#f5e0e0' : '#e0f0e8'};
    border-radius: 100px;
    overflow: hidden;
    margin-top: 12px;
    flex-shrink: 0;
    position: relative;
`;

const ProgressPillFill = styled.div<{ $pct: number; $failed?: boolean }>`
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: ${p => p.$pct}%;
    background: ${p => p.$failed ? '#a51c1c' : '#2d9c5c'};
    border-radius: 100px;
    /* no transition when frozen so it snaps to the failure position instantly */
    transition: ${p => p.$failed ? 'none' : 'width 1s linear'};
`;


const getRemainingSeconds = (usage_start: Date | undefined, usage_duration: number | undefined): number => {
    if (!usage_start || !usage_duration) return 0;
    const end = usage_start.getTime() + usage_duration * 1000;
    return Math.max(0, Math.floor((end - Date.now()) / 1000));
};

const formatRemaining = (secs: number): string => {
    if (secs <= 0) return 'Complete';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`;
    if (m > 0) return `${m}m ${String(s).padStart(2,'0')}s`;
    return `${s}s`;
};

const MachineCard: React.FC<MachineCardProps> = ({ machine: machineInput, $minimized, $highlightFailed}) => {
    // Read locally-stored failure data (percent + time) written by FailAMachine on submit
    const getLocalFailureData = (id: string) => {
        try {
            const raw = localStorage.getItem(`failure_data_${id}`);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            return {
                percent_completed: typeof parsed.percent_completed === 'number' ? parsed.percent_completed : null,
                failed_at: parsed.failed_at ? new Date(parsed.failed_at) : null,
            };
        } catch { return null; }
    };

    const [machine, setMachine] = useState(machineInput);
    const [liveProgress, setLiveProgress] = useState(() => {
        if (machineInput.failed) {
            const local = getLocalFailureData(machineInput.id);
            if (local?.percent_completed != null) return local.percent_completed;
            return machineInput.percent_completed
                ?? getProgressAtTime(machineInput.usage_start, machineInput.usage_duration, machineInput.failed_at);
        }
        return getProgress(machineInput.usage_start, machineInput.usage_duration);
    });
    const [failedAt, setFailedAt] = useState<Date | undefined>(() => {
        if (machineInput.failed) {
            const local = getLocalFailureData(machineInput.id);
            return local?.failed_at ?? machineInput.failed_at;
        }
        return machineInput.failed_at;
    });
    const [remainingSeconds, setRemainingSeconds] = useState(() =>
        machineInput.failed ? 0 : getRemainingSeconds(machineInput.usage_start, machineInput.usage_duration)
    );

    useEffect(() => { setMachine(machineInput); }, [machineInput]);

    // Update progress + countdown every second — stop entirely when failed or complete
    useEffect(() => {
        if (machine.failed) {
            const local = getLocalFailureData(machine.id);
            const frozenProgress = local?.percent_completed != null
                ? local.percent_completed
                : machine.percent_completed ?? getProgressAtTime(machine.usage_start, machine.usage_duration, machine.failed_at);
            setLiveProgress(frozenProgress);
            setFailedAt(local?.failed_at ?? machine.failed_at);
            setRemainingSeconds(0);
            return;
        }

        const update = () => {
            setLiveProgress(getProgress(machine.usage_start, machine.usage_duration));
            setRemainingSeconds(getRemainingSeconds(machine.usage_start, machine.usage_duration));
        };
        update();
        if (!machine.in_use || !machine.usage_start || !machine.usage_duration) return;
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [machine.in_use, machine.usage_start, machine.usage_duration, machine.failed, machine.failed_at]);

    const {id, name, in_use, usage_start, usage_duration, user, maintenance_mode, disabled, failed, failed_at, weight, material} = machine;

    const {setSelectedMachine } = useSelectedMachine();

    const handleClick = () => {
        setSelectedMachine({ id, name, in_use, usage_start, usage_duration, user, maintenance_mode, disabled, failed, failed_at, weight, material});
    };

    const handleClearClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (failed || in_use) {
            try {
                const authToken = localStorage.getItem("authToken");
                if (!authToken) {
                    alert('Error, not authenticated. Must be logged in to clear machines.');
                    return;
                }

                const response = await OmniAPI.clear(`${machine.id}`);
                if (response != null) {
                    if (response.status === 404) {
                        alert('Machine not found. Please check the machine ID.');
                    }
                    if (response.status === 403) {
                        alert('Error, not authenticated. Must be logged in to clear machines.');
                        return;
                    }
                    else {
                        throw new Error(`Failed to clear machine: ${response.statusText}`);
                    }
                }
                // Remove locally-stored failure data so the card resets cleanly
                localStorage.removeItem(`failure_data_${machine.id}`);

                const updatedMachine = {
                    ...machine,
                    failed: false,
                    in_use: false,
                    maintenance_mode: false,
                    disabled: false,
                    failed_at: undefined,
                    progress: 0
                };

                setMachine(updatedMachine);
                setSelectedMachine({ id, name, in_use, usage_start, usage_duration, user, maintenance_mode, disabled, failed, failed_at, weight, material });

                window.location.reload();

            } catch (error) {
                console.error('Error clearing machine:', error);
                alert('Failed to clear the machine. Please try again.');
            }
        }
};

function convHM(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
}

const getStatusText = (in_use?: boolean, failed?: boolean, maintenance_mode?: boolean, disabled?: boolean) => {
    const statuses = [];
    if (failed) {
        statuses.push("Failed");
    } else if (liveProgress === 100) {
        statuses.push("Completed");
    } else {
        if (in_use) statuses.push("In Use");
        if (maintenance_mode) statuses.push("Under Maintenance");
        if (disabled) statuses.push("Disabled");
        if (!in_use && !maintenance_mode && !disabled) statuses.push("Available");
    }
    return statuses.length > 0 ? statuses.join(", ") : "Operational";
};

    const statusKey: 'available' | 'in_use' | 'completed' | 'failed' | 'maintenance' | 'disabled' =
        failed ? 'failed'
        : maintenance_mode ? 'maintenance'
        : disabled ? 'disabled'
        : liveProgress === 100 ? 'completed'
        : in_use ? 'in_use'
        : 'available';

    return (
        <Card
            $symbol={name}
            $minimized={$minimized}
            $highlightFailed={$highlightFailed && !!failed}
            $failed={!!failed}
            progress={liveProgress}
            onClick={handleClick}
        >
            {$minimized ? (
                <>
                    <MachineName $minimized={true} $clearable={$highlightFailed && (failed || in_use)}>{name}</MachineName>
                    <FieldRow><FieldLabel>User :</FieldLabel><FieldValue>{user || 'N/A'}</FieldValue></FieldRow>
                    <FieldRow><FieldLabel>Est. Completion :</FieldLabel><FieldValue>{usage_start && usage_duration ? getEndTime(usage_start, usage_duration) : 'N/A'}</FieldValue></FieldRow>
                    <FieldRow><FieldLabel>Material :</FieldLabel><FieldValue>{material || 'N/A'}</FieldValue></FieldRow>
                    <FieldRow><FieldLabel>Status :</FieldLabel><FieldValue>{getStatusText(in_use, failed, maintenance_mode, disabled)}</FieldValue></FieldRow>
                    {$highlightFailed && (failed || in_use) && (
                        <StyledButton onClick={handleClearClick}>Clear</StyledButton>
                    )}
                </>
            ) : (
                <>
                    <MachineName $minimized={false} $clearable={$highlightFailed && (failed || in_use)}>{name}</MachineName>
                    <DetailsGrid>
                        <DLabel>User</DLabel>
                        <DValue>{user || 'N/A'}</DValue>

                        {in_use && !failed && (
                            <>
                                <DividerLine />
                                <DLabel>Start Time</DLabel>
                                <DValue>{usage_start?.toLocaleString('en-US', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}</DValue>

                                <DLabel>Total Time</DLabel>
                                <DValue>{convHM(usage_duration ?? 0)}</DValue>

                                <DLabel>Time Left</DLabel>
                                <DValue>{formatRemaining(remainingSeconds)}</DValue>

                                <DLabel>Progress</DLabel>
                                <DValue>{liveProgress.toFixed(1)}%</DValue>
                            </>
                        )}

                        {failed && (
                            <>
                                <DividerLine />
                                <DLabel>Progress at Failure</DLabel>
                                <DValue $failed={true}>{liveProgress.toFixed(1)}%</DValue>

                                <DLabel>Failed At</DLabel>
                                <DValue $failed={true}>{failedAt?.toLocaleString('en-US', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }) ?? 'Unknown'}</DValue>
                            </>
                        )}

                        <DividerLine />
                        <DLabel>Status</DLabel>
                        <DValue $failed={!!failed}>{getStatusText(in_use, failed, maintenance_mode, disabled)}</DValue>
                    </DetailsGrid>

                    {usage_start && usage_duration && !failed && (
                        <EstLine>Est. Completion: {getEndTime(usage_start, usage_duration)}</EstLine>
                    )}

                    <ProgressPillTrack $failed={!!failed}>
                        <ProgressPillFill $pct={failed ? 100 : liveProgress} $failed={!!failed} />
                    </ProgressPillTrack>
                </>
            )}
        </Card>
    );
}

export default MachineCard;
