import React from 'react';
import AddNote from './Add note';

export default function ApproveButton(props){
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
          return fetch("https://api-v2.returnless.com/2023-01/request-orders/returnorder_oo1nQE6Y2Xl77FlAgY9P9Jta0/approve", requestOptions)
            .then(response => response.json())
            .then(result => console.log(result))
            .catch(error => console.error('Error:', error));
        }
    




    function approveRequest(){
        if (props.noteID === ''){
            alert("Selecteer een notitie.")
        }
        else{
            AddNote(props.noteID, props.id)

            // If Free Shipping === True, the shipping should be free. Otherwise it should be paid
            if (props.checked){
                console.log("Request has been approved with free shipping")
                apiCall(props.id)
            }
            else {
                console.log("Request has been approved without free shipping")
                apiCall(props.id)
            }
        }
        

    }

    return(
        <div>
            <button id='requestButton' onClick={approveRequest}>Approve</button>
        </div>
    )
}