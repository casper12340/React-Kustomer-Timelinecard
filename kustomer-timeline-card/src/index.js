import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import BasicInfo from './Basic Info/Basic Info';
import reportWebVitals from './reportWebVitals';
import jsonData from "/Users/casper.dekeijzer/Documents/react-folder/kustomer-timeline-card/src/Data/Data.json";




// Define a Promise that resolves when the Kustomer initialization is complete
const kustomerInitializationPromise = new Promise((resolve, reject) => {
  window.Kustomer.initialize((context, config) => {

    resolve({ ...context, ...config });
  });
});

let huts
// Use the Promise
kustomerInitializationPromise.then((result) => {
  // Handle the resolved value
  console.log('Kustomer initialized with:', result);
  huts = result;

}).catch((error) => {
  console.error('Error initializing Kustomer:', error);
});




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <p>{huts}</p>
    <BasicInfo data={jsonData} />
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
