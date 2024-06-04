import React from 'react';


export default function BasicInfo(props) {
  if (!props.data2 || !props.data2.huts) {
    return null; // Do not render anything if props.data2.huts is not present
  }
  
  const kobject = props.data2.huts.customContext.kobject;
  let state = kobject.custom.stateStr;

  if (props.paazlUrl && state === 'processing') {
    // Set status to 'shipped'
    state = 'shipped';
  }
  if (props.delivered && (state === "Shipped" || state === "shipped")){
    state = "delivered"
  }
  const statusMap = {
    "new": "Pending",
    "pending": "Pending",
    "processing": "Preparing Shipment",
    "shipped": "Shipped",
    "delivered": "Delivered",
    "canceled": "Canceled",
    "closed": "Closed"
  };
let status = statusMap[state] || state; // Default to the original state if not found in the map


  function changeDate (date){
    // Parse the original date string to a Date object
    const dateObject = new Date(date);

    // Function to format numbers to two digits
    const padToTwoDigits = (num) => String(num).padStart(2, '0');

    // Format the Date object to the desired string format
    const formattedDateTime = 
      `${padToTwoDigits(dateObject.getUTCDate())}-${padToTwoDigits(dateObject.getUTCMonth() + 1)}-${dateObject.getUTCFullYear()} ` +
      `${padToTwoDigits(dateObject.getUTCHours())}:${padToTwoDigits(dateObject.getUTCMinutes())}`;
      return formattedDateTime}

  return (
    <div id="basicInfo">
      <div id="basicInfoHeadingRow" className="row">
        <div className="column">
          <p id="basicInfoTitle">Bestelling <b>#{kobject.custom.incrementIdStr}</b></p>
        </div>
        <div className="column">
          <p id="basicInfoTitle">Status: <b>{status}</b></p>
        </div>
      </div>
      <div className="row">

        {/* Column Links */}
        <div className="column">
          <p style={{marginBottom:'2px'}}><b>Aangemaakt op:</b></p>
          <p style={{marginTop:'0px'}}>{changeDate(kobject.createdAt)}</p>
          <p style={{marginBottom:'2px', fontSize:'18px'}}><b>Verzendgegevens</b></p>
          <div className="address" >
            <p style={{marginTop:'8px'}}>{kobject.custom.shippingStreetStr},</p>
            <p>{kobject.custom.shippingCityStr} {kobject.custom.shippingZipStr}</p>
          </div>
          <div>
            <p style={{marginBottom:'2px'}}><b>Verzendmethode</b></p>
            <p style={{marginTop:'0px'}}>{kobject.data.shipping_description} - € {(kobject.data.shipping_incl_tax).toFixed(2).replace('.', ',')}</p>
          </div>
        </div>
        {/* Column Rechts */}
        <div className="column">
          <p style={{marginBottom:'2px'}}><b>Geüpdatet op:</b></p>
          <p style={{marginTop:'0px'}}>{changeDate(kobject.updatedAt)}</p>
          <p style={{marginBottom:'2px', fontSize:'18px'}}><b>Factuurgegevens</b></p>
            <div className="address" >
              <p style={{marginTop:'8px'}}>{kobject.custom.billingStreetStr},</p>
              <p>{kobject.custom.billingCityStr} {kobject.custom.billingZipStr}</p>
            </div>

            <p style={{marginBottom:'2px'}}><b>Betaalmethode:</b></p>
            <p style={{marginTop:'0px'}}>{kobject.data.payment.method}</p>
          </div>
        </div>
    </div>
  );
}
