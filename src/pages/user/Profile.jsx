import { useState } from 'react';
import { post } from '../../api.js';
import { useAuth } from '../../context.jsx';
import { Panel, useToast } from '../../components/ui.jsx';

export default function Profile() {
    const toast = useToast();
    const { user, setUser } = useAuth();
    const [f, setF] = useState({ name: user.name, email: user.email, phone: user.phone, dept: user.dept });
    const [pw, setPw] = useState({ current: '', next: '', again: '' });
    const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
    const setP = (k) => (e) => setPw({ ...pw, [k]: e.target.value });
    const initials = user.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
    const roleLabel = user.role === 'admin' ? 'Administrator' : user.role[0].toUpperCase() + user.role.slice(1);

    const save = async (e) => {
        e.preventDefault();
        try { const d = await post('profile.php', 'update', f); setUser(d.user); toast('Profile updated'); } catch (err) { toast(err.message, 'error'); }
    };
    const changePassword = async (e) => {
        e.preventDefault();
        if (pw.next !== pw.again) { toast('New passwords do not match', 'error'); return; }
        try { await post('profile.php', 'password', { current: pw.current, new: pw.next }); toast('Password changed'); setPw({ current: '', next: '', again: '' }); } catch (err) { toast(err.message, 'error'); }
    };

    return (
        <div className="row g-4">
            <div className="col-lg-4"><Panel><div className="panel-body text-center">
                <div className="avatar avatar-lg mb-3">{initials}</div>
                <h5 className="fw-bold mb-0" style={{ color: 'var(--navy)' }}>{user.name}</h5>
                <p className="text-muted">{roleLabel}</p>
                <ul className="info-list text-start">
                    <li><i className="bi bi-card-text" /><div>{user.cid}<small>College ID</small></div></li>
                    <li><i className="bi bi-envelope" /><div>{user.email}<small>Email</small></div></li>
                    <li><i className="bi bi-telephone" /><div>{user.phone}<small>Phone</small></div></li>
                </ul>
            </div></Panel></div>
            <div className="col-lg-8">
                <Panel title="Personal information" className="mb-4"><div className="panel-body">
                    <form onSubmit={save}>
                        <div className="row g-3">
                            <div className="col-md-6"><label className="form-label">Full name</label><input className="form-control" required value={f.name} onChange={set('name')} /></div>
                            <div className="col-md-6"><label className="form-label">College ID</label><input className="form-control" value={user.cid} disabled /></div>
                            <div className="col-md-6"><label className="form-label">Email</label><input type="email" className="form-control" required value={f.email} onChange={set('email')} /></div>
                            <div className="col-md-6"><label className="form-label">Phone</label><input className="form-control" required value={f.phone} onChange={set('phone')} /></div>
                            <div className="col-md-6"><label className="form-label">Department</label><input className="form-control" value={f.dept} onChange={set('dept')} /></div>
                        </div>
                        <button className="btn btn-shbs mt-3" type="submit">Save changes</button>
                    </form>
                </div></Panel>
                <Panel title="Change password"><div className="panel-body">
                    <form onSubmit={changePassword}>
                        <div className="row g-3">
                            <div className="col-md-4"><label className="form-label">Current password</label><input type="password" className="form-control" required value={pw.current} onChange={setP('current')} /></div>
                            <div className="col-md-4"><label className="form-label">New password</label><input type="password" className="form-control" minLength="8" required value={pw.next} onChange={setP('next')} /></div>
                            <div className="col-md-4"><label className="form-label">Confirm new password</label><input type="password" className="form-control" minLength="8" required value={pw.again} onChange={setP('again')} /></div>
                        </div>
                        <button className="btn btn-navy mt-3" type="submit">Update password</button>
                    </form>
                </div></Panel>
            </div>
        </div>
    );
}
