import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { LocalStorageSaveAdapter } from './storage/LocalStorageSaveAdapter';
import './style.css';

const adapter = new LocalStorageSaveAdapter();
const clock = { now: () => Date.now() };

createRoot(document.getElementById('root')!).render(
  <StrictMode><App adapter={adapter} clock={clock} /></StrictMode>,
);
