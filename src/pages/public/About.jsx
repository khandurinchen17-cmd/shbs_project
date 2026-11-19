import { FEATURES, TEAM, asset } from '../../data.js';
import { useSettings } from '../../context.jsx';

export default function About() {
    const c = useSettings();
    return (
        <>
            <section className="page-hero"><div className="container">
                <h1>About Smart Hall Booking System</h1>
                <p>A digital platform that simplifies hall reservations for colleges and universities.</p>
            </div></section>

            <section className="section"><div className="container"><div className="row g-4 align-items-center">
                <div className="col-lg-7">
                    <p className="section-kicker mb-1">Who we are</p>
                    <h2 className="section-title mb-3">Making hall booking faster and clearer</h2>
                    <p>Hall bookings at the college used to be managed manually: users visited the office, called staff or sent emails, and records were kept on paper. That caused delays, confusion and double bookings.</p>
                    <p>The Smart Hall Booking System replaces that process. Students and faculty can check availability, submit requests and track their status online, while administrators approve requests and monitor hall usage from one dashboard.</p>
                    <div className="feature-card mt-4"><div className="d-flex gap-3">
                        <div className="icon-box mb-0"><i className="bi bi-bullseye" /></div>
                        <div><h5 className="mb-1">Our Mission</h5><p>To provide a fast, reliable and user-friendly hall booking solution that reduces manual work and improves event management efficiency.</p></div>
                    </div></div>
                </div>
                <div className="col-lg-5"><div className="hero-logo-wrap" style={{ background: 'var(--bg)' }}><img src={asset('logo.png')} alt="SHBS logo" /></div></div>
            </div></div></section>

            <section className="section section-alt"><div className="container">
                <div className="text-center mb-5"><p className="section-kicker mb-1">Features</p><h2 className="section-title">What the system offers</h2></div>
                <div className="row g-4">
                    {FEATURES.map(([icon, title, text]) => (
                        <div className="col-md-6 col-lg-4" key={title}>
                            <div className="feature-card"><div className="icon-box"><i className={`bi bi-${icon}`} /></div><h5>{title}</h5><p>{text}</p></div>
                        </div>
                    ))}
                </div>
            </div></section>

            <section className="section"><div className="container">
                <div className="text-center mb-5"><p className="section-kicker mb-1">The team</p><h2 className="section-title">Built by students of JNEC</h2></div>
                <div className="row g-4 justify-content-center">
                    {TEAM.map(([name, role]) => (
                        <div className="col-md-4" key={name}><div className="feature-card team-card">
                            <div className="avatar avatar-lg mb-3">{name.split(' ').slice(0, 2).map((w) => w[0]).join('')}</div>
                            <h5>{name}</h5><p>{role}</p>
                        </div></div>
                    ))}
                </div>
            </div></section>

            <section className="container"><div className="cta">
                <h2>Contact us</h2>
                <p className="mb-1"><i className="bi bi-envelope me-2" />{c.contact_email}</p>
                <p className="mb-1"><i className="bi bi-telephone me-2" />{c.contact_phone}</p>
                <p className="mb-0"><i className="bi bi-geo-alt me-2" />{c.contact_address}</p>
            </div></section>
        </>
    );
}
