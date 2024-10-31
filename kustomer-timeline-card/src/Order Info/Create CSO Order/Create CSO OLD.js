import React, { useState } from 'react';
import CustomAlert from './CustomAlert';
import transformOrderNumber from './Transform Order Number';



import setCSONumber from './Get CSO Number'
import { getOldBCOrder } from './Get Original BC Order';

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
            arr.push([sku, stockData.ean])
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
        // arr.push(sku);
        // Clear skuToCheck after it's processed to allow the loop to continue normally
        skuToCheck = null;
      }

      // If no issues with stock, proceed to create the CSO
      const documentNumber = await setCSONumber()
      console.log("Document Number", documentNumber)

      const oldBCOrder = await getOldBCOrder(customerData.incrementIdStr)
      console.log('hoi', oldBCOrder['paymentMethodCode'])

      createOrderBC(arr, documentNumber, oldBCOrder);  // Pass all processed SKUs
      props.csoPresent();

    } finally {
      arr = []
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
      const response = await fetch(process.env.REACT_APP_GET_STOCK_URL, requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`); // Fixed string interpolation
      }
      const result = await response.json();
      console.log("Stock", result.available_stock);
      console.log("EAN", result.ean);

      // Return both available_stock and closest_matches
      return {
        available_stock: result.available_stock,
        ean: result.ean,
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

  const createOrderBC = async (finalSkus, documentNumber, oldBCOrder) => {
    console.log("Document Number:", documentNumber)
    console.log("Creating CSO for SKUs:", finalSkus);
    const finalAmount = Object.values(props.csoQuantities);
    // Create the saleslines array dynamically
    let saleslines = [];

    for(let i = 0; i < finalSkus.length; i++){
      // Transform the SKU and get the resulting array
      let transformedSkuArray = transformOrderNumber(finalSkus[i][0]);
      // Check if the transformed array has at least 2 elements
      if (transformedSkuArray.length >= 2) {
        saleslines.push({
          "type": "Item",
          "documentType": "Order",
          "documentNo": documentNumber, // You might want to customize this for each sales line if needed
          "lineNo": 10000 + (i * 10000), // Increment the line number by 10000 for each item
          "locationCode": "MW",
          // "no": transformedSkuArray[0],  // First element as "no"
          "description": "",
          // "variantCode": transformedSkuArray[1],  // Second element as "variantCode"
          // "barcode": finalSkus[i][1], // You might want to replace this with a dynamic value if applicable
          "barcode": "8719954198825",
          "quantity": finalAmount[i], // Adjust this as needed
          "unitofMeasureCode": "PC",
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
    myHeaders.append("Authorization", process.env.REACT_APP_CSO_TOKEN_DEV);
    
    
    
    const customerNo = {"NL":["K-000001", "Magento B2C NL (Nederland))"], "BE":["K-001019", "Magento B2C (BE) België"], 
      "BG":["K-001407", "Magento B2C BG (Bulgarije)"], "CZ":["K-001408", "Magento B2C CZ (Tjechie)"], "DK":["K-001409", "Magento B2C DK (Denemarken)"], "DE":["K-001410", "Magento B2C DE (Duitsland)"], "EE":["K-001411", "Magento B2C EE (Estalnd)"], "IE":["K-001412", "Magento B2C IE (Ierland)"], "GR":["K-001413", "Magento B2C EL (Griekenland)"], "ES":["K-001414", "Magento B2C ES (Spanje)"], "FR":["K-001415", "Magento B2C FR (Frankrijk)"], "HR":["K-001416", "Magento B2C HR (Kroatie)"], "IT":["K-001417", "Magento B2C IT (Italie)"], "CY":["K-001418", "Magento B2C CY (Cyprus)"], 
      "LV":["K-001419", "Magento B2C LV (Letland)"], "LT":["K-001420", "Magento B2C HU (Lithouwen)"], "HU":["K-001421", "Magento B2C HU (Hongarije)"], "MT":["K-001422", "Magento B2C MT (Malta)"], "AT":["K-001423", "Magento B2C AT (Oostenrijk)"], "PL":["K-001424", "Magento B2C PL (Polen)"], "PT":["K-001425", "Magento B2C PT (Portugal)"], "RO":["K-001426", "Magento B2C RO (Roemenie)"], "SI":["K-001427", "Magento B2C SI (Slovenie)"], "FI":["K-001428", "Magento B2C FI (Finland)"], "SE":["K-001429", "Magento B2C SE (Zweden)"], 
      "GB":["K-001430", "Magento B2C Niet EU UK (Verenigd Koninkrijk)"], "NO":["K-001431", "Magento B2C Niet EU NO (Noorwegen)"], "CH":["K-001432", "Magento B2C Niet EU CH Zwitserland)"], "TR":["K-001433", "Magento B2C Niet EU TR (Turkije)"], "LU":["K-001675", "Magento B2C LU (Luxemburg)"]}


    const raw = JSON.stringify({
      "documentType": "Order",
      "documentNo": documentNumber,
      "paymentMethod": oldBCOrder["paymentMethodCode"],
      "orderStatus": "Processing",
      "orderOrigin": oldBCOrder["orderOrigin"],
      "requestedDeliveryDate": formattedToday,
      "orderID": documentNumber,
      "customerNo": oldBCOrder["sellToCustomerNo"],
      // "customerNo": customerNo[customerData.shippingCountryStr][0],
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
      "selltoName": oldBCOrder["sellToCustomerName"],
      // "selltoName": customerNo[customerData.shippingCountryStr][1],
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
      "shippingAgentCode": oldBCOrder["shippingAgentCode"],
      // "shippingAgentCode": "POSTNL",
      "shippingAgentServiceCode": oldBCOrder["shippingAgentServiceCode"],
      // "shippingAgentServiceCode": "AVG",
      "shipmentMethodCode": "",
      "priceIncludeVAT": true,
      "externalDocumentNo": customerData.incrementIdStr,
      "saleslines": saleslines
    });

// const url = new URL('https://sieradenbeheerapi.my-jewellery.com:7068/ACCEPT2/api/tcg/imr/v2.0/companies(762e400d-b869-ec11-be1e-000d3abee88a)/sales');
// const url = new URL('https://sieradenbeheerapi.my-jewellery.com:7018/DEV/api/tcg/imr/v2.0/companies(762e400d-b869-ec11-be1e-000d3abee88a)/sales');
const url = new URL(process.env.REACT_APP_CSO_URL_DEV);
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
