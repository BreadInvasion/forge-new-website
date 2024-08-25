import React, { useState } from 'react';
import styled from 'styled-components';

export const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #eeeeee;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    padding: 3%;
    gap: 10px;
    align-items: center;
`;

const InputContainer = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-gap: 10px;
    align-items: center;
    justify-content: block-end;
`;

const Label = styled.label`
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    text-align: right;
`;

export const FormIcon = styled.div<{ src: string }>`
    height: 10vh;
    width: 100%;
    aspect-ratio: 1 / 1;

    background-image: url(${props => props.src});
    background-size: auto 90%;
    background-repeat: no-repeat;
    background-position: center;
`;
export const FormLabel = styled.label`
    font-size: 1.5rem;
    color: #333;
    text-align: center;
`;

const StyledInput = styled.input`
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    width: 100%;
    border: 1px solid #333;
`;

interface FormElementProps {
    label?: string;
    id: string;
    value: string;
    placeholder?: string;
    onChange: (id: string, value: string) => void;
}

export const TextInput = (props: FormElementProps) => {
    const { label, id, value, onChange, placeholder } = props;
    return (
        <InputContainer>
            {label && <Label>{label}</Label>}
            <StyledInput
                type="text"
                value={value}
                onChange={(e) => onChange(id, e.target.value)}
                placeholder={placeholder ? placeholder : ""}
            />
        </InputContainer>
    );
} 

const StyledDropdown = styled.select`
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.875rem;
    width: 100%;
    border: 1px solid #333;
`;

const StyledDropdownOption = styled.option`
    color: #090909;
`;

const StyledDropdownPlaceholder = styled.option`
    color: rgba(0, 0, 0, 0.5);
`;

export const DropdownInput = (props: FormElementProps & { options: string[] }) => {
    const { label, id, value, onChange, placeholder, options } = props;
    return (
        <InputContainer>
            {label && <Label>{label}</Label>}
            <StyledDropdown
                defaultValue="placeholder"
                onChange={(e) => onChange(id, e.target.value)}
            >
                {placeholder && <StyledDropdownPlaceholder value="placeholder" hidden>{placeholder}</StyledDropdownPlaceholder>}
                {options.map((option) => (
                    <StyledDropdownOption key={option} value={option}>{option}</StyledDropdownOption>
                ))}
            </StyledDropdown>
        </InputContainer>
    );
}

const StyledCheckbox = styled.input`
    /* Add your styling here */
`;
const CheckboxLabel = styled(Label)`
    text-align: center;
`;
const CheckboxInputContainer = styled(InputContainer)`
    display: flex;
    justify-content: center;
    max-width: 90%;
    align-items: center;
`;

export const CheckboxInput = (props: FormElementProps) => {
    const { label, id, value, onChange } = props;
    return (
        <CheckboxInputContainer>
            <StyledCheckbox
                type="checkbox"
                onChange={(e) => onChange(id, e.target.checked ? "checked" : "")}
            />
            {label && <CheckboxLabel>{label}</CheckboxLabel>}
        </CheckboxInputContainer>
    );
}
