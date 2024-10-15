import React, { useState } from 'react';
import './CustomAlert.css'; // Import your CSS file for styling

export default function CustomAlert({ title, message, onClose, closestMatches = [], onSelect }) {
  const [mjNumber, setMjNumber] = useState(''); // State to manage the MJ number input

  // Handler for input change
  const handleInputChange = (e) => {
    setMjNumber(e.target.value);
  };

  // Handler for submission of MJ number
  const handleMjSubmit = () => {
    onSelect(mjNumber);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>

        {closestMatches.length > 0 && (
          <div>
            <h3>Kies een alternatief product:</h3>
            <ul>
              {closestMatches.map((match) => (
                <li key={match.product_id}>
                  {match.product_id}, Voorraad: {match.available_stock} 
                  <button className="selectButton" onClick={() => onSelect(match.product_id)}>Selecteer</button>
                </li>
              ))}
            </ul>
            <div>
              <h3>Of voer een ander MJ-nummer in:</h3>
              <input 
                className='mjinput'
                type="text"
                value={mjNumber}
                onChange={handleInputChange}
                placeholder="MJ-nummer"
              />
              <button onClick={handleMjSubmit}>Verstuur</button>
            </div>
          </div>
        )}

        {/* New section for entering MJ number */}


        <button onClick={onClose}>Sluiten</button>
      </div>
    </div>
  );
}
