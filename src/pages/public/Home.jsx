import { Link } from 'react-router-dom';
import { FEATURES, asset } from '../../data.js';
import { useApi } from '../../api.js';
import { HallCard } from '../../components/ui.jsx';

const STEPS = [
    ['Register or log in', 'Use your college details to sign in.'],
    ['Choose a hall', 'Check capacity, facilities and availability.'],
    ['Submit a request', 'Enter the date, time and event details.'],
    ['Get a decision', 'You are notified when the admin responds.'],
];

export default function Home() {
    const halls = useApi('halls.php');
    const stats = useApi('stats.php', { scope: 'public' });
    const n = stats.data || {};
    return (
        <>
            <section className="hero">
                <div className="container">
                    <div className="row align-items-center gy-4">
                        <div className="col-lg-7">
                            <p className="section-kicker mb-2" style={{ color: '#5EEAD4' }}>Jigme Namgyal Engineering College</p>
                            <h1>Book your hall <span>smart, seamless</span> and special.</h1>
                            <p className="lead my-4">Check hall availability, submit a booking request and track its status online, with no office visits, no paperwork and no double bookings.</p>
                            <div className="d-flex flex-wrap gap-2">
                                <Link to="/register" className="btn btn-shbs btn-lg px-4">Get Started</Link>
                                <Link to="/login" className="btn btn-shbs-outline btn-lg px-4">Login</Link>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="hero-logo-wrap"><img src={asset('logo.png')} alt="Smart Hall Booking System logo" /></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="stats-strip">
                <div className="container"><div className="row g-3">
                    {[[n.halls ?? '-', 'Halls listed'], [n.bookings ?? '-', 'Approved bookings'], [n.users ?? '-', 'Registered users'], ['24/7', 'Online access']].map(([n, l]) => (
                        <div className="col-6 col-md-3" key={l}><div className="stat-card"><div className="num">{n}</div><div className="label">{l}</div></div></div>
                    ))}
                </div></div>
            </section>

            <section className="section"><div className="container">
                <div className="text-center mb-5"><p className="section-kicker mb-1">Features</p><h2 className="section-title">Everything you need to book a hall</h2></div>
                <div className="row g-4">
                    {FEATURES.map(([icon, title, text]) => (
                        <div className="col-md-6 col-lg-4" key={title}>
                            <div className="feature-card"><div className="icon-box"><i className={`bi bi-${icon}`} /></div><h5>{title}</h5><p>{text}</p></div>
                        </div>
                    ))}
                </div>
            </div></section>

            <section className="section section-alt"><div className="container">
                <div className="text-center mb-5"><p className="section-kicker mb-1">Our Halls</p><h2 className="section-title">Choose the right venue</h2></div>
                {halls.error && <div className="alert alert-warning text-center">{halls.error}</div>}
                <div className="row g-4">
                    {(halls.data || []).slice(0, 3).map((h) => <div className="col-md-6 col-lg-4" key={h.id}><HallCard hall={h} mode="public" /></div>)}
                </div>
            </div></section>

            <section className="section"><div className="container">
                <div className="text-center mb-4"><p className="section-kicker mb-1">How it works</p><h2 className="section-title">Four simple steps</h2></div>
                <div className="row g-3">
                    {STEPS.map(([t, d], i) => (
                        <div className="col-6 col-lg-3" key={t}><div className="step-card"><div className="step-number">{i + 1}</div><h6>{t}</h6><p>{d}</p></div></div>
                    ))}
                </div>
            </div></section>

            <section className="container"><div className="cta">
                <h2>Ready to book your next event?</h2><p className="mb-4">Create an account and reserve a hall in minutes.</p>
                <Link to="/register" className="btn btn-shbs btn-lg px-5">Create an Account</Link>
            </div></section>
        </>
    );
}
