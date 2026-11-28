import { Link } from 'react-router-dom';
import { useApi } from '../../api.js';
import { NOTIF_STYLE } from '../../data.js';
import { useAuth } from '../../context.jsx';
import { Badge, Panel, Stat, Table, Wait } from '../../components/ui.jsx';

export default function Dashboard() {
    const { user } = useAuth();
    const bookings = useApi('bookings.php', { scope: 'mine' });
    const notifs = useApi('notifications.php');

    return (
        <>
            <div className="panel mb-4" style={{ background: 'linear-gradient(135deg,var(--navy),var(--teal-dark))', color: '#fff', border: 0 }}>
                <div className="panel-body d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <div><h4 className="fw-bold mb-1">Welcome back, {user.name.split(' ')[0]}</h4><p className="mb-0" style={{ color: '#D6E2F0' }}>Here is what is happening with your hall bookings.</p></div>
                </div>
            </div>
            <Wait q={bookings}>{(rows) => {
                const count = (...s) => rows.filter((b) => s.includes(b.status)).length;
                return (
                    <>
                        <div className="row g-3 mb-4">
                            <Stat icon="journal-text" color="ic-navy" num={rows.length} label="Total bookings" />
                            <Stat icon="hourglass-split" color="ic-orange" num={count('pending')} label="Pending requests" />
                            <Stat icon="check-circle" color="ic-green" num={count('approved')} label="Approved bookings" />
                            <Stat icon="x-circle" color="ic-red" num={count('rejected', 'cancelled')} label="Rejected / cancelled" />
                        </div>
                        <div className="row g-4">
                            <div className="col-xl-8">
                                <Panel title="Recent bookings" action={<Link to="/user/my-bookings" className="btn btn-sm btn-outline-secondary">View all</Link>}>
                                    <Table heads={['Ref', 'Hall', 'Event', 'Date', 'Time', 'Status']}>
                                        {rows.slice(0, 4).map((b) => (
                                            <tr key={b.id}><td>{b.ref}</td><td>{b.hall}</td><td>{b.event}</td><td>{b.date}</td><td>{b.time}</td><td><Badge s={b.status} /></td></tr>
                                        ))}
                                    </Table>
                                    {rows.length === 0 && <div className="empty-state"><i className="bi bi-journal" />No bookings yet. Book your first hall.</div>}
                                </Panel>
                            </div>
                            <div className="col-xl-4">
                                <Panel title="Latest notifications" action={<Link to="/user/notifications" className="btn btn-sm btn-outline-secondary">View all</Link>}>
                                    {(notifs.data ? notifs.data.items : []).slice(0, 3).map((n) => (
                                        <div className={`notif ${n.unread ? 'unread' : ''}`} key={n.id}>
                                            <div className={`notif-icon ${NOTIF_STYLE[n.kind] || 'ic-navy'}`}><i className={`bi bi-${n.icon}`} /></div>
                                            <div className="notif-body"><strong>{n.title}</strong><p>{n.msg}</p></div>
                                            <span className="notif-time">{n.time}</span>
                                        </div>
                                    ))}
                                    {notifs.data && notifs.data.items.length === 0 && <div className="empty-state">No notifications yet.</div>}
                                </Panel>
                            </div>
                        </div>
                    </>
                );
            }}</Wait>
        </>
    );
}
