import React, { useState } from 'react';
import styled from 'styled-components';

import './styles/Form.scss';

interface FormElementProps {
    label?: string;
    id: string;
    value: string;
    placeholder?: string;
    onChange: (id: string, value: string) => void;
    type: string;
}

export const TextInput = (props: FormElementProps) => {
    const { label, id, value, onChange, placeholder, type } = props;
    return (
        <div className='input-container'>
            {label && <label id='login-label'>{label}</label>}
            <input
                className='styled-input'
                type={type}
                value={value}
                onChange={(e) => onChange(id, e.target.value)}
                placeholder={placeholder ? placeholder : ""}
                
                required
            />
        </div>
    );
} 

export const DropdownInput = (props: FormElementProps & { options: string[] }) => {
    const { label, id, value, onChange, placeholder, options } = props;
    return (
        <div className='input-container'>
            {label && <label>{label}</label>}
            <select
                className='styled-dropdown'
                defaultValue="placeholder"
                onChange={(e) => onChange(id, e.target.value)}
                required
            >
                {placeholder && <option className='styled-dropdown-placeholder' value="placeholder" hidden>{placeholder}</option>}
                {options.map((option) => (
                    <option className='styled-dropdown-option' key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
}

export const CheckboxInput = (props: FormElementProps) => {
    const { label, id, value, onChange } = props;
    return (
        <div className='input-container checkbox-input-container'>
            <input  
                className='styled-checkbox'
                type="checkbox"
                onChange={(e) => onChange(id, e.target.checked ? "checked" : "")}
            />
            {label && <label className='checkbox-label'>{label}</label>}
        </div>
    );
}
