import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/books.scss';
import App from '../versions/books/BooksApp';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
