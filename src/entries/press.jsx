import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/press.scss';
import App from '../versions/press/PressApp';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
