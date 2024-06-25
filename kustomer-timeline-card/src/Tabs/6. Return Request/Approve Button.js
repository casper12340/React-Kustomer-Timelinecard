import React from 'react';

export default function ApproveButton(props){
    function approveRequest(){
        console.log("Request has been approved")
    }

    return(
        <div>
            <button id='csoButton' onSubmit={approveRequest}>Approve</button>
        </div>
    )
}