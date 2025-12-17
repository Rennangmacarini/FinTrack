import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

import HomePage from './Pages/home';
import LoginPage from './Pages/login';
import NoptFoundPage from './Pages/not-found';
import SignupPage from './Pages/signup';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<NoptFoundPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
