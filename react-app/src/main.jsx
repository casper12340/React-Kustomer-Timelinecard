import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <h2>Order informatie</h2>
    <ul>
      <li>Adres gegevens</li>
      <li>Betaal gegevens</li>
    </ul>
    <App />
  </React.StrictMode>
);
