import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/hub.scss';
import App from '../versions/hub/HubApp';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
