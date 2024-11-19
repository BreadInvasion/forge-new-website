import React, { useState } from 'react';
import styled from 'styled-components';
import { CheckboxInput, DropdownInput, FormIcon, FormLabel, FormWrapper, TextInput } from './Form';
import { useNavigate } from 'react-router-dom';
import useAuth from '../Auth/useAuth';

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

const FormContainer = styled.form`
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
        secret: true,
    },
    {
        type: "text",
        label: "Confirm Password",
        id: "confirm-password",
        secret: true,
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

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (input: string, value: string) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [input]: value,
        }));
    };
    
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "RCSID": formValues["rcsid"],
                    "RIN": formValues["rin"],
                    "first_name": formValues["first-name"],
                    "last_name": formValues["last-name"],
                    "major": formValues["major"],
                    "gender_identity": 0,
                    "pronouns": "not_shown",
                    "password": formValues["password"]
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Register successful:', result);
                navigate('/login');
            } else {
                console.error('Register failed:', response.status);
                console.error('Register failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <PageContainer>
            <FormContainer onSubmit={handleRegister}>
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
                    <SubmitButton type="submit" >
                        Submit
                    </SubmitButton>
                </FormWrapper>
            </FormContainer>
        </PageContainer>
    )
}