import { useState } from 'react';
import { post, useApi } from '../../api.js';
import { NOTIF_STYLE } from '../../data.js';
import { Modal, Panel, Wait, useToast } from '../../components/ui.jsx';

export default function Notifications() {
    const toast = useToast();
    const q = useApi('notifications.php');
    
    // State to hold the specific notification we clicked on
    const [selected, setSelected] = useState(null);

    const markAll = async () => {
        try { 
            await post('notifications.php', 'read_all'); 
            toast('All notifications marked as read'); 
            q.reload(); 
        } catch (e) { 
            toast(e.message, 'error'); 
        }
    };

    const handleOpen = async (n) => {
        // 1. Open the modal with this notification
        setSelected(n);
        
        // 2. If it's unread, mark it as read in the database
        if (n.unread) {
            try {
                await post('notifications.php', 'mark_read', { id: n.id });
                q.reload(); // Reload to update the sidebar count and remove the orange dot
            } catch (e) {
                console.error(e);
            }
        }
    };

    return (
        <>
            <Wait q={q}>{(data) => (
                <Panel title="Notifications" action={<button className="btn btn-sm btn-outline-secondary" onClick={markAll}>Mark all as read</button>}>
                    {data.items.map((n) => (
                        <div 
                            className={`notif ${n.unread ? 'unread' : ''}`} 
                            key={n.id} 
                            onClick={() => handleOpen(n)}
                            style={{ cursor: 'pointer' }} // Make it look clickable
                        >
                            <div className={`notif-icon ${NOTIF_STYLE[n.kind] || 'ic-navy'}`}><i className={`bi bi-${n.icon}`} /></div>
                            <div className="notif-body">
                                <strong>{n.title}</strong>
                                {/* We keep truncate here for the list view so it stays clean */}
                                <p className="text-truncate mb-0" style={{ maxWidth: '100%' }}>
                                    {n.msg}
                                </p>
                            </div>
                            <span className="notif-time">{n.time}</span>
                        </div>
                    ))}
                    {data.items.length === 0 && <div className="empty-state"><i className="bi bi-bell" />No notifications yet.</div>}
                </Panel>
            )}</Wait>

            {/* THE MODAL (Pops up when clicked) */}
            {selected && (
                <Modal 
                    title={selected.title} 
                    onClose={() => setSelected(null)} 
                    footer={<button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>}
                >
                    <div className="d-flex justify-content-between mb-3 text-muted border-bottom pb-2">
                        <span><i className="bi bi-clock me-1"/> {selected.time}</span>
                        <span className="badge bg-secondary text-capitalize">{selected.kind}</span>
                    </div>
                    {/* whiteSpace: 'pre-wrap' ensures that line breaks in your database are preserved */}
                    <p style={{ whiteSpace: 'pre-wrap', fontSize: '1.05rem', lineHeight: '1.6' }}>
                        {selected.msg}
                    </p>
                </Modal>
            )}
        </>
    );
}