import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

if (/^\/services?\/?$/.test(location.pathname)) {
  history.replaceState(history.state, '', '/' + location.search + '#services');
}

createRoot(document.getElementById('root')).render(<App/>);
