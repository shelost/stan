import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/orbit.scss';
import App from '../versions/orbit/OrbitApp';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
