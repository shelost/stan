import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/coming-soon.scss';
import App from '../versions/coming-soon/ComingSoonApp';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
