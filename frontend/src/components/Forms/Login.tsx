import * as React from 'react';
import { FormEvent, useState } from 'react';
import useAuth from '../Auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { UserInterface, userState } from 'src/GlobalAtoms';

import './styles/Login.scss';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface CustomJwtPayload extends JwtPayload {
    expires_at?: number;
    issued_at?: number;
}

export default function Login() {

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const { setAuth, setUser } = useAuth();
    const navigate = useNavigate();

    const getUserData = async (token: string): Promise<UserInterface | null> => {
        try {
            const response = await fetch('http://localhost:3000/api/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.ok) {
                const result = await response.json();

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
                    setAuth(true);
                    localStorage.setItem('authToken', token);
                    const decodedToken: CustomJwtPayload = jwtDecode<JwtPayload>(token);
                    localStorage.setItem('token_expiration', decodedToken.expires_at?.toString() || '0');
                    const userData = await getUserData(token);
                    if (userData) {
                        setUser(userData);
                        localStorage.setItem('user', JSON.stringify(userData));
                    }
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
        <div className='login-container'>
            <form onSubmit={handleLogin}>
                <div className='form-logo' />
                <label>Sign In</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <div className='button-container'>
                    <button type='submit'>Sign In</button>
                    <a href="/reset-password">Forgot Password?</a>
                </div>
                <div className='seperator' />
                <span className='register'>Don't have an account? <a href="/register">Register Here!</a></span>
            </form>
        </div>
    )
}