import { useEffect, useState } from 'react';
import { api, post } from '../../api.js';
import { Panel, Loading, useToast } from '../../components/ui.jsx';

export default function Settings() {
    const toast = useToast();
    const [f, setF] = useState(null);
    useEffect(() => { api('settings.php').then(setF).catch((e) => toast(e.message, 'error')); }, []); // eslint-disable-line react-hooks/exhaustive-deps
    if (!f) return <Loading />;

    const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
    const save = async (e) => {
        e.preventDefault();
        try { await post('settings.php', 'save', f); toast('Settings saved'); } catch (err) { toast(err.message, 'error'); }
    };

    return (
        <form onSubmit={save}>
            <div className="row g-4">
                <div className="col-lg-6"><Panel title="Booking rules"><div className="panel-body"><div className="row g-3">
                    <div className="col-6"><label className="form-label">Opening time</label><input type="time" className="form-control" required value={f.opening_time} onChange={set('opening_time')} /></div>
                    <div className="col-6"><label className="form-label">Closing time</label><input type="time" className="form-control" required value={f.closing_time} onChange={set('closing_time')} /></div>
                    <div className="col-6"><label className="form-label">Max days in advance</label><input type="number" min="1" className="form-control" required value={f.max_advance_days} onChange={set('max_advance_days')} /></div>
                    <div className="col-6"><label className="form-label">Cancellation window (hours)</label><input type="number" min="0" className="form-control" required value={f.cancel_hours} onChange={set('cancel_hours')} /></div>
                </div></div></Panel></div>
                <div className="col-lg-6"><Panel title="Contact information"><div className="panel-body"><div className="row g-3">
                    <div className="col-12"><label className="form-label">Support email</label><input type="email" className="form-control" required value={f.contact_email} onChange={set('contact_email')} /></div>
                    <div className="col-12"><label className="form-label">Support phone</label><input className="form-control" value={f.contact_phone} onChange={set('contact_phone')} /></div>
                    <div className="col-12"><label className="form-label">Address</label><input className="form-control" value={f.contact_address} onChange={set('contact_address')} /></div>
                </div></div></Panel></div>
            </div>
            <button className="btn btn-shbs mt-4" type="submit"><i className="bi bi-save me-1" />Save settings</button>
        </form>
    );
}
