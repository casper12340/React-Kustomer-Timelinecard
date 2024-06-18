import React, { useState } from 'react';

export default function OrderInfo(props) {

  
  console.log(props)
  const [cso, setCso] = useState(false);
  if (!props.data2 || !props.data2.huts) {
    return null; // Do not render anything if props.data2.huts is not present
  }
  const kobject = props.data2.huts.customContext.kobject;
  const items = props.data2.huts.customContext.kobject.custom.itemsObj;

  let tax;
  if (kobject.data.extension_attributes.applied_taxes.length < 1){
    tax = 1.21
  }
  else{
    tax = kobject.data.extension_attributes.applied_taxes[0].percent/100+1
  }
  // let tax = kobject.data.extension_attributes.applied_taxes[0].percent/100+1
  console.log("Tax Kustomer ", tax)
  
  const uniqueSkus = new Set(); // To keep track of unique skuStr values
  // Filtering out items with duplicate skuStr values
  const filteredItems = items.filter(item => {
    if (uniqueSkus.has(item.skuStr)) {
      return false; // If skuStr already exists, don't include this item
    } else {
      uniqueSkus.add(item.skuStr); // Add skuStr to the set
      return true;
    }
  });

  // Calculate total prices
  let totalsList = []
  filteredItems.map(item => {
    const price = parseFloat((item.priceNum) * tax);
    const rowTotal = item.quantityNum * (price);
    totalsList.push(rowTotal.toFixed(2))
    return rowTotal.toFixed(2).replace('.', ',');
  });
  const totalSum = totalsList.reduce((acc, curr) => acc + parseFloat(curr), 0).toFixed(2);



  // function csoColumn() {
  //   const container = document.getElementById('csoDiv');
  //   if (container) {
  //     container.style.display = 'block';
  //   }
  // }

  
  function csoPresent(){
    setCso(!cso); // Toggle the CSO state
    console.log(cso)
  };

  console.log(props.delivered)
  return (
    <div>
    <div style={{ marginTop: '20px' }}>
    <div style={{ display: 'grid', gap: '0px' }}>
        {/* Header Row */}
        <div style={{ display: 'grid', gridTemplateColumns: `3fr 1fr 1fr ${cso ? '1fr' : ""} 3fr `, gap: '0px', paddingLeft:'10px', fontWeight: 'bold' }}>
          
            <div><h3><u>Product Naam</u></h3></div>
            <div><h3 className="center"><u>Prijs</u></h3></div>
            <div><h3 className="center"><u>Aantal</u></h3></div>
            {cso && (
                <div>
                  <h3 className="center"><u>CSO</u></h3>
                </div>
              )}
            <div><h3 style={{ textAlign: 'right' }}><u>Totaal</u></h3></div>
            
        </div>

          {filteredItems.map((item, index) => (
            <div key={index} style={{ display: 'grid', gridTemplateColumns: `3fr 1fr 1fr ${cso ? '1fr' : ""} 3fr`, alignItems: 'center', gap: '0px', paddingLeft: '10px', backgroundColor: index % 2 === 0 ? 'white' : '#f0f0f0'}}>
              {/* Prooduct Name and Number */}
              <div>
                <p id='smallMarginBottomAndTop'>{item.nameStr}</p>
                <p style={{color:'gray'}} id='smallMarginBottomAndTop'>{item.skuStr}</p>
              </div>
              {/* Item Price */}
              <div style={{marginTop:'0px'}}>
                <p key={index} className="center" id='smallMarginBottomAndTop'>€ {((item.priceNum) * tax).toFixed(2).replace('.', ',')}</p>
              </div>
              {/* Item Quantity */}
              <div style={{marginTop:'0px'}}>
                <p key={index} className="center" id='smallMarginBottomAndTop'>{item.quantityNum}</p>
              </div> 
              {/* CSO order */}
              {cso && (
                <div className='center'>
                  <input key={index} id={`number-${index}`} type="number" min="0" max={item.quantityNum} defaultValue="0" style={{ marginBottom: '0px', alignItems: 'center' }} />
                </div>
              )}
              {/* Total price */}
              <div style={{marginTop:'0px'}}>
                <p key={index} id='smallMarginBottomAndTop' style={{ textAlign: 'right' }}>€ {(item.quantityNum*((item.priceNum) * tax)).toFixed(2).replace('.', ',')} </p>
              </div>  
            </div>            
          ))}
            <div style={{ display: 'grid', gridTemplateColumns: `3fr 1fr 1fr ${cso ? '1fr' : ""} 3fr`, alignItems: 'center', gap: '0px ', paddingLeft: '10px'}}>
              <div></div>
              <div></div>
              <div></div>
              {cso && <div></div>}
              <div id='smallMarginBottomAndTop' style={{ textAlign: 'right' }}>

                <div className="divider"></div>
                <p id='smallMarginBottomAndTop'>€ {totalSum.replace('.', ',')}</p>
                <div className="paragraph-wrapper">
                {kobject.data.base_discount_amount !== 0 && (
                  <>
                    <p style={{ textAlign: 'left' }}>{kobject.data.discount_description ? kobject.data.discount_description : "Korting:"}</p>
                    <p style={{ paddingTop: '10px'}}>€ {(kobject.data.base_discount_amount).toFixed(2).replace('.', ',')}</p>
                  </>
                )}
                <p style={{textAlign:'left'}}>Verzendkosten:</p>
                <p style={{paddingTop:'10px'}}>€ {(kobject.data.shipping_incl_tax).toFixed(2).replace('.', ',')}</p>
                <div className="divider"></div>
                <p style={{textAlign:'left'}}>Totaal:</p>
                <p style={{paddingTop:'10px'}}>€ {(kobject.data.grand_total).toFixed(2).replace('.', ',')}</p>
                </div>
              </div>
            </div>
          </div>
          



            


      {props.delivered && filteredItems.length > 0 && (
        <button id='csoButton' onClick={csoPresent}>CSO Aanmaken</button>
      )}


    </div>
    </div>
  );
}
