import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';

const root = document.getElementById('root');
if (!root) throw new Error('Code Visio: #root element is missing');

const surface = root.dataset.surface === 'panel' ? 'panel' : 'sidebar';

createRoot(root).render(
  <StrictMode>
    <App surface={surface} />
  </StrictMode>,
);
