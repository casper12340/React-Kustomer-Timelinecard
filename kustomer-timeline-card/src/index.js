import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import BasicInfo from './Basic Info/Basic Info';
import OrderInfo from './Order Info/Order Info';
import reportWebVitals from './reportWebVitals';
import jsonData from '/Users/casper.dekeijzer/Documents/react-folder/kustomer-timeline-card/src/Data/Data.json';





const KustomerComponent = () => {
  const [huts, setHuts] = useState(null);

  useEffect(() => {
    // Define a Promise that resolves when the Kustomer initialization is complete
    const kustomerInitializationPromise = new Promise((resolve, reject) => {
      window.Kustomer.initialize((context, config) => {
        resolve({ ...context, ...config });
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
      console.log(huts ? huts.customContext : "nothing")
  return (
    <React.StrictMode>
      {/* <p>{huts ? JSON.stringify(huts.customContext.currentUser.createdAt) : 'Initializing Kustomer...'}</p> */}
      {/* <p>{JSON.stringify(huts.data.type)}</p> */}
      <BasicInfo data={jsonData} data2={{huts}} />

      {/* <BasicInfo data={jsonData} /> */}
      <App />
      <OrderInfo data={jsonData} />
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<KustomerComponent />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
