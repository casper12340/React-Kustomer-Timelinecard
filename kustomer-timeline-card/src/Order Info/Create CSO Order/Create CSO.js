import React, { useState, useEffect } from 'react';
import CustomAlert from './CustomAlert'; // Import your custom alert component

export default function CreateCSO(props) {
  const stock = { "MJ10925-0400-XL": 9, "MJ07610-1500": 100 };
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

  const checkItemStock = (sku) => {
    // Fetch request or other logic to get stock
    return stock[sku];
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
