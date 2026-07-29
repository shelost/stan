import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/stan.scss';
import App from '../versions/stan/StanApp';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
