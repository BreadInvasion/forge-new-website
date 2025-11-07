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
        label: "RCS ID",
        id: "rcsid",
    },
    {
        type: "text",
        label: "RIN",
        id: "rin",
    },
];

export default function ForgotPassword() {

    const navigate = useNavigate();

    const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>, formValues: { [key: string]: string }) => {
        e.preventDefault();

        //Check RIN 9 digits, no characters, no special characters
        if (!/^\d{9}$/.test(formValues["rin"])) {
            alert("RIN must be 9 digits");
            return;
        }

        //Check RIN starts with 662
        if (!/^662\d{6}$/.test(formValues["rin"])) {
            alert("RIN must start with 662");
            return;
        }

        //Check if there is any special characters in RCSID
        if (/[^a-zA-Z0-9]/.test(formValues["rcsid"])) {
            alert("RCSID must not contain special characters");
            return;
        }

        // Check if RCSID has enough characters
        if(!/^.{6,}$/.test(formValues["rcsid"])) {
            alert("RCSID must be at least 6 characters long");
            return;
        }

        try {
            alert("There's going to be functionality here later.");
        } catch (error) {
            console.error('Error:', error);
            alert('Error occured:' + error);
        }
    }

    return (
        <div className='page-container'>
            <Form
                formFields={formFields}
                handleSubmit={handleForgotPassword} 
                submitLabel="Reset Password" 
                title="Forgot Password?"
                showIcon={true} 
            />
        </div>
    )
}