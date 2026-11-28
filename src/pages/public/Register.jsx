import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { asset } from '../../data.js';
import { post } from '../../api.js';
import { useToast } from '../../components/ui.jsx';

const EMPTY = { name: '', cid: '', email: '', phone: '', role: '', dept: '', pass: '', pass2: '' };

export default function Register() {
    const navigate = useNavigate();
    const toast = useToast();
    const [f, setF] = useState(EMPTY);
    const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        
        // 1. Check if passwords match
        if (f.pass !== f.pass2) { 
            toast('Passwords do not match', 'error'); 
            return; 
        }

        // 2. Check if email belongs to the college domain
        if (!f.email.trim().toLowerCase().endsWith('@rub.edu.bt')) {
            toast('Only official college emails (@rub.edu.bt) are allowed to register.', 'error');
            return;
        }

        try {
            await post('auth.php', 'register', { name: f.name, cid: f.cid, email: f.email, phone: f.phone, role: f.role, dept: f.dept, password: f.pass });
            
            // NEW: Updated success message to tell them to check email
            toast('Registration successful! Please check your email to verify your account.');
            
            // Increased timeout to 3 seconds so they can read the message
            setTimeout(() => navigate('/login'), 3000);
            
        } catch (err) {
            toast(err.message, 'error');
        }
    };

    const field = (k, label, type = 'text', extra = {}) => (
        <div className="col-md-6">
            <label className="form-label" htmlFor={`r-${k}`}>{label}</label>
            <input id={`r-${k}`} type={type} className="form-control" required value={f[k]} onChange={set(k)} {...extra} />
        </div>
    );

    return (
        <section className="auth-section"><div className="auth-card"><div className="row g-0">
            <div className="col-md-4 d-none d-md-block"><div className="auth-side">
                <img src={asset('logo.png')} alt="SHBS logo" />
                <h4 className="fw-bold">Join SHBS</h4>
                <p>Create your account to start booking halls.</p>
            </div></div>
            <div className="col-md-8"><div className="auth-form">
                <h2 className="mb-1">Create account</h2>
                <p className="text-muted mb-4">Students and faculty can register here.</p>
                <form onSubmit={submit}>
                    <div className="row g-3">
                        {field('name', 'Full name')}
                        {field('cid', 'College ID')}
                        {field('email', 'Email', 'email', { placeholder: 'example@rub.edu.bt' })}
                        {field('phone', 'Phone', 'tel', { placeholder: '+975 17XXXXXX' })}
                        <div className="col-md-6">
                            <label className="form-label" htmlFor="r-role">I am a</label>
                            <select id="r-role" className="form-select" required value={f.role} onChange={set('role')}>
                                <option value="">Choose...</option><option value="student">Student</option><option value="Staff">Staff</option>
                            </select>
                        </div>
                        {field('dept', 'Department')}
                        {field('pass', 'Password', 'password', { minLength: 8 })}
                        {field('pass2', 'Confirm password', 'password')}
                    </div>
                    <button className="btn btn-shbs w-100 py-2 mt-4" type="submit">Register</button>
                </form>
                <p className="text-center mt-3 mb-0">Already have an account? <Link to="/login" className="fw-semibold">Login</Link></p>
            </div></div>
        </div></div></section>
    );
}