import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/standard.scss';
import App from '../versions/standard/StandardApp';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
