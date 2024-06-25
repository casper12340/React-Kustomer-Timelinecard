import React from 'react';

export default function RejectButton(props){
    function rejectRequest(){
        console.log("Request has been rejected")
    }

    return(
        <div>
            <button id='csoButton' onSubmit={rejectRequest}>Reject</button>
        </div>
    )
}