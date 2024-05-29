import React from 'react';


export default function BasicInfo(props) {

  return (
    <div id="basicInfo">
      <div id="basicInfoHeadingRow" className="row">
        <div className="column">
          <p id="basicInfoTitle">Bestelling <b>#{props.data.ordernummer}</b></p>
        </div>

        <div className="column">
          <p id="basicInfoTitle">Status: <b>{props.data.status}</b></p>
        </div>
      </div>

      <div className="row">
        <div className="column">
          <h3>Verzend gegevens</h3>
            {/* <p><b>Adres</b></p> */}
            <div class="address" >
                <p>{props.data.customer.street} {props.data.customer.number},</p>
                <p>{props.data.customer.city} {props.data.customer.zip}</p>
            </div>
          <h3>Verzend gegevens</h3>
          <ul>
            <li>Adres gegevens</li>
            <li>Betaal gegevens</li>
          </ul>
        </div>

        <div className="column">
        <h3>Factuur gegevens</h3>
            <div className="address" >
                <p>{props.data.customer.street} {props.data.customer.number},</p>
                <p>{props.data.customer.city} {props.data.customer.zip}</p>
            </div>


          <p><b>Aangemaakt op:</b> {props.data2.huts ? (props.data2.huts.customContext.currentUser.createdAt) : "Kustomer Data Not Available"}</p>
          <p><b>Geüpdatet op:</b> {props.data.updated_at}</p>
          <p><b>Naam:</b> {props.data2.huts ? (props.data2.huts.customContext.currentUser.displayName) : "Kustomer Data Not Available"}</p>
        </div>
      </div>
      <p></p>
    </div>
  );
}
