import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { post, useApi } from '../../api.js';
import { fmt } from '../../data.js';
import { Badge, Panel, useToast } from '../../components/ui.jsx';

function todayISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function BookHall() {
    const navigate = useNavigate();
    const toast = useToast();
    const preselect = new URLSearchParams(useLocation().search).get('hall') || '';
    const halls = useApi('halls.php');
    const [f, setF] = useState({ hall: preselect, date: '', start: '', end: '', event: '', attendees: '', purpose: '' });
    const [result, setResult] = useState(null); // { level: 'ok' | 'warn' | 'error', msg }
    const [busy, setBusy] = useState(false);
    const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

    const active = (halls.data || []).filter((h) => h.status === 'Active');
    const hall = active.find((h) => String(h.id) === f.hall);
    const payload = { hallId: Number(f.hall), date: f.date, start: f.start, end: f.end, attendees: Number(f.attendees) || 0, event: f.event, purpose: f.purpose };

    // The server applies all booking rules (past dates, opening hours, capacity, clashes)
    const check = async () => {
        if (!f.hall || !f.date || !f.start || !f.end) { setResult({ level: 'error', msg: 'Please choose a hall, date, start time and end time first.' }); return; }
        try { setResult(await post('bookings.php', 'check', payload)); } catch (e) { setResult({ level: 'error', msg: e.message }); }
    };
    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            const r = await post('bookings.php', 'create', payload);
            toast(`Request ${r.ref} submitted. Status: PENDING`);
            setTimeout(() => navigate('/user/my-bookings'), 1200);
        } catch (err) {
            setResult({ level: 'error', msg: err.message });
        } finally {
            setBusy(false);
        }
    };

    const alertClass = { ok: 'alert-success', warn: 'alert-warning', error: 'alert-danger' };
    const alertIcon = { ok: 'bi-check-circle', warn: 'bi-exclamation-circle', error: 'bi-x-circle' };

    return (
        <div className="row g-4">
            <div className="col-lg-8"><Panel title="Booking request form"><div className="panel-body">
                {halls.error && <div className="alert alert-danger">{halls.error}</div>}
                <form onSubmit={submit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label" htmlFor="hall">Hall</label>
                            <select id="hall" className="form-select" required value={f.hall} onChange={set('hall')}>
                                <option value="">Choose a hall...</option>
                                {active.map((h) => <option key={h.id} value={h.id}>{h.name} (capacity {h.cap})</option>)}
                            </select>
                        </div>
                        <div className="col-md-6"><label className="form-label" htmlFor="date">Date</label><input id="date" type="date" className="form-control" min={todayISO()} required value={f.date} onChange={set('date')} /></div>
                        <div className="col-md-6"><label className="form-label" htmlFor="start">Start time</label><input id="start" type="time" className="form-control" required value={f.start} onChange={set('start')} /></div>
                        <div className="col-md-6"><label className="form-label" htmlFor="end">End time</label><input id="end" type="time" className="form-control" required value={f.end} onChange={set('end')} /></div>
                        <div className="col-md-8"><label className="form-label" htmlFor="event">Event name</label><input id="event" className="form-control" placeholder="e.g. Class Presentation" required value={f.event} onChange={set('event')} /></div>
                        <div className="col-12"><label className="form-label" htmlFor="purpose">Purpose</label><textarea id="purpose" className="form-control" rows="3" placeholder="Describe the event" required value={f.purpose} onChange={set('purpose')} /></div>
                    </div>
                    {result && <div className="mt-3"><div className={`alert ${alertClass[result.level]} mb-0`}><i className={`bi ${alertIcon[result.level]} me-2`} />{result.msg}</div></div>}
                    <div className="d-flex flex-wrap gap-2 mt-3">
                        <button type="button" className="btn btn-outline-secondary" onClick={check}><i className="bi bi-search me-1" />Check availability</button>
                        <button type="submit" className="btn btn-shbs" disabled={busy}><i className="bi bi-send me-1" />{busy ? 'Submitting...' : 'Submit request'}</button>
                        <button type="button" className="btn btn-light" onClick={() => navigate('/user/halls')}>Cancel</button>
                    </div>
                </form>
            </div></Panel></div>
            <div className="col-lg-4">
                <Panel title="Request summary"><div className="panel-body">
                    <div className="summary-row"><span>Hall</span><span>{hall ? hall.name : '-'}</span></div>
                    <div className="summary-row"><span>Date</span><span>{f.date || '-'}</span></div>
                    <div className="summary-row"><span>Time</span><span>{f.start && f.end ? `${fmt(f.start)} - ${fmt(f.end)}` : '-'}</span></div>
                    <div className="summary-row"><span>Capacity</span><span>{hall ? `${hall.cap} people` : '-'}</span></div>
                    <div className="summary-row"><span>Status after submit</span><span><Badge s="pending" /></span></div>
                </div></Panel>
            </div>
        </div>
    );
}
