import React, { useState } from 'react';
import AddNote from './Add note';
import CustomAlert from '/Users/casper.dekeijzer/Documents/react-folder/kustomer-timeline-card/src/Order Info/Create CSO Order/CustomAlert.js'; // Import your custom alert component


export default function ApproveButton(props){
    const [alertMessage, setAlertMessage] = useState({ title: '', message: '', show: false })

    async function apiCall(id){
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
        return fetch(`https://api-v2.returnless.com/2023-01/request-orders/${id}/approve`, requestOptions)
            .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
            .then(result => result)
            .catch(error => { throw error });
        }
    
    async function apiCallFreeShipping(id){
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer XhPeDPsNuaHf7pw2GAWNBA2HmKNuGQyRZ1ZDpm1hd0649e8c");
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "enabled": true
          });
        
          const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
          };
        // Change this to id
        return fetch(`https://api-v2.returnless.com/2023-01/request-orders/${id}/free-shipping`, requestOptions)
            .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
            .then(result => result)
            .catch(error => { throw error });

    }
    
    async function approveRequest(){
        if (props.noteID === ''){
            setAlertMessage({
                title: 'Selecteer Notitie.',
                message: `Je hebt geen notitie toegevoegd, selecteer er een en probeer het opnieuw.`,
                show: true
            });
        }
        else{
            try{
                AddNote(props.noteID, props.id)

                // If Free Shipping === True, the shipping should be free. Otherwise it should be paid
                if (props.checked){
                    
                    console.log("Request has been approved with free shipping")
                    await apiCall(props.id);

                    await apiCallFreeShipping(props.id)

                    setAlertMessage({
                        title: 'Gelukt!',
                        message: `Request is goedgekeurd met gratis verzending.`, // Fixed string interpolation
                        show: true
                    });
                }
                else {
                    console.log("Request has been approved")
                    await apiCall(props.id);
                    setAlertMessage({
                        title: 'Gelukt!',
                        message: `Request is goedgekeurd.`, // Fixed string interpolation
                        show: true
                    });
                }
            }
            catch (error) {
                // Handle the error case
                setAlertMessage({
                    title: 'Fout.',
                    message: `Er is een fout opgetreden: ${error.message}`,
                    show: true
                });
                console.error('Error:', error);
            }
        }
    }

    const handleCloseAlert = () => {
        setAlertMessage({ ...alertMessage, show: false });
      };

    return(
        <div>
            {alertMessage.show && <CustomAlert title={alertMessage.title} message={alertMessage.message} onClose={handleCloseAlert} />}
            <button id='requestButton' onClick={approveRequest}>Approve</button>
        </div>
    )
}