import React, {useEffect} from 'react'

export default function ReturnlessRequest (props){

    const { requestID, setRequestData } = props;


    useEffect(() => {
        // Proceed only if orderID is available
        if (!requestID) {
          console.error("Request ID is missing.");
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
    
        fetch(`https://api-v2.returnless.com/2023-01/request-orders/${requestID}`, requestOptions)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(result => {
            if (result) {
                setRequestData(result);
                console.log(result)
            } else {
                setRequestData([]);
              console.warn("No data found in the response.");
            }
          })
          .catch(error => {
            setRequestData([]);
            console.error("Fetch error:", error);
          });
      }, [requestID, setRequestData]);

    return(
        <div>{requestID}</div>
    )
}