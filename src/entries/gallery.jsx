import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/editions.scss';
import App from '../versions/editions/EditionsApp';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
