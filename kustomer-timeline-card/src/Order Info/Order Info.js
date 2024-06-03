import React from 'react'

export default function OrderInfo(props) {
  if (!props.data2 || !props.data2.huts) {
    return null; // Do not render anything if props.data2.huts is not present
  }
  const kobject = props.data2.huts.customContext.kobject;
  const items = props.data2.huts.customContext.kobject.custom.itemsObj;
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
  const rowTotals = filteredItems.map(item => {
    const price = parseFloat((item.priceNum) * 1.21);
    // const discount = parseFloat(item.discountNum);
    // const rowTotal = item.quantityNum * (price - discount);
    const rowTotal = item.quantityNum * (price);
    totalsList.push(rowTotal.toFixed(2))
    return rowTotal.toFixed(2).replace('.', ',');
  });
  const totalSum = totalsList.reduce((acc, curr) => acc + parseFloat(curr), 0).toFixed(2);

  // Calculate total discount value
  // let discountList = []
  // filteredItems.map(item => {
  //   const discount = parseFloat(item.discountNum);
  //   discountList.push(discount.toFixed(2))
  //   return null
  // });
  // const totalDiscount = discountList.reduce((acc, curr) => acc + parseFloat(curr), 0).toFixed(2).replace('.',',');

  function csoColumn() {
    const container = document.getElementById('csoDiv');
    if (container) {
      container.style.display = 'block';
    }
  }

  return (
    
    <div>
      <div className="container">
        <div className="fourColumns">
          <h3><u>Product Naam</u></h3>
          {filteredItems.map((item, index) => (
            <React.Fragment key={index}>
              <p id='noMarginBottom'>{item.nameStr}</p>
              <p style={{color:'gray'}} id='noMarginTop'>{item.skuStr}</p>
            </React.Fragment>
          ))}
        </div>

        <div className="fourColumns" style={{ maxWidth: "60px"}}>
          <h3 className="center"><u>Prijs</u></h3>
          {filteredItems.map((item, index) => (
            <React.Fragment>
            <p key={index} className="center" id='noMarginBottom'>€ {((item.priceNum) * 1.21).toFixed(2).replace('.', ',')}</p>
            <p id='noMarginTop'>.</p>
            </React.Fragment>
          ))}
        </div>
        <div className="fourColumns" style={{ maxWidth: "60px"}}>
          <h3 className="center"><u>Aantal</u></h3>
          {filteredItems.map((item, index) => (
            <React.Fragment key={index}>
            <p key={index} className="center" id='noMarginBottom'>{item.quantityNum}</p>
            <p id='noMarginTop'>.</p>
            </React.Fragment>
          ))}
        </div>
        {/* <div className="fourColumns" style={{ maxWidth: "60px"}}>
          <h3 className="center"><u>Korting</u></h3>
          {filteredItems.map((item, index) => (
            <React.Fragment key={index}>
            <p key={index} className="center" id='noMarginBottom'>€{(item.discountNum).toFixed(2).replace('.', ',')}</p>
            {index !== rowTotals.length - 1 && <p id='noMarginTop'>.</p>}
            </React.Fragment>
          ))}
          <div className="divider"></div>
          <p className="center" id='noMarginBottom'>€{totalDiscount}</p>
        </div> */}

        <div className="fourColumns" id="csoDiv" style={{ display: 'none', maxWidth:'120px' }}>
          <h3 className="center"><u>CSO Aantal</u></h3>
          {filteredItems.map((item, index) => (
            <React.Fragment key={index}>
            <div className='center'>
            <input key={index} id={`number-${index}`} type="number" min="0" max={item.quantityNum} defaultValue="0" style={{marginBottom:'0px', alignItems:'center'}}/>
            </div>
            <p id='noMarginTop'>.</p>
            </React.Fragment>
          ))}
        </div>



        <div className="fourColumnsTotal" style={{textAlign:"right"}}>
          <h3><u>Totaal</u></h3>
          {rowTotals.map((total, index) => (
            <React.Fragment key={index}>
            <p key={index} id='noMarginBottom'>€ {total}</p>
            {index !== rowTotals.length - 1 && <p id='noMarginTop'>.</p>}
            </React.Fragment>
          ))}
          <div className="divider"></div>
          <p id='noMarginBottom'>€ {totalSum.replace('.', ',')}</p>
          <div className="paragraph-wrapper">
          {kobject.data.base_discount_amount !== 0 && (
              <>
                <p style={{ textAlign: 'left' }}>{kobject.data.discount_description ? kobject.data.discount_description : "Korting:"}</p>
                <p style={{ paddingTop: '10px' }}>€ {(kobject.data.base_discount_amount).toFixed(2).replace('.', ',')}</p>
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
      {filteredItems.length > 0 && (
        <button id='csoButton' onClick={csoColumn}>CSO Aanmaken</button>
      )}


    </div>

  );
}
