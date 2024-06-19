import React from 'react';
import './CustomAlert.css'; // Import your CSS file for styling

export default function CustomAlert({ title, message, onClose }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onClose}>Sluiten</button>
      </div>
    </div>
  );
}
