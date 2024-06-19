import React, { useState, useEffect } from 'react';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';

const PostNLStatus = (props) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const originalUrl = props.paazlUrl;
  const params = new URLSearchParams(originalUrl.split('?')[1]);
  const shipmentId = params.get('B');
  const countryCode = params.get('D');
  const postalCode = params.get('P');
  const newUrl = `https://jouw.postnl.nl/track-and-trace/api/trackAndTrace/${shipmentId}-${countryCode}-${postalCode}?language=nl`;

  // Function to add 2 hours to the date and format it
  function changeDate(date) {
    const dateObject = new Date(date);
    dateObject.setUTCHours(dateObject.getUTCHours() + 2);
    return format(dateObject, "dd-MM-yyyy HH:mm");
  }

  // Function to format the package delivery message
  const PackageDelivery = (start, end) => {
    const startDate = parseISO(start);
    const endDate = parseISO(end);
    if (isToday(startDate)) {
      return `De bestelling wordt vandaag bezorgd tussen ${format(startDate, 'HH:mm')} en ${format(endDate, 'HH:mm')}.`;
    } else if (isTomorrow(startDate)) {
      return `De bestelling wordt morgen bezorgd tussen ${format(startDate, 'HH:mm')} en ${format(endDate, 'HH:mm')}.`;
    } else {
      return `De bestelling wordt ${format(startDate, 'EEEE', { locale: nl })} ${format(startDate, 'dd', { locale: nl })} ${format(startDate, 'MM', { locale: nl })} bezorgd tussen ${format(startDate, 'HH:mm')} en ${format(endDate, 'HH:mm')}.`;
    }
  };

  // Function to format the delivery time
  function deliveryTimeFormat(dateString) {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy 'om' HH:mm", { locale: nl });
  }

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

        const result = await response.json();
        setData(result);

        // Check and set the delivered status after data is fetched
        if (result.colli) {
          Object.keys(result.colli).forEach((key) => {
            const item = result.colli[key];
            if (item.isDelivered) {
              props.setDeliveredStatus(true, item.statusPhase.message, deliveryTimeFormat(item.lastObservation));
            }
          });
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [props, newUrl]);

  const renderColliData = (colli) => {
    if (!colli) return null;

    return Object.keys(colli).map((key) => {
      const item = colli[key];

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
          ) : null}
          <p className='bodyItems'><b>Laatste Update PostNL</b></p>
          <p className='bodyItems'>{changeDate(item.lastObservation)}</p>
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
