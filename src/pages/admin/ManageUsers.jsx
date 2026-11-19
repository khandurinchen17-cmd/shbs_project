import { useState } from 'react';
import { post, useApi } from '../../api.js';
import { Modal, Panel, Table, Wait, useToast } from '../../components/ui.jsx';

const BLANK = { cid: '', name: '', email: '', role: 'Student', password: '' };

export default function ManageUsers() {
    const toast = useToast();
    const q = useApi('users.php');
    const [query, setQuery] = useState('');
    const [role, setRole] = useState('');
    const [form, setForm] = useState(null);
    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    const run = async (action, body, okMsg) => {
        try { await post('users.php', action, body); toast(okMsg); setForm(null); q.reload(); } catch (err) { toast(err.message, 'error'); }
    };
    const save = (e) => { e.preventDefault(); run(form.id ? 'update' : 'create', form, 'User saved'); };
    const remove = (u) => { if (window.confirm(`Delete ${u.name}?`)) run('delete', { id: u.id }, 'User deleted'); };

    return (
        <>
            <div className="page-actions">
                <input type="search" className="form-control search" placeholder="Search by name, ID or email..." value={query} onChange={(e) => setQuery(e.target.value)} />
                <select className="form-select w-auto" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="">All roles</option><option>Student</option><option>Faculty</option><option>Administrator</option>
                </select>
                <button className="btn btn-shbs ms-auto" onClick={() => setForm(BLANK)}><i className="bi bi-plus-lg me-1" />Add user</button>
            </div>
            <Wait q={q}>{(users) => (
                <Panel>
                    <Table heads={['ID', 'Name', 'Email', 'Role', 'Status', 'Actions']}>
                        {users.filter((u) => (!role || u.role === role) && `${u.name} ${u.cid} ${u.email}`.toLowerCase().includes(query.toLowerCase())).map((u) => (
                            <tr key={u.id}>
                                <td>{u.cid}</td><td className="fw-semibold">{u.name}</td><td>{u.email}</td><td>{u.role}</td>
                                <td><span className={`st ${u.active ? 'st-approved' : 'st-cancelled'}`}>{u.active ? 'Active' : 'Inactive'}</span></td>
                                <td className="text-nowrap">
                                    <button className="btn btn-sm btn-outline-secondary me-1" aria-label="Edit" onClick={() => setForm({ ...u, password: '' })}><i className="bi bi-pencil" /></button>
                                    <button className="btn btn-sm btn-outline-secondary me-1" title={u.active ? 'Deactivate' : 'Activate'} onClick={() => run('toggle', { id: u.id }, u.active ? 'User deactivated' : 'User activated')}><i className="bi bi-person-check" /></button>
                                    <button className="btn btn-sm btn-outline-danger" aria-label="Delete" onClick={() => remove(u)}><i className="bi bi-trash" /></button>
                                </td>
                            </tr>
                        ))}
                    </Table>
                </Panel>
            )}</Wait>

            {form && (
                <Modal title={form.id ? 'Edit user' : 'Add user'} onClose={() => setForm(null)}>
                    <form onSubmit={save}>
                        <div className="row g-3">
                            <div className="col-md-6"><label className="form-label">College ID</label><input className="form-control" required value={form.cid} onChange={set('cid')} /></div>
                            <div className="col-md-6"><label className="form-label">Role</label>
                                <select className="form-select" value={form.role} onChange={set('role')}><option>Student</option><option>Faculty</option><option>Administrator</option></select></div>
                            <div className="col-12"><label className="form-label">Full name</label><input className="form-control" required value={form.name} onChange={set('name')} /></div>
                            <div className="col-12"><label className="form-label">Email</label><input type="email" className="form-control" required value={form.email} onChange={set('email')} /></div>
                            <div className="col-12"><label className="form-label">{form.id ? 'New password (leave empty to keep current)' : 'Password'}</label>
                                <input type="password" className="form-control" minLength="8" required={!form.id} value={form.password} onChange={set('password')} /></div>
                        </div>
                        <div className="text-end mt-3">
                            <button type="button" className="btn btn-light me-2" onClick={() => setForm(null)}>Cancel</button>
                            <button className="btn btn-shbs" type="submit">Save user</button>
                        </div>
                    </form>
                </Modal>
            )}
        </>
    );
}
