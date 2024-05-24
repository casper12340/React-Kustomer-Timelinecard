import React from 'react';
import './Order Info.css'

export default function OrderInfo (props) {

    return(
      <div className="container">
      <div className="fourColumns">
        <h2>Product Names</h2>
        {props.data.items.map((item, index) => (
          <p key={index}>{item.product_name}</p>
        ))}
      </div>
      <div className="fourColumns">
        <h2>MJ Numbers</h2>
        {props.data.items.map((item, index) => (
          <p key={index}>{item.mj_number}</p>
        ))}
      </div>
      <div className="fourColumns">
        <h2>Prices</h2>
        {props.data.items.map((item, index) => (
          <p key={index}>{item.price}</p>
        ))}
      </div>
    </div>
    
    )
}