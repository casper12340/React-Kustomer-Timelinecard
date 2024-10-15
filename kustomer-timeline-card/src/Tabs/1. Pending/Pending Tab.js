import React from 'react';


export default function Pending(props){
    console.log("jajajja", props)

    if (!props.data2) return <p>Aan het laden...</p>;

    let statusUpdate;
    if (props.data2.customContext.kobject.data.status_histories.length < 1){
        statusUpdate = <p>Empty</p>
        
    }
    else{
        statusUpdate = <p>{props.data2.customContext.kobject.data.status_histories[0].comment}</p>
    }

return(
    <div>
        <p>{statusUpdate}</p>
        {/* <h3>Paazl adres wijzigen</h3> */}
    </div>
    
);
};