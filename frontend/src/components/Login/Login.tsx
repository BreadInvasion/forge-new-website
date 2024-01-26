import React from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { emailState, passwordState } from 'src/GlobalAtoms';

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const LoginForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1rem;
`;

const LoginInput = styled.input`
    padding: 0.5rem;
    margin-bottom: 0.5rem;
`;

const LoginButton = styled.button`
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;
`;

const Login = () => {
    const [email, setEmail] = useRecoilState(emailState);
    const [password, setPassword] = useRecoilState(passwordState);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement login logic
    };

    const handleCreateAccount = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement create account logic
    };

    return (
        <LoginContainer>
            <h2>Login</h2>
            <LoginForm onSubmit={handleLogin}>
                <label htmlFor="email">Email:</label>
                <LoginInput type="email" id="email" value={email} onChange={handleEmailChange} />

                <label htmlFor="password">Password:</label>
                <LoginInput type="password" id="password" value={password} onChange={handlePasswordChange} />

                <LoginButton type="submit">Sign In</LoginButton>
            </LoginForm>

            <h2>Create Account</h2>
            <LoginForm onSubmit={handleCreateAccount}>
                <label htmlFor="newEmail">Email:</label>
                <LoginInput type="email" id="newEmail" />

                <label htmlFor="newPassword">Password:</label>
                <LoginInput type="password" id="newPassword" />

                <LoginButton type="submit">Create Account</LoginButton>
            </LoginForm>
        </LoginContainer>
    );
};

export default Login;
