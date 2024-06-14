import React from 'react';


export default function Delivered(props){



return(
    <div>
        <h3 style={{marginBottom:'0px', marginTop:'2px'}}>Bezorg informatie:</h3>
        <p>{props.pickupInfo} op {props.deliveryTime}</p>

        
    
    </div>
);
};