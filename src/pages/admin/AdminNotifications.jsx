import { useState } from 'react';
import { post, useApi } from '../../api.js';
import { NOTIF_STYLE } from '../../data.js';
import { Modal, Panel, Table, Wait, useToast } from '../../components/ui.jsx';

export default function AdminNotifications() {
    const toast = useToast();
    
    // 1. Fetch Sent Announcements
    const sent = useApi('notifications.php', { scope: 'sent' });
    
    // 2. Fetch Received Notifications (System Alerts)
    const receivedQ = useApi('notifications.php');

    const [audience, setAudience] = useState('all');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [selectedNotif, setSelectedNotif] = useState(null);

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

    const markAll = async () => {
        try { 
            await post('notifications.php', 'read_all'); 
            toast('All notifications marked as read'); 
            receivedQ.reload(); 
        } catch (e) { 
            toast(e.message, 'error'); 
        }
    };

    const handleRead = async (n) => {
        setSelectedNotif(n);
        if (n.unread) {
            try {
                await post('notifications.php', 'mark_read', { id: n.id });
                receivedQ.reload(); // Update the list and the sidebar badge
            } catch (e) {
                console.error(e);
            }
        }
    };

    return (
        <div className="d-flex flex-column gap-4">
            {/* TOP ROW: SEND ANNOUNCEMENT & SENT HISTORY */}
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

            {/* BOTTOM ROW: RECEIVED SYSTEM NOTIFICATIONS */}
            <div className="row">
                <div className="col-12">
                    <Wait q={receivedQ}>{(data) => (
                        <Panel 
                            title="Received Notifications" 
                            action={<button className="btn btn-sm btn-outline-secondary" onClick={markAll}>Mark all as read</button>}
                        >
                            {data.items.map((n) => (
                                <div 
                                    className={`notif ${n.unread ? 'unread' : ''}`} 
                                    key={n.id} 
                                    onClick={() => handleRead(n)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className={`notif-icon ${NOTIF_STYLE[n.kind] || 'ic-navy'}`}><i className={`bi bi-${n.icon}`} /></div>
                                    <div className="notif-body">
                                        <strong>{n.title}</strong>
                                        <p className="text-truncate mb-0" style={{ maxWidth: '100%' }}>
                                            {n.msg}
                                        </p>
                                    </div>
                                    <span className="notif-time">{n.time}</span>
                                </div>
                            ))}
                            {data.items.length === 0 && <div className="empty-state"><i className="bi bi-bell" />No notifications received yet.</div>}
                        </Panel>
                    )}</Wait>
                </div>
            </div>

            {/* MODAL TO READ FULL NOTIFICATION */}
            {selectedNotif && (
                <Modal 
                    title={selectedNotif.title} 
                    onClose={() => setSelectedNotif(null)}
                    footer={<button className="btn btn-secondary" onClick={() => setSelectedNotif(null)}>Close</button>}
                >
                    <div className="d-flex justify-content-between mb-3 text-muted border-bottom pb-2">
                        <span><i className="bi bi-clock me-1"/> {selectedNotif.time}</span>
                        <span className="badge bg-secondary text-capitalize">{selectedNotif.kind}</span>
                    </div>
                    <p style={{ whiteSpace: 'pre-wrap', fontSize: '1.05rem', lineHeight: '1.6' }}>
                        {selectedNotif.msg}
                    </p>
                </Modal>
            )}
        </div>
    );
}