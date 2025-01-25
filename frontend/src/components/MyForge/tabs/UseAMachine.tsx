import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { OmniAPI } from "src/apis/OmniAPI";
import { emptyMachine, Machine } from "src/interfaces";

/** 
 * The shape of the response from GET http://localhost:3000/machines 
 * (an array of machine names).
 */
type MachinesResponse = string[];

/** 
 * The shape of the response from POST http://localhost:3000/use/machine
 * when requesting the schema (an array of field names).
 */
interface MachineSchemaResponse {
    [key: string]: any;
}

/**
 * Our component’s state for dynamic form data will be
 * a record of fieldName -> fieldValue.
 */
interface FormDataState {
    [key: string]: string;
}

const DynamicMachineForm: React.FC = () => {
    // List of available machines (fetched from /machines endpoint)
    const [machines, setMachines] = useState<Machine[]>([]);

    // The currently selected machine
    const [selectedMachine, setSelectedMachine] = useState<Machine>(emptyMachine);

    // The schema (array of field names) for the selected machine
    const [schema, setSchema] = useState<MachineSchemaResponse>({});

    // The dynamic form data: fieldName -> value
    const [formData, setFormData] = useState<FormDataState>({});

    /**
     * On component mount, fetch the list of machines from the mock endpoint.
     */
    useEffect(() => {
        const fetchMachines = async () => {
            try {
                const response = await OmniAPI.getAll("machines");
                console.log(response);
                const data: Machine[] = response;
                setMachines(data);
            } catch (error) {
                console.error("Error fetching machines:", error);
            }
        };

        fetchMachines();
    }, []);

    /**
     * When the user selects a machine, we POST to /use/machine with { machineName }
     * to retrieve the schema (an array of field names).
     */
    const handleSelectMachine = async (event: ChangeEvent<HTMLSelectElement>) => {
        const machineID = event.target.selectedOptions[0].value;

        console.log("Selected machine ID:", machineID);

        const newSelectedMachine = machines.find((machine) => machine.id === machineID);

        console.log("Selected machine:", newSelectedMachine);
        setSelectedMachine(newSelectedMachine || emptyMachine);

        if (newSelectedMachine) {
            try {
                const response = OmniAPI.get("use", `${newSelectedMachine.id}/schema`);

                const schemaData: MachineSchemaResponse = await response;
                console.log("Schema for machine:", schemaData);
                setSchema(schemaData);

                // Initialize formData with empty values
                const emptyFormData: FormDataState = {};
                for (const field in schemaData) {
                    if (schemaData.hasOwnProperty(field)) {
                        emptyFormData[field] = "";
                    }
                }
                setFormData(emptyFormData);
            } catch (error) {
                console.error("Error fetching machine schema:", error);
            }
        } else {
            setSchema({});
            setFormData({});
        }
    };

    /**
     * Handle changes to any of the dynamically generated fields.
     */
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    /**
     * On form submit, we POST to /use/machine with { machineName, formData }
     * to simulate "using" the machine with the provided data.
     */
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!selectedMachine) {
            alert("Please select a machine first.");
            return;
        }
        if (Object.keys(formData).length === 0) {
            alert("No fields to submit.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/use/machine", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ machineName: selectedMachine, formData }),
            });

            if (!response.ok) {
                throw new Error(`Failed to submit data: ${response.statusText}`);
            }

            // In a real app, you might receive some result or success message here
            const result = await response.json();
            console.log("Submission result:", result);

            alert("Form submitted successfully! Check the console for the response.");

            // (Optional) Reset form or navigate away
            setSelectedMachine(emptyMachine);
            setSchema({});
            setFormData({});
        } catch (error) {
            console.error("Error submitting form data:", error);
            alert("There was an error submitting the form. Check the console for details.");
        }
    };

    return (
        <div className="usage-form">
            <h2>Machine Usage Form</h2>

            {/* Step 1: Machine selection */}
            <label htmlFor="machine-select" className="usage-form-label">Select a machine:</label>
            <select
                id="machine-select"
                className="usage-form-select"
                value={selectedMachine.id}
                onChange={handleSelectMachine}
                style={{ display: "block", marginBottom: "1rem" }}
            >
                <option value="_">--Please choose a machine--</option>
                {machines.map((machine) => (
                    <option key={machine.id} value={machine.id}>
                        {machine.name}
                    </option>
                ))}
            </select>

            {/* Step 2: Render form fields based on the schema */}
            {schema && Object.keys(schema).length > 0 && (
                <form onSubmit={handleSubmit} className="usage-form-resources">
                    {schema.resource_slots.map((field: any) => (
                        <div key={field} className="resource-slot">
                            <label htmlFor={field}>{field}:</label>
                            <input
                                id={field}
                                name={field}
                                type="text"
                                value={formData[field]}
                                onChange={handleChange}
                                style={{ marginLeft: "0.5rem" }}
                            />
                        </div>
                    ))}
                    {/* Submit button */}
                    <button type="submit" style={{ marginTop: "1rem" }}>
                        Submit
                    </button>
                </form>
            )}
        </div>
    );
};

export default DynamicMachineForm;
