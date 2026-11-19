import { Link } from 'react-router-dom';
import { useApi } from '../../api.js';
import { Badge, BarList, ColumnChart, Panel, Stat, Table, Wait } from '../../components/ui.jsx';

export default function Dashboard() {
    const stats = useApi('stats.php', { scope: 'admin' });
    const pending = useApi('bookings.php', { scope: 'pending' });

    return (
        <Wait q={stats}>{(s) => (
            <>
                <div className="row g-3 mb-4">
                    <Stat icon="building" color="ic-navy" num={s.halls} label="Total halls" />
                    <Stat icon="people" color="ic-teal" num={s.users} label="Registered users" />
                    <Stat icon="journal-text" color="ic-navy" num={s.total} label="Total bookings" />
                    <Stat icon="hourglass-split" color="ic-orange" num={s.pending} label="Pending requests" />
                    <Stat icon="check-circle" color="ic-green" num={s.approved} label="Approved bookings" />
                    <Stat icon="x-circle" color="ic-red" num={s.rejectedCancelled} label="Rejected / cancelled" />
                </div>
                <div className="row g-4 mb-4">
                    <div className="col-xl-7"><Panel title="Monthly bookings (last 6 months)"><div className="panel-body"><ColumnChart data={s.monthly} /></div></Panel></div>
                    <div className="col-xl-5"><Panel title="Most booked halls">
                        <div className="panel-body">
                            {s.hallUsage.length ? <BarList data={s.hallUsage} /> : <p className="text-muted mb-0">No approved bookings yet.</p>}
                        </div>
                    </Panel></div>
                </div>
                <Panel title="Pending requests" action={<Link to="/admin/booking-requests" className="btn btn-sm btn-shbs">Review requests</Link>}>
                    <Table heads={['Ref', 'Requested by', 'Hall', 'Date', 'Status']}>
                        {(pending.data || []).slice(0, 5).map((r) => (
                            <tr key={r.id}><td>{r.ref}</td><td>{r.user}</td><td>{r.hall}</td><td>{r.date}</td><td><Badge s="pending" /></td></tr>
                        ))}
                    </Table>
                    {pending.data && pending.data.length === 0 && <div className="empty-state"><i className="bi bi-inbox" />No pending requests.</div>}
                </Panel>
            </>
        )}</Wait>
    );
}
