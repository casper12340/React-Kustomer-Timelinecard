    // myHeaders.append("Authorization", process.env.REACT_APP_CSO_TOKEN);
    // const url = (process.env.REACT_APP_BASE_URL_ROOT + `/salesshipment?$filter=orderNo eq '${props}'`)

export async function getOldBCOrder(orderNumber) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", process.env.REACT_APP_CSO_TOKEN_DEV);
    
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };
    
    const url = new URL((process.env.REACT_APP_BASE_URL_ROOT_DEV + `/salesshipment?$filter=orderNo eq '${orderNumber}'`));
    url.searchParams.append('tenant', 'operations');
    console.log("url", url);
    
    try {
        const response = await fetch(url, requestOptions); // Wait for the fetch to complete
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`); // Check for HTTP errors
        }
        const result = await response.json(); // Parse the JSON response
        
        if (!Array.isArray(result["value"]) || result["value"].length === 0) {
            throw new Error("Error: The list is empty.");
        }
        console.log("Shipment header", result["value"][0]);
        return result["value"][0];
    }
    catch (error) {
        console.error('Fetch error:', error);
        throw error; // Re-throw the error for handling in the calling function
    }
    }
      
