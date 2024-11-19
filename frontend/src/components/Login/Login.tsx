import * as React from 'react';
import { FormEvent, useState } from 'react';
import styled from 'styled-components';
import useAuth from '../Auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userState } from 'src/GlobalAtoms';

const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: right;
    padding-right: 10%;
    display: flex;
    background-color: #D40000;
    background-image: url(src/assets/img/anvil_with_benchys.png);
    background-size: cover;
    background-position: center;

`;

const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    
    width: 25vw;
    align-items: center;
    border-radius: 5px;
    padding: 1rem 2rem;
    gap: 1rem;
    background-color: #eeeeee;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
`;

const LogoIcon = styled.div`
    height: 10vh;
    aspect-ratio: 1 / 1;
    width: 100%;

    background-image: url(src/assets/img/logo.svg);
    background-size: auto 90%;
    background-repeat: no-repeat;
    background-position: center;
`;

const Title = styled.label`
    font-size: 1.5rem;
    color: #333;
    text-align: center;
`;


const Input = styled.input`
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    width: 100%;
    border: 1px solid #333;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

const Button = styled.button`
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

const ForgotPassword = styled.a`
    font-size: 0.75rem;
    text-align: center;
    cursor: pointer;
`;

const Register = styled.span`
    color: #333;
    text-align: center;
    width: 100%;
    font-size: 1rem;
`;

const Seperator = styled.div`
    width: 100%;
    height: 1px;
    background-color: #333;
`;


export default function Login() {

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const [user, setUser] = useRecoilState(userState);


    const handleLogin = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                const token = result.access_token;

                if (token) {
                    login(token); // Store the token and update auth state

                    

                    navigate('/myforge');
                }
            } else {
                console.error('Login failed:', response.status);
                console.error('Login failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <PageContainer>
            <FormContainer onSubmit={handleLogin}>
                <LogoIcon />
                <Title>Sign In</Title>
                <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <ButtonContainer>
                    <Button type='submit'>Sign In</Button>
                    <ForgotPassword href="/reset-password">Forgot Password?</ForgotPassword>
                </ButtonContainer>
                <Seperator />
                <Register>Don't have an account? <a href="/register">Register Here!</a></Register>
            </FormContainer>
        </PageContainer>
    )
}