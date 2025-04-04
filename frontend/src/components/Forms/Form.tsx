import React, { useState } from 'react';

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

interface DropdownInputProps extends FormElementProps {
    options: string[];
    taggedOptions?: { id: string, value: string }[];
}

export const DropdownInput = (props: DropdownInputProps) => {
    const { label, id, onChange, placeholder, options } = props;
    return (
        <div className='input-container'>
            {label && <label>{label}</label>}
            <select
                className='styled-dropdown'
                defaultValue="_"
                onChange={(e) => onChange(id, e.target.value)}
                required
            >
                {placeholder && <option className='styled-dropdown-placeholder' value="_" hidden>{placeholder}</option>}
                {!props.taggedOptions && options.map((option) => (
                    <option className='styled-dropdown-option' key={option} value={option}>{option}</option>
                ))}
                {props.taggedOptions && props.taggedOptions.map((option) => (
                    <option className='styled-dropdown-option' key={option.id} value={option.id}>{option.value}</option>
                ))}
            </select>
        </div>
    );
}

export const CheckboxInput = (props: FormElementProps & {required?: boolean }) => {
    const { label, id, value, onChange, required } = props;
    return (
        <div className='input-container checkbox-input-container'>
            {required && <span style={{ color: 'red' }}>*</span>}
            <input
                id={'checkbox-' + id}
                className='styled-checkbox'
                type="checkbox"
                onChange={(e) => onChange(id, e.target.checked ? "checked" : "")}
            />
            {label && <label htmlFor={'checkbox-' + id} className='checkbox-label'>{label}</label>}
        </div>
    );
}

export interface FormField {
    id: string;
    label?: string;
    type: string;
    placeholder?: string;
    required: boolean | undefined;
}

interface FormProps {
    formFields: FormField[];
    handleSubmit: (e: React.FormEvent<HTMLFormElement>, formValues: { [key: string]: string }) => void;
    submitLabel: string;
    title: string;
    showIcon?: boolean;
    width?: string;
}

export const Form = (props: FormProps) => {

    const { formFields, submitLabel, title, width } = props;
    const [formValues, setFormValues] = useState<{ [key: string]: string }>({});

    const handleInputChange = (input: string, value: string) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [input]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        props.handleSubmit(e, formValues); 
    }

    return (
        <form className='form-container' onSubmit={handleSubmit} style={{ width: width ? width : '' }}>
            {props.showIcon && <div className='form-icon' />}
            <label>{title}</label>
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
                                required = {field.required}
                            />
                        );
                    default:
                        return null;
                }
            })}
            <button className='submit-button' type="submit" >
                {submitLabel}
            </button>
        </form>
    )
}


export const FormIcon = () => {
    return (
        <div className='form-icon' />
    );
}

export interface CustomFormField extends FormField {
    handleChange: (id: string, value: string) => void;
    options?: string[];
    taggedOptions?: { id: string, value: string }[];
}

interface CustomFormProps extends FormProps {
    formFields: CustomFormField[];
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    showSubmit?: boolean;
    children?: React.ReactNode;
}

export const CustomForm = (props: CustomFormProps) => {

    const { formFields, handleSubmit, submitLabel, title, width, showSubmit } = props;

    // console.log(props.children)

    return (
        <form className='form-container' onSubmit={handleSubmit} style={{ width: width ? width : '' }}>
            {props.showIcon && <div className='form-icon' />}
            <label>{title}</label>
            {formFields.map((field) => {
                switch (field.type) {
                    case "text":
                    case "password":
                        return (
                            <TextInput
                                key={field.id}
                                label={field.label}
                                id={field.id}
                                value={field.id ? field.id : ""}
                                onChange={field.handleChange}
                                type={field.type}
                            />
                        );
                    case "dropdown":
                        return (
                            <DropdownInput
                                key={field.id}
                                label={field.label}
                                id={field.id}
                                value={field.id ? field.id : ""}
                                placeholder={field.placeholder}
                                onChange={field.handleChange}
                                options={field.options ? field.options : []}
                                type={field.type}
                            />
                        );
                    case "tagged-dropdown":
                        return (
                            <DropdownInput
                                key={field.id}
                                label={field.label}
                                id={field.id}
                                value={field.id ? field.id : ""}
                                placeholder={field.placeholder}
                                onChange={field.handleChange}
                                options={field.options ? field.options : []}
                                taggedOptions={field.taggedOptions ? field.taggedOptions : []}
                                type={field.type}
                            />
                        );
                    case "checkbox":
                        return (
                            <CheckboxInput
                                key={field.id}
                                label={field.label}
                                id={field.id}
                                value={field.id ? field.id : ""}
                                onChange={field.handleChange}
                                type={field.type}
                                required={field.required}
                            />
                        );
                    case "custom":
                        return (
                            <div key={field.id}>
                                {React.Children.map(props.children, child => {
                                    if (React.isValidElement(child) && child.key === field.id) {
                                        return child;
                                    }
                                    return null;
                                })}
                            </div>
                        );
                    default:
                        return null;
                }
            })}
            {showSubmit && <button className='submit-button' type="submit" >
                {submitLabel}
            </button>}
        </form>
    )
}
