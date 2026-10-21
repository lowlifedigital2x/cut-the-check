import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register PWA service worker for mobile installability and offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .then((reg) => {
        console.log('CTC PWA Service Worker registered:', reg.scope);
      })
      .catch((err) => {
        console.warn('CTC PWA Service Worker registration skipped:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
