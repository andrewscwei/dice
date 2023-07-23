import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

window.__VERSION__ = $APP_CONFIG.version;

createRoot(document.getElementById('app')).render(<App/>);
