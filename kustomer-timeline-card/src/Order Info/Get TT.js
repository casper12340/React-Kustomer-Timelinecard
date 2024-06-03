import React, { useEffect, useState } from 'react';

export default function GetTT() {
  const [data, setData] = useState(null);

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
      .then(response => response.json())  // Parse JSON response
      .then(result => {
        setData(result);  // Store the result in the state
        console.log(result);
      })
      .catch(error => console.error(error));
  }, []);  // Empty dependency array to run once on mount

  // Render the fetched data
  return (
    <div>
      {data ? (
        <a href={data.shipments[0].trackingUrl} target="_blank" rel="noopener noreferrer">{data.shipments[0].trackingUrl}</a>  // Display the fetched data
      ) : (
        <p>Data not available</p>
      )}
    </div>
  );
}
