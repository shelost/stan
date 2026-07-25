import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/terminal.scss';
import App from '../versions/terminal/TerminalApp';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
