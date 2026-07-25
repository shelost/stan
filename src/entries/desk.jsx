import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/desk.scss';
import App from '../versions/desk/DeskApp';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
