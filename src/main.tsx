import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/routes';
import './styles/index.css';
import { Toaster } from "sonner";

// 👇 IMPORTA PROVIDERS
import { AuthProvider } from './app/contexts/AuthContext';
import { ThemeProvider } from './app/contexts/ThemeContext';
import { AccessibilityProvider } from './app/contexts/AccessibilityContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AccessibilityProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" />
        </AuthProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  </React.StrictMode>
);