import React, { useState, useEffect } from 'react';
import CustomAlert from './CustomAlert';
import transformOrderNumber from './Transform Order Number';
import setCSONumber from './Get CSO Number'
import setOldCSONumber from './Set CSO Number to Old';
import { getOldBCOrder } from './Get Original BC Order';
import LogUser from './Log User Created CSO'
import Swal from 'sweetalert2';
import '/Users/casper.dekeijzer/Documents/react-folder/kustomer-timeline-card/src/Order Info/Order Info.css'

var arr = [];

export default function CreateCSO(props) {
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '', show: false });
  const [closestMatches, setClosestMatches] = useState([]);  // Store closest matches
  const [loading, setLoading] = useState(false);
  const [lastProcessedIndex, setLastProcessedIndex] = useState(0);  // Track the last processed index in the loop
  const [pendingSku, setPendingSku] = useState(null); // Track the pending SKU for closest match selection
  const [progress, setProgress] = useState(0); // Initialize progress to 0
  const [queue, setQueue] = useState([]);
  const itemsWithAmount = []

  const addItemQueue = (item) => {
    setQueue((prevQueue) => [...prevQueue, item]);
  };

  const removeFirstItemFromQueue = () => {
    setQueue((prevQueue) => prevQueue.slice(1));
  };
  
  const data = props.data2.huts.customContext;
  const customerData = data.kobject.custom;
  
  const createCSO = async (skuToCheck = null) => {
    setLoading(true);


    try {
      const skusToProcess = Object.keys(props.csoQuantities).filter(
        (sku) => props.csoQuantities[sku] !== 0
      );
      setQueue(skusToProcess);  // Set queue

    } catch (error) {
      // await setOldCSONumber()
      console.error('Error during CSO creation:', error);
    }
  };

  // Effect to process queue after it's updated
  useEffect(() => {
    const totalSteps = 5;
    const stepProgress = 100 / totalSteps;
    if (queue.length > 0) {
      const processQueue = async () => {

        for (let i = lastProcessedIndex; i < queue.length; i++) {
          let sku = queue[i];

          if (props.csoQuantities[sku] !== 0) {
            try {
              const stockData = await checkItemStock(sku);

              if (stockData.available_stock === "" && stockData.closest_matches.length > 0) {
                setAlertMessage({
                  title: 'Let op!',
                  message: `${sku} is niet gevonden. Bedoelde je:`,
                  show: true
                });
                setClosestMatches(stockData.closest_matches);
                setPendingSku(sku);
                setLastProcessedIndex(i);
                return;
              } else if (stockData.available_stock <= 10) {
                arr = [];
                Swal.fire({
                  title: 'Onvoldoende voorraad!',
                  text: `${sku} is niet voldoende meer op voorraad.`,
                  icon: 'error',
                  confirmButtonText: 'Terug',
                  position: "center"
                });
                setQueue([])
                return;
              }

              arr.push([sku, stockData.ean, stockData.product_id]);
            } catch (error) {
              Swal.fire({
                title: 'Oeps...',
                text: `Er is een fout opgetreden bij het ophalen van de voorraad voor ${sku}.`,
                icon: 'error',
                confirmButtonText: 'Terug',
                position: "center"
              });
              setQueue([])
              return;
            }
          }
        }

        setProgress((prev) => Math.min(prev + stepProgress, 100));

        // Further processing (like creating CSO, updating state, etc.)
        const documentNumber = await setCSONumber();
        setProgress((prev) => Math.min(prev + stepProgress, 100));

        const oldBCOrder = await getOldBCOrder(customerData.incrementIdStr);

        console.log("OLD BC", oldBCOrder)
        setProgress((prev) => Math.min(prev + stepProgress, 100));

        if (arr.length === 0){
          Swal.fire({
            title: 'Oeps...',
            text: `Er is geen item geselecteerd uit de order, probeer het opnieuw.`,
            icon: 'error',
            confirmButtonText: 'Terug',
            position: "center"
          });
          setQueue([]);
          // await setOldCSONumber()
          return;
        }

        createOrderBC(arr, documentNumber, oldBCOrder);
        props.csoPresent();

        setProgress(100);
        
        props.setreason()
        props.setcsoquantities()
        arr = [];
        setLoading(false)
      };

      processQueue();
    }
  }, [queue, lastProcessedIndex, props.csoQuantities, customerData]);

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

      // Return both available_stock and closest_matches
      return {
        available_stock: result.available_stock,
        ean: result.ean,
        product_id: result.product_id,
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

  // Makes call to Sales Processing List
  const createOrderBC = async (finalSkus, documentNumber, oldBCOrder) => {
    console.log("Creating CSO for SKUs:", finalSkus);
    const finalAmount = Object.values(props.csoQuantities);
    // Create the saleslines array dynamically
    let saleslines = [];

    for(let i = 0; i < finalSkus.length; i++){
      console.log("FINAL SKUS", finalSkus)
      console.log("BARCODE", finalSkus[i][1])
      
      
      
      
      // appendToLogList(`${finalSkus[i][0]}: ${finalAmount[i]}`)





      // Transform the SKU and get the resulting array
      let transformedSkuArray = transformOrderNumber(finalSkus[i][2]);
      // Check if the transformed array has at least 2 elements
      if (transformedSkuArray.length >= 2) {
        const atelierSkus = [
          "MJ06486", "MJ06488", "MJ06490", "MJ06485", "MJ06482", "MJ06476", "MJ06479",
          "MJ05579", "MJ10569", "MJ05580", "MJ06483", "MJ06491", "MJ06480", "MJ06478", "MJ06473"
        ];
        const locationCode = atelierSkus.includes(transformedSkuArray[0]) ? "ATELIER" : "MW";
        saleslines.push({
          "lineNo": 10000 + (i * 10000),
          // "no": transformedSkuArray[0],
          // "variantCode": transformedSkuArray[1],
          // "locationCode": "MW",
          "locationCode": locationCode,
          "unitofMeasureCode": "PC",
          "quantity": finalAmount[i],
          "price": 0,
          "netAmount": 0,
          "amount": 0,
          "discountAmount": 0,
          "discountPercent": 0,
          // "barcode":"8719743587366"
          "barcode": finalSkus[i][1]
        });
        for(let j = 0; j < finalAmount[i]; j++){
          itemsWithAmount.push(`${finalSkus[i][0]}`)
        }
        // itemsWithAmount.push(`${finalSkus[i][0]}: ${finalAmount[i]}`)
        

      } else {
        console.error(`Invalid SKU transformation for index ${i}:`, transformedSkuArray);
      }
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", process.env.REACT_APP_CSO_TOKEN_DEV);
    
    // const customerNo = {"NL":["K-000001", "Magento B2C NL (Nederland))"], "BE":["K-001019", "Magento B2C (BE) België"], 
    //   "BG":["K-001407", "Magento B2C BG (Bulgarije)"], "CZ":["K-001408", "Magento B2C CZ (Tjechie)"], "DK":["K-001409", "Magento B2C DK (Denemarken)"], "DE":["K-001410", "Magento B2C DE (Duitsland)"], "EE":["K-001411", "Magento B2C EE (Estalnd)"], "IE":["K-001412", "Magento B2C IE (Ierland)"], "GR":["K-001413", "Magento B2C EL (Griekenland)"], "ES":["K-001414", "Magento B2C ES (Spanje)"], "FR":["K-001415", "Magento B2C FR (Frankrijk)"], "HR":["K-001416", "Magento B2C HR (Kroatie)"], "IT":["K-001417", "Magento B2C IT (Italie)"], "CY":["K-001418", "Magento B2C CY (Cyprus)"], 
    //   "LV":["K-001419", "Magento B2C LV (Letland)"], "LT":["K-001420", "Magento B2C HU (Lithouwen)"], "HU":["K-001421", "Magento B2C HU (Hongarije)"], "MT":["K-001422", "Magento B2C MT (Malta)"], "AT":["K-001423", "Magento B2C AT (Oostenrijk)"], "PL":["K-001424", "Magento B2C PL (Polen)"], "PT":["K-001425", "Magento B2C PT (Portugal)"], "RO":["K-001426", "Magento B2C RO (Roemenie)"], "SI":["K-001427", "Magento B2C SI (Slovenie)"], "FI":["K-001428", "Magento B2C FI (Finland)"], "SE":["K-001429", "Magento B2C SE (Zweden)"], 
    //   "GB":["K-001430", "Magento B2C Niet EU UK (Verenigd Koninkrijk)"], "NO":["K-001431", "Magento B2C Niet EU NO (Noorwegen)"], "CH":["K-001432", "Magento B2C Niet EU CH Zwitserland)"], "TR":["K-001433", "Magento B2C Niet EU TR (Turkije)"], "LU":["K-001675", "Magento B2C LU (Luxemburg)"]}

    const raw = JSON.stringify({
      "customerNo": oldBCOrder["sellToCustomerNo"],
      "storeNo": "",
      "documentType": "Order",
      // "reasonCode": props.reason,
      "documentNo": documentNumber,
      "paymentMethod": oldBCOrder["paymentMethodCode"],
      "orderStatus": "processing",
      "orderOrigin": "B2C",
      "orderID": documentNumber,
      "pspReference": "pspref",
      "basketPrice": 0,
      "shiptoName": customerData.customerNameStr,
      "shiptoID": "",
      "shiptoAddress": customerData.shippingStreetStr,
      "shiptoAddress2": "",
      "shiptoHouseNumber": "",
      "shiptoCity": customerData.shippingCityStr,
      "shiptoPostCode": customerData.shippingZipStr,
      "shiptoCounty": "",
      "shiptoCountryRegionCode": customerData.shippingCountryStr,
      "shiptoPhoneNo": "",
      "billtoName": data.kobject.data.billing_address.firstname,
      "billtoID": "",
      "billtoAddress": customerData.billingStreetStr,
      "billtoAddress2": "",
      "billtoHouseNumber": "",
      "billtoCity": customerData.billingCityStr,
      "billtoPostCode": customerData.billingZipStr,
      "billtoCounty": "",
      "billtoCountryRegionCode": customerData.billingCountryStr,
      "billtoPhoneNo": "",
      // "eMail": "casper.dekeijzer@my-jewellery.com",
      "eMail": customerData.customerEmailStr,
      "paazlShopID": "1184",
      "shippingAgentCode": oldBCOrder["shippingAgentCode"],
      "shipmentMethodCode": oldBCOrder["shippingAgentServiceCode"],
      "priceIncludeVAT": true,
      "externalDocumentNo": customerData.incrementIdStr,
      "mjysaleslines": saleslines
    });


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
    let itemsWithAmountStr
    // Check if there is an error in the result
    if (!result.error) {

      // Get item
      if (itemsWithAmount.length > 1){
        itemsWithAmountStr = itemsWithAmount.map(item => item).join(', ');
      }
      else{
        itemsWithAmountStr = itemsWithAmount[0]
      }
      console.log("itemswithamount", itemsWithAmount)
      console.log("itemsWithAmountStr", itemsWithAmountStr)
      LogUser(documentNumber, customerData.incrementIdStr, props.data2.huts.customContext.currentUser.name, props.reason, data.customer.id, itemsWithAmount);
      Swal.fire({
        title: 'Gelukt!',
        text: `Er is een CSO aangemaakt met nummer: ${documentNumber} Voor item(s): ${itemsWithAmountStr}`,
        icon: 'success',
        confirmButtonText: 'Verder',
        position: "center",
        showCancelButton: true,
        cancelButtonText: 'Kopieer nummer',
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
          // If the "Kopieer nummer" button is clicked, copy the documentNumber to the clipboard
          navigator.clipboard.writeText(documentNumber).then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Nummer gekopieerd!',
              text: `Er is een CSO aangemaakt met nummer: ${documentNumber} Voor item(s): ${itemsWithAmountStr}`,
              confirmButtonText: 'Ok',
              position: "center"
            });
          }).catch(() => {
            Swal.fire({
              icon: 'error',
              title: 'Fout, het kopieren is mislukt',
              text: `Er is een CSO aangemaakt met nummer: ${documentNumber} Voor item(s): ${itemsWithAmountStr}`,
              confirmButtonText: 'Ok',
              position: "center"
            });
          });
        }
      });
      setQueue([]);
    } else {
      Swal.fire({
        title: 'Oeps...',
        text: `Er is iets fout gegaan bij het aanmaken van de CSO. ${result.error.message}`,
        icon: 'error',  
        confirmButtonText: 'Terug',
        position: "center"
      });
      // await setOldCSONumber()
      setQueue([]);

    }
  
  } catch (error) {
    // Handle any network or other errors
    // await setOldCSONumber()
    console.error('Error creating CSO:', error);
    Swal.fire({
      title: 'Oeps...',
      text: `Er is iets fout gegaan bij het aanmaken van de CSO.`,
      icon: 'error',  
      confirmButtonText: 'Terug',
      position: "center"
    });
  }
  
  
};

  const handleSelectMatch = (selectedSku) => {
    setAlertMessage({ ...alertMessage, show: false });
    setClosestMatches([]);  // Clear closest matches after selection
    // Continue processing with the selected SKU
    // createCSO(selectedSku);
    removeFirstItemFromQueue()
    addItemQueue(selectedSku)
  };

  const handleCloseAlert = () => {
    setAlertMessage({ ...alertMessage, show: false });
    setClosestMatches([]);  // Clear closest matches when closing the alert
  };

  const url = new URL(process.env.REACT_APP_CSO_URL_DEV);
  return (
    <div>
    {loading && (
      <div style={{ width: '100%', backgroundColor: '#f3f3f3', borderRadius: '4px', margin: '10px 0' }}>
        <div
          style={{
            width: `${progress}%`,
            backgroundColor: '#4caf50',
            height: '10px',
            borderRadius: '4px',
            transition: 'width 0.3s ease-in-out',
          }}
        />
    </div>)}

    {url.href.includes("DEV") && (
      <div style={{color:'red', fontWeight: "700"}}>Let Op: Je maakt nu een order aan op de DEV omgeving!</div>
    )}
      <button
        onClick={() => createCSO()}
        id='csoSendButton'
        disabled={loading || !props.reason} // Disable button when loading
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
