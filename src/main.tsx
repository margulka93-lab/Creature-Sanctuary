import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { LocalStorageSaveAdapter } from './storage/LocalStorageSaveAdapter';
import './style.css';

const adapter = new LocalStorageSaveAdapter();
const clock = { now: () => Date.now() };
const random = { next: () => Math.random() };

createRoot(document.getElementById('root')!).render(
  <StrictMode><App adapter={adapter} clock={clock} random={random} /></StrictMode>,
);
