import { useState } from 'react';
import { useApi } from '../../api.js';
import { HallCard, Wait } from '../../components/ui.jsx';

export default function Halls() {
    const q = useApi('halls.php');
    const [query, setQuery] = useState('');
    const [minCap, setMinCap] = useState(0);

    return (
        <>
            <div className="page-actions">
                <input type="search" className="form-control search" placeholder="Search halls by name or facility..." value={query} onChange={(e) => setQuery(e.target.value)} />
                <select className="form-select w-auto" value={minCap} onChange={(e) => setMinCap(Number(e.target.value))}>
                    <option value={0}>Any capacity</option><option value={100}>100+ people</option><option value={200}>200+ people</option><option value={500}>500+ people</option>
                </select>
            </div>
            <Wait q={q}>{(halls) => {
                const shown = halls.filter((h) => `${h.name} ${h.loc} ${h.fac.join(' ')}`.toLowerCase().includes(query.toLowerCase()) && h.cap >= minCap);
                return (
                    <>
                        <div className="row g-4">{shown.map((h) => <div className="col-md-6 col-lg-4" key={h.id}><HallCard hall={h} mode="user" /></div>)}</div>
                        {shown.length === 0 && <div className="empty-state"><i className="bi bi-search" />No halls match your search.</div>}
                    </>
                );
            }}</Wait>
        </>
    );
}
