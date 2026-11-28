import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { post } from '../../api.js';
import { asset } from '../../data.js';

export default function Verify() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No verification token provided.');
            return;
        }

        const verify = async () => {
            try {
                await post('auth.php', 'verify', { token });
                setStatus('success');
            } catch (err) {
                setStatus('error');
                setMessage(err.message || 'Verification failed. The link may be expired or invalid.');
            }
        };
        verify();
    }, [token]);

    return (
        <section className="auth-section"><div className="auth-card" style={{ maxWidth: '500px' }}><div className="auth-form text-center">
            <img src={asset('logo.png')} alt="Logo" style={{ width: '80px', marginBottom: '1rem' }} />
            
            {status === 'verifying' && (
                <>
                    <h3 className="mb-3">Verifying your email...</h3>
                    <div className="spinner-border text-success" role="status"></div>
                </>
            )}

            {status === 'success' && (
                <>
                    <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
                    <h3 className="mt-3">Email Verified!</h3>
                    <p className="text-muted">Your account is now active. You can log in to the system.</p>
                    <Link to="/login" className="btn btn-shbs mt-3">Go to Login</Link>
                </>
            )}

            {status === 'error' && (
                <>
                    <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '3rem' }}></i>
                    <h3 className="mt-3">Verification Failed</h3>
                    <p className="text-muted">{message}</p>
                    <Link to="/register" className="btn btn-outline-secondary mt-3">Back to Register</Link>
                </>
            )}
        </div></div></section>
    );
}