import { useState } from 'react';
import { post, useApi } from '../../api.js';
import { Modal, Panel, Table, Wait, useToast } from '../../components/ui.jsx';

export default function BookingRequests() {
    const toast = useToast();
    const q = useApi('bookings.php', { scope: 'pending' });
    const [target, setTarget] = useState(null); // request being rejected
    const [remarks, setRemarks] = useState('');
    const [invalid, setInvalid] = useState(false);

    // The server re-checks for a clash when approving; if it finds one it sends back an error message.
    const approve = async (r) => {
        try { await post('bookings.php', 'approve', { id: r.id }); toast(`${r.ref} approved. The user has been notified.`); } catch (e) { toast(e.message, 'error'); }
        q.reload();
    };
    const close = () => { setTarget(null); setRemarks(''); setInvalid(false); };
    const reject = async () => {
        if (!remarks.trim()) { setInvalid(true); return; }
        try { await post('bookings.php', 'reject', { id: target.id, remarks }); toast(`${target.ref} rejected. The user has been notified.`); close(); } catch (e) { toast(e.message, 'error'); }
        q.reload();
    };

    return (
        <>
            <div className="alert alert-info small"><i className="bi bi-info-circle me-1" />When you approve, the system re-checks for a clash with other approved bookings.</div>
            <Wait q={q}>{(rows) => (
                <Panel title={<>Pending requests <span className="st st-pending ms-2">{rows.length} pending</span></>}>
                    <Table heads={['Ref', 'Requested by', 'Hall', 'Event', 'Date and time', 'Submitted', 'Action']}>
                        {rows.map((r) => (
                            <tr key={r.id}>
                                <td>{r.ref}</td>
                                <td>{r.user}<br /><small className="text-muted">{r.role}</small></td>
                                <td>{r.hall}</td>
                                <td>{r.event}<br /><small className="text-muted">{r.people} attendees</small></td>
                                <td>{r.date}<br /><small className="text-muted">{r.time}</small></td>
                                <td>{r.sent}</td>
                                <td className="text-nowrap">
                                    <button className="btn btn-sm btn-shbs me-1" onClick={() => approve(r)}>Approve</button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => setTarget(r)}>Reject</button>
                                </td>
                            </tr>
                        ))}
                    </Table>
                    {rows.length === 0 && <div className="empty-state"><i className="bi bi-inbox" />No pending requests. You are all caught up.</div>}
                </Panel>
            )}</Wait>

            {target && (
                <Modal title="Reject request" onClose={close} footer={<>
                    <button className="btn btn-light" onClick={close}>Back</button>
                    <button className="btn btn-danger" onClick={reject}>Reject request</button>
                </>}>
                    <p className="fw-semibold">{target.ref} - {target.event}</p>
                    <label className="form-label" htmlFor="remarks">Remarks for the user</label>
                    <textarea id="remarks" className={`form-control ${invalid ? 'is-invalid' : ''}`} rows="3" placeholder="Explain why the request is rejected" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                    <div className="invalid-feedback">Remarks are required.</div>
                </Modal>
            )}
        </>
    );
}
