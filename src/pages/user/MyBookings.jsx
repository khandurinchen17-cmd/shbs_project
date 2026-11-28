import { useState } from 'react';
import { Link } from 'react-router-dom';
import { post, useApi } from '../../api.js';
import { Badge, Modal, Panel, Table, Wait, useToast } from '../../components/ui.jsx';

export default function MyBookings() {
    const toast = useToast();
    const q = useApi('bookings.php', { scope: 'mine' });
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('');
    const [target, setTarget] = useState(null); // the booking being cancelled
    const [reason, setReason] = useState('');
    const [invalid, setInvalid] = useState(false);

    const close = () => { setTarget(null); setReason(''); setInvalid(false); };
    const confirmCancel = async () => {
        if (!reason.trim()) { setInvalid(true); return; }
        try {
            await post('bookings.php', 'cancel', { id: target.id, reason });
            toast('Booking cancelled');
            close();
            q.reload();
        } catch (e) {
            toast(e.message, 'error');
        }
    };

    return (
        <>
            <div className="page-actions">
                <input type="search" className="form-control search" placeholder="Search by hall, event or reference..." value={query} onChange={(e) => setQuery(e.target.value)} />
                <select className="form-select w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">All statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="cancelled">Cancelled</option>
                </select>
            </div>
            <Wait q={q}>{(rows) => {
                const shown = rows.filter((b) => (!status || b.status === status) && `${b.ref} ${b.hall} ${b.event}`.toLowerCase().includes(query.toLowerCase()));
                return (
                    <Panel>
                        <Table heads={['Ref', 'Hall', 'Event', 'Date', 'Time', 'Status', 'Action']}>
                            {shown.map((b) => (
                                <tr key={b.id}>
                                    <td>{b.ref}</td><td>{b.hall}</td><td>{b.event}</td><td>{b.date}</td><td>{b.time}</td>
                                    <td><Badge s={b.status} />{b.status === 'rejected' && b.remarks && <div className="small text-muted mt-1">{b.remarks}</div>}</td>
                                    <td>{b.status === 'pending' || b.status === 'approved'
                                        ? <button className="btn btn-sm btn-outline-danger" onClick={() => setTarget(b)}>Cancel</button>
                                        : <span className="text-muted small">-</span>}</td>
                                </tr>
                            ))}
                        </Table>
                        {shown.length === 0 && <div className="empty-state"><i className="bi bi-journal" />No bookings found.</div>}
                    </Panel>
                );
            }}</Wait>

            {target && (
                <Modal title="Cancel booking" onClose={close} footer={<>
                    <button className="btn btn-light" onClick={close}>Keep booking</button>
                    <button className="btn btn-danger" onClick={confirmCancel}>Cancel booking</button>
                </>}>
                    <p className="fw-semibold mb-1">{target.ref} - {target.hall} on {target.date}</p>
                    <div className="alert alert-warning small"><i className="bi bi-exclamation-triangle me-1" />Cancellation is only allowed before the time limit set by the administrator.</div>
                    <label className="form-label" htmlFor="reason">Reason for cancellation</label>
                    <textarea id="reason" className={`form-control ${invalid ? 'is-invalid' : ''}`} rows="3" placeholder="Enter your reason here" value={reason} onChange={(e) => setReason(e.target.value)} />
                    <div className="invalid-feedback">Please give a reason.</div>
                </Modal>
            )}
        </>
    );
}
