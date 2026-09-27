import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import anvilImg from '../../assets/img/anvil_with_benchys.png';
import rulerMask from '../../assets/img/ruler-mask-tile.svg?url';
import PageRuler from '../shared/PageRuler';
import './styles/Register.scss';

const ANVIL_URL = anvilImg;
const RULER_URL = rulerMask;

const MAJORS = [
    "Aeronautical Engineering", "Architecture", "Biological Sciences",
    "Biomedical Engineering", "Chemical Engineering", "Chemistry",
    "Civil Engineering", "Cognitive Science", "Communication",
    "Computer Science", "Computer Systems Engineering", "Design, Innovation & Society",
    "Economics", "Electrical Engineering", "Electronic Media, Arts & Communication",
    "Environmental Engineering", "Games & Simulation Arts & Sciences",
    "Geology", "Hydrogeology", "Industrial & Management Engineering",
    "Information Technology & Web Science", "Interdisciplinary Science",
    "Materials Engineering", "Mathematics", "Mechanical Engineering",
    "Nuclear Engineering", "Philosophy", "Physics",
    "Psychology", "Science, Technology & Society", "Undecided",
];

export default function Register() {
    const navigate = useNavigate();

    const [formValues, setFormValues] = useState<{ [key: string]: string | boolean }>({
        'first-name': '',
        'last-name': '',
        'rcsid': '',
        'rin': '',
        'major': '',
        'password': '',
        'confirm-password': '',
        'graduating': false,
        'bursar-acknowledgement': false,
    });
    const [status, setStatus] = useState<{ text: string; type: string }>({ text: '', type: '' });

    const set = (key: string, value: string | boolean) =>
        setFormValues(prev => ({ ...prev, [key]: value }));

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!/^\d{9}$/.test(formValues['rin'] as string)) {
            setStatus({ text: 'RIN must be 9 digits', type: 'error' }); return;
        }
        if (!/^662\d{6}$/.test(formValues['rin'] as string)) {
            setStatus({ text: 'RIN must start with 662', type: 'error' }); return;
        }
        if (/[^a-zA-Z0-9]/.test(formValues['rcsid'] as string)) {
            setStatus({ text: 'RCS ID must not contain special characters', type: 'error' }); return;
        }
        if (!formValues['first-name'] || !formValues['last-name']) {
            setStatus({ text: 'First and last name cannot be empty', type: 'error' }); return;
        }
        if (formValues['password'] !== formValues['confirm-password']) {
            setStatus({ text: 'Passwords do not match', type: 'error' }); return;
        }
        if ((formValues['password'] as string).length < 5) {
            setStatus({ text: 'Password must be at least 5 characters', type: 'error' }); return;
        }
        if (!formValues['major'] || formValues['major'] === 'Select a major') {
            setStatus({ text: 'Please select a major', type: 'error' }); return;
        }
        if (!formValues['bursar-acknowledgement']) {
            setStatus({ text: 'Please acknowledge the bursar charge', type: 'error' }); return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    RCSID: formValues['rcsid'],
                    RIN: formValues['rin'],
                    first_name: formValues['first-name'],
                    last_name: formValues['last-name'],
                    major: formValues['major'],
                    gender_identity: 'notdisclosed',
                    pronouns: 'not_shown',
                    password: formValues['password'],
                }),
            });

            if (response.ok) {
                setStatus({ text: 'Registration successful! Redirecting…', type: 'success' });
                setTimeout(() => navigate('/login'), 1200);
            } else {
                setStatus({ text: `Registration failed: ${response.status} ${response.statusText}`, type: 'error' });
            }
        } catch (error) {
            setStatus({ text: `Error: ${error}`, type: 'error' });
        }
    };

    return (
        <div className="register-page">
            <img className="register-anvil" src={ANVIL_URL} alt="" />
            <PageRuler src={RULER_URL} side="left" zIndex={1} />

            <div className="register-card">
                <div className="register-card__inner">
                    <form className="register-form" onSubmit={handleRegister}>
                        <h1 className="register-title">Registration Form</h1>
                        <div className="register-divider" />

                        <div className="register-fields">
                            <div className="register-field">
                                <label className="register-field__label" htmlFor="first-name">First Name</label>
                                <input className="register-field__input" id="first-name" type="text" value={formValues['first-name'] as string}
                                    onChange={e => set('first-name', e.target.value)} required />
                            </div>
                            <div className="register-field">
                                <label className="register-field__label" htmlFor="last-name">Last Name</label>
                                <input className="register-field__input" id="last-name" type="text" value={formValues['last-name'] as string}
                                    onChange={e => set('last-name', e.target.value)} required />
                            </div>
                            <div className="register-field">
                                <label className="register-field__label" htmlFor="rcsid">RCS ID</label>
                                <input className="register-field__input" id="rcsid" type="text" value={formValues['rcsid'] as string}
                                    onChange={e => set('rcsid', e.target.value)} required />
                            </div>
                            <div className="register-field">
                                <label className="register-field__label" htmlFor="rin">RIN</label>
                                <input className="register-field__input" id="rin" type="text" value={formValues['rin'] as string}
                                    onChange={e => set('rin', e.target.value)} required />
                            </div>
                            <div className="register-field">
                                <label className="register-field__label" htmlFor="major">Major</label>
                                <select className="register-field__select" id="major" value={formValues['major'] as string}
                                    onChange={e => set('major', e.target.value)} required>
                                    <option value="" disabled hidden>Select a major</option>
                                    {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                            <div className="register-field">
                                <label className="register-field__label" htmlFor="password">Password</label>
                                <input className="register-field__input" id="password" type="password" value={formValues['password'] as string}
                                    onChange={e => set('password', e.target.value)} required />
                            </div>
                            <div className="register-field">
                                <label className="register-field__label" htmlFor="confirm-password">Confirm Password</label>
                                <input className="register-field__input" id="confirm-password" type="password" value={formValues['confirm-password'] as string}
                                    onChange={e => set('confirm-password', e.target.value)} required />
                            </div>
                        </div>

                        <div className="register-divider" />

                        <div className="register-checks">
                            <div className="register-check">
                                <input className="register-check__box" id="graduating" type="checkbox"
                                    checked={formValues['graduating'] as boolean}
                                    onChange={e => set('graduating', e.target.checked)} />
                                <label className="register-check__label" htmlFor="graduating">Are you graduating this semester?</label>
                            </div>
                            <div className="register-check">
                                <input className="register-check__box" id="bursar-acknowledgement" type="checkbox"
                                    checked={formValues['bursar-acknowledgement'] as boolean}
                                    onChange={e => set('bursar-acknowledgement', e.target.checked)} />
                                <label className="register-check__label" htmlFor="bursar-acknowledgement">
                                    I acknowledge that $15 will be charged to my bursar account.
                                </label>
                            </div>
                        </div>

                        <p className={`register-status${status.type ? ` register-status--${status.type}` : ''}`}>
                            {status.text || ' '}
                        </p>

                        <button className="register-submit" type="submit">Start Making!</button>

                    </form>
                </div>
            </div>
        </div>
    );
}
