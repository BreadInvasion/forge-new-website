import React, { useState } from 'react';
import styled from 'styled-components';
import { CheckboxInput, DropdownInput, Form, TextInput } from './Form';
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

    const navigate = useNavigate();


    const handleRegister = async (e: React.FormEvent<HTMLFormElement>, formValues: { [key: string]: string }) => {
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
            <Form
                formFields={formFields}
                handleSubmit={handleRegister} 
                submitLabel="Register" 
                title="Register"
                showIcon={true} 
            />
        </div>
    )
}