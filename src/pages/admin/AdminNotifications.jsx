import { useState } from 'react';
import { post, useApi } from '../../api.js';
import { Panel, Table, Wait, useToast } from '../../components/ui.jsx';

export default function AdminNotifications() {
    const toast = useToast();
    const sent = useApi('notifications.php', { scope: 'sent' });
    const [audience, setAudience] = useState('all');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    const send = async (e) => {
        e.preventDefault();
        try {
            const r = await post('notifications.php', 'send', { audience, title, message });
            toast(`Announcement sent to ${r.sent} user(s)`);
            setTitle(''); setMessage('');
            sent.reload();
        } catch (err) {
            toast(err.message, 'error');
        }
    };

    return (
        <div className="row g-4">
            <div className="col-lg-5"><Panel title="Send announcement"><div className="panel-body">
                <form onSubmit={send}>
                    <div className="mb-3"><label className="form-label">Send to</label>
                        <select className="form-select" value={audience} onChange={(e) => setAudience(e.target.value)}>
                            <option value="all">All users</option><option value="student">Students only</option><option value="faculty">Faculty only</option>
                        </select></div>
                    <div className="mb-3"><label className="form-label">Title</label><input className="form-control" required maxLength="150" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
                    <div className="mb-3"><label className="form-label">Message</label><textarea className="form-control" rows="4" required maxLength="500" value={message} onChange={(e) => setMessage(e.target.value)} /></div>
                    <button className="btn btn-shbs" type="submit"><i className="bi bi-send me-1" />Send</button>
                </form>
            </div></Panel></div>
            <div className="col-lg-7"><Panel title="Sent announcements">
                <Wait q={sent}>{(rows) => (
                    <>
                        <Table heads={['Title', 'Audience', 'Date']}>{rows.map(([t, a, d], i) => <tr key={i}><td>{t}</td><td>{a}</td><td>{d}</td></tr>)}</Table>
                        {rows.length === 0 && <div className="empty-state">No announcements sent yet.</div>}
                    </>
                )}</Wait>
            </Panel></div>
        </div>
    );
}
