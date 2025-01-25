import * as React from 'react';
import { FormEvent, useState } from 'react';
import useAuth from '../Auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userState } from 'src/GlobalAtoms';
import { User } from 'src/interfaces';

import './styles/Login.scss';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { AuthAPI } from 'src/apis/AuthAPI';

interface CustomJwtPayload extends JwtPayload {
    expires_at?: number;
    issued_at?: number;
}

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