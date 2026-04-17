import React, { useEffect, useState, ChangeEvent, FormEvent, ReactNode, Suspense, useMemo } from "react";
import styled from "styled-components";
import { OmniAPI } from "src/apis/OmniAPI";
import { emptyMachine, Machine, Resource } from "src/interfaces";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
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
    padding: 0 0 28px 0;
`;

// ── Title & divider ───────────────────────────────────────────────────────────

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

const Divider = styled.div`
    width: calc(100% - 40px);
    height: 2px;
    background: #e2e8f0;
    flex-shrink: 0;
`;

// ── Fields ────────────────────────────────────────────────────────────────────

const FieldsArea = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
    width: calc(100% - 40px);
    padding: 18px 0 12px 0;
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
    height: 35px;
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
    height: 35px;
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

// ── Duration row ──────────────────────────────────────────────────────────────

const DurationRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
    justify-content: center;
    width: 100%;
`;

const DurationInput = styled.input`
    height: 35px;
    width: clamp(60px, 10vw, 100px);
    border: 2px solid ${C.black};
    border-radius: 5px;
    background: ${C.white};
    padding: 4px 8px;
    font-size: 14px;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    text-align: right;
    outline: none;
    box-sizing: border-box;

    &:focus { border-color: ${C.navy}; }
`;

const DurationLabel = styled.span`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(14px, 1.5vw, 20px);
    font-weight: 700;
    color: ${C.black};
`;

// ── Checkboxes ────────────────────────────────────────────────────────────────

const CheckboxArea = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    width: calc(100% - 40px);
    padding: 14px 10px;
`;

const CheckRow = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px 0;
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
    font-size: clamp(12px, 1.2vw, 15px);
    font-weight: 700;
    color: ${C.black};
    cursor: pointer;
`;

// ── Resource table ────────────────────────────────────────────────────────────

const ResourceArea = styled.div`
    width: calc(100% - 24px);
    padding: 14px 0 8px 0;
    overflow-x: auto;
`;

const ResourceTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: 13px;
`;

const TableHead = styled.thead`
    color: ${C.navy};

    th {
        padding: 8px 6px;
        border-bottom: 2px solid ${C.navy};
        text-align: center;
        font-weight: 700;
        white-space: nowrap;
        font-size: clamp(11px, 1.1vw, 13px);
    }
`;

const TableBody = styled.tbody`
    td {
        padding: 6px;
        text-align: center;
        border-bottom: 1px solid #e2e8f0;
    }

    tr:last-child td { border-bottom: none; }

    select, input[type="number"] {
        padding: 4px 6px;
        border: 1px solid #aaa;
        border-radius: 4px;
        font-size: 12px;
        width: 100%;
        box-sizing: border-box;
        font-family: var(--font-display, 'Funnel Display', sans-serif);
        outline: none;
        &:focus { border-color: ${C.navy}; }
    }

    input[type="checkbox"] {
        width: 16px;
        height: 16px;
        accent-color: ${C.navy};
        cursor: pointer;
    }
`;

const ResourceSectionLabel = styled.p`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(14px, 1.5vw, 18px);
    font-weight: 700;
    color: ${C.navy};
    margin: 0 0 10px 0;
    text-align: left;
    padding: 0 10px;
`;

// ── Status text ───────────────────────────────────────────────────────────────

const StatusText = styled.div<{ $type: string }>`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    padding: 6px 20px;
    min-height: 20px;
    color: ${({ $type }) =>
        $type === 'success' ? '#1d7a48' :
        $type === 'error'   ? '#a51c1c' :
        $type === 'warning' ? '#8a5c00' : 'transparent'};
`;

// ── Step indicator ────────────────────────────────────────────────────────────

const StepRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 0 0 0;
    width: 100%;
`;

const StepDot = styled.div<{ $active: boolean }>`
    width: ${p => p.$active ? '28px' : '10px'};
    height: 10px;
    border-radius: 100px;
    background: ${p => p.$active ? C.navy : '#c8d3e8'};
    transition: width 0.2s ease, background 0.2s ease;
`;

// ── Nav buttons ───────────────────────────────────────────────────────────────

const NavRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - 40px);
    padding: 12px 0 4px 0;
    box-sizing: border-box;
`;

const NavBtn = styled.button`
    height: 44px;
    min-width: 100px;
    padding: 0 24px;
    background: ${C.red};
    border: 2px solid ${C.black};
    border-radius: 6px;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(16px, 1.8vw, 22px);
    font-weight: 700;
    color: ${C.white};
    cursor: pointer;
    transition: background 0.15s, transform 0.1s, box-shadow 0.1s;

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
        transform: none;
    }
`;

// ═════════════════════════════════════════════════════════════════════════════
// Main component
// ═════════════════════════════════════════════════════════════════════════════

export const DynamicMachineForm: React.FC = () => {

    const [machines, setMachines] = useState<Machine[]>([]);
    const [selectedMachineId, setSelectedMachineId] = useState<string>("0");
    const [schema, setSchema] = useState<MachineSchemaResponse>({});
    const [formData, setFormData] = useState<{ [key: string]: any }>({ hours: 0, minutes: 0, policy: false, org: false, reprint: false });
    const [slotValues, setSlotValues] = useState<ResourceSlotElement[]>([{
        slot_id: "_",
        name: "_",
        brand: "_",
        color: "_",
        amount: 0,
        own: false,
        cost: 0,
    }]);
    const [resourceUsageForm, setResourceUsageForm] = useState<ReactNode>(null);
    const [page, setPage] = useState<number>(1);
    const [status, setStatus] = useState<{ text: string; type: "error" | "success" | "warning" | "" }>({ text: "", type: "" });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMachines = async () => {
            const allMachines: Machine[] = await OmniAPI.getAll("machines");
            setMachines(allMachines);
        };
        fetchMachines();
    }, []);

    const handleSelectMachine = (id: string) => {
        if (id === "_") return;
        setSelectedMachineId(id);
    };

    useEffect(() => {
        if (selectedMachineId == "0") return;
        const fetchSchema = async () => {
            const schemaData: MachineSchemaResponse = await OmniAPI.get("use", `${selectedMachineId}/schema`);
            setSchema(schemaData);
        };
        fetchSchema();
    }, [selectedMachineId]);

    useEffect(() => {
        if (!schema.resource_slots) return;

        const initialValues: ResourceSlotElement[] = schema.resource_slots.map((slot: ResourceSlotSchema) => ({
            slot_id: slot.resource_slot_id,
            name: "_",
            brand: "_",
            color: "_",
            amount: 0,
            own: false,
            cost: 0,
        }));

        setSlotValues(initialValues);

        const fieldId = uuidv4();
        const resourceUsageProps = {
            slots: schema.resource_slots,
            initialValues,
            setSlots: (updatedSlot: ResourceSlotElement) => {
                setSlotValues((prevSlots) => {
                    const newSlots = [...prevSlots];
                    const slotIndex = newSlots.findIndex((slot) => slot.slot_id === updatedSlot.slot_id);
                    newSlots[slotIndex] = updatedSlot;
                    return newSlots;
                });
            }
        };

        setResourceUsageForm(<ResourceUsageForm key={fieldId} {...resourceUsageProps} />);
    }, [schema]);

    function updateStatus(message: string, type: string) {
        setStatus({ text: message, type: type as "error" | "success" | "warning" | "" });
        try { document.getElementById('status-text')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch { console.log('Failed to display status text'); }
    }
    function clearStatus() { updateStatus("", ""); }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!formData.policy) {
            updateStatus("Please accept the usage policy.", "error");
            return;
        }

        const resource_usages: { [key: string]: { resource_id: string, amount: number, is_own_material: boolean } } = {};
        slotValues.map((slot) => {
            if (slot.resource_id) {
                resource_usages[slot.slot_id] = {
                    resource_id: slot.resource_id,
                    amount: slot.amount * 1,
                    is_own_material: slot.own as boolean,
                };
            }
        });

        const duration_seconds = Math.ceil((formData.hours * 3600) + (formData.minutes * 60));
        const usageData = {
            as_org_id: formData.org ? formData.org : null,
            duration_seconds: duration_seconds,
            resource_usages: resource_usages,
        };

        try {
            const response = await OmniAPI.use(selectedMachineId, usageData);
            if (response == null) {
                updateStatus("Usage submitted successfully.", "success");
                window.setTimeout(() => navigate('../../status'), 1000);
            } else {
                throw new Error("An error occurred. Please try again.");
            }
        } catch (error: any) {
            if (error.status == 409) {
                updateStatus("This machine is already in use. Please clear it before submitting a new usage.", "error");
            } else if (error.status == 404) {
                updateStatus("The selected machine does not exist.", "error");
            } else if (error.status == 403) {
                updateStatus("You are not permitted to use this machine.", "error");
            } else {
                updateStatus("An error occurred. Please try again.", "error");
            }
        }
    };

    const validateResourceUsage = (slotValue: ResourceSlotElement) => {
        if (!schema.resource_slots.find((slot: ResourceSlotSchema) => slot.resource_slot_id === slotValue.slot_id)?.allow_own_material && slotValue.own) {
            const displayName = schema.resource_slots.find((slot: ResourceSlotSchema) => slot.resource_slot_id === slotValue.slot_id)?.display_name;
            return `${displayName} does not allow personal material.`;
        }
        if (!schema.resource_slots.find((slot: ResourceSlotSchema) => slot.resource_slot_id === slotValue.slot_id)?.allow_empty && slotValue.amount <= 0 && !slotValue.own) {
            const displayName = schema.resource_slots.find((slot: ResourceSlotSchema) => slot.resource_slot_id === slotValue.slot_id)?.display_name;
            return `Please enter an amount greater than 0 for ${displayName}.`;
        }
        return null;
    };

    const handlePageChange = (nextPage: number) => {
        if (nextPage == 2 && selectedMachineId == "0") {
            updateStatus("Please select a machine first.", "error");
            return;
        }
        if (nextPage == 3) {
            const invalidSlot = slotValues.find((slot) => validateResourceUsage(slot));
            if (invalidSlot) {
                updateStatus(validateResourceUsage(invalidSlot) ?? "Please contact the site administrators.", "error");
                return;
            }
            slotValues.forEach((slot) => {
                if (slot.amount > 1000 && !slot.own) {
                    updateStatus(`WARNING: The amount for ${slot.name} exceeds one spool. Please alert a volunteer after starting.`, "warning");
                } else if (slot.amount > 1000 && slot.own) {
                    updateStatus(`WARNING: The amount for ${slot.name} exceeds one spool. Ensure you have enough material.`, "warning");
                }
            });
        }
        if (nextPage == 4 && (formData.hours == 0 && formData.minutes == 0)) {
            updateStatus("Please enter a valid duration.", "error");
            return;
        }
        clearStatus();
        setPage(nextPage);
    };

    return (
        <PageWrapper>
            <Card>
                <CardInner>
                    <form onSubmit={handleSubmit} style={{ width: '100%', display: 'contents' }}>
                        <TitleBand><Title>Machine Usage Form</Title></TitleBand>

                        {/* ── Page 1: Choose a Machine ── */}
                        {page === 1 && (
                            <FieldsArea>
                                <FieldRow>
                                    <FieldLabel htmlFor="machine-select">Choose a Machine</FieldLabel>
                                    <FieldSelect
                                        id="machine-select"
                                        value={selectedMachineId}
                                        onChange={(e) => handleSelectMachine(e.target.value)}
                                    >
                                        <option value="0" disabled hidden>Please Select a Machine</option>
                                        {machines.map((machine: Machine) => (
                                            <option key={machine.id} value={machine.id}>{machine.name}</option>
                                        ))}
                                    </FieldSelect>
                                </FieldRow>
                            </FieldsArea>
                        )}

                        {/* ── Page 2: Resource Selection ── */}
                        {page === 2 && (
                            <ResourceArea>
                                <ResourceSectionLabel>Resource Selection</ResourceSectionLabel>
                                {resourceUsageForm}
                            </ResourceArea>
                        )}

                        {/* ── Page 3: Usage Duration ── */}
                        {page === 3 && (
                            <FieldsArea>
                                <DurationRow>
                                    <DurationLabel>Usage Duration</DurationLabel>
                                    <DurationInput
                                        id="hours"
                                        type="number"
                                        inputMode="numeric"
                                        step="1"
                                        min="0"
                                        placeholder="0"
                                        value={formData.hours}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, hours: e.target.valueAsNumber }))}
                                    />
                                    <DurationLabel>hr</DurationLabel>
                                    <DurationInput
                                        id="minutes"
                                        type="number"
                                        inputMode="numeric"
                                        step="1"
                                        min="0"
                                        placeholder="0"
                                        value={formData.minutes}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, minutes: e.target.valueAsNumber }))}
                                    />
                                    <DurationLabel>min</DurationLabel>
                                </DurationRow>
                            </FieldsArea>
                        )}

                        {/* ── Page 4: Policies ── */}
                        {page === 4 && (
                            <CheckboxArea>
                                <CheckRow>
                                    <StyledCheckbox
                                        id="policy"
                                        type="checkbox"
                                        onChange={(e) => setFormData((prev) => ({ ...prev, policy: e.target.checked }))}
                                    />
                                    <CheckLabel htmlFor="policy">
                                        <span style={{ color: C.red, marginRight: 4 }}>*</span>
                                        Do you agree to the Machine Usage Policy?
                                    </CheckLabel>
                                </CheckRow>
                                <CheckRow>
                                    <StyledCheckbox
                                        id="reprint"
                                        type="checkbox"
                                        onChange={(e) => setFormData((prev) => ({ ...prev, reprint: e.target.checked }))}
                                    />
                                    <CheckLabel htmlFor="reprint">Is this a reprint?</CheckLabel>
                                </CheckRow>
                                <CheckRow>
                                    <StyledCheckbox
                                        id="org"
                                        type="checkbox"
                                        onChange={(e) => setFormData((prev) => ({ ...prev, org: e.target.checked }))}
                                    />
                                    <CheckLabel htmlFor="org">Is this usage for an organization?</CheckLabel>
                                </CheckRow>
                            </CheckboxArea>
                        )}

                        <StatusText id="status-text" $type={status.type}>{status.text || " "}</StatusText>

                        <StepRow>
                            {[1,2,3,4].map(s => <StepDot key={s} $active={s === page} />)}
                        </StepRow>

                        <NavRow>
                            <NavBtn
                                type="button"
                                onClick={() => { clearStatus(); setPage(page - 1); }}
                                disabled={page === 1}
                            >
                                Back
                            </NavBtn>
                            {page !== 4 && (
                                <NavBtn type="button" onClick={() => handlePageChange(page + 1)}>
                                    Next
                                </NavBtn>
                            )}
                            {page === 4 && (
                                <NavBtn type="submit">Submit</NavBtn>
                            )}
                        </NavRow>
                    </form>
                </CardInner>
            </Card>
        </PageWrapper>
    );
};


// ═════════════════════════════════════════════════════════════════════════════
// Supporting types & sub-components (logic unchanged)
// ═════════════════════════════════════════════════════════════════════════════

interface MachineSchemaResponse { [key: string]: any; }

interface ResourceSlotSchema {
    resource_slot_id: string;
    display_name: string;
    valid_resources: Resource[];
    allow_own_material: boolean;
    allow_empty: boolean;
}

interface ResourceSlotElement {
    slot_id: string;
    resource_id?: string;
    name: string;
    brand?: string;
    color?: string;
    amount: number;
    own?: boolean;
    cost: number;
}

interface ResourceUsageFormProps {
    slots: ResourceSlotSchema[];
    initialValues: ResourceSlotElement[];
    setSlots: (updatedSlot: ResourceSlotElement) => void;
}

const ResourceUsageForm: React.FC<ResourceUsageFormProps> = ({ slots, initialValues, setSlots }) => {
    const showBrand = slots.find((slot) => slot.valid_resources.find((resource) => resource.brand)) ? true : false;
    const showColor = false;

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResourceTable>
                <TableHead>
                    <tr>
                        <th>Slot</th>
                        <th>Material</th>
                        {showBrand && <th>Brand</th>}
                        {showColor && <th>Color</th>}
                        <th>Amount</th>
                        <th>Own</th>
                        <th>Cost</th>
                    </tr>
                </TableHead>
                <TableBody>
                    {slots.map((slot, index) => (
                        <ResourceSlot
                            key={slot.resource_slot_id + index}
                            slot={slot}
                            slotValue={initialValues[index]}
                            setSlotValue={setSlots}
                            showBrand={showBrand}
                            showColor={showColor}
                        />
                    ))}
                </TableBody>
            </ResourceTable>
        </Suspense>
    );
};

interface ResourceSlotProps {
    slot: ResourceSlotSchema;
    slotValue: ResourceSlotElement;
    setSlotValue: (slotValue: ResourceSlotElement) => void;
    showBrand?: boolean;
    showColor?: boolean;
}

const ResourceSlot: React.FC<ResourceSlotProps> = ({ slot, slotValue, setSlotValue, showBrand, showColor }) => {
    const [selectedDetails, setSelectedDetails] = useState<ResourceSlotElement>({
        slot_id: slot.resource_slot_id,
        name: "_", brand: "_", color: "_", amount: 0, own: false, cost: 0,
    });
    const [cost, setCost] = useState(0);
    const validResources = slot.valid_resources;

    const materialOptions = useMemo(() => [...new Set(validResources.map(r => r.name))], [validResources]);
    const brandOptions = useMemo(() => [...new Set(validResources
        .filter(r => r.name === selectedDetails.name || selectedDetails.name === "_")
        .map(r => r.brand))], [validResources, selectedDetails.name]);
    const colorOptions = useMemo(() => [...new Set(validResources
        .filter(r => (r.name === selectedDetails.name && r.brand === selectedDetails.brand) || selectedDetails.name === "_")
        .map(r => r.color))], [validResources, selectedDetails.name, selectedDetails.brand]);

    const matchingResource = (name: string, brand: string, color: string) =>
        validResources.find(r => r.name === name && (brand === "_" || r.brand === brand) && (color === "_" || r.color === color)) ?? null;

    const handleChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value, type } = event.target;
        const newValue = type === "checkbox" ? (event.target as HTMLInputElement).checked : value;

        setSelectedDetails(prev => {
            let updated = { ...prev, [name]: newValue };
            const validBrands = validResources.filter(r => r.name === updated.name).map(r => r.brand);
            const validColors = validResources.filter(r => r.name === updated.name && r.brand === updated.brand).map(r => r.color);
            if (name === "name" && !validBrands.includes(updated.brand)) updated.brand = "_";
            if ((name === "name" || name === "brand") && !validColors.includes(updated.color)) updated.color = "_";
            const resource = matchingResource(updated.name, updated.brand || "_", updated.color || "_");
            const unitCost = parseFloat(resource?.cost ?? "0");
            updated.cost = updated.own ? 0 : (updated.amount * unitCost);
            return updated;
        });
    };

    useEffect(() => {
        const matchedResource = validResources.find(r =>
            r.name === selectedDetails.name &&
            (r.brand === selectedDetails.brand || selectedDetails.brand === "_") &&
            (r.color === selectedDetails.color || selectedDetails.color === "_")
        );
        setSlotValue({
            slot_id: selectedDetails.slot_id,
            resource_id: matchedResource?.id,
            name: selectedDetails.name,
            brand: selectedDetails.brand,
            color: selectedDetails.color,
            amount: Number.isNaN(selectedDetails.amount) ? 0 : selectedDetails.amount,
            own: selectedDetails.own,
            cost: cost,
        });
    }, [selectedDetails, setSlotValue]);

    useEffect(() => { setCost(selectedDetails.cost); }, [selectedDetails.cost]);

    return (
        <tr>
            <td>{slot.display_name}</td>
            <td>
                <select name="name" value={selectedDetails.name} onChange={handleChange} required={!slot.allow_empty}>
                    <option value="_">-- Material --</option>
                    {materialOptions.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
            </td>
            {showBrand && (
                <td>
                    <select name="brand" value={selectedDetails.brand} onChange={handleChange} disabled={selectedDetails.name === "_"}>
                        <option value="_">-- Brand --</option>
                        {brandOptions.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                </td>
            )}
            {showColor && (
                <td>
                    <select name="color" value={selectedDetails.color} onChange={handleChange} disabled={selectedDetails.name === "_" || selectedDetails.brand === "_"}>
                        <option value="_">-- Color --</option>
                        {colorOptions.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </td>
            )}
            <td>
                <input type="number" name="amount" value={selectedDetails.amount} onChange={handleChange} required={!slot.allow_empty} />
            </td>
            <td>
                <input type="checkbox" name="own" checked={selectedDetails.own} onChange={handleChange} />
            </td>
            <td>{"$" + cost.toFixed(2)}</td>
        </tr>
    );
};
