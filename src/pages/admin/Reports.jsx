import { useState } from 'react';
import { useApi } from '../../api.js';
import { BarList, ColumnChart, Modal, Panel, Stat, Wait } from '../../components/ui.jsx';

export default function Reports() {
    const [range, setRange] = useState({ from: '', to: '' });
    const [applied, setApplied] = useState({});
    const q = useApi('stats.php', { scope: 'admin', ...applied });
    
    // Fetch the feedback
    const feedbackQ = useApi('feedback.php');

    // State to hold the feedback we want to read in the modal
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    const apply = () => setApplied(Object.fromEntries(Object.entries(range).filter(([, v]) => v)));

    return (
        <>
            <div className="page-actions no-print">
                <label className="form-label mb-0">From</label><input type="date" className="form-control w-auto" value={range.from} onChange={(e) => setRange({ ...range, from: e.target.value })} />
                <label className="form-label mb-0">To</label><input type="date" className="form-control w-auto" value={range.to} onChange={(e) => setRange({ ...range, to: e.target.value })} />
                <button className="btn btn-navy" onClick={apply}>Apply</button>
            </div>

            <Wait q={q}>{(s) => (
                <>
                    {/* STAT CARDS */}
                    <div className="row g-3 mb-4">
                        <div className="col-12 col-md-6 col-xl-3">
                            <div className="d-flex align-items-center bg-white border rounded-4 p-3 h-100 shadow-sm">
                                <div className="stat-icon ic-navy me-3"><i className="bi bi-journal-text"></i></div>
                                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy)', lineHeight: 1.2 }}>{s.total}</div>
                                    <div className="text-muted small text-nowrap">Total bookings</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-3">
                            <div className="d-flex align-items-center bg-white border rounded-4 p-3 h-100 shadow-sm">
                                <div className="stat-icon ic-green me-3"><i className="bi bi-check-circle"></i></div>
                                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy)', lineHeight: 1.2 }}>{s.approvalRate}%</div>
                                    <div className="text-muted small text-nowrap">Approval rate</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-3">
                            <div className="d-flex align-items-center bg-white border rounded-4 p-3 h-100 shadow-sm">
                                <div className="stat-icon ic-teal me-3"><i className="bi bi-building"></i></div>
                                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy)', lineHeight: 1.2, overflowWrap: 'break-word' }}>{s.mostBooked}</div>
                                    <div className="text-muted small text-nowrap">Most booked hall</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-3">
                            <div className="d-flex align-items-center bg-white border rounded-4 p-3 h-100 shadow-sm">
                                <div className="stat-icon ic-orange me-3"><i className="bi bi-calendar-event"></i></div>
                                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', lineHeight: 1.2 }}>{s.busiestMonth}</div>
                                    <div className="text-muted small text-nowrap">Busiest month</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CHARTS */}
                    <div className="row g-4 mb-4">
                        <div className="col-xl-6"><Panel title="Hall usage (approved bookings per hall)"><div className="panel-body">
                            {s.hallUsage.length ? <BarList data={s.hallUsage} /> : <p className="text-muted mb-0">No approved bookings in this period.</p>}
                        </div></Panel></div>
                        <div className="col-xl-6"><Panel title="Bookings by status"><div className="panel-body"><BarList data={s.statusCounts} max={Math.max(s.total, 1)} /></div></Panel></div>
                        <div className="col-12"><Panel title="Monthly booking statistics (last 6 months)"><div className="panel-body"><ColumnChart data={s.monthly} /></div></Panel></div>
                    </div>

                    {/* FEEDBACK TABLE */}
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
                                                                <th>Action</th> {/* THIS WAS MISSING */}
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
                                                                    <td className="text-truncate" style={{ maxWidth: '250px' }}>
                                                                        {fb.message}
                                                                    </td>
                                                                    <td className="text-muted small">{fb.date}</td>
                                                                    <td>
                                                                        {/* THIS BUTTON WAS MISSING */}
                                                                        <button 
                                                                            className="btn btn-sm btn-outline-primary"
                                                                            onClick={() => setSelectedFeedback(fb)}
                                                                        >
                                                                            <i className="bi bi-eye me-1" /> Read
                                                                        </button>
                                                                    </td>
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

            {/* MODAL TO READ FULL FEEDBACK */}
            {selectedFeedback && (
                <Modal 
                    title="Student Feedback" 
                    onClose={() => setSelectedFeedback(null)}
                    footer={<button className="btn btn-secondary" onClick={() => setSelectedFeedback(null)}>Close</button>}
                >
                    <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                        <div>
                            <strong>{selectedFeedback.user}</strong> <br />
                            <small className="text-muted">ID: {selectedFeedback.college_id}</small>
                        </div>
                        <div className="text-end">
                            <span className="text-warning fs-5">
                                {selectedFeedback.rating} <i className="bi bi-star-fill" />
                            </span> <br />
                            <small className="text-muted">{selectedFeedback.date}</small>
                        </div>
                    </div>
                    <p style={{ whiteSpace: 'pre-wrap', fontSize: '1.05rem', lineHeight: '1.6' }}>
                        {selectedFeedback.message}
                    </p>
                </Modal>
            )}
        </>
    );
}