import React from 'react';

export default function BasicInfo (props) {

// let datum = new Date()
return(
    
    <div id="basicInfo">

        <div id="basicInfoHeadingRow" class="row">
            <div class="column">
                <p id="basicInfoTitle">Bestelling <b>#{props.data.ordernummer}</b></p>
            </div>

            <div class="column">
                <p id="basicInfoTitle">Status: <b>{props.data.status}</b></p>
            </div>
        </div>

        <div class="row">
            <div class="column">
                <h3>Order informatie</h3>
                <ul>
                    <li>Adres gegevens</li>
                    <li>Betaal gegevens</li>
                </ul>
            </div>

            <div class="column">
                <p><b>Created at:</b> {props.data.created_at}</p>
                <p><b>Updated at:</b> {props.data.updated_at}</p>

                {/* <p><b>Updated at:</b>{datum}</p> */}

            </div>
        </div>




        <p></p>
    </div>
)
}