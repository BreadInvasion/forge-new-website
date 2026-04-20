import * as React from 'react';
import { FormEvent, useState } from 'react';
import styled from 'styled-components';
import useAuth from '../Auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userState } from 'src/GlobalAtoms';
import { User } from 'src/interfaces';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { AuthAPI } from 'src/apis/AuthAPI';
import bgPattern from '../../assets/img/background.svg?url';
import PageRuler from '../shared/PageRuler';

// ── Figma assets ──────────────────────────────────────────────────────────────
const ANVIL_URL  = 'https://www.figma.com/api/mcp/asset/0ca5af14-4911-42d6-b056-db8c2c2dec01';
const RULER_URL  = 'https://www.figma.com/api/mcp/asset/c39237df-01e0-4113-8117-8aff7f16b4bb';

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
    navy:  '#111c36',
    red:   '#a51c1c',
    white: '#ffffff',
};

// ── Styled components ─────────────────────────────────────────────────────────

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

const FormCard = styled.div`
    position: relative;
    z-index: 2;
    background: ${C.white};
    border: 4px solid ${C.navy};
    border-radius: 10px;
    width: clamp(320px, 38vw, 552px);
    padding: 0 0 28px 0;
    margin-right: clamp(24px, 6vw, 96px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 8px 32px rgba(17,28,54,0.25);

    /* subtle background pattern inside card */
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
    font-size: clamp(22px, 2.5vw, 30px);
    font-weight: 700;
    color: ${C.navy};
    text-align: center;
    margin: 24px 0 16px 0;
`;

const Divider = styled.div`
    width: calc(100% - 40px);
    height: 2px;
    background: ${C.navy};
    margin: 0 20px;
    flex-shrink: 0;
`;

const FieldsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    width: calc(100% - 40px);
    padding: 16px 0;
`;

const FieldRow = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 6px 10px;
    width: 100%;
    justify-content: flex-end;
`;

const FieldLabel = styled.label`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(15px, 1.5vw, 20px);
    font-weight: 700;
    color: #000;
    white-space: nowrap;
    flex-shrink: 0;
`;

const FieldInput = styled.input`
    height: 32px;
    width: clamp(140px, 20vw, 300px);
    border: 2px solid #000;
    border-radius: 5px;
    background: ${C.white};
    padding: 4px 8px;
    font-size: 14px;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    outline: none;
    flex-shrink: 0;

    &:focus {
        border-color: ${C.navy};
        box-shadow: 0 0 0 2px rgba(17,28,54,0.15);
    }
`;

const ButtonRow = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 8px 20px 16px 20px;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
`;

const StartMakingBtn = styled.button`
    height: 36px;
    width: clamp(130px, 13vw, 181px);
    background: ${C.red};
    border: 1px solid #000;
    border-radius: 5px;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(12px, 1.1vw, 15px);
    font-weight: 700;
    color: ${C.white};
    cursor: pointer;
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

const ForgotBtn = styled.a`
    height: 36px;
    width: clamp(130px, 13vw, 181px);
    background: ${C.red};
    border: 1px solid #000;
    border-radius: 5px;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(12px, 1.1vw, 15px);
    font-weight: 700;
    color: ${C.white};
    cursor: pointer;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s ease;

    &:hover {
        background: #8a1515;
    }
`;

const RegisterLabel = styled.p`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(16px, 2vw, 28px);
    font-weight: 700;
    color: #000;
    text-align: center;
    margin: 16px 20px 12px 20px;
`;

const RegisterBtn = styled.a`
    display: flex;
    align-items: center;
    justify-content: center;
    height: clamp(40px, 4vw, 50px);
    width: calc(100% - 80px);
    max-width: 461px;
    background: ${C.red};
    border: 2px solid #000;
    border-radius: 5px;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(18px, 2vw, 30px);
    font-weight: 700;
    color: ${C.white};
    text-decoration: none;
    cursor: pointer;
    transition: background 0.15s ease, transform 0.1s ease;
    margin-bottom: 4px;

    &:hover {
        background: #8a1515;
        transform: translateY(-1px);
    }
`;

// ── Types ─────────────────────────────────────────────────────────────────────

interface CustomJwtPayload extends JwtPayload {
    expires_at?: number;
    issued_at?: number;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Login() {

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const { setAuth, setUser } = useAuth();
    const navigate = useNavigate();

    const getUserData = async (): Promise<User | null> => {
        try {
            const response = await AuthAPI.me();

            if (response.status === 200) {
                const result = await response.data;

                return result;
            } else {
                console.error('Retrieve User Data failed:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        return null;
    }

    const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        try {
            const response = await AuthAPI.login(username, password);
            console.log('Login response:', response);

            if (response.status === 200) {
                const result = response.data;
                const token = result.access_token;
                const expiration = Math.floor(Date.now() / 1000) + 3 * 60;
                console.log('Expires at:', expiration * 1000);
                console.log('Expires in (minutes):', (expiration * 1000 - Date.now()) / 1000 / 60);

                setAuth(true);
                localStorage.setItem('authToken', token);
                localStorage.setItem('token_expiration', expiration.toString() || '0');
                const userData = await getUserData();
                if (userData) {
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                }
                navigate('/myforge');
            } else {
                console.error('Login failed:', response.status);
                console.error('Login failed:', response.statusText);
                alert('Login failed:' + " " + response.status);
                alert('Login failed:' + " " + response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.status === 401) {
                alert('Invalid username or password');
            } else{
                alert('Error occured:' + error);
            }
        }
    };

    return (
        <PageBackground>
            <AnvilImage src={ANVIL_URL} alt="" />
            <PageRuler src={RULER_URL} side="left" zIndex={1} />

            <FormCard>
                <CardInner>
                    <form onSubmit={handleLogin} style={{ width: '100%', display: 'contents' }}>
                        <Title>Sign In</Title>
                        <Divider />

                        <FieldsContainer>
                            <FieldRow>
                                <FieldLabel htmlFor="rscid">RSC ID</FieldLabel>
                                <FieldInput
                                    id="rscid"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </FieldRow>
                            <FieldRow>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <FieldInput
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </FieldRow>
                        </FieldsContainer>

                        <ButtonRow>
                            <StartMakingBtn type="submit">Start Making!</StartMakingBtn>
                            <ForgotBtn href="/reset-password">Forgot Password?</ForgotBtn>
                        </ButtonRow>

                        <Divider />

                        <RegisterLabel>Don't have an account?</RegisterLabel>
                        <RegisterBtn href="/register">Register Here!</RegisterBtn>
                    </form>
                </CardInner>
            </FormCard>
        </PageBackground>
    );
}
