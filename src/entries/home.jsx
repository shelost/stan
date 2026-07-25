import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/home.scss';
import App from '../versions/home/HomeApp';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
