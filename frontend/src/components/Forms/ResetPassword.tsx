import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthAPI } from 'src/apis/AuthAPI';
import './styles/ResetPassword.scss';

export default function ResetPassword() {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    const [rcsid, setRcsid] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(Boolean(token));
    const [isTokenValid, setIsTokenValid] = useState(!token);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) return;

        const validateToken = async () => {
            try {
                const result = await AuthAPI.checkPasswordToken(token);
                if (!result.success) {
                    alert('This password reset link is invalid or has expired.');
                    navigate('/reset-password');
                    return;
                }
                setIsTokenValid(true);
            } catch (err: any) {
                alert('This password reset link is invalid or has expired.');
                navigate('/reset-password');
            } finally {
                setIsLoading(false);
            }
        };

        validateToken();
    }, [token, navigate]);

    const handleResetRequest = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (!token) {
                const result = await AuthAPI.makePasswordToken({
                    token_type: 'password_reset',
                    rcsid: rcsid,
                });
                if (result.success) {
                    alert('A password reset email has been sent to your RPI email. (It may be in spam)');
                    navigate('/login');
                } else {
                    setError('Unable to send a password reset email for that RCSID.');
                }
                return;
            }

            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            if (password.length < 5) {
                setError('Password must be at least 5 characters');
                return;
            }

            const result = await AuthAPI.resetPassword(token, {
                rcsid: rcsid,
                new_password: password,
            });
            if (result.success) {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError('Password reset failed. Check your RCSID and try again.');
            }
        } catch (err: any) {
            setError(err?.detail || err?.message || 'An error occurred while resetting your password.');
        } finally {
            setIsLoading(false);
        }
    };

    const isRequestForm = !token;

    return (
        <div className='reset-password-container'>
            <form onSubmit={handleResetRequest}>
                <div className='form-logo' />
                <label>{isRequestForm ? 'Reset Your Password' : 'Choose a New Password'}</label>
                <p className='description'>
                    {isRequestForm
                        ? 'Enter your RCSID and we will send you a password reset link.'
                        : 'Enter your RCSID and choose a new password for your Forge account.'}
                </p>

                {error && <div className='error-message'>{error}</div>}
                {success && (
                    <div className='success-message'>
                        {isRequestForm
                            ? 'Check your RPI email for a password reset link.'
                            : 'Password reset successfully'}
                    </div>
                )}

                {(!token || isTokenValid) && !success && (
                    <>
                        <input
                            type='text'
                            placeholder='RCSID'
                            value={rcsid}
                            onChange={(event) => setRcsid(event.target.value)}
                            required
                        />
                        {!isRequestForm && (
                            <>
                                <input
                                    type='password'
                                    placeholder='New password'
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                />
                                <input
                                    type='password'
                                    placeholder='Confirm new password'
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    required
                                />
                            </>
                        )}
                        <div className='button-container'>
                            <button type='submit' disabled={isLoading}>
                                {isLoading ? 'Please wait...' : isRequestForm ? 'Send Reset Link' : 'Reset Password'}
                            </button>
                        </div>
                    </>
                )}

                {token && !isLoading && !isTokenValid && !success && (
                    <div className='button-container'>
                        <button type='button' onClick={() => navigate('/reset-password')}>Request a New Link</button>
                    </div>
                )}
            </form>
        </div>
    );
}