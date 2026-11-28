// The two page frames: public pages (top navbar) and logged-in pages (sidebar + top bar).
import { useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { asset } from '../data.js';
import { useApi } from '../api.js';
import { useAuth, useSettings } from '../context.jsx';
import { Loading } from './ui.jsx';

const USER_NAV = [
    { to: '/user/dashboard', icon: 'speedometer2', label: 'Dashboard' },
    { to: '/user/halls', icon: 'building', label: 'Halls' },
    { to: '/user/availability', icon: 'calendar3', label: 'Availability', title: 'Hall Availability' },
    { to: '/user/my-bookings', icon: 'journal-check', label: 'My Bookings' },
    { to: '/user/notifications', icon: 'bell', label: 'Notifications' },
    { to: '/user/profile', icon: 'person', label: 'Profile', title: 'My Profile' },
    { to: '/user/help', icon: 'question-circle', label: 'Help & Support' },
    { to: '/user/feedback', icon: 'chat-square-text', label: 'Feedback' },
];
const ADMIN_NAV = [
    { to: '/admin/dashboard', icon: 'speedometer2', label: 'Dashboard', title: 'Admin Dashboard' },
    { to: '/admin/booking-requests', icon: 'inbox', label: 'Booking Requests' },
    { to: '/admin/all-bookings', icon: 'journal-text', label: 'All Bookings' },
    { to: '/admin/manage-halls', icon: 'building', label: 'Manage Halls' },
    { to: '/admin/manage-users', icon: 'people', label: 'Manage Users' },
    { to: '/admin/reports', icon: 'graph-up', label: 'Reports', title: 'Reports & Analytics' },
    { to: '/admin/notifications', icon: 'bell', label: 'Notifications' },
    { to: '/admin/settings', icon: 'gear', label: 'Settings' },
];

/* ============ PUBLIC LAYOUT ============ */
export function PublicLayout() {
    const { pathname } = useLocation();
    const contact = useSettings();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => { window.scrollTo(0, 0); setOpen(false); }, [pathname]);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const link = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`;
    return (
        <>
            <nav className={`navbar navbar-expand-lg shbs-navbar sticky-top ${scrolled ? 'scrolled' : ''}`}>
                <div className="container">
                    <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
                        <img src={asset('logo.png')} alt="SHBS logo" className="brand-logo" />
                        <span className="brand-text">Smart Hall <small>Booking System</small></span>
                    </Link>
                    <button className="navbar-toggler" type="button" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
                        <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
                            <li className="nav-item"><NavLink className={link} to="/" end>Home</NavLink></li>
                            <li className="nav-item"><NavLink className={link} to="/about">About Us</NavLink></li>
                            <li className="nav-item"><NavLink className={link} to="/login">Login</NavLink></li>
                            <li className="nav-item ms-lg-2"><Link className="btn btn-shbs-accent btn-sm px-3" to="/register">Register</Link></li>
                        </ul>
                    </div>
                </div>
            </nav>

            <Outlet />

            <footer className="shbs-footer">
                <div className="container">
                    <div className="row gy-4">
                        <div className="col-lg-5">
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <img src={asset('logo.png')} alt="" className="footer-logo" />
                                <strong className="fs-5">Smart Hall Booking System</strong>
                            </div>
                            <p className="mb-0 footer-muted">A simple way for students and faculty of Jigme Namgyal Engineering College to check hall availability and book halls online.</p>
                        </div>
                        <div className="col-6 col-lg-3">
                            <h6 className="text-uppercase footer-heading">Quick Links</h6>
                            <ul className="list-unstyled mb-0">
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/login">Login</Link></li>
                                <li><Link to="/register">Register</Link></li>
                            </ul>
                        </div>
                        <div className="col-6 col-lg-4">
                            <h6 className="text-uppercase footer-heading">Contact</h6>
                            <ul className="list-unstyled mb-0 footer-muted">
                                <li><i className="bi bi-envelope me-2" />{contact.contact_email}</li>
                                <li><i className="bi bi-telephone me-2" />{contact.contact_phone}</li>
                                <li><i className="bi bi-geo-alt me-2" />{contact.contact_address}</li>
                            </ul>
                        </div>
                    </div>
                    <hr className="footer-line" />
                    <p className="text-center footer-muted small mb-0">&copy; 2026 Smart Hall Booking System. Royal University of Bhutan.</p>
                </div>
            </footer>
        </>
    );
}

/* ============ DASHBOARD LAYOUT (sidebar + top bar) ============ */
export function AppLayout({ role }) {
    const nav = role === 'user' ? USER_NAV : ADMIN_NAV;
    const { pathname } = useLocation();
    const [sideOpen, setSideOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, ready, logout } = useAuth();
    const navigate = useNavigate();
    // unread count for the bell; the extra "t" value makes it reload on every page change
    const notif = useApi(user ? 'notifications.php' : null, { t: pathname });
    const unread = notif.data ? notif.data.unread : 0;

    // the CSS uses body.sidebar-open to slide the sidebar in on phones
    useEffect(() => {
        document.body.classList.toggle('sidebar-open', sideOpen);
        return () => document.body.classList.remove('sidebar-open');
    }, [sideOpen]);
    useEffect(() => { setSideOpen(false); setMenuOpen(false); window.scrollTo(0, 0); }, [pathname]);

    if (!ready) return <Loading />;
    if (!user) return <Navigate to="/login" replace />;
    const area = user.role === 'admin' ? 'admin' : 'user';
    if (area !== role) return <Navigate to={`/${area}/dashboard`} replace />;
    const doLogout = async () => { await logout(); navigate('/login'); };

    const current = nav.find((n) => n.to === pathname);
    const title = current ? current.title || current.label : pathname.endsWith('hall-details') ? 'Hall Details' : '';
    const who = {
        name: user.name,
        sub: user.role === 'admin' ? 'Administrator' : user.role[0].toUpperCase() + user.role.slice(1),
        ini: user.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase(),
    };

    return (
        <>
            <aside className="sidebar">
                <Link className="side-brand" to="/">
                    <img src={asset('logo.png')} alt="" />
                    <span><strong>Smart Hall</strong><small>Booking System</small></span>
                </Link>
                {nav.map((n) => (
                    <NavLink key={n.to} to={n.to} className={({ isActive }) => `side-link ${isActive ? 'active' : ''} d-flex align-items-center justify-content-between`}>
                        <div>
                            <i className={`bi bi-${n.icon} me-2`} />{n.label}
                        </div>
                        {/* NEW: Show the orange badge for unread notifications */}
                        {n.label === 'Notifications' && unread > 0 && (
                            <span className="badge bg-warning text-dark rounded-pill">{unread}</span>
                        )}
                    </NavLink>
                ))}
                <div className="side-bottom">
                    <button className="side-link" type="button" onClick={doLogout} style={{ background: 'none', border: 0, width: 'calc(100% - 1.5rem)' }}>
                        <i className="bi bi-box-arrow-left" />Logout
                    </button>
                </div>
            </aside>
            <div className="sidebar-backdrop" onClick={() => setSideOpen(false)} />

            <div className="main">
                <header className="topbar">
                    <button className="icon-btn sidebar-toggle" type="button" aria-label="Menu" onClick={() => setSideOpen(!sideOpen)}>
                        <i className="bi bi-list fs-4" />
                    </button>
                    <h1>{title}</h1>
                    <div className="spacer" />
                    <div className="dropdown">
                        <button className="user-chip" type="button" onClick={() => setMenuOpen(!menuOpen)}>
                            <span className="avatar">{who.ini}</span>
                            <span className="d-none d-sm-block"><strong>{who.name}</strong><small>{who.sub}</small></span>
                        </button>
                        <ul className={`dropdown-menu dropdown-menu-end ${menuOpen ? 'show' : ''}`}>
                            <li>
                                <Link className="dropdown-item" to={role === 'user' ? '/user/profile' : '/admin/settings'}>
                                    <i className={`bi me-2 ${role === 'user' ? 'bi-person' : 'bi-gear'}`} />{role === 'user' ? 'Profile' : 'Settings'}
                                </Link>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><button className="dropdown-item" type="button" onClick={doLogout}><i className="bi bi-box-arrow-left me-2" />Logout</button></li>
                        </ul>
                    </div>
                </header>
                <main className="content"><Outlet /></main>
            </div>
        </>
    );
}