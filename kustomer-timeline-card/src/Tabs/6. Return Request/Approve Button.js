import React from 'react';

export default function ApproveButton(props){
    function approveRequest(){

        if (props.noteID === ''){
            alert("Selecteer een notitie.")
        }

        // If checked == True, shipping should be free
        console.log(props.checked)
        if (props.checked){
            console.log("Request has been approved with free shipping")}
        else {
            console.log("Request has been approved without free shipping")
        }
    }

    return(
        <div>
            <button id='csoButton' onClick={approveRequest}>Approve</button>
        </div>
    )
}