import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../../api.js';
import { fmt } from '../../data.js';
import { Panel } from '../../components/ui.jsx';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Availability() {
    const halls = useApi('halls.php');
    const [chosen, setChosen] = useState('');
    const [month, setMonth] = useState(() => { const d = new Date(); d.setDate(1); return d; });
    const [selected, setSelected] = useState(null);

    const list = (halls.data || []).filter((h) => h.status === 'Active');
    const hallId = chosen || (list[0] ? String(list[0].id) : '');
    const y = month.getFullYear();
    const m = month.getMonth();
    const monthKey = `${y}-${String(m + 1).padStart(2, '0')}`;
    const cal = useApi(hallId ? 'bookings.php' : null, { scope: 'calendar', hall: hallId, month: monthKey });
    const bookings = cal.data || [];

    const firstWeekday = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const title = month.toLocaleString('en-GB', { month: 'long', year: 'numeric' });
    const shift = (n) => { setMonth(new Date(y, m + n, 1)); setSelected(null); };
    const slots = selected ? bookings.filter((b) => b.d === selected) : [];

    return (
        <div className="row g-4">
            <div className="col-lg-8">
                <Panel title={
                    <span className="d-flex align-items-center gap-2">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => shift(-1)} aria-label="Previous month"><i className="bi bi-chevron-left" /></button>
                        {title}
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => shift(1)} aria-label="Next month"><i className="bi bi-chevron-right" /></button>
                    </span>
                } action={
                    <select className="form-select form-select-sm w-auto" value={hallId} onChange={(e) => { setChosen(e.target.value); setSelected(null); }}>
                        {list.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
                    </select>
                }>
                    <div className="panel-body">
                        {(halls.error || cal.error) && <div className="alert alert-danger">{halls.error || cal.error}</div>}
                        <div className="cal-grid">
                            {DAYS.map((d) => <div className="cal-head" key={d}>{d}</div>)}
                            {Array.from({ length: firstWeekday }, (_, i) => <div className="cal-day empty" key={`e${i}`} />)}
                            {Array.from({ length: daysInMonth }, (_, i) => {
                                const d = i + 1;
                                const day = bookings.filter((b) => b.d === d);
                                const date = new Date(y, m, d);
                                let cls = 'cal-day';
                                if (date < today) cls += ' past';
                                if (day.some((b) => b.st === 'approved')) cls += ' booked';
                                else if (day.length) cls += ' pending';
                                if (date.getTime() === today.getTime()) cls += ' today';
                                if (d === selected) cls += ' selected';
                                return (
                                    <div className={cls} key={d} onClick={() => setSelected(d)}>
                                        <span>{d}</span>
                                        {day.length > 0 && <em>{day.length} booking{day.length > 1 ? 's' : ''}</em>}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-3 small text-muted">
                            <span className="me-3"><span className="legend-dot" style={{ background: '#D8F1EE', border: '1px solid var(--teal)' }} />BOOKED (approved)</span>
                            <span className="me-3"><span className="legend-dot" style={{ background: '#FEF0DC', border: '1px solid var(--orange)' }} />Pending request</span>
                            <span><span className="legend-dot" style={{ background: '#fff', border: '1px solid var(--border)' }} />Free</span>
                        </div>
                    </div>
                </Panel>
            </div>
            <div className="col-lg-4">
                <Panel title={selected ? `${selected} ${title}` : 'Select a day'}><div className="panel-body">
                    {!selected && <p className="text-muted mb-0">Click a date to see its time slots.</p>}
                    {selected && slots.length === 0 && <p className="text-success mb-0"><i className="bi bi-check-circle me-1" />Free all day</p>}
                    {slots.map((b, i) => (
                        <div className={`slot-item ${b.st}`} key={i}>
                            <strong>{fmt(b.s)} - {fmt(b.e)}</strong>
                            <div className="small">{b.ev}</div>
                            <span className={`st st-${b.st} mt-1`}>{b.st === 'approved' ? 'BOOKED' : 'PENDING'}</span>
                        </div>
                    ))}
                </div></Panel>
                <Link to={`/user/book-hall?hall=${hallId}`} className="btn btn-shbs w-100 mt-3"><i className="bi bi-calendar-plus me-1" />Book this hall</Link>
            </div>
        </div>
    );
}
