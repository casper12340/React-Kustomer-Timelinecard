import Swal from 'sweetalert2';
import '/Users/casper.dekeijzer/Documents/react-folder/kustomer-timeline-card/src/Order Info/Order Info.css'

export async function getOldBCOrder(orderNumber) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", process.env.REACT_APP_CSO_TOKEN_DEV);
    
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };
    
    const urlSalesShipment = new URL((process.env.REACT_APP_BASE_URL_ROOT_DEV + `/salesshipment?$filter=orderNo eq '${orderNumber}'`));
    urlSalesShipment.searchParams.append('tenant', 'operations');


    const urlSalesOrders = new URL((process.env.REACT_APP_BASE_URL_ROOT_DEV + `/salesOrders?$filter=no eq '${orderNumber}'`));
    urlSalesOrders.searchParams.append('tenant', 'operations');

    
    try {
        const response = await fetch(urlSalesShipment, requestOptions);
        if (!response.ok) {
            Swal.fire({
                title: 'Oeps...',
                text: `Er is iets fout gegaan met het ophalen van de oude order in BC`,
                icon: 'error',
                confirmButtonText: 'Terug',
                position: "center"
            });
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let result = await response.json(); // Parse the JSON response
        console.log("Sales Shipment list result", result)
        
        if (!Array.isArray(result["value"]) || result["value"].length === 0) {
            // If order is not found in sales shipment list, then check sales orders list
            const response = await fetch(urlSalesOrders, requestOptions);
            if (!response.ok) {
                Swal.fire({
                    title: 'Oeps...',
                    text: `Er is iets fout gegaan met het ophalen van de oude order in BC`,
                    icon: 'error',
                    confirmButtonText: 'Terug',
                    position: "center"
                });
                throw new Error(`HTTP error! Status: ${response.status}`); // Check for HTTP errors
            }
            result = await response.json(); // Parse the JSON response
            console.log("Sales order result", result)
            
            if (!Array.isArray(result["value"]) || result["value"].length === 0) {
                Swal.fire({
                    title: 'Niet gevonden',
                    text: `De originele order is niet gevonden in BC`,
                    icon: 'error',
                    confirmButtonText: 'Terug',
                    position: "center"
                });

                throw new Error("Error: Original order was not found in BC.");
            }
            
        }
        console.log("Shipment header", result["value"][0]);

        if (result['value'][0] === undefined){
            Swal.fire({
                title: 'Niet gevonden',
                text: `De originele order is niet gevonden in BC`,
                icon: 'error',
                confirmButtonText: 'Terug',
                position: "center"
            });

            throw new Error("Error: Original order was not found in BC.");
        }

        return result["value"][0];
    }
    catch (error) {
        console.error('Fetch error:', error);
        throw error; // Re-throw the error for handling in the calling function
    }
    }
      
