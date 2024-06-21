import React, { useState } from 'react';
import CustomAlert from './CustomAlert'; // Import your custom alert component

export default function CreateCSO(props) {
  const stock = { "MJ10925-0400-XL": 9, "MJ10895-0200-XL": 100 };
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const createCSO = () => {
    for (const sku in props.csoQuantities) {
      console.log(sku, props.csoQuantities[sku]);
      if (checkItemStock(sku) > 10 + props.csoQuantities[sku]) {
        continue;
      } else {
        setAlertTitle('Let op!')
        setAlertMessage(`${sku} is niet voldoende meer op voorraad.`);
        setShowAlert(true);
        return;
      }
    }
    createOrderBC();
    props.csoPresent();
    console.log(props);
    console.log(props.csoQuantities);
  };

  const checkItemStock = (sku) => {
    // Fetch request or other logic to get stock
    return stock[sku];
  };

  function createOrderBC() {
    alert("CSO is aangemaakt!");
  }

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <div>
      <button onClick={createCSO} id='csoSendButton'>Verzenden</button>
      {showAlert && <CustomAlert title={alertTitle} message={alertMessage} onClose={handleCloseAlert} />}
    </div>
  );
}
