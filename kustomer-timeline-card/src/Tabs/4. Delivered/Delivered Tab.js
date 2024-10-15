import React from 'react';


export default function Delivered(props){
    function deliveredMessage(){
        if (props.pickupInfo && props.deliveryTime){
            if (props.pickupInfo === 'The shipment has been successfully delivered'){
                return <p>Het pakket is bezorgd op {props.deliveryTime}</p>
            }
            else{
                return <p>{props.pickupInfo} op {props.deliveryTime}</p>
            }
        }

    }



return(
    <div>
        <h3 style={{marginBottom:'0px', marginTop:'2px'}}>Bezorg informatie:</h3>
        {deliveredMessage()}



    
    </div>
);
};