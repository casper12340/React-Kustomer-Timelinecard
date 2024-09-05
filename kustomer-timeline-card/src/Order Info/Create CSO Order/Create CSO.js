import React, { useState } from 'react';
import CustomAlert from './CustomAlert';
import transformOrderNumber from './Transform Order Number';



import setCSONumber from './Get CSO Number'

var arr = []; // Create an empty array

export default function CreateCSO(props) {
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '', show: false });
  const [closestMatches, setClosestMatches] = useState([]);  // Store closest matches
  const [loading, setLoading] = useState(false);
  const [lastProcessedIndex, setLastProcessedIndex] = useState(0);  // Track the last processed index in the loop
  const [pendingSku, setPendingSku] = useState(null); // Track the pending SKU for closest match selection
  const data = props.data2.huts.customContext;
  const customerData = data.kobject.custom;

  
  const createCSO = async (skuToCheck = null) => {
    setLoading(true); // Set loading to true at the start
    try {
      // Filter out SKUs with zero quantity
      const skusToProcess = Object.keys(props.csoQuantities).filter(sku => props.csoQuantities[sku] !== 0);

      for (let i = lastProcessedIndex; i < skusToProcess.length; i++) {
        const sku = skuToCheck || skusToProcess[i];

        console.log("THE SKU IS:", sku);
        
        if (props.csoQuantities[sku] !== 0) {
          try {
            const stockData = await checkItemStock(sku); // Await the checkItemStock function
            if (stockData.available_stock === "" && stockData.closest_matches.length > 0) {
              // Show closest matches in an alert with options to select
              setAlertMessage({
                title: 'Let op!',
                message: `${sku} is niet gevonden. Bedoelde je:`, // Message prompting for closest match
                show: true
              });
              setClosestMatches(stockData.closest_matches);  // Save closest matches to state
              setPendingSku(sku);  // Save the current SKU causing the closest match issue
              setLastProcessedIndex(i);  // Save the index to resume from later
              return;  // Exit early to wait for user input
            } else if ((stockData.available_stock) <= 10 ) {
              arr = [];
              setAlertMessage({
                title: 'Let op!',
                message: `${sku} is niet voldoende meer op voorraad.`, // Fixed string interpolation
                show: true
              });
              return; // Exit early to avoid further processing
            }
          } catch (error) {
            // Handle error scenario, e.g., log it or show an alert
            setAlertMessage({
              title: 'Fout!',
              message: `Er is een fout opgetreden bij het ophalen van de voorraad voor ${sku}.`, // Fixed string interpolation
              show: true
            });
            return; // Exit early to avoid further processing
          }

        }
        arr.push(sku);
        // Clear skuToCheck after it's processed to allow the loop to continue normally
        skuToCheck = null;
      }

      // If no issues with stock, proceed to create the CSO
      const documentNumber = await setCSONumber()
      console.log("Document Number", documentNumber)

      createOrderBC(arr, documentNumber);  // Pass all processed SKUs
      props.csoPresent();

    } finally {
      setLoading(false); // Ensure loading is set to false after processing
    }
  };

  const checkItemStock = async (sku) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");

    const raw = JSON.stringify({
      "sku": sku
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    try {
      const response = await fetch("https://europe-west3-mj-staging.cloudfunctions.net/available-stock-to-kustomer", requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`); // Fixed string interpolation
      }
      const result = await response.json();
      console.log("Stock", result.available_stock);

      // Return both available_stock and closest_matches
      return {
        available_stock: result.available_stock,
        closest_matches: result.closest_matches || []
      };

    } catch (error) {
      console.error("Error fetching stock:", error);
      throw error;
    }
  };

  // const csoNumber = GetCSONumber();

  const today = new Date();
  const formattedToday = today.getFullYear() + '-' + 
    String(today.getMonth() + 1).padStart(2, '0') + '-' + 
    String(today.getDate()).padStart(2, '0');

  const createOrderBC = async (finalSkus, documentNumber) => {
    console.log("Creating CSO for SKUs:", finalSkus);
    const finalAmount = Object.values(props.csoQuantities);
    // Create the saleslines array dynamically
    let saleslines = [];

    for(let i = 0; i < finalSkus.length; i++){
      // Transform the SKU and get the resulting array
      let transformedSkuArray = transformOrderNumber(finalSkus[i]);
      // Check if the transformed array has at least 2 elements
      if (transformedSkuArray.length >= 2) {
        saleslines.push({
          "type": "Item",
          "documentType": "Order",
          "documentNo": documentNumber, // You might want to customize this for each sales line if needed
          "lineNo": 10000 + (i * 10000), // Increment the line number by 10000 for each item
          "locationCode": "MW",
          "no": transformedSkuArray[0],  // First element as "no"
          "description": "",
          "variantCode": transformedSkuArray[1],  // Second element as "variantCode"
          "barcode": "", // You might want to replace this with a dynamic value if applicable
          "quantity": finalAmount[i], // Adjust this as needed
          "unitofMeasureCode": "PCS",
          "price": 0,
          "amount": 0,
          "netamount": 0,
          "discountAmount": 0,
          "discountPercent": 0,
          "invDiscountAmount": 0,
          "lineID": "",
          "plannedShipmentDate": formattedToday,
          "plannedDeliveryDate": formattedToday,
          "webTransactionID": "00000000-0000-0000-0000-000000000000",
          "prepaymentPercentage": 0,
          "prepaymentAmount": 0,
          "purchasingCode": ""
        });
      } else {
        console.error(`Invalid SKU transformation for index ${i}:`, transformedSkuArray);
      }
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Basic SU5URUdSQVRJT05fUFJEOm9rVjUkKmZMaEk2QFZweTExR3QzUzlDWThCV25BMkh0TkMkbnomMFk=`);
    
    const customerNo = {"NL":"K-000001", "BE":"K-001019", "DE":"K-001410", "FR":"K-001415", "ES":"K-001414", "AT":"K-001423", "PL":"K-001424", "PT":"K-001425", 
      "BG":"K-001407", "CZ":"K-001408", "DK":"K-001409", "EE":"K-001411", "IE":"K-001412", "GR":"K-001413", "HR":"K-001416", "IT":"K-001417", "CY":"K-001418", 
      "LV":"K-001419", "LT":"K-001420", "HU":"K-001421", "MT":"K-001422", "PT":"K-001425", "RO":"K-001426", "SI":"K-001427", "FI":"K-001428", "SE":"K-001429", 
      "GB":"K-001430", "NO":"K-001431", "CH":"K-001432", "TR":"K-001433"}


    const raw = JSON.stringify({
      "documentType": "Order",
      "documentNo": documentNumber,
      "paymentMethod": "05",
      "orderStatus": "Pending",
      "orderOrigin": "B2C",
      "requestedDeliveryDate": formattedToday,
      "orderID": documentNumber,
      "customerNo": customerNo[customerData.shippingCountryStr],
      "pspReference": "PSPREF",
      "webTransactionID": "00000000-0000-0000-0000-000000000000",
      "basketPrice": 0,
      "shiptoName": customerData.customerNameStr,
      "shiptoID": "",
      "shiptoAddress": customerData.shippingStreetStr,
      "shiptoAddress2": "",
      "shiptoCity": customerData.shippingCityStr,
      "shiptoPostCode": customerData.shippingZipStr,
      "shiptoCountryRegionCode": customerData.shippingCountryStr,
      "selltoName": customerData.customerNameStr,
      "selltoID": "",
      "selltoAddress": customerData.shippingStreetStr,
      "selltoCity": customerData.shippingCityStr,
      "selltoPostCode": customerData.shippingZipStr,
      "billtoName": customerData.customerNameStr,
      "billtoID": "",
      "billtoAddress": customerData.billingStreetStr,
      "billtoCity": customerData.billingCityStr,
      "billtoPostCode": customerData.billingZipStr,
      // "eMail": customerData.customerEmailStr,
      "eMail": "casper.dekeijzer@my-jewellery.com",
      "shippingAgentCode": "POSTNL",
      "shipmentMethodCode": "AVG",
      "priceIncludeVAT": true,
      "externalDocumentNo": customerData.incrementIdStr,
      "saleslines": saleslines
    });

const url = new URL('https://sieradenbeheerapi.my-jewellery.com:7068/ACCEPT2/api/tcg/imr/v2.0/companies(762e400d-b869-ec11-be1e-000d3abee88a)/sales');
  url.searchParams.append('tenant', 'operations');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    });
    const result = await response.json();
    console.log(result);

    alert(`Gelukt! Er is een CSO aangemaakt met nummer: ${documentNumber}`)

  } catch (error) {
    console.error('Error creating CSO:', error);
  }
};

  const handleSelectMatch = (selectedSku) => {
    setAlertMessage({ ...alertMessage, show: false });
    setClosestMatches([]);  // Clear closest matches after selection

    // Continue processing with the selected SKU
    createCSO(selectedSku);
  };

  const handleCloseAlert = () => {
    setAlertMessage({ ...alertMessage, show: false });
    setClosestMatches([]);  // Clear closest matches when closing the alert
  };

  return (
    <div>
      <button
        onClick={() => createCSO()}
        id='csoSendButton'
        disabled={loading} // Disable button when loading
      >
        {loading ? 'Bezig...' : 'Verzenden'} {/* Change button text based on loading state */}
      </button>
      {alertMessage.show && (
        <CustomAlert
          title={alertMessage.title}
          message={alertMessage.message}
          onClose={handleCloseAlert}
          closestMatches={closestMatches}  // Pass closest matches to CustomAlert
          onSelect={handleSelectMatch}  // Pass selection handler to CustomAlert
        />
      )}
    </div>
  );
}
