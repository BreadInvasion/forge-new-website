import React, { useState } from 'react';
import styled from 'styled-components';
import { CheckboxInput, DropdownInput, FormIcon, FormLabel, FormWrapper, TextInput } from './Form';

const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    background-image: url(src/assets/img/anvil_with_benchys.png);
    background-size: cover;
    background-color: #D40000;
    background-position: center;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
`;

const FormContainer = styled.div`
    display: flex;
    height: 100%;
    min-width: 50%;
    align-items: center;
    justify-content: center;
    padding: 1rem 2rem;
`;

const SubmitButton = styled.button`
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    min-width: fit-content;
    width: 50%;
    background-color: #AF0909;
    color: white;
    cursor: pointer;
`;

    
const formFields = [
    {
        type: "text",
        label: "First Name",
        id: "first-name",
    },
    {
        type: "text",
        label: "Last Name",
        id: "last-name",
    },
    {
        type: "text",
        label: "RCS ID",
        id: "rcsid",
    },
    {
        type: "text",
        label: "RIN",
        id: "rin",
    },
    {
        type: "dropdown",
        label: "Major",
        id: "major",
        placeholder: "Select a major",
    },
    {
        type: "text",
        label: "Password",
        id: "password",
    },
    {
        type: "text",
        label: "Confirm Password",
        id: "confirm-password",
    },
    {
        type: "checkbox",
        label: "Are you graduating this semester?",
        id: "graduating",
    },
    {
        type: "checkbox",
        label: "I acknowledge that $15 will be charged to my bursar account.",
        id: "bursar-acknowledgement",
    },

];

export default function Register() {

    const [formValues, setFormValues] = useState<{ [key: string]: string }>({});

    const handleInputChange = (input: string, value: string) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [input]: value,
        }));
    };
    
    // Just check validity at submission.

    return (
        <PageContainer>
            <FormContainer>
                <FormWrapper>
                    <FormIcon src="src/assets/img/logo.svg" />
                    <FormLabel>Register</FormLabel>
                    {formFields.map((field) => {
                        switch (field.type) {
                            case "text":
                                return (
                                    <TextInput
                                        key={field.id}
                                        label={field.label}
                                        id={field.id}
                                        value={formValues[field.id] ? formValues[field.id] : ""}
                                        onChange={handleInputChange}
                                    />
                                );
                            case "dropdown":
                                return (
                                    <DropdownInput
                                        key={field.id}
                                        label={field.label}
                                        id={field.id}
                                        value={formValues[field.id] ? formValues[field.id] : ""}
                                        placeholder={field.placeholder}
                                        onChange={handleInputChange}
                                        options={["Computer Science", "ITWS", "Math", "Physics", "Biology"]}
                                    />
                                );
                            case "checkbox":
                                return (
                                    <CheckboxInput
                                        key={field.id}
                                        label={field.label}
                                        id={field.id}
                                        value={formValues[field.id] ? formValues[field.id] : ""}
                                        onChange={handleInputChange}
                                    />
                                );
                            default:
                                return null;
                        }
                    })}
                    <SubmitButton
                        onClick={() => {
                            console.log(formValues);
                        }}
                    >
                        Submit
                    </SubmitButton>
                </FormWrapper>
            </FormContainer>
        </PageContainer>
    )
}