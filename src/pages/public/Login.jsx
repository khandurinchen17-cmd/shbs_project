import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { asset } from '../../data.js';
import { useAuth } from '../../context.jsx';

export default function Login() {
    const navigate = useNavigate();
    const { login, offline } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setError(''); setBusy(true);
        try {
            const user = await login(email, password);
            navigate(user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <section className="auth-section"><div className="auth-card"><div className="row g-0">
            <div className="col-md-5 d-none d-md-block"><div className="auth-side">
                <img src={asset('logo.png')} alt="SHBS logo" />
                <h4 className="fw-bold">Welcome back</h4>
                <p>Log in to check availability and manage your hall bookings.</p>
            </div></div>
            <div className="col-md-7"><div className="auth-form">
                <h2 className="mb-1">Login</h2>
                <p className="text-muted mb-4">Enter your email and password to continue.</p>
                {offline && <div className="alert alert-warning small">{offline}</div>}
                {error && <div className="alert alert-danger small"><i className="bi bi-x-circle me-1" />{error}</div>}
                <form onSubmit={submit}>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">Email address</label>
                        <input id="email" type="email" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label className="form-label" htmlFor="password">Password</label>
                        <div className="input-group">
                            <input id="password" type={show ? 'text' : 'password'} className="form-control" required value={password} onChange={(e) => setPassword(e.target.value)} />
                            <button className="btn btn-outline-secondary" type="button" aria-label="Show password" onClick={() => setShow(!show)}>
                                <i className={`bi ${show ? 'bi-eye-slash' : 'bi-eye'}`} />
                            </button>
                        </div>
                    </div>
                    <button className="btn btn-shbs w-100 py-2" type="submit" disabled={busy}>{busy ? 'Logging in...' : 'Login'}</button>
                </form>
                <p className="text-center mt-3 mb-0">New here? <Link to="/register" className="fw-semibold">Create an account</Link></p>
            </div></div>
        </div></div></section>
    );
}
