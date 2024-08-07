import React from 'react';
import AddNote from './Add note';

export default function RejectButton(props){
    function apiCall(id){
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer XhPeDPsNuaHf7pw2GAWNBA2HmKNuGQyRZ1ZDpm1hd0649e8c");
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        
          const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            redirect: "follow"
          };
        // Change this to id
          return fetch("https://api-v2.returnless.com/2023-01/request-orders/returnorder_oo1nQE6Y2Xl77FlAgY9P9Jta0/reject", requestOptions)
            .then(response => response.json())
            .then(result => console.log(result))
            .catch(error => console.error('Error:', error));
        }

    function rejectRequest(){

        if (props.noteID === ''){
            alert("Selecteer een notitie.")
        }
        else{
            AddNote(props.noteID, props.id)
            apiCall(props.id)
        }
        


        console.log("Request has been rejected")
    }

    return(
        <div>
            <button id='requestButton' onClick={rejectRequest}>Reject</button>
        </div>
    )
}