import React from 'react';
import jsonData from "/Users/casper.dekeijzer/Documents/react-folder/kustomer-timeline-card/src/Data/Data.json";

export default function Preparing(){



return(
    <div>
    
        <h3>Warehouse status:</h3>
        <ul>
            <li>{jsonData.latest_warhouse_status}</li>
            <li><b>Last Update:</b> {jsonData.updated_at}</li>
            <li><b>Image from packing machine: <img src="https://www.cadeaukaart.nl/sites/live/files/2022-09/my-jewellery-1500px_0.jpg" alt="My Jewellery" width="100px" style={{verticalAlign: "top"}}/></b></li>
        </ul>
    
    </div>
    
);
};