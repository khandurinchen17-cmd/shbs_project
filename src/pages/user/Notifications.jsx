import { post, useApi } from '../../api.js';
import { NOTIF_STYLE } from '../../data.js';
import { Panel, Wait, useToast } from '../../components/ui.jsx';

export default function Notifications() {
    const toast = useToast();
    const q = useApi('notifications.php');
    const markAll = async () => {
        try { await post('notifications.php', 'read_all'); toast('All notifications marked as read'); q.reload(); } catch (e) { toast(e.message, 'error'); }
    };

    return (
        <Wait q={q}>{(data) => (
            <Panel title="Notifications" action={<button className="btn btn-sm btn-outline-secondary" onClick={markAll}>Mark all as read</button>}>
                {data.items.map((n) => (
                    <div className={`notif ${n.unread ? 'unread' : ''}`} key={n.id}>
                        <div className={`notif-icon ${NOTIF_STYLE[n.kind] || 'ic-navy'}`}><i className={`bi bi-${n.icon}`} /></div>
                        <div className="notif-body"><strong>{n.title}</strong><p>{n.msg}</p></div>
                        <span className="notif-time">{n.time}</span>
                    </div>
                ))}
                {data.items.length === 0 && <div className="empty-state"><i className="bi bi-bell" />No notifications yet.</div>}
            </Panel>
        )}</Wait>
    );
}
