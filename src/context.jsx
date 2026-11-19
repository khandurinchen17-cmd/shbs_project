// Logged-in user and site settings, available to every page.
import { createContext, useContext, useEffect, useState } from 'react';
import { api, post, setCsrf } from './api.js';
import { CONTACT } from './data.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);
    const [offline, setOffline] = useState('');

    // on start: ask the server who is logged in (and get the security token)
    useEffect(() => {
        api('auth.php', { params: { action: 'me' } })
            .then((d) => { setCsrf(d.csrf); setUser(d.user); })
            .catch((e) => setOffline(e.message))
            .finally(() => setReady(true));
    }, []);

    const login = async (email, password) => {
        const d = await post('auth.php', 'login', { email, password });
        setCsrf(d.csrf); setUser(d.user);
        return d.user;
    };
    const logout = async () => {
        try { const d = await post('auth.php', 'logout'); setCsrf(d.csrf); } catch (e) { /* ignore */ }
        setUser(null);
    };
    return <AuthContext.Provider value={{ user, setUser, ready, offline, login, logout }}>{children}</AuthContext.Provider>;
}

const SettingsContext = createContext({});
export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }) {
    const [s, setS] = useState({ contact_email: CONTACT.email, contact_phone: CONTACT.phone, contact_address: CONTACT.address });
    useEffect(() => { api('settings.php').then(setS).catch(() => {}); }, []);
    return <SettingsContext.Provider value={s}>{children}</SettingsContext.Provider>;
}
