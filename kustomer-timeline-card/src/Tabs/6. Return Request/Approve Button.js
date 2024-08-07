import React from 'react';
import AddNote from './Add note';

export default function ApproveButton(props){
    function approveRequest(){

        if (props.noteID === ''){
            alert("Selecteer een notitie.")
        }
        else{
            console.log(props.noteID)
            // AddNote(props.noteID, props.id) 
            AddNote(props.noteID)
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
            <button id='requestButton' onClick={approveRequest}>Approve</button>
        </div>
    )
}