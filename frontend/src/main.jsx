import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import AdminGallery from './AdminGallery.jsx';
import DevPortfolio from './DevPortfolio.jsx';
import InfographicPage from './InfographicPage.jsx';
import JPage from './JPage.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<App />} />
  <Route path="/editor" element={<AdminGallery />} />
  <Route path="/dev" element={<DevPortfolio />} />
  <Route path="/x" element={<InfographicPage />} />
  <Route path="/j" element={<JPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
