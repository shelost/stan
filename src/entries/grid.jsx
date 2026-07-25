import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/grid.scss';
import App from '../versions/grid/GridApp';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
