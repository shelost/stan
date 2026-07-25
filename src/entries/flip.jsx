import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/flip.scss';
import App from '../versions/flip/FlipApp';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
