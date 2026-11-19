import { useState } from 'react';
import { post, useApi } from '../../api.js';
import { Modal, Panel, Table, Wait, useToast } from '../../components/ui.jsx';

const BLANK = { name: '', loc: '', cap: '', fac: '', status: 'Active', desc: '' };

export default function ManageHalls() {
    const toast = useToast();
    const q = useApi('halls.php');
    const [query, setQuery] = useState('');
    const [form, setForm] = useState(null); // null = closed, otherwise the hall being added / edited
    const [photo, setPhoto] = useState(null);
    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    const edit = (h) => { setPhoto(null); setForm({ ...h, fac: h.fac.join(', ') }); };
    // Sent as FormData (not JSON) because it can include a photo file
    const save = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        ['name', 'loc', 'cap', 'fac', 'status', 'desc'].forEach((k) => fd.append(k, form[k] ?? ''));
        if (form.id) fd.append('id', form.id);
        if (photo) fd.append('photo', photo);
        try {
            await post('halls.php', form.id ? 'update' : 'create', fd);
            toast('Hall saved');
            setForm(null);
            q.reload();
        } catch (err) {
            toast(err.message, 'error');
        }
    };
    const remove = async (h) => {
        if (!window.confirm(`Delete ${h.name}?`)) return;
        try { await post('halls.php', 'delete', { id: h.id }); toast('Hall deleted'); q.reload(); } catch (err) { toast(err.message, 'error'); }
    };

    return (
        <>
            <div className="page-actions">
                <input type="search" className="form-control search" placeholder="Search halls..." value={query} onChange={(e) => setQuery(e.target.value)} />
                <button className="btn btn-shbs ms-auto" onClick={() => { setPhoto(null); setForm(BLANK); }}><i className="bi bi-plus-lg me-1" />Add hall</button>
            </div>
            <Wait q={q}>{(halls) => (
                <Panel>
                    <Table heads={['Hall', 'Location', 'Capacity', 'Facilities', 'Status', 'Actions']}>
                        {halls.filter((h) => `${h.name} ${h.loc}`.toLowerCase().includes(query.toLowerCase())).map((h) => (
                            <tr key={h.id}>
                                <td className="fw-semibold">{h.name}</td><td>{h.loc}</td><td>{h.cap}</td><td>{h.fac.join(', ')}</td>
                                <td><span className={`st ${h.status === 'Active' ? 'st-approved' : h.status === 'Maintenance' ? 'st-pending' : 'st-cancelled'}`}>{h.status}</span></td>
                                <td className="text-nowrap">
                                    <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => edit(h)} aria-label="Edit"><i className="bi bi-pencil" /></button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => remove(h)} aria-label="Delete"><i className="bi bi-trash" /></button>
                                </td>
                            </tr>
                        ))}
                    </Table>
                </Panel>
            )}</Wait>

            {form && (
                <Modal large title={form.id ? 'Edit hall' : 'Add hall'} onClose={() => setForm(null)}>
                    <form onSubmit={save}>
                        <div className="row g-3">
                            <div className="col-md-6"><label className="form-label">Hall name</label><input className="form-control" required value={form.name} onChange={set('name')} /></div>
                            <div className="col-md-6"><label className="form-label">Location</label><input className="form-control" required value={form.loc} onChange={set('loc')} /></div>
                            <div className="col-md-4"><label className="form-label">Capacity</label><input type="number" min="1" className="form-control" required value={form.cap} onChange={set('cap')} /></div>
                            <div className="col-md-8"><label className="form-label">Facilities (comma separated)</label><input className="form-control" placeholder="Projector, Sound system, WiFi" value={form.fac} onChange={set('fac')} /></div>
                            <div className="col-md-6"><label className="form-label">Status</label>
                                <select className="form-select" value={form.status} onChange={set('status')}><option>Active</option><option>Maintenance</option><option>Inactive</option></select></div>
                            <div className="col-md-6"><label className="form-label">Hall photo (JPG, PNG or WEBP, max 2 MB)</label>
                                <input type="file" className="form-control" accept="image/jpeg,image/png,image/webp" onChange={(e) => setPhoto(e.target.files[0] || null)} /></div>
                            <div className="col-12"><label className="form-label">Description</label><textarea className="form-control" rows="2" value={form.desc} onChange={set('desc')} /></div>
                        </div>
                        <div className="text-end mt-3">
                            <button type="button" className="btn btn-light me-2" onClick={() => setForm(null)}>Cancel</button>
                            <button className="btn btn-shbs" type="submit">Save hall</button>
                        </div>
                    </form>
                </Modal>
            )}
        </>
    );
}
