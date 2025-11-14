import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import { store } from './store';
import './index.css';
import App from './App.jsx';
import { StrictMode } from 'react';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                <App />
            </GoogleOAuthProvider>
        </Provider>
    </StrictMode>
);
