import { Link, useLocation } from 'react-router-dom';
import { useApi } from '../../api.js';
import { Badge, HallPhoto, Panel, Table, Wait } from '../../components/ui.jsx';

export default function HallDetails() {
    const id = new URLSearchParams(useLocation().search).get('id');
    const halls = useApi('halls.php');
    const upcoming = useApi(id ? 'bookings.php' : null, { scope: 'hall', hall: id });

    return (
        <>
            <Link to="/user/halls" className="btn btn-sm btn-outline-secondary mb-3"><i className="bi bi-arrow-left me-1" />Back to halls</Link>
            <Wait q={halls}>{(list) => {
                const h = list.find((x) => String(x.id) === id);
                if (!h) return <div className="empty-state"><i className="bi bi-building" />Hall not found. Choose one from the Halls page.</div>;
                const available = h.status === 'Active';
                return (
                    <div className="row g-4">
                        <div className="col-lg-8">
                            <div className="panel overflow-hidden mb-4">
                                <HallPhoto hall={h} height={300} />
                                <div className="panel-body">
                                    <div className="d-flex justify-content-between flex-wrap gap-2 mb-2">
                                        <h3 className="fw-bold mb-0" style={{ color: 'var(--navy)' }}>{h.name}</h3>
                                        <span className={`badge align-self-start ${available ? 'st-approved' : 'st-pending'}`}>{available ? 'Available' : h.status}</span>
                                    </div>
                                    <p className="text-muted">{h.desc}</p>
                                    <div className="mb-3">{h.fac.map((f) => <span key={f} className="badge badge-facility me-1">{f}</span>)}</div>
                                    <h6 className="fw-bold" style={{ color: 'var(--navy)' }}>Booking rules</h6>
                                    <ul className="text-muted mb-0">
                                        <li>Requests must be approved by the administrator.</li>
                                        <li>Overlapping approved bookings are not allowed.</li>
                                        <li>Expected attendees must not exceed the hall capacity.</li>
                                        <li>Cancellation is allowed up to the time limit set by the administrator.</li>
                                    </ul>
                                </div>
                            </div>
                            <Panel title="Upcoming bookings for this hall">
                                <Table heads={['Date', 'Time', 'Event', 'Status']}>
                                    {(upcoming.data || []).map((b, i) => (
                                        <tr key={i}><td>{b.date}</td><td>{b.time}</td><td>{b.event}</td>
                                            <td>{b.status === 'approved' ? <span className="st st-approved">BOOKED</span> : <Badge s="pending" />}</td></tr>
                                    ))}
                                </Table>
                                {upcoming.data && upcoming.data.length === 0 && <div className="empty-state">No upcoming bookings. The hall is free.</div>}
                            </Panel>
                        </div>
                        <div className="col-lg-4">
                            <Panel title="Hall information"><div className="panel-body">
                                <ul className="info-list">
                                    <li><i className="bi bi-people" /><div>{h.cap}<small>Capacity</small></div></li>
                                    <li><i className="bi bi-geo-alt" /><div>{h.loc}<small>Location</small></div></li>
                                </ul>
                                <Link to={`/user/book-hall?hall=${h.id}`} className={`btn btn-shbs w-100 mt-3 ${available ? '' : 'disabled'}`}>Book this hall</Link>
                                <Link to="/user/availability" className="btn btn-outline-secondary w-100 mt-2">View availability</Link>
                            </div></Panel>
                        </div>
                    </div>
                );
            }}</Wait>
        </>
    );
}
