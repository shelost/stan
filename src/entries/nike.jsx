import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/nike.scss';
import App from '../versions/nike/NikeApp';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
