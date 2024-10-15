import React, { useState } from 'react';
import AddNote from './Add note';
import CustomAlert from '/Users/casper.dekeijzer/Documents/react-folder/kustomer-timeline-card/src/Order Info/Create CSO Order/CustomAlert.js'; // Import your custom alert component

export default function ApproveWoShipment(props) {
    const [alertMessage, setAlertMessage] = useState({ title: '', message: '', show: false });

    function apiCall(id) {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", process.env.REACT_APP_RETURNLESS_TOKEN);
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            redirect: "follow"
        };
        return fetch(`https://api-v2.returnless.com/2023-01/request-orders/${id}/approve-without-shipment`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.json();
            })
            .then(result => result)
            .catch(error => { throw error });
    }

    function setReturnStatus(id) {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", process.env.REACT_APP_RETURNLESS_TOKEN);
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");

        const urlencoded = new URLSearchParams();
        urlencoded.append("status_id", "returnstatus_aaVkP09mYJPJvTbaXw5r5ZUaQ");

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            redirect: "follow",
            body: urlencoded
        };
        return fetch(`https://api-v2.returnless.com/2023-01/return-orders/${id}/return-status`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.json();
            })
            .then((result) => console.log("Set Return Status:", result))
            .catch(error => { throw error });
    }

    async function approveRequestWoShipment() {
        if (props.noteID === '') {
            setAlertMessage({
                title: 'Selecteer Notitie.',
                message: `Je hebt geen notitie toegevoegd, selecteer er een en probeer het opnieuw.`,
                show: true
            });
        } else {
            try {
                // Assume AddNote is synchronous, or handle it as needed.
                AddNote(props.noteID, props.id);
                
                // Wait for the API call to complete
                await apiCall(props.id);
                
                const noteIDList = ["365837a0_New_Item_No_Returns", "xfvt70o6_PNOV_No_Returns", "76a084af_Refund_No_Returns"];

                if (props.noteID && noteIDList.includes(props.noteID)) {
                    await setReturnStatus(props.id);
                }
                
                
                // Set the success message after successful API call
                setAlertMessage({
                    title: 'Gelukt!',
                    message: `Request is goedgekeurd zonder verzending.`,
                    show: true
                });
                console.log("Request approved without Shipment");
            } catch (error) {
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

    return (
        <div>
            {alertMessage.show && <CustomAlert title={alertMessage.title} message={alertMessage.message} onClose={handleCloseAlert} />}
            <button id='requestButton' onClick={approveRequestWoShipment}>Approve w/o Shipment</button>
        </div>
    );
}
