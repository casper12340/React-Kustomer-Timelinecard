import React from 'react';
import PostNLStatus from './PostNL Status'

export default function Shipped(props){

return(
    <div>
        <h3 style={{marginBottom:'0px', marginTop:'2px'}}>Track & Trace informatie:</h3>
        {props.paazlUrl.includes("postnl") ? <PostNLStatus paazlUrl={props.paazlUrl} setDeliveredStatus={props.setDeliveredStatus}/> : <p>"No postNL"</p>}

    </div>
);
};