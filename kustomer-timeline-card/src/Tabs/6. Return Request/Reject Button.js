import React from 'react';

export default function RejectButton(props){
    function rejectRequest(){

        if (props.noteID === ''){
            alert("Selecteer een notitie.")
        }


        console.log("Request has been rejected")
    }

    return(
        <div>
            <button id='csoButton' onClick={rejectRequest}>Reject</button>
        </div>
    )
}