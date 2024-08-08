import React, { useState, useEffect } from 'react';
import CustomAlert from './CustomAlert'; // Import your custom alert component

export default function CreateCSO(props) {
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '', show: false });
  const [loading, setLoading] = useState(false); // Add loading state

  // Mark createCSO as async function
  const createCSO = async () => {
    setLoading(true); // Set loading to true at the start
    try {
      for (const sku in props.csoQuantities) {
        if (props.csoQuantities[sku] !== 0) {
          try {
            const stock = await checkItemStock(sku); // Await the checkItemStock function
            if (stock > 10 + props.csoQuantities[sku]) {
              continue;
            } else {
              setAlertMessage({
                title: 'Let op!',
                message: `${sku} is niet voldoende meer op voorraad.`,
                show: true
              });
              return;
            }
          } catch (error) {
            // Handle error scenario, e.g., log it or show an alert
            setAlertMessage({
              title: 'Fout!',
              message: `Er is een fout opgetreden bij het ophalen van de voorraad voor ${sku}.`,
              show: true
            });
            return;
          }
        }
      }
      setAlertMessage({
        title: 'CSO Aangemaakt!',
        message: 'Er is succesvol een CSO aangemaakt voor order #',
        show: true
      });
      console.log(alertMessage);
      createOrderBC();
      props.csoPresent();
    } finally {
      setLoading(false); // Ensure loading is set to false after processing
    }
  };

  const checkItemStock = async (sku) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    
    const raw = JSON.stringify({
      "sku": sku
    });
  
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
  
    try {
      const response = await fetch("https://europe-west3-mj-staging.cloudfunctions.net/available-stock-to-kustomer", requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Stock", result.available_stock);
      return result.available_stock;
    } 
    catch (error) {
      console.error("Error fetching stock:", error);
      // Handle error scenario, possibly return a default value or throw
      throw error;
    }
  };
  
  function createOrderBC() {
    // Implementation for creating an order
  }

  const handleCloseAlert = () => {
    setAlertMessage({ ...alertMessage, show: false });
  };

  useEffect(() => {
    if (alertMessage.title || alertMessage.message) {
      console.log({ alertTitle: alertMessage.title });
      console.log({ alertMessage: alertMessage.message });
    }
  }, [alertMessage.title, alertMessage.message]);

  return (
    <div>
      <button 
        onClick={createCSO} 
        id='csoSendButton'
        disabled={loading} // Disable button when loading
      >
        {loading ? 'Bezig...' : 'Verzenden'} {/* Change button text based on loading state */}
      </button>
      {alertMessage.show && <CustomAlert title={alertMessage.title} message={alertMessage.message} onClose={handleCloseAlert} />}
    </div>
  );
}
