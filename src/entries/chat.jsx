import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/chat.scss';
import App from '../versions/chat/ChatApp';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
