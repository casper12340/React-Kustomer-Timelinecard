import React from 'react';

export default function Closed(props) {
    console.log("The return Data is: ", props.returnData)
    return (
        <div>
            <h3 style={{ marginBottom: '0px', marginTop: '2px' }}>Retour informatie:</h3>
            {props.returnData?.data && props.returnData.data.length > 0 ? (
                <div>
                    <p>{(props.returnData.data[0].created_at)}</p>
                    {/* Render more details if needed */}
                </div>
            ) : (
                <p>Aan het laden...</p> // or handle no data case
            )}
            <p>Item 1</p>
            <p>Item 2</p>
            <p>Item 3</p>
        </div>
    );
}
