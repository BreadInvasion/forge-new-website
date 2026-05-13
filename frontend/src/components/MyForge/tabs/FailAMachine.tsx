import React, { useEffect, useState, FormEvent } from "react";
import styled from "styled-components";
import { OmniAPI } from "src/apis/OmniAPI";
import { Machine, MachineStatus, AllMachinesStatusResponse } from "src/interfaces";
import { useNavigate } from "react-router-dom";
import bgPattern from '../../../assets/img/background.svg?url';

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
    navy:  '#111c36',
    red:   '#a51c1c',
    white: '#ffffff',
    black: '#000000',
};

// ── Page wrapper ──────────────────────────────────────────────────────────────

const PageWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: calc(100vh - 74px);
    padding: 40px 16px;
    box-sizing: border-box;
    background: #EEF2F8;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: url(${bgPattern});
        background-repeat: repeat;
        background-size: 122px 140px;
        opacity: 0.09;
        pointer-events: none;
    }
`;

// ── Card ──────────────────────────────────────────────────────────────────────

const Card = styled.div`
    position: relative;
    z-index: 1;
    background: ${C.white};
    border: 4px solid ${C.navy};
    border-radius: 12px;
    width: clamp(340px, 50vw, 600px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 12px 48px rgba(17,28,54,0.18), 0 2px 8px rgba(17,28,54,0.08);

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: url(${bgPattern});
        background-repeat: repeat;
        background-size: 122px 140px;
        opacity: 0.04;
        pointer-events: none;
        z-index: 0;
    }
`;

const CardInner = styled.div`
    position: relative;
    z-index: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 0 0 0;
`;

// ── Title band ────────────────────────────────────────────────────────────────

const TitleBand = styled.div`
    width: 100%;
    background: ${C.navy};
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

const Title = styled.h2`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(20px, 2.5vw, 28px);
    font-weight: 700;
    color: ${C.white};
    text-align: center;
    margin: 0;
`;

// ── Fields ────────────────────────────────────────────────────────────────────

const FieldsArea = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    width: calc(100% - 40px);
    padding: 20px 0 12px 0;
`;

const FieldRow = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 6px 10px;
    width: 100%;
    justify-content: flex-end;
`;

const FieldLabel = styled.label`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(14px, 1.5vw, 20px);
    font-weight: 700;
    color: ${C.black};
    white-space: nowrap;
    flex-shrink: 0;
`;

const FieldInput = styled.input`
    height: 32px;
    width: clamp(120px, 25vw, 300px);
    border: 2px solid ${C.black};
    border-radius: 5px;
    background: ${C.white};
    padding: 4px 8px;
    font-size: 14px;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    outline: none;
    box-sizing: border-box;
    flex-shrink: 0;

    &:focus {
        border-color: ${C.navy};
        box-shadow: 0 0 0 2px rgba(17,28,54,0.15);
    }

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
        opacity: 1;
    }
`;

const FieldSelect = styled.select`
    height: 32px;
    width: clamp(120px, 25vw, 300px);
    border: 2px solid ${C.black};
    border-radius: 5px;
    background: ${C.white};
    padding: 4px 8px;
    font-size: 14px;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    outline: none;
    box-sizing: border-box;
    flex-shrink: 0;
    cursor: pointer;

    &:focus {
        border-color: ${C.navy};
    }
`;

// ── Section divider ───────────────────────────────────────────────────────────

const SectionDivider = styled.div`
    width: calc(100% - 40px);
    height: 2px;
    background: #e2e8f0;
    flex-shrink: 0;
    margin: 4px 0;
`;

// ── Checkboxes ────────────────────────────────────────────────────────────────

const CheckboxArea = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    width: calc(100% - 40px);
    padding: 14px 10px 8px 10px;
`;

const FaultsLabel = styled.p`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(15px, 1.6vw, 20px);
    font-weight: 700;
    color: ${C.black};
    margin: 0 0 8px 0;
`;

const CheckRow = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 7px 0;
    width: 100%;
`;

const StyledCheckbox = styled.input`
    width: 22px;
    height: 22px;
    border: 2px solid ${C.black};
    border-radius: 4px;
    flex-shrink: 0;
    cursor: pointer;
    accent-color: ${C.navy};
`;

const CheckLabel = styled.label`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(13px, 1.3vw, 16px);
    font-weight: 700;
    color: ${C.black};
    cursor: pointer;
`;

// ── Status text ───────────────────────────────────────────────────────────────

const StatusText = styled.div<{ $type: string }>`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    padding: 6px 20px;
    min-height: 20px;
    width: 100%;
    box-sizing: border-box;
    color: ${({ $type }) =>
        $type === 'success' ? '#1d7a48' :
        $type === 'error'   ? '#a51c1c' :
        $type === 'warning' ? '#8a5c00' : 'transparent'};
`;

// ── Read-only progress display ────────────────────────────────────────────────

const ProgressDisplay = styled.div`
    height: 32px;
    width: clamp(120px, 25vw, 300px);
    border: 2px solid #aaa;
    border-radius: 5px;
    background: #f4f6fa;
    padding: 4px 8px;
    font-size: 14px;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    color: #64748b;
    box-sizing: border-box;
    flex-shrink: 0;
    display: flex;
    align-items: center;
`;

// ── Submit button ─────────────────────────────────────────────────────────────

const SubmitBtn = styled.button`
    height: 44px;
    width: calc(100% - 40px);
    background: ${C.red};
    border: 2px solid ${C.black};
    border-radius: 6px;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(16px, 1.8vw, 22px);
    font-weight: 700;
    color: ${C.white};
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.1s ease;
    margin: 0 0 20px 0;

    &:hover:not(:disabled) {
        background: #8a1515;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(165,28,28,0.3);
    }

    &:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: none;
    }

    &:disabled {
        background: #c9a0a0;
        border-color: #aaa;
        cursor: not-allowed;
    }
`;

// ═════════════════════════════════════════════════════════════════════════════
// Component
// ═════════════════════════════════════════════════════════════════════════════

export const FailAMachineForm: React.FC = () => {

    const [machines, setMachines] = useState<Machine[]>([]);
    const [selectedMachineId, setSelectedMachineId] = useState<string>("_");
    const [machineStatuses, setMachineStatuses] = useState<Map<string, MachineStatus>>(new Map());
    const [liveProgress, setLiveProgress] = useState<number | null>(null);
    const [printerErrorMessage, setPrinterErrorMessage] = useState<string>("");
    const [noticeableFaults, setNoticeableFaults] = useState<string[]>([]);
    const [status, setStatus] = useState<{ text: string; type: string }>({ text: "", type: "" });
    const navigate = useNavigate();

    // Compute progress the same way MachineCard does
    const computeProgress = (usage_start: Date | string | undefined, usage_duration: number | undefined): number => {
        if (!usage_start || !usage_duration) return 0;
        const start = new Date(usage_start as string);
        const end = new Date(start.getTime() + usage_duration * 1000);
        const now = new Date();
        return Math.min(100, Math.max(0, (now.getTime() - start.getTime()) / (end.getTime() - start.getTime()) * 100));
    };

    useEffect(() => {
        const fetchData = async () => {
            const [allMachines, statusRes] = await Promise.all([
                OmniAPI.getAll("machines"),
                OmniAPI.getPublic("machinestatus"),
            ]);
            setMachines(allMachines as Machine[]);
            // Flatten groups + loners into an id→status map
            const res = statusRes as AllMachinesStatusResponse;
            const statusMap = new Map<string, MachineStatus>();
            res.groups?.forEach(g => g.machines?.forEach(m => statusMap.set(m.id, m)));
            res.loners?.forEach(m => statusMap.set(m.id, m));
            setMachineStatuses(statusMap);
        };
        fetchData();
    }, []);

    // Update live progress every second for the selected machine
    useEffect(() => {
        if (selectedMachineId === "_") { setLiveProgress(null); return; }
        const ms = machineStatuses.get(selectedMachineId);
        if (!ms?.in_use || !ms.usage_start || !ms.usage_duration) { setLiveProgress(null); return; }
        const update = () => setLiveProgress(computeProgress(ms.usage_start, ms.usage_duration));
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [selectedMachineId, machineStatuses]);

    const handleSelectMachine = (id: string) => {
        if (id === "_") return;
        setSelectedMachineId(id);
    };

    const handleCheckboxChange = (fault: string) => {
        setNoticeableFaults((prevFaults) =>
            prevFaults.includes(fault)
                ? prevFaults.filter((f) => f !== fault)
                : [...prevFaults, fault]
        );
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const temp = selectedMachineId;
        // Capture the exact live progress at the moment of submission
        const ms = machineStatuses.get(temp);
        const percentAtSubmit = (ms?.in_use && ms.usage_start && ms.usage_duration)
            ? computeProgress(ms.usage_start, ms.usage_duration)
            : (liveProgress ?? 0);
        try {
            const response = await OmniAPI.fail(temp, {
                percent_completed: percentAtSubmit,
                error_message: printerErrorMessage,
                noticeable_faults: noticeableFaults,
            });
            if (response == null) {
                // Store the computed data locally so the status page can display it accurately.
                localStorage.setItem(`failure_data_${temp}`, JSON.stringify({
                    percent_completed: percentAtSubmit,
                    failed_at: new Date().toISOString(),
                }));
                setStatus({ text: "Failure reported. Redirecting to status page...", type: "success" });
                const form = document.querySelector(".usage-form") as HTMLFormElement;
                form?.reset();
                resetFormFields();
                window.setTimeout(() => navigate('/status'), 1200);
            } else {
                setStatus({ text: "An error occurred, please try again.", type: "error" });
            }
        } catch (error) {
            console.error("Error:", error);
            setStatus({ text: "An error occurred, please try again.", type: "error" });
        }
    };

    const resetFormFields = () => {
        setLiveProgress(null);
        setPrinterErrorMessage("");
        setNoticeableFaults([]);
    };

    const FAULTS = ["Layer Shift", "Filament Jam", "Lack of Bed Adhesion", "Other"];

    return (
        <PageWrapper>
            <Card>
                <CardInner>
                    <form className="usage-form" onSubmit={handleSubmit} style={{ width: '100%', display: 'contents' }}>

                        <TitleBand><Title>Failure Form</Title></TitleBand>

                        <FieldsArea>
                            <FieldRow>
                                <FieldLabel htmlFor="machine-select">Machine</FieldLabel>
                                <FieldSelect
                                    id="machine-select"
                                    defaultValue="_"
                                    onChange={(e) => handleSelectMachine(e.target.value)}
                                    required
                                >
                                    <option value="_" disabled hidden>Please Select a Machine</option>
                                    {machines.map((machine: Machine) => (
                                        <option key={machine.id} value={machine.id}>{machine.name}</option>
                                    ))}
                                </FieldSelect>
                            </FieldRow>

                            <FieldRow>
                                <FieldLabel>Percent Completed</FieldLabel>
                                <ProgressDisplay>
                                    {liveProgress !== null
                                        ? `${liveProgress.toFixed(1)}%`
                                        : selectedMachineId === "_"
                                            ? "Select a machine"
                                            : "Not in use — 0%"}
                                </ProgressDisplay>
                            </FieldRow>

                            <FieldRow>
                                <FieldLabel htmlFor="error-message">Error Message</FieldLabel>
                                <FieldInput
                                    id="error-message"
                                    type="text"
                                    value={printerErrorMessage}
                                    placeholder="Printer Error Message"
                                    onChange={(e) => setPrinterErrorMessage(e.target.value)}
                                    required
                                />
                            </FieldRow>
                        </FieldsArea>

                        <SectionDivider />

                        <CheckboxArea>
                            <FaultsLabel>Noticeable Faults</FaultsLabel>
                            {FAULTS.map((fault) => (
                                <CheckRow key={fault}>
                                    <StyledCheckbox
                                        id={`fault-${fault.toLowerCase().replace(/\s+/g, '-')}`}
                                        type="checkbox"
                                        checked={noticeableFaults.includes(fault)}
                                        onChange={() => handleCheckboxChange(fault)}
                                    />
                                    <CheckLabel htmlFor={`fault-${fault.toLowerCase().replace(/\s+/g, '-')}`}>
                                        {fault}
                                    </CheckLabel>
                                </CheckRow>
                            ))}
                        </CheckboxArea>

                        <StatusText $type={status.type}>{status.text || " "}</StatusText>

                        <SectionDivider style={{ marginBottom: '16px' }} />

                        <SubmitBtn type="submit" disabled={selectedMachineId === "_"}>
                            Submit
                        </SubmitBtn>

                    </form>
                </CardInner>
            </Card>
        </PageWrapper>
    );
};
