import React from 'react';
import AddNote from './Add note';

export default function ApproveWoShipment(props){
    function approveRequestWoShipment(){

        if (props.noteID === ''){
            alert("Selecteer een notitie.")
        }

        console.log("Request approved without Shipment")
    }

    return(
        <div>
            <button id='requestButton' onClick={approveRequestWoShipment}>Approve w/o Shipment</button>
        </div>
    )
}