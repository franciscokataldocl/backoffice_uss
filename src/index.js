import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/css/index.css';
import 'react-toastify/dist/ReactToastify.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import App from './App';
import reportWebVitals from './reportWebVitals';
import AuthProvider from './context/authentication/AuthProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>    
  // </React.StrictMode>
);
reportWebVitals();
