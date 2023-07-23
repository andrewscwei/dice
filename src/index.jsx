import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import isTouchDevice from 'is-touch-device';

window.__VERSION__ = $APP_CONFIG.version;

if (isTouchDevice()) {
  document.documentElement.classList.add('touch');
  document.documentElement.classList.remove('no-touch');
}
else {
  document.documentElement.classList.remove('touch');
  document.documentElement.classList.add('no-touch');
}

createRoot(document.getElementById('app')).render(<App/>);
