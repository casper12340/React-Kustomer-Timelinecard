import React, { useEffect } from 'react';

export default function SetPaazlStatus(props) {
  useEffect(() => {
    // Check if props and props.data2 exist and if props.data2.huts.customContext is defined
    if (!props || !props.data2 || !props.data2.huts || !props.data2.huts.customContext) {
      return; // Exit early if necessary props are not present
    }

    console.log('huts in SetPaazlStatus:', props.data2.huts.customContext.kobject.data.increment_id);

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer ndWhja9Ly9WgS2x5PdJLKvavq");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(`https://api.paazl.com/v1/orders/${props.data2.huts.customContext.kobject.data.increment_id}/shipments`, requestOptions)
      .then(response => {
        if (response.status === 200) {
          return response.json();  // Parse response as JSON
        } else {
          throw new Error('Status != 200');
        }
      })
      .then(result => {
        props.paazlStatus(result.shipments[0].trackingUrl);
      })
      .catch(error => console.error('Error:', error));
  }, [props]);  // Empty dependency array to run once on mount

  return null;
}
