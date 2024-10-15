import { useEffect } from 'react';

export default function SetPaazlStatus(props) {
  useEffect(() => {
    // Check if props and props.data2 exist and if props.data2.huts.customContext is defined
    if (!props || !props.data2 || !props.data2.huts || !props.data2.huts.customContext) {
      return; // Exit early if necessary props are not present
    }

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    
    myHeaders.append("Authorization", process.env.REACT_APP_PAAZL_TOKEN);
    
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
        if (result.shipments && result.shipments.length > 0 && result.shipments[0].trackingUrl) {
          // Check if shipments exist and if the first shipment has a trackingUrl
          props.paazlStatus(result.shipments[0].trackingUrl); // Assuming you want the first shipment's trackingUrl
        } else {
          throw new Error('No T&T present');
        }
      })
      .catch(error => console.error('Error:', error));
  }, [props]);  // Empty dependency array to run once on mount
  return null;
}
