import React, { useEffect, useState, ChangeEvent, FormEvent, ReactNode, Suspense, useMemo, createContext, useContext } from "react";
import { OmniAPI } from "src/apis/OmniAPI";
import { CheckboxInput, CustomForm, CustomFormField, DropdownInput, FormIcon, TextInput } from "src/components/Forms/Form";
import { emptyMachine, Machine, Resource } from "src/interfaces";
import { v4 as uuidv4 } from "uuid";

import '../../Forms/styles/Form.scss';
import '../styles/UseAMachine.scss';
import { AxiosError } from "axios";


interface MachineSchemaResponse {
    [key: string]: any;
}

/** Database IDs specific to UsageForm Testing
 * Resource IDs:
 *   "acc18d23-19db-4c6e-b3c8-fdf79e19b6e6"
 *   "0897f0dc-eb66-41f2-b179-e76ced9aad69"
 *   "23fb8bf6-7d0c-4029-8810-f19fe85bfb38"
 *   "da36be80-2dcb-43a7-88b2-885e3ce387f6"
 *   "c96423f3-fbea-4993-8455-e929f333a820"
 *   "5a7c609b-df2f-48b4-9028-a0222a13b7a9"
 *   "fec63512-f7d3-46c9-a89a-c0f4e0b5c8b7"
 *   "f0f83ef1-a4c5-4fc9-8ff8-821c7658f7ad"
 *
 * Reource Slot IDs:
 *   "6fad9ba9-2093-40cc-81d4-5443bc8d06f8"
 *   "af30b008-1f52-4e77-91ec-67dc8d61fa75"
 *   "73cd77a0-1a74-4047-9c2c-ce08d1062963"
 * 
 * Machine Type IDs:
 *   "2cc65063-23a9-41b5-ab5a-fb451f6ef547"
 *
 * Machine Group IDs:
 *   "9d18bb70-cf67-4903-a78d-073722bb9ff2"
 *
 * Machine IDs:
 *   "d8aa3861-a1f3-4c1d-a154-018936173dc4"
*/

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

    /**
     * Initial Step on Load
     */
    useEffect(() => {
        const fetchMachines = async () => {
            const allMachines: Machine[] = await OmniAPI.getAll("machines");
            console.log("All machines:", allMachines);
            setMachines(allMachines);
        };

        fetchMachines();
    }, []);


    /**
     * Handle Machine Selection with placeholder protection
     */
    const handleSelectMachine = (id: string) => {
        if (id === "_") {
            return;
        }
        setSelectedMachineId(id);
    };


    /**
     * Fetch Machine Schema on Machine Selection
     */
    useEffect(() => {
        if (selectedMachineId == "0") return;

        const fetchSchema = async () => {
            const schemaData: MachineSchemaResponse = await OmniAPI.get("use", `${selectedMachineId}/schema`);
            console.log("Schema for machine:", schemaData);
            setSchema(schemaData);
        };

        fetchSchema();

    }, [selectedMachineId]);


    /**
     * Generate Resource Usage Form on Schema Load
     */
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

        const newResourceUsageForm = <ResourceUsageForm key={fieldId} {...resourceUsageProps} />;
        setResourceUsageForm(newResourceUsageForm);
    }, [schema]);


    /**
     * Handle Form Submission
     */
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!formData.policy) {
            alert("Please accept the usage policy.");
            return;
        }

        console.log(slotValues);

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

        const duration_seconds = (formData.hours * 3600) + (formData.minutes * 60);
        console.log("Resource Usages:", resource_usages);
        const usageData = {
            as_org_id: formData.org ? formData.org : null,
            duration_seconds: duration_seconds,
            resource_usages: resource_usages,
        };

        console.log("Usage Data:", usageData);

        try {
            const response = await OmniAPI.use(selectedMachineId, usageData);
            console.log("Usage Response:", response);
            if (response == null) {
                alert("Usage submitted successfully.");
                window.location.reload();
            } else {
                throw new Error("An error occurred. Please try again.");
            }

        } catch (error: any) {
            if (error.status == 409) {
                alert("This machine is already in use. Please clear it before submitting a new usage.");
                window.location.reload();
            } else if (error.status == 404) {
                alert("The selected machine does not exist.");
                window.location.reload();
            } else if (error.status == 403) {
                alert("You are not permitted to use this machine.");
                window.location.reload();
            } else {
                alert("An error occurred. Please try again.");
                window.location.reload();
            }
        }
    };

    const validateResourceUsage = (slotValue: ResourceSlotElement) => {
        if (!schema.resource_slots.find((slot: ResourceSlotSchema) => slot.resource_slot_id === slotValue.slot_id)?.allow_own_material && slotValue.own) {
            const displayName = schema.resource_slots.find((slot: ResourceSlotSchema) => slot.resource_slot_id === slotValue.slot_id)?.display_name;
            return `${displayName} does not allow personal material.`
        }

        if (!schema.resource_slots.find((slot: ResourceSlotSchema) => slot.resource_slot_id === slotValue.slot_id)?.allow_empty && slotValue.amount <= 0 && !slotValue.own) {
            const displayName = schema.resource_slots.find((slot: ResourceSlotSchema) => slot.resource_slot_id === slotValue.slot_id)?.display_name;
            return `Please enter an amount greater than 0 for ${displayName}.`
        }

        return null;
    }

    const handlePageChange = (page: number) => {
        //Check if machine is selected
        if (page == 2 && selectedMachineId == "0") {
            alert("Please select a machine first.");
            return;
        }

        //Check if resource is selected
        if (page == 3) {
            const invalidSlot = slotValues.find((slot) => validateResourceUsage(slot));
            if (invalidSlot) {
                alert(validateResourceUsage(invalidSlot));
                return;
            }

            slotValues.forEach((slot) => {
                if (slot.amount > 1000 && !slot.own) {
                    alert(`WARNING: The amount of material you selected for ${slot.name} is greater than a single spool of filament. You will need to change the filament during the print. This is allowed, but please alert a volunteer or room manager after you start the print, so they are aware.`);
                } else if (slot.amount > 1000 && slot.own) {
                    alert(`WARNING: The amount of material you selected for ${slot.name} is greater than a single spool of filament. You will need to change the filament during the print. This is allowed, but please make sure you have enough material to complete the print - you will not able to use Forge resources to complete the print.`);
                }
            });
        }

        //Check if duration is valid
        if (page == 4 && (formData.hours == 0 && formData.minutes == 0)) {
            alert("Please enter a valid duration.");
            return;
        }

        setPage(page);
    };


    return (
        <div className="use-a-machine">
            <form className="usage-form" onSubmit={handleSubmit}>
                <FormIcon />
                <h2>Machine Usage Form</h2>
                {page == 1 &&
                    <div className="machine-selection">
                        <label>1. Machine Selection</label>
                        <select
                            className='styled-dropdown'
                            value={selectedMachineId}
                            onChange={(e) => handleSelectMachine(e.target.value)}
                        >
                            <option className='styled-dropdown-placeholder' value="0" hidden>{"Please Select a Machine"}</option>
                            {machines.map((machine: Machine) => (
                                <option className='styled-dropdown-option' key={machine.id} value={machine.id}>{machine.name}</option>
                            ))}
                        </select>
                    </div>
                }


                {page == 2 && resourceUsageForm}


                {page == 3 &&
                    <div className="usage-duration">
                        <label>3. Usage Duration</label>
                        <input
                            type="number"
                            inputMode="numeric"
                            step="1"
                            min="0"
                            placeholder="Hours"
                            onChange={(e) => setFormData((prev) => ({ ...prev, 'hours': Math.ceil(e.target.valueAsNumber) }))}
                            value={formData.hours}
                        />
                        <input
                            type="number"
                            inputMode="numeric"
                            step="1"
                            min="0"
                            placeholder="Minutes"
                            onChange={(e) => setFormData((prev) => ({ ...prev, 'minutes': Math.ceil(e.target.valueAsNumber) }))}
                            value={formData.minutes}
                        />
                    </div>
                }

                {page == 4 &&
                    <div className="usage-policies">
                        <input
                            id='checkbox-usage-policy'
                            className='styled-checkbox'
                            type="checkbox"
                            onChange={(e) => setFormData((prev) => ({ ...prev, 'policy': e.target.value }))}
                        />
                        <label
                            htmlFor='checkbox-usage-policy'
                            className='checkbox-label'
                        >
                            Do you agree to the Machine Usage Policy?
                        </label>
                        <input
                            id='checkbox-org-usage'
                            className='styled-checkbox'
                            type="checkbox"
                            onChange={(e) => setFormData((prev) => ({ ...prev, 'org': e.target.value }))}
                        />
                        <label
                            htmlFor='checkbox-org-usage'
                            className='checkbox-label'
                        >
                            Is this machine usage for an organization?
                        </label>

                        <input
                            id='checkbox-reprint'
                            className='styled-checkbox'
                            type="checkbox"
                            onChange={(e) => setFormData((prev) => ({ ...prev, 'reprint': e.target.value }))}
                        />
                        <label
                            htmlFor='checkbox-reprint'
                            className='checkbox-label'
                        >
                            Is this a reprint?
                        </label>
                    </div>
                }

                <div className="pagination-buttons">
                    <button type="button" onClick={() => setPage(page - 1)} disabled={page === 1}>Back</button>
                    {page !== 4 && <button type="button" onClick={() => handlePageChange(page + 1)} disabled={page === 4}>Next</button>}
                    {page == 4 && <button type="submit">Submit</button>}
                </div>

            </form>
        </div >
    );
};


/** This interface will serve as the master version of the schema - not the editable state version */
interface ResourceSlotSchema {
    resource_slot_id: string;
    display_name: string;
    valid_resources: Resource[];
    allow_own_material: boolean;
    allow_empty: boolean;
}


/** This is an interface to use as a template to populate the ResourceSlotElement into a state
 *  An instance should be created for each resource slot in the 
 *  machine schema, and then populated with the setSlots function
 */
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

/** Passing along a state object wouldn't have worked, so when slotValues updated, initialValues will need to be updated concurrently */
interface ResourceUsageFormProps {
    slots: ResourceSlotSchema[];
    initialValues: ResourceSlotElement[];
    setSlots: (updatedSlot: ResourceSlotElement) => void;
}

/* This is a CustomField for the CustomForm Component to use */
const ResourceUsageForm: React.FC<ResourceUsageFormProps> = ({ slots, initialValues, setSlots }) => {

    const [slotValues, setSlotValues] = useState<ResourceSlotElement[]>(initialValues);

    const handleSlotChange = (slotValue: ResourceSlotElement) => {
        const newSlotValues = [...slotValues];
        const slotIndex = newSlotValues.findIndex((slot) => slot.slot_id === slotValue.slot_id);
        newSlotValues[slotIndex] = slotValue;
        setSlotValues(newSlotValues);
    }

    const showBrand = slots.find((slot) => slot.valid_resources.find((resource) => resource.brand)) ? true : false;
    const showColor = false; //slots.find((slot) => slot.valid_resources.find((resource) => resource.color) ? true : false);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="resource-usage-form">
                <label>2. Resource Selection</label>
                <table>
                    <thead>
                        <tr>
                            <th>Slot Name</th>
                            <th>Material</th>
                            {showBrand && <th>Brand</th>}
                            {showColor && <th>Color</th>}
                            <th className="amount">Amount</th>
                            <th className="own-material">Personal Material</th>
                            <th>Cost</th>
                        </tr>
                    </thead>
                    <tbody>
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
                    </tbody>

                </table>
            </div >
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
        name: "_",
        brand: "_",
        color: "_",
        amount: 0,
        own: false,
        cost: 0,
    });

    const [cost, setCost] = useState(0);

    const validResources = slot.valid_resources;

    // Get unique materials (always available)
    const materialOptions = useMemo(() => [...new Set(validResources.map(resource => resource.name))], [validResources]);

    // Get brands based on selected material
    const brandOptions = useMemo(() => [...new Set(validResources
        .filter(resource => resource.name === selectedDetails.name || selectedDetails.name === "_")
        .map(resource => resource.brand))],
        [validResources, selectedDetails.name]);

    // Get colors based on selected material and brand
    const colorOptions = useMemo(() => [...new Set(validResources
        .filter(resource => resource.name === selectedDetails.name && resource.brand === selectedDetails.brand || selectedDetails.name === "_")
        .map(resource => resource.color))],
        [validResources, selectedDetails.name, selectedDetails.brand]);

    // Find the best matching resource
    const matchingResource = (name: string, brand: string, color: string) => {
        return validResources.find(resource =>
            resource.name === name &&
            (brand === "_" || resource.brand === brand) &&
            (color === "_" || resource.color === color)
        ) ?? null;
    };

    const handleChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value, type } = event.target;
        const newValue = type === "checkbox" ? (event.target as HTMLInputElement).checked : value;

        setSelectedDetails(prev => {
            let updatedDetails = { ...prev, [name]: newValue };

            // Get valid brands for the selected material
            const validBrands = validResources
                .filter(resource => resource.name === updatedDetails.name)
                .map(resource => resource.brand);

            // Get valid colors for the selected material & brand
            const validColors = validResources
                .filter(resource => resource.name === updatedDetails.name && resource.brand === updatedDetails.brand)
                .map(resource => resource.color);

            // If material changes, check if brand is still valid
            if (name === "name" && !validBrands.includes(updatedDetails.brand)) {
                updatedDetails.brand = "_"; // Reset brand if it's not a valid option anymore
            }

            // If brand changes, check if color is still valid
            if ((name === "name" || name === "brand") && !validColors.includes(updatedDetails.color)) {
                updatedDetails.color = "_"; // Reset color if it's not a valid option anymore
            }

            // Find best resource with the selected options
            const resource = matchingResource(updatedDetails.name, updatedDetails.brand || "_", updatedDetails.color || "_");
            const unitCost = parseFloat(resource?.cost ?? "0");
            updatedDetails.cost = updatedDetails.own ? 0 : (updatedDetails.amount * unitCost);

            return updatedDetails;
        });
    };

    useEffect(() => {
        const matchedResource = validResources.find(resource =>
            resource.name === selectedDetails.name &&
            (resource.brand === selectedDetails.brand || selectedDetails.brand === "_") &&
            (resource.color === selectedDetails.color || selectedDetails.color === "_")
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

    useEffect(() => {
        setCost(selectedDetails.cost);
    }, [selectedDetails.cost]);

    return (
        <tr>
            <td>{slot.display_name}</td>
            {/* Material Dropdown (Always available) */}
            <td>
                <select
                    name="name"
                    value={selectedDetails.name}
                    onChange={handleChange}
                    required={!slot.allow_empty}
                >
                    <option value="_">--Material--</option>
                    {materialOptions.map(name => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
            </td>

            {/* Brand Dropdown (Only available if material is selected) */}
            {showBrand && (
                <td>
                    <select
                        name="brand"
                        value={selectedDetails.brand}
                        onChange={handleChange}
                        disabled={selectedDetails.name === "_"}
                    >
                        <option value="_">--Brand--</option>
                        {brandOptions.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>
                </td>
            )}

            {/* Color Dropdown (Only available if brand is selected) */}
            {showColor && (
                <td>
                    <select
                        name="color"
                        value={selectedDetails.color}
                        onChange={handleChange}
                        disabled={selectedDetails.name === "_" || selectedDetails.brand === "_"}
                    >
                        <option value="_">--Color--</option>
                        {colorOptions.map(color => (
                            <option key={color} value={color}>{color}</option>
                        ))}
                    </select>
                </td>
            )}

            {/* Amount Input */}
            <td>
                <input
                    type="number"
                    name="amount"
                    value={selectedDetails.amount}
                    onChange={handleChange}
                    required={!slot.allow_empty}
                />
            </td>

            {/* Own Checkbox */}
            <td>
                <input
                    type="checkbox"
                    name="own"
                    checked={selectedDetails.own}
                    onChange={handleChange}
                />
            </td>

            {/* Cost Display */}
            <td>
                {"$" + cost.toFixed(2)}
            </td>
        </tr>
    );
};

