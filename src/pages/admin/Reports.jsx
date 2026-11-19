import { useState } from 'react';
import { useApi } from '../../api.js';
import { BarList, ColumnChart, Panel, Stat, Wait } from '../../components/ui.jsx';

export default function Reports() {
    const [range, setRange] = useState({ from: '', to: '' });
    const [applied, setApplied] = useState({});
    const q = useApi('stats.php', { scope: 'admin', ...applied });
    
    // NEW: Fetch the feedback from your updated feedback.php
    const feedbackQ = useApi('feedback.php');

    const apply = () => setApplied(Object.fromEntries(Object.entries(range).filter(([, v]) => v)));

    return (
        <>
            <div className="page-actions no-print">
                <label className="form-label mb-0">From</label><input type="date" className="form-control w-auto" value={range.from} onChange={(e) => setRange({ ...range, from: e.target.value })} />
                <label className="form-label mb-0">To</label><input type="date" className="form-control w-auto" value={range.to} onChange={(e) => setRange({ ...range, to: e.target.value })} />
                <button className="btn btn-navy" onClick={apply}>Apply</button>
                <button className="btn btn-shbs ms-auto" onClick={() => window.print()}><i className="bi bi-printer me-1" />Print report</button>
            </div>

            <Wait q={q}>{(s) => (
                <>
                    <div className="row g-3 mb-4">
                        <Stat icon="journal-text" color="ic-navy" num={s.total} label="Total bookings" />
                        <Stat icon="check-circle" color="ic-green" num={`${s.approvalRate}%`} label="Approval rate" />
                        <Stat icon="building" color="ic-teal" num={s.mostBooked} label="Most booked hall" />
                        <Stat icon="calendar-event" color="ic-orange" num={s.busiestMonth} label="Busiest month (last 6)" />
                    </div>
                    <div className="row g-4 mb-4">
                        <div className="col-xl-6"><Panel title="Hall usage (approved bookings per hall)"><div className="panel-body">
                            {s.hallUsage.length ? <BarList data={s.hallUsage} /> : <p className="text-muted mb-0">No approved bookings in this period.</p>}
                        </div></Panel></div>
                        <div className="col-xl-6"><Panel title="Bookings by status"><div className="panel-body"><BarList data={s.statusCounts} max={Math.max(s.total, 1)} /></div></Panel></div>
                        <div className="col-12"><Panel title="Monthly booking statistics (last 6 months)"><div className="panel-body"><ColumnChart data={s.monthly} /></div></Panel></div>
                    </div>

                    {/* ========================================== */}
                    {/* NEW: STUDENT FEEDBACK TABLE */}
                    {/* ========================================== */}
                    <div className="row">
                        <div className="col-12">
                            <Wait q={feedbackQ}>
                                {(feedbacks) => (
                                    <Panel title="Student Feedback">
                                        <div className="panel-body">
                                            {(!feedbacks || feedbacks.length === 0) ? (
                                                <p className="text-muted mb-0">No feedback received yet.</p>
                                            ) : (
                                                <div className="table-responsive">
                                                    <table className="table table-hover align-middle mb-0">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th>Student</th>
                                                                <th>College ID</th>
                                                                <th>Rating</th>
                                                                <th>Message</th>
                                                                <th>Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {feedbacks.map((fb) => (
                                                                <tr key={fb.id}>
                                                                    <td className="fw-semibold">{fb.user}</td>
                                                                    <td>{fb.college_id}</td>
                                                                    <td>
                                                                        <span className="text-warning">
                                                                            {fb.rating} <i className="bi bi-star-fill" />
                                                                        </span>
                                                                    </td>
                                                                    <td>{fb.message}</td>
                                                                    <td className="text-muted small">{fb.date}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    </Panel>
                                )}
                            </Wait>
                        </div>
                    </div>
                </>
            )}</Wait>
        </>
    );
}