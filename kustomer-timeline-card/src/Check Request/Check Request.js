import React, { useState, useEffect } from 'react';
import SecondRequest from './Second Request';

export default function CheckRequest(props) {
  const [requestList, setRequestList] = useState(null);
  const [requestID, setRequestID] = useState(null);
  const { data2, setRequestData } = props;

  // Ensure nested properties are checked for existence
  const kobject = data2?.huts?.customContext?.kobject;
  const orderID = kobject?.custom?.incrementIdStr;

  useEffect(() => {
    // Proceed only if orderID is available
    if (!orderID) {
      console.error("Order ID is missing.");
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer Vg0fXemNY4JJl0pAQr2DMY56RsM4v9D0jzQo6mdAea67746f");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch("https://api-v2.returnless.com/2023-01/request-orders", requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(result => {
        if (result.data) {
          setRequestList(result.data);
        } else {
          setRequestList([]);
          console.warn("No data found in the response.");
        }
      })
      .catch(error => {
        setRequestList([]);
        console.error("Fetch error:", error);
      });
  }, [orderID]);

  useEffect(() => {
    if (!requestList) return;

    for (const request of requestList) {
      if (request.includes && request.includes.sales_order) {
        if (request.includes.sales_order.order_number === orderID) {
          setRequestID(request.id);
          break;
        }
      } else {
        console.warn("Request data structure is unexpected or missing properties.");
      }
    }
  }, [requestList, orderID]);

  return (
    <div>
      {requestID && <SecondRequest setRequestData={setRequestData} requestID={requestID} />}
    </div>
  );
}
