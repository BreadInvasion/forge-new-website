import * as React from 'react';
import { FormEvent, useState } from 'react';
import useAuth from '../Auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userState } from 'src/GlobalAtoms';
import { User } from 'src/interfaces';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { AuthAPI } from 'src/apis/AuthAPI';
import rulerMask from '../../assets/img/ruler-mask-tile.svg?url';
import anvilImg from '../../assets/img/anvil_with_benchys.png';
import PageRuler from '../shared/PageRuler';
import './styles/Login.scss';

const ANVIL_URL  = anvilImg;
const RULER_URL  = rulerMask;

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
        <div className="login-page">
            <img className="login-anvil" src={ANVIL_URL} alt="" />
            <PageRuler src={RULER_URL} side="left" zIndex={1} />

            <div className="login-card">
                <div className="login-card__inner">
                    <form className="login-form" onSubmit={handleLogin}>
                        <h1 className="login-title">Sign In</h1>
                        <div className="login-divider" />

                        <div className="login-fields">
                            <div className="login-field">
                                <label className="login-field__label" htmlFor="rscid">RSC ID</label>
                                <input
                                    className="login-field__input"
                                    id="rscid"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="login-field">
                                <label className="login-field__label" htmlFor="password">Password</label>
                                <input
                                    className="login-field__input"
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="login-buttons">
                            <button className="login-btn login-btn--submit" type="submit">Start Making!</button>
                            <a className="login-btn" href="/reset-password">Forgot Password?</a>
                        </div>

                        <div className="login-divider" />

                        <p className="login-register__label">Don't have an account?</p>
                        <a className="login-register__btn" href="/register">Register Here!</a>
                    </form>
                </div>
            </div>
        </div>
    );
}
