import { useState } from 'react';
import { post, useApi } from '../../api.js';
import { Badge, Modal, Panel, Table, Wait, useToast } from '../../components/ui.jsx';

export default function AllBookings() {
    const toast = useToast();
    const q = useApi('bookings.php', { scope: 'all' });
    const halls = useApi('halls.php');
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('');
    const [hall, setHall] = useState('');
    const [target, setTarget] = useState(null);
    const [reason, setReason] = useState('');

    const close = () => { setTarget(null); setReason(''); };
    const cancel = async () => {
        if (!reason.trim()) { toast('Please give a reason', 'error'); return; }
        try { await post('bookings.php', 'cancel', { id: target.id, reason }); toast('Booking cancelled. The user has been notified.'); close(); q.reload(); } catch (e) { toast(e.message, 'error'); }
    };

    return (
        <>
            <div className="page-actions">
                <input type="search" className="form-control search" placeholder="Search by user, event or reference..." value={query} onChange={(e) => setQuery(e.target.value)} />
                <select className="form-select w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">All statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="cancelled">Cancelled</option>
                </select>
                <select className="form-select w-auto" value={hall} onChange={(e) => setHall(e.target.value)}>
                    <option value="">All halls</option>
                    {(halls.data || []).map((h) => <option key={h.id}>{h.name}</option>)}
                </select>
            </div>
            <Wait q={q}>{(rows) => {
                const shown = rows.filter((b) => (!status || b.status === status) && (!hall || b.hall === hall) && `${b.ref} ${b.user} ${b.event}`.toLowerCase().includes(query.toLowerCase()));
                return (
                    <Panel>
                        <Table heads={['Ref', 'User', 'Hall', 'Event', 'Date', 'Time', 'Status', 'Action']}>
                            {shown.map((b) => (
                                <tr key={b.id}>
                                    <td>{b.ref}</td><td>{b.user}</td><td>{b.hall}</td><td>{b.event}</td><td>{b.date}</td><td>{b.time}</td><td><Badge s={b.status} /></td>
                                    <td>{b.status === 'approved' || b.status === 'pending'
                                        ? <button className="btn btn-sm btn-outline-danger" onClick={() => setTarget(b)}>Cancel</button>
                                        : <span className="text-muted small">-</span>}</td>
                                </tr>
                            ))}
                        </Table>
                        {shown.length === 0 && <div className="empty-state"><i className="bi bi-journal" />No bookings match your filters.</div>}
                    </Panel>
                );
            }}</Wait>

            {target && (
                <Modal title="Cancel booking" onClose={close} footer={<>
                    <button className="btn btn-light" onClick={close}>Back</button>
                    <button className="btn btn-danger" onClick={cancel}>Cancel booking</button>
                </>}>
                    <p className="fw-semibold">{target.ref} - {target.hall} on {target.date}</p>
                    <label className="form-label" htmlFor="why">Reason (the user will see it)</label>
                    <textarea id="why" className="form-control" rows="3" value={reason} onChange={(e) => setReason(e.target.value)} />
                </Modal>
            )}
        </>
    );
}
