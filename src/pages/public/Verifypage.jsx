import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { post } from '../../api.js';
import { asset } from '../../data.js';

export default function Verify() {
    const location = useLocation();
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // 1. Get the token from the URL (handling the HashRouter format)
        // The URL looks like: http://localhost:5173/#/verify?token=12345
        // We split it by '?' to grab the token part
        const queryString = window.location.href.split('?')[1];
        const urlParams = new URLSearchParams(queryString);
        const token = urlParams.get('token');

        if (!token) {
            setStatus('error');
            setMessage('No verification token provided in the URL.');
            return;
        }

        // 2. Send the token to the backend
        const verify = async () => {
            try {
                // This calls your fixed auth.php
                await post('auth.php', 'verify', { token });
                setStatus('success');
            } catch (err) {
                setStatus('error');
                setMessage(err.message || 'Verification failed. The link may be expired or invalid.');
            }
        };
        
        verify();
    }, [location]); // Re-run if the URL changes

    return (
        <section className="auth-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="auth-card" style={{ maxWidth: '500px', width: '100%' }}>
                <div className="auth-form text-center p-5">
                    <img src={asset('logo.png')} alt="Logo" style={{ width: '80px', marginBottom: '1rem' }} />
                    
                    {/* SHOW LOADING STATE */}
                    {status === 'verifying' && (
                        <div>
                            <h3 className="mb-3">Verifying your email...</h3>
                            <div className="spinner-border text-success" role="status"></div>
                        </div>
                    )}

                    {/* SHOW SUCCESS MESSAGE */}
                    {status === 'success' && (
                        <div>
                            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
                            <h3 className="mt-3">Email Verified!</h3>
                            <p className="text-muted mb-4">Your account is now active. You can log in to the system.</p>
                            <Link to="/login" className="btn btn-shbs w-100 py-2">Go to Login</Link>
                        </div>
                    )}

                    {/* SHOW ERROR MESSAGE */}
                    {status === 'error' && (
                        <div>
                            <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '4rem' }}></i>
                            <h3 className="mt-3">Verification Failed</h3>
                            <p className="text-muted mb-4">{message}</p>
                            <Link to="/register" className="btn btn-outline-secondary w-100 py-2">Back to Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}