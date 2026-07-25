import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/phone.scss';
import App from '../versions/phone/PhoneApp';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
