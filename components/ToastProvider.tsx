"use client";

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        // Default options for all toasts
        duration: 4000,
        style: {
          background: '#fff',
          color: '#000',
          border: '4px solid #000',
          boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
          fontWeight: 'bold',
          padding: '16px',
        },
        // Custom options for different types
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
          style: {
            background: '#d1fae5',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
          style: {
            background: '#fee2e2',
          },
        },
        loading: {
          style: {
            background: '#fef3c7',
          },
        },
      }}
    />
  );
}
