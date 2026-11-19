// Small reusable pieces used by many pages.
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LABEL } from '../data.js';
import { UPLOAD_URL } from '../api.js';

/* ---------- Toast message (bottom-right popup) ---------- */
const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
    const [toast, setToast] = useState(null);
    const show = useCallback((msg, type = 'success') => setToast({ msg, type, id: Date.now() }), []);
    useEffect(() => {
        if (!toast) return undefined;
        const id = setTimeout(() => setToast(null), 3200);
        return () => clearTimeout(id);
    }, [toast]);
    return (
        <ToastContext.Provider value={show}>
            {children}
            {toast && (
                <div className={`toast-shbs ${toast.type}`} key={toast.id}>
                    <i className={`bi me-2 ${toast.type === 'error' ? 'bi-exclamation-triangle' : 'bi-check-circle'}`} />
                    {toast.msg}
                </div>
            )}
        </ToastContext.Provider>
    );
}

/* ---------- Status badge: pending / approved / rejected / cancelled ---------- */
export const Badge = ({ s, text }) => <span className={`st st-${s}`}>{text || LABEL[s]}</span>;

/* ---------- Statistic tile ---------- */
export const Stat = ({ icon, color, num, label, cols = 'col-6 col-xl-3' }) => (
    <div className={cols}>
        <div className="stat-tile">
            <div className={`stat-icon ${color}`}><i className={`bi bi-${icon}`} /></div>
            <div><div className="num">{num}</div><div className="label">{label}</div></div>
        </div>
    </div>
);

/* ---------- White panel with a heading ---------- */
export const Panel = ({ title, action, children, className = '' }) => (
    <div className={`panel ${className}`}>
        {title && <div className="panel-head"><span>{title}</span>{action}</div>}
        {children}
    </div>
);

/* ---------- Table wrapper ---------- */
export const Table = ({ heads, children }) => (
    <div className="table-responsive">
        <table className="table table-shbs table-hover">
            <thead><tr>{heads.map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>{children}</tbody>
        </table>
    </div>
);

/* ---------- Pop-up dialog (the page decides when to show it) ---------- */
export function Modal({ title, onClose, children, footer, large }) {
    return (
        <>
            <div className="modal d-block" tabIndex="-1" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
                <div className={`modal-dialog modal-dialog-centered ${large ? 'modal-lg' : ''}`}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
                        </div>
                        <div className="modal-body">{children}</div>
                        {footer && <div className="modal-footer">{footer}</div>}
                    </div>
                </div>
            </div>
            <div className="modal-backdrop show" />
        </>
    );
}

/* ---------- Hall photo with icon fallback when the photo file is missing ---------- */
export function HallPhoto({ hall, height }) {
    const [ok, setOk] = useState(true);
    return (
        <div className="hall-banner" style={height ? { height, fontSize: '5rem' } : undefined}>
            {ok && hall.img && <img src={UPLOAD_URL + hall.img} alt={hall.name} onError={() => setOk(false)} />}
            <i className="bi bi-building" />
        </div>
    );
}

/* ---------- Hall card (Home page and Halls page) ---------- */
export function HallCard({ hall, mode }) {
    const available = hall.status === 'Active';
    return (
        <div className="hall-card">
            <HallPhoto hall={hall} />
            <div className="hall-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="mb-0">{hall.name}</h5>
                    <span className={`badge ${available ? 'st-approved' : 'st-pending'}`}>{available ? 'Available' : 'Maintenance'}</span>
                </div>
                <p className="hall-meta mb-1"><i className="bi bi-people me-1" />Capacity: {hall.cap}</p>
                <p className="hall-meta mb-3"><i className="bi bi-geo-alt me-1" />{hall.loc}</p>
                <div className="d-flex flex-wrap gap-1 mb-3">
                    {hall.fac.map((f) => <span key={f} className="badge badge-facility">{f}</span>)}
                </div>
                {mode === 'public' ? (
                    <Link to="/login" className="btn btn-shbs btn-sm w-100">Login to Book</Link>
                ) : (
                    <div className="d-flex gap-2">
                        <Link to={`/user/hall-details?id=${hall.id}`} className="btn btn-outline-secondary btn-sm flex-fill">Details</Link>
                        <Link to={`/user/book-hall?hall=${hall.id}`} className={`btn btn-shbs btn-sm flex-fill ${available ? '' : 'disabled'}`}>Book Now</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ---------- Simple CSS bar charts ---------- */
export function BarList({ data, max }) {
    const top = max || Math.max(...data.map((d) => d[1]));
    return data.map(([name, v]) => (
        <div className="bar-row" key={name}>
            <div className="bar-label">{name}</div>
            <div className="bar-track"><div className="bar-fill" style={{ width: `${(v / top) * 100}%` }} /></div>
            <div className="bar-val">{v}</div>
        </div>
    ));
}

export function ColumnChart({ data }) {
    const top = Math.max(...data.map((d) => d[1]));
    return (
        <div className="col-chart">
            {data.map(([name, v]) => (
                <div className="col-item" key={name}>
                    <div className="col-bar" style={{ height: `${(v / top) * 160}px` }}><span>{v}</span></div>
                    <small>{name}</small>
                </div>
            ))}
        </div>
    );
}

/* ---------- Loading / error while data comes from the server ---------- */
export const Loading = () => (
    <div className="empty-state"><div className="spinner-border text-secondary mb-2" role="status" /><div>Loading...</div></div>
);

// <Wait q={useApi(...)}>{(data) => ...}</Wait> shows a spinner, then an error with Retry, then the page
export function Wait({ q, children }) {
    if (q.loading && !q.data) return <Loading />;
    if (q.error && !q.data) {
        return (
            <div className="alert alert-danger d-flex flex-wrap justify-content-between align-items-center gap-2">
                <span><i className="bi bi-exclamation-triangle me-2" />{q.error}</span>
                <button className="btn btn-sm btn-outline-danger" onClick={q.reload}>Try again</button>
            </div>
        );
    }
    return children(q.data);
}
