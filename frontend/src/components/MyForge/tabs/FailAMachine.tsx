import React, { useEffect, useState, ChangeEvent, FormEvent, ReactNode, Suspense, useMemo } from "react";
import { OmniAPI } from "src/apis/OmniAPI";
import { CheckboxInput, CustomForm, CustomFormField, DropdownInput, FormIcon, TextInput } from "src/components/Forms/Form";
import { emptyMachine, Machine, Resource } from "src/interfaces";
import { v4 as uuidv4 } from "uuid";

import '../../Forms/styles/Form.scss';
import '../styles/UseAMachine.scss';

export const FailAMachineForm: React.FC = () => {
    
    const [machines, setMachines] = useState<Machine[]>([]);
    const [selectedMachineId, setSelectedMachineId] = useState<string>("_");
    // I think this data is for the email the user gets sent? TODO
    const [estimatedPercentCompleted, setEstimatedPercentCompleted] = useState(0);
    const [printerErrorMessage, setPrinterErrorMessage] = useState<string>("");
    const [noticeableFaults, setNoticeableFaults] = useState<string[]>([]);


    /**
     * Load Machines
     */
    useEffect(() => {
        const fetchMachines = async () => {
            const allMachines: Machine[] = await OmniAPI.getAll("machines");
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
     * Handle Checkbox Change
     */
    const handleCheckboxChange = (fault: string) => {
        setNoticeableFaults((prevFaults) =>
            prevFaults.includes(fault)
                ? prevFaults.filter((f) => f !== fault)
                : [...prevFaults, fault]
        );
    };

    /**
     * Handle Form Submission
     */
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const response = await OmniAPI.fail(selectedMachineId);
        console.log("Response:", response);

        // Clear form
        const form = document.querySelector(".usage-form") as HTMLFormElement;
        form.reset();
        resetFormFields();
    };

    /**
     * Reset Form Fields
     */
    const resetFormFields = () => {
        setEstimatedPercentCompleted(0);
        setPrinterErrorMessage("");
        setNoticeableFaults([]);
    };
    
    return (
        <div className="use-a-machine">
            <form className="usage-form" onSubmit={handleSubmit}>
                <FormIcon />
                <h2>Machine Failure Form</h2>

                <label>Machine Selection</label>
                <select
                    className='styled-dropdown'
                    defaultValue="_"
                    onChange={(e) => handleSelectMachine(e.target.value)}
                    required
                >
                    <option className='styled-dropdown-placeholder' value="_" hidden>{"Please Select a Machine"}</option>
                    {machines.map((machine: Machine) => (
                        <option className='styled-dropdown-option' key={machine.id} value={machine.id}>{machine.name}</option>
                    ))}
                </select>
        
                <div className="usage-duration">
                    <label>Percent Completed</label>
                    <input
                        type="number"
                        value={estimatedPercentCompleted}
                        placeholder="0"
                        min="0"
                        max="100"
                        onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value >= 0 && value <= 100) {
                                setEstimatedPercentCompleted(value);
                            }
                        }}
                    />
                </div>
                <label>Error Message</label>
                <div className="resource-usage-form">
                    <input
                        type="text"
                        value={printerErrorMessage}
                        placeholder="Printer Error Message" 
                        onChange={(e) => setPrinterErrorMessage(e.target.value)}
                        required
                    />
                </div>

                <label>Noticeable Faults</label>
                <div className="noticeable-faults">
                    <div className="checkbox-labels">
                        <input
                            id='checkbox-layer-shift'
                            className='styled-checkbox'
                            type="checkbox"
                            checked={noticeableFaults.includes("Layer Shift")}
                            onChange={() => handleCheckboxChange("Layer Shift")}
                        />
                        <label htmlFor='checkbox-layer-shift' className='checkbox-label'>
                            Layer Shift
                        </label>
                    </div>

                    <div className="checkbox-labels">
                        <input
                            id='checkbox-filament-jam'
                            className='styled-checkbox'
                            type="checkbox"
                            checked={noticeableFaults.includes("Filament Jam")}
                            onChange={() => handleCheckboxChange("Filament Jam")}
                        />
                        <label htmlFor='checkbox-filament-jam' className='checkbox-label'>
                            Filament Jam
                        </label>
                    </div>

                    <div className="checkbox-labels">
                        <input
                            id='checkbox-bed-adhesion'
                            className='styled-checkbox'
                            type="checkbox"
                            checked={noticeableFaults.includes("Lack of Bed Adhesion")}
                            onChange={() => handleCheckboxChange("Lack of Bed Adhesion")}
                        />
                        <label htmlFor='checkbox-bed-adhesion' className='checkbox-label'>
                            Lack of Bed Adhesion
                        </label>
                    </div>

                    <div className="checkbox-labels">
                        <input
                            id='checkbox-other'
                            className='styled-checkbox'
                            type="checkbox"
                            checked={noticeableFaults.includes("Other")}
                            onChange={() => handleCheckboxChange("Other")}
                        />
                        <label htmlFor='checkbox-other' className='checkbox-label'>
                            Other
                        </label>
                    </div>
                </div>

                {selectedMachineId !== "_" && (
                    <button type="submit">Submit</button>
                )}
            </form>
        </div>
    );
};