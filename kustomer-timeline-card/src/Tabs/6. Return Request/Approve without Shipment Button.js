import React from 'react';

export default function ApproveWoShipment(props){
    function approveRequestWoShipment(){
        console.log("Request approved without Shipment")
    }

    return(
        <div>
            <button id='csoButton' onSubmit={approveRequestWoShipment}>Approve w/o Shipment</button>
        </div>
    )
}