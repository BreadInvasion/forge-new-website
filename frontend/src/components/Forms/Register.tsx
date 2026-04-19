import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import bgPattern from '../../assets/img/background.svg?url';

// ── Figma assets ───────────────────────────────────────────────────────────────
const ANVIL_URL = 'https://www.figma.com/api/mcp/asset/e8a3284e-3457-4355-bbdf-65163140905b';
const RULER_URL = 'https://www.figma.com/api/mcp/asset/bba8fd43-c457-48c7-9661-f9b17452f667';

// ── Design tokens ──────────────────────────────────────────────────────────────
const C = {
    navy:  '#111c36',
    red:   '#a51c1c',
    white: '#ffffff',
};

// ── Styled components ──────────────────────────────────────────────────────────

const PageBackground = styled.div`
    position: relative;
    width: 100%;
    min-height: calc(100vh - 74px);
    background: linear-gradient(to right, ${C.red} 0%, #2d4a80 100%);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    overflow: hidden;
`;

const AnvilImage = styled.img`
    position: absolute;
    left: 4%;
    top: 50%;
    transform: translateY(-50%);
    height: 100%;
    max-height: 816px;
    width: auto;
    object-fit: contain;
    pointer-events: none;
    user-select: none;
`;

const RulerStrip = styled.div`
    position: absolute;
    left: -1px;
    top: 0;
    width: 70px;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
    z-index: 1;

    &::after {
        content: '';
        position: absolute;
        width: 5000px;
        height: 70px;
        left: calc(50% - 2500px);
        top: -2535px;
        transform: rotate(-90deg) scaleY(-1);
        transform-origin: center center;
        background-image: url(${RULER_URL});
        background-size: 750px 70px;
        background-repeat: repeat-x;
        background-position: 0 0;
    }
`;

const FormCard = styled.div`
    position: relative;
    z-index: 2;
    background: ${C.white};
    border: 4px solid ${C.navy};
    border-radius: 10px;
    width: clamp(320px, 38vw, 552px);
    padding: 0 0 20px 0;
    margin-right: clamp(24px, 6vw, 96px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 8px 32px rgba(17,28,54,0.25);

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: url(${bgPattern});
        background-repeat: repeat;
        background-size: 122px 140px;
        opacity: 0.03;
        pointer-events: none;
        z-index: 0;
    }

    @media screen and (max-width: 700px) {
        width: calc(100% - 48px);
        margin-right: 24px;
        margin-left: 24px;
    }
`;

const CardInner = styled.div`
    position: relative;
    z-index: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Title = styled.h1`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(20px, 2.5vw, 30px);
    font-weight: 700;
    color: ${C.navy};
    text-align: center;
    margin: 20px 0 14px 0;
`;

const Divider = styled.div`
    width: calc(100% - 40px);
    height: 2px;
    background: ${C.navy};
    flex-shrink: 0;
`;

const FieldsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    width: calc(100% - 40px);
    padding: 12px 0 8px 0;
`;

const FieldRow = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 5px 10px;
    width: 100%;
    justify-content: flex-end;
`;

const FieldLabel = styled.label`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(13px, 1.4vw, 20px);
    font-weight: 700;
    color: #000;
    white-space: nowrap;
    flex-shrink: 0;
`;

const FieldInput = styled.input`
    height: 30px;
    width: clamp(130px, 20vw, 300px);
    border: 2px solid #000;
    border-radius: 5px;
    background: ${C.white};
    padding: 4px 8px;
    font-size: 13px;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    outline: none;
    flex-shrink: 0;
    box-sizing: border-box;

    &:focus {
        border-color: ${C.navy};
        box-shadow: 0 0 0 2px rgba(17,28,54,0.15);
    }
`;

const FieldSelect = styled.select`
    height: 30px;
    width: clamp(130px, 20vw, 300px);
    border: 2px solid #000;
    border-radius: 5px;
    background: ${C.white};
    padding: 4px 8px;
    font-size: 13px;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    outline: none;
    flex-shrink: 0;
    box-sizing: border-box;
    cursor: pointer;

    &:focus {
        border-color: ${C.navy};
    }
`;

// ── Checkboxes ─────────────────────────────────────────────────────────────────

const CheckboxArea = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    width: calc(100% - 40px);
    padding: 8px 10px 4px 10px;
`;

const CheckRow = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 7px 0;
    width: 100%;
`;

const StyledCheckbox = styled.input`
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    cursor: pointer;
    accent-color: ${C.navy};
    border: 2px solid #000;
    border-radius: 4px;
`;

const CheckLabel = styled.label`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(11px, 1.1vw, 14px);
    font-weight: 700;
    color: #000;
    cursor: pointer;
    line-height: 1.3;
`;

// ── Status & Submit ────────────────────────────────────────────────────────────

const StatusText = styled.p<{ $type: string }>`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    padding: 4px 20px;
    min-height: 18px;
    width: 100%;
    box-sizing: border-box;
    margin: 0;
    color: ${({ $type }) =>
        $type === 'error'   ? '#a51c1c' :
        $type === 'success' ? '#1d7a48' : 'transparent'};
`;

const SubmitBtn = styled.button`
    height: clamp(54px, 6vw, 72px);
    width: calc(100% - 40px);
    background: ${C.red};
    border: 2px solid #000;
    border-radius: 5px;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(18px, 2.2vw, 30px);
    font-weight: 700;
    color: ${C.white};
    cursor: pointer;
    margin-top: 4px;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s ease;

    &:hover {
        background: #8a1515;
        transform: translateY(-1px);
    }
    &:active {
        transform: translateY(0);
    }
`;

// ── Majors list ────────────────────────────────────────────────────────────────

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

// ── Component ──────────────────────────────────────────────────────────────────

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
        <PageBackground>
            <AnvilImage src={ANVIL_URL} alt="" />
            <RulerStrip />

            <FormCard>
                <CardInner>
                    <form onSubmit={handleRegister} style={{ width: '100%', display: 'contents' }}>
                        <Title>Registration Form</Title>
                        <Divider />

                        <FieldsContainer>
                            <FieldRow>
                                <FieldLabel htmlFor="first-name">First Name</FieldLabel>
                                <FieldInput id="first-name" type="text" value={formValues['first-name'] as string}
                                    onChange={e => set('first-name', e.target.value)} required />
                            </FieldRow>
                            <FieldRow>
                                <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
                                <FieldInput id="last-name" type="text" value={formValues['last-name'] as string}
                                    onChange={e => set('last-name', e.target.value)} required />
                            </FieldRow>
                            <FieldRow>
                                <FieldLabel htmlFor="rcsid">RCS ID</FieldLabel>
                                <FieldInput id="rcsid" type="text" value={formValues['rcsid'] as string}
                                    onChange={e => set('rcsid', e.target.value)} required />
                            </FieldRow>
                            <FieldRow>
                                <FieldLabel htmlFor="rin">RIN</FieldLabel>
                                <FieldInput id="rin" type="text" value={formValues['rin'] as string}
                                    onChange={e => set('rin', e.target.value)} required />
                            </FieldRow>
                            <FieldRow>
                                <FieldLabel htmlFor="major">Major</FieldLabel>
                                <FieldSelect id="major" value={formValues['major'] as string}
                                    onChange={e => set('major', e.target.value)} required>
                                    <option value="" disabled hidden>Select a major</option>
                                    {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
                                </FieldSelect>
                            </FieldRow>
                            <FieldRow>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <FieldInput id="password" type="password" value={formValues['password'] as string}
                                    onChange={e => set('password', e.target.value)} required />
                            </FieldRow>
                            <FieldRow>
                                <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                                <FieldInput id="confirm-password" type="password" value={formValues['confirm-password'] as string}
                                    onChange={e => set('confirm-password', e.target.value)} required />
                            </FieldRow>
                        </FieldsContainer>

                        <Divider />

                        <CheckboxArea>
                            <CheckRow>
                                <StyledCheckbox id="graduating" type="checkbox"
                                    checked={formValues['graduating'] as boolean}
                                    onChange={e => set('graduating', e.target.checked)} />
                                <CheckLabel htmlFor="graduating">Are you graduating this semester?</CheckLabel>
                            </CheckRow>
                            <CheckRow>
                                <StyledCheckbox id="bursar-acknowledgement" type="checkbox"
                                    checked={formValues['bursar-acknowledgement'] as boolean}
                                    onChange={e => set('bursar-acknowledgement', e.target.checked)} />
                                <CheckLabel htmlFor="bursar-acknowledgement">
                                    I acknowledge that $15 will be charged to my bursar account.
                                </CheckLabel>
                            </CheckRow>
                        </CheckboxArea>

                        <StatusText $type={status.type}>{status.text || ' '}</StatusText>

                        <SubmitBtn type="submit">Start Making!</SubmitBtn>

                    </form>
                </CardInner>
            </FormCard>
        </PageBackground>
    );
}
