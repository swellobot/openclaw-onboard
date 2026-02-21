import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import WizardPage from './pages/WizardPage';
import WizardRedirect from './pages/WizardRedirect';
import SuccessPage from './pages/SuccessPage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/wizard" element={<WizardRedirect />} />
        <Route path="/setup" element={<WizardRedirect />} />
        <Route path="/wizard/:sessionId" element={<WizardPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
