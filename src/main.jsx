import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import './styles.css';
import App from './App.jsx';
import { ToastProvider } from './components/ui.jsx';
import { AuthProvider, SettingsProvider } from './context.jsx';

createRoot(document.getElementById('root')).render(
    <HashRouter>
        <ToastProvider>
            <AuthProvider>
                <SettingsProvider>
                    <App />
                </SettingsProvider>
            </AuthProvider>
        </ToastProvider>
    </HashRouter>
);
