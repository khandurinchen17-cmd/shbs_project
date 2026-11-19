// Talks to the PHP backend (the files in the "api" folder).
// While developing with "npm run dev" requests go to /api (forwarded to XAMPP by vite.config.js);
// in the built site (app folder) the API is one folder up: ../api
import { useEffect, useState } from 'react';

const BASE = import.meta.env.DEV ? '/api' : '../api';
export const UPLOAD_URL = import.meta.env.DEV ? '/uploads/halls/' : '../uploads/halls/';

let csrfToken = '';
export const setCsrf = (t) => { csrfToken = t; };

export async function api(path, { method = 'GET', params, body } = {}) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    const options = { method, credentials: 'same-origin', headers: {} };
    if (method !== 'GET') {
        options.headers['X-CSRF-Token'] = csrfToken;
        if (body instanceof FormData) {
            options.body = body;
        } else if (body) {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(body);
        }
    }
    let res;
    try {
        res = await fetch(`${BASE}/${path}${query}`, options);
    } catch (e) {
        throw new Error('Cannot reach the server. Start Apache and MySQL in XAMPP.');
    }
    let data = null;
    try { data = await res.json(); } catch (e) {
        throw new Error('The server sent an unexpected reply. Check that the project is inside htdocs/shbs and PHP is running.');
    }
    if (!res.ok) {
        const err = new Error(data.error || 'Something went wrong.');
        err.status = res.status;
        throw err;
    }
    return data;
}

// shortcut for actions:  post('bookings.php', 'cancel', { id: 3, reason: '...' })
export const post = (path, action, body) => api(path, { method: 'POST', params: { action }, body });

// Loads data when the page opens. Pass path = null to skip loading.
export function useApi(path, params) {
    const [state, setState] = useState({ data: null, loading: !!path, error: '' });
    const [tick, setTick] = useState(0);
    const key = JSON.stringify(params || {});
    useEffect(() => {
        if (!path) { setState({ data: null, loading: false, error: '' }); return undefined; }
        let alive = true;
        setState((s) => ({ ...s, loading: true, error: '' }));
        api(path, { params })
            .then((data) => alive && setState({ data, loading: false, error: '' }))
            .catch((e) => alive && setState((s) => ({ ...s, loading: false, error: e.message })));
        return () => { alive = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path, key, tick]);
    return { ...state, reload: () => setTick((t) => t + 1) };
}
