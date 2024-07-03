import React, { useState, useEffect } from 'react';
import CustomAlert from './CustomAlert'; // Import your custom alert component

export default function CreateCSO(props) {
  // const stock = { "MJ10925-0400-XL": 9, "MJ07610-1500": 100 };
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '', show: false });

  const createCSO = () => {
    for (const sku in props.csoQuantities) {
      if (props.csoQuantities[sku] !== 0) {
        if (checkItemStock(sku) > 10 + props.csoQuantities[sku]) {
          continue;
        } else {
          setAlertMessage({
            title: 'Let op!',
            message: `${sku} is niet voldoende meer op voorraad.`,
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
    console.log(setAlertMessage)
    alert(`CSO is aangemaakt voor order #${props.data2.huts.customContext.kobject.custom.incrementIdStr}`)
    createOrderBC();
    props.csoPresent();
  };

  const checkItemStock = async (sku) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    // Add any additional headers if needed
  
    const raw = JSON.stringify({
      "sku": sku // Use the sku passed into the function
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
      console.log(result)
      return result.availableStock; // Assuming API returns the available stock
    } catch (error) {
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
    if (alertMessage.title || alert.message) {
      console.log({ alertTitle: alertMessage.title });
      console.log({ alertMessage: alertMessage.message });
    }
  }, [alertMessage.title, alertMessage.message]);

  return (
    <div>
      <button onClick={createCSO} id='csoSendButton'>Verzenden</button>
      {alertMessage.show && <CustomAlert title={alertMessage.title} message={alertMessage.message} onClose={handleCloseAlert} />}
    </div>
  );
}
