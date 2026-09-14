// Ensure window.fetch is configurable with a setter across browser runtime
if (typeof window !== 'undefined') {
  try {
    const origFetch = window.fetch ? window.fetch.bind(window) : undefined;
    let _fetch = origFetch;
    Object.defineProperty(window, 'fetch', {
      get() {
        return _fetch;
      },
      set(val) {
        _fetch = val;
      },
      configurable: true,
      enumerable: true,
    });
  } catch {}
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
