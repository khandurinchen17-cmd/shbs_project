import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FAQ } from '../../data.js';
import { useSettings } from '../../context.jsx';
import { Panel } from '../../components/ui.jsx';

export default function Help() {
    const c = useSettings();
    const [open, setOpen] = useState(0); // index of the open question
    return (
        <div className="row g-4">
            <div className="col-lg-8">
                <Panel title="Frequently asked questions"><div className="panel-body p-0">
                    <div className="accordion accordion-flush">
                        {FAQ.map(([q, a], i) => (
                            <div className="accordion-item" key={q}>
                                <h2 className="accordion-header">
                                    <button className={`accordion-button ${open === i ? '' : 'collapsed'}`} type="button" onClick={() => setOpen(open === i ? -1 : i)}>{q}</button>
                                </h2>
                                {open === i && <div className="accordion-body">{a}</div>}
                            </div>
                        ))}
                    </div>
                </div></Panel>
            </div>
            <div className="col-lg-4"><Panel title="Contact support"><div className="panel-body">
                <ul className="info-list">
                    <li><i className="bi bi-envelope" /><div>{c.contact_email}<small>Email</small></div></li>
                    <li><i className="bi bi-telephone" /><div>{c.contact_phone}<small>Phone</small></div></li>
                    <li><i className="bi bi-geo-alt" /><div>{c.contact_address}<small>Office</small></div></li>
                </ul>
                <Link to="/user/feedback" className="btn btn-outline-secondary w-100 mt-2">Send feedback</Link>
            </div></Panel></div>
        </div>
    );
}
