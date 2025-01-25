import React, { useState } from 'react';
import styled from 'styled-components';
import { CheckboxInput, DropdownInput, TextInput } from './Form';
import { useNavigate } from 'react-router-dom';
import useAuth from '../Auth/useAuth';
// import { ReactComponent as Logo } from 'logo.svg';

import './styles/Form.scss';
import './styles/Register.scss';

    
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
        type: "password",
        label: "Password",
        id: "password",
    },
    {
        type: "password",
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
                    "gender_identity": "notdisclosed",
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
        <div className='page-container'>
            <form className='form-container' onSubmit={handleRegister}>
                <div className='form-icon' />
                <label>Register</label>
                {formFields.map((field) => {
                    switch (field.type) {
                        case "text":
                        case "password":
                            return (
                                <TextInput
                                    key={field.id}
                                    label={field.label}
                                    id={field.id}
                                    value={formValues[field.id] ? formValues[field.id] : ""}
                                    onChange={handleInputChange}
                                    type={field.type}
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
                                    type={field.type}
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
                                    type={field.type}
                                />
                            );
                        default:
                            return null;
                    }
                })}
                <button className='submit-button' type="submit" >
                    Submit
                </button>
            </form>
        </div>
    )
}