import React from 'react';
import './Order Info.css'

export default function OrderInfo (props) {

  const rowTotals = props.data.items.map(item => {
    // Replace comma with dot and parse the price to float
    const price = parseFloat(item.price.replace(',', '.'));
    // Calculate the total for this row
    const rowTotal = item.quantity * price;
    return rowTotal;
  });

  function csoColumn () {
    console.log("huts")
  }
  
  

    return(
      <div>
        <div className="container">
        <div className="fourColumns">
          <h3><u>Product Naam</u></h3>
          {props.data.items.map((item, index) => (
            <p key={index}>{item.product_name}</p>
          ))}
        </div>
        <div className="fourColumns">
          <h3><u>MJ Nummer</u></h3>
          {props.data.items.map((item, index) => (
            <p key={index}>{item.mj_number}</p>
          ))}
        </div>
        <div className="fourColumns" style={{maxWidth:"60px"}}>
          <h3 className="center"><u>Prijs</u></h3>
          {props.data.items.map((item, index) => (
            <p key={index} className="center">€ {item.price}</p>
          ))}
        </div>
        <div className="fourColumns" style={{maxWidth:"60px"}}>
          <h3 className="center"><u>Aantal</u></h3>
          {props.data.items.map((item, index) => (
            <p key={index} className="center">{item.quantity}</p>
          ))}
        </div>
        <div className="fourColumns" >
          <h3><u>Totaal</u></h3>
          {rowTotals.map((total, index) => (
            <p key={index}>€ {total.toFixed(2).replace('.', ',')}</p>
          ))}
        </div>
      </div>
      {props.data.status === "Delivered" && (
        <button id='csoButton' onClick={csoColumn}>CSO Aanmaken</button>
      )}
    </div>
    )
}