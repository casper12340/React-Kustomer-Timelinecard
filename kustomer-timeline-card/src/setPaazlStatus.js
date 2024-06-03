import React, { useEffect } from 'react';

export default function SetPaazlStatus({ paazlStatus }) {

  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer ndWhja9Ly9WgS2x5PdJLKvavq");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch("https://api.paazl.com/v1/orders/116636524/shipments", requestOptions)
      .then(response => {
        console.log('Response', response);
        if (response.status === 200) {
          return response.json();  // Parse response as JSON
        } else {
          throw new Error('Status != 200');
        }
      })
      .then(result => {
        paazlStatus(result.shipments[0].trackingUrl);
      })
      .catch(error => console.error('Error:', error));
  }, []);  // Empty dependency array to run once on mount

  return null;
}
