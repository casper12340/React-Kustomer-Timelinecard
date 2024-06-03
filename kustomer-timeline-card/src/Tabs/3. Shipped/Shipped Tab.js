import React from 'react';


export default function Shipped(props){

console.log(props)

return(
    <div>
        <h3>Track & Trace informatie:</h3>
        <a href={props.paazlUrl} target="_blank" rel="noopener noreferrer">{props.paazlUrl}</a>

    </div>
);
};