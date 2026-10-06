import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { LocalStorageSaveAdapter } from './storage/LocalStorageSaveAdapter';
import { startGame } from './app/startGame';
import './style.css';

const adapter = new LocalStorageSaveAdapter();
const clock = { now: () => Date.now() };
const random = { next: () => Math.random() };
const initial = startGame(adapter, clock, random);

createRoot(document.getElementById('root')!).render(
  <StrictMode><App initial={initial} adapter={adapter} clock={clock} random={random} /></StrictMode>,
);
