import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../Auth/useAuth';
import { AuthAPI } from 'src/apis/AuthAPI';
import './styles/VerifyEmail.scss';

export default function VerifyEmail() {
    const { token } = useParams<{ token: string }>();
    const { isAuthenticated, setUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [isLoading, setIsLoading] = useState(Boolean(token));
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: location } });
        }
    }, [isAuthenticated, navigate, location]);

    useEffect(() => {
        if (!isAuthenticated) return;

        if (!token) {
            setError('No verification token found');
            setIsLoading(false);
            return;
        }

        const validateToken = async () => {
            try {
                const result = await AuthAPI.checkEmailToken(token);
                if (!result.success) {
                    setError('This email verification link is invalid or has expired.');
                    return;
                }
                setIsTokenValid(true);
            } catch (err: any) {
                setError(err?.detail || err?.message || 'Unable to validate the email verification link.');
            } finally {
                setIsLoading(false);
            }
        };

        validateToken();
    }, [isAuthenticated, token]);

    const handleVerifyEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!token) {
            setError('No verification token found');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await AuthAPI.verifyEmail(token);

            if (result.success) {
                // Update the users new permission
                const userResponse = await AuthAPI.me();
                if (userResponse.status == 200) {
                    setUser(userResponse.data);
                    localStorage.setItem('user', JSON.stringify(userResponse.data));
                }
                setSuccess(true);
                setTimeout(() => {
                    navigate('/myforge');
                }, 2000);
            } else {
                setError('Email verification failed.');
            }
        } catch (err: any) {
            console.error('Error verifying email:', err);
            setError(err.message || 'An error occurred while verifying your email.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) {
        return <div>Redirecting to login...</div>;
    }

    if (isLoading) {
        return <div className='verify-email-container'>Checking verification link...</div>;
    }

    return (
        <div className='verify-email-container'>
            <form onSubmit={handleVerifyEmail}>
                <div className='form-logo' />
                <label>Verify Your Email</label>
                <p className='description'>
                    Click the button below to verify your email address
                </p>

                {error && <div className='error-message'>{error}</div>}
                {success && <div className='success-message'>Email verified successfully</div>}

                {isTokenValid && (
                    <div className='button-container'>
                        <button type='submit' disabled={success}>
                            {success ? 'Verified!' : 'Verify Email'}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
