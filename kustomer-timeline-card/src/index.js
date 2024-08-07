import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import BasicInfo from './Basic Info/Basic Info';
import OrderInfo from './Order Info/Order Info';
import SetPaazlStatus from './setPaazlStatus';
import reportWebVitals from './reportWebVitals';
import CheckReturn from './Check Return';




const KustomerComponent = () => {
  let [huts, setHuts] = useState(null);
  console.log("testtestestkl;adjfks")
  useEffect(() => {
    // Define a Promise that resolves when the Kustomer initialization is complete
    const kustomerInitializationPromise = new Promise((resolve, reject) => {
      
      window.Kustomer.initialize((context, config) => {
        resolve({ ...context, ...config });
        // Kustomer.modal.resize({height: 10, width:1000})
      });
    });

    // Use the Promise
    kustomerInitializationPromise
      .then((result) => {
        // Handle the resolved value
        console.log('Kustomer initialized with:', result);
        setHuts(result);
        
      })
      .catch((error) => {
        console.error('Error initializing Kustomer:', error);
      });
  }, []);

  const [tt, setTT] = useState(null)
  function paazlStatus (url){
    setTT(url)
  };
  const [returnData, setReturnData] = useState();
  const [delivered, setDelivered] = useState(false);
  const [pickupInfo, setPickupInfo] = useState();
  const [deliveryTime, setDeliveryTime] = useState();
  function setDeliveredStatus(status, info, time){
    setDelivered(status);
    setPickupInfo(info);
    setDeliveryTime(time);
  }
  
  return (
    <React.StrictMode>
      <SetPaazlStatus paazlStatus={paazlStatus} data2={{huts}}/>
      <CheckReturn setReturnData={setReturnData} data2={{huts}}/>
      {/* {data2?.huts?.customContext?.kobject.data.returnless ? <CheckRequest setRequestData={setRequestData} data2={{huts}} requestData={requestData}/> : console.log("No return Request") } */}
      <BasicInfo data2={{huts}} paazlUrl={tt} delivered={delivered} returnData={returnData}/>

      <App data2={{huts}} paazlUrl={tt} setDeliveredStatus={setDeliveredStatus} delivered={delivered} pickupInfo={pickupInfo} deliveryTime={deliveryTime} returnData={returnData} />
      <OrderInfo data2={{huts}} paazlUrl={tt} delivered={delivered} returnData={returnData}/>
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<KustomerComponent />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
