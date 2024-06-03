import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import BasicInfo from './Basic Info/Basic Info';
import OrderInfo from './Order Info/Order Info';
import SetPaazlStatus from './setPaazlStatus';
import reportWebVitals from './reportWebVitals';
import jsonData from '/Users/casper.dekeijzer/Documents/react-folder/kustomer-timeline-card/src/Data/Data.json';



const KustomerComponent = () => {
  let [huts, setHuts] = useState(null);

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

  console.log(tt)

  return (
    <React.StrictMode>
      
      <SetPaazlStatus paazlStatus={paazlStatus} data2={{huts}}/>
      <BasicInfo data={jsonData} data2={{huts}} paazlUrl={tt}/>

      <App data2={{huts}} paazlUrl={tt}/>
      <OrderInfo data={jsonData} data2={{huts}} paazlUrl={tt}/>

    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<KustomerComponent />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
