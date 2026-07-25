import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/atlas.scss';
import App from '../versions/atlas/AtlasApp';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
