import React from 'react';

export default function BasicInfo(props) {
  // Accessing data from props
  console.log(props); // Accessing data from props
//   console.log(props.data2); // Accessing data from props2

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
          <h3>Order informatie</h3>
          <ul>
            <li>Adres gegevens</li>
            <li>Betaal gegevens</li>
          </ul>
        </div>

        <div className="column">
          <p><b>Created at:</b> {props.data2.huts ? (props.data2.huts.customContext.currentUser.createdAt) : "Kustomer Data Not Available"}</p>
          <p><b>Updated at:</b> {props.data.updated_at}</p>
        </div>
      </div>
      <p></p>
    </div>
  );
}
