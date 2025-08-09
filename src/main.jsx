import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Admin from './admin.jsx';
import Dev from './dev.jsx';
import Xx from './xx.jsx';

// Динамический импорт новых страниц
const customPages = window.customPages || [];
const customRoutes = customPages.map(page => {
  try {
    const PageComponent = require(`./${page}.jsx`).default;
    return <Route key={page} path={`/${page}`} element={<PageComponent />} />;
  } catch {
    return null;
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/editor" element={<Admin />} />
        <Route path="/dev" element={<Dev />} />
        <Route path="/x" element={<Xx />} />
        {customRoutes}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
