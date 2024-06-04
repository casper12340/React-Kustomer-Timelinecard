import React, { useState, useEffect } from 'react';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';


const PostNLStatus = (props) => {

  function changeDate(date) {
    // Parse the original date string to a Date object
    const dateObject = new Date(date);
  
    // Add 2 hours to the date
    dateObject.setUTCHours(dateObject.getUTCHours() + 2);
  
    // Function to format numbers to two digits
    const padToTwoDigits = (num) => String(num).padStart(2, '0');
  
    // Format the Date object to the desired string format
    const formattedDateTime =
      `${padToTwoDigits(dateObject.getUTCDate())}-${padToTwoDigits(dateObject.getUTCMonth() + 1)}-${dateObject.getUTCFullYear()} ` +
      `${padToTwoDigits(dateObject.getUTCHours())}:${padToTwoDigits(dateObject.getUTCMinutes())}`;
    return formattedDateTime;
  }
  





  const PackageDelivery = (start, end) => {
    const startDate = parseISO(start);
    const endDate = parseISO(end);
    const now = new Date();
    console.log(now)
    let message = '';
  
    if (isToday(startDate)) {
      message = `De bestelling wordt vandaag bezorgd tussen ${format(startDate, 'HH:mm')} en ${format(endDate, 'HH:mm')}.`;
    } else if (isTomorrow(startDate)) {
      message = `De bestelling wordt morgen bezorgd tussen ${format(startDate, 'HH:mm')} en ${format(endDate, 'HH:mm')}.`;
    } else {
      message = `De bestelling wordt ${format(startDate, 'EEEE')} bezorgd tussen ${format(startDate, 'HH:mm')} en ${format(endDate, 'HH:mm')}.`;
    }
    return message}

  


  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const originalUrl = props.paazlUrl;

  // Extracting relevant parts from the original URL
  const params = new URLSearchParams(originalUrl.split('?')[1]);
  const shipmentId = params.get('B');
  const countryCode = params.get('D');
  const postalCode = params.get('P');

  // Constructing the new URL
  const newUrl = `https://jouw.postnl.nl/track-and-trace/api/trackAndTrace/${shipmentId}-${countryCode}-${postalCode}?language=nl`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://europe-west1-mj-customer-service-tools.cloudfunctions.net/function-1", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ url: newUrl })
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const result = await response.json(); // Assuming the response is JSON
        console.log(result)
        setData(result);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [newUrl]);

  const renderColliData = (colli) => {
    if (!colli) return null;

    return Object.keys(colli).map((key) => {
      const item = colli[key];
      console.log(props)
      if (item.isDelivered === true){
        props.setDeliveredStatus(true)
        console.log("Het is bezorgd!")
      }
      return (
        <div key={key}>
          {/* <h3>Barcode: {item.barcode}</h3>
          <p>Identification: {item.identification}</p>
          <p>Effective Date: {item.effectiveDate}</p>
          <p>Description: {item.description}</p>
          <h4>Recipient:</h4>
          <p>Company Name: {item.recipient.names.companyName}</p>
          <p>Street: {item.recipient.address.street}</p>
          <p>House Number: {item.recipient.address.houseNumber}</p>
          <p>Postal Code: {item.recipient.address.postalCode}</p>
          <p>Town: {item.recipient.address.town}</p>
          <p>Country: {item.recipient.address.country}</p> */}
          <p className='postNL'><b>Huidige Status PostNL</b></p>
          <p className='postNL'> {item.statusPhase.message}</p>
          <p className='postNL'><b>Laatste Update PostNL</b></p>
          <p className='postNL'>{changeDate(item.lastObservation)}</p>
          {!item.isDelivered ? (
        item.eta && item.eta.start && item.eta.end ? (
          <p>{PackageDelivery(item.eta.start, item.eta.end)}</p>
        ) : (
          <p>Levertijd is nog niet bekend.</p>
        )
      ) : (
        <p></p>
      )}
          {/* {item.eta.start ? <p>Wordt bezorgd tussen {changeDate(item.eta.start)} en {changeDate(item.eta.end)}</p> : <p>Levertijd is nog niet bekend.</p>} */}
          {/* Add more fields as needed */}
          </div>
      );
    });
  };


  

  return (
    <div>
      

      {error ? (
        <p>Error: {error}</p>
      ) : (
        data && renderColliData(data.colli)
      )}

      <a href={props.paazlUrl} target="_blank" rel="noopener noreferrer" className='postNL'>{props.paazlUrl}</a>
    </div>
  );
};

export default PostNLStatus;
