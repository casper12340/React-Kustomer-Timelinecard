import React, { useState, useEffect } from 'react';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';

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
    // const now = new Date();
    let message = '';
  
    if (isToday(startDate)) {
      message = `De bestelling wordt vandaag bezorgd tussen ${format(startDate, 'HH:mm')} en ${format(endDate, 'HH:mm')}.`;
    } else if (isTomorrow(startDate)) {
      message = `De bestelling wordt morgen bezorgd tussen ${format(startDate, 'HH:mm')} en ${format(endDate, 'HH:mm')}.`;
    } else {
      message = `De bestelling wordt ${format(startDate, 'EEEE', { locale: nl })} ${format(startDate, 'dd', { locale: nl })} ${format(startDate, 'MM', { locale: nl })} bezorgd tussen ${format(startDate, 'HH:mm')} en ${format(endDate, 'HH:mm')}.`;

    }
    return message}

  
    function deliveryTimeFormat(dateString) {
      const date = new Date(dateString);
      return format(date, "d MMMM yyyy 'om' HH:mm", { locale: nl });
    }

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
        setData(result);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [newUrl]);

  const renderColliData = (colli) => {
    if (!colli) return null;

    return Object.keys(colli).map((key) => {
      const item = colli[key];
      
      // Set Delivered status
      if (item.isDelivered === true){
        props.setDeliveredStatus(true, item.statusPhase.message, deliveryTimeFormat(item.lastObservation))
      }

      return (
        <div key={key}>
          <p className='bodyItems'><b>Huidige Status PostNL</b></p>
          <p className='bodyItems'>{item.statusPhase.message}.</p>
          {!item.isDelivered ? (
        item.eta && item.eta.start && item.eta.end ? (
          <p className='bodyItems'>{PackageDelivery(item.eta.start, item.eta.end)}</p>
        ) : (
          <p className='bodyItems'>Levertijd is nog niet bekend.</p>
        )
      ) : (
        null
      )}
          <p className='bodyItems'><b>Laatste Update PostNL</b></p>
          <p className='bodyItems'>{changeDate(item.lastObservation)}</p>

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

    </div>
  );
};

export default PostNLStatus;
