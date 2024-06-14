import React from 'react';
import PostNLStatus from './PostNL Status'; // Fixed the import statement
import DHLStatus from './DHL Status'; // Fixed the import statement

export default function Shipped(props) {
  // Check that props.paazlUrl is not null and not undefined
  const paazlUrl = props.paazlUrl || '';


  return (
    <div>
      <h3 style={{marginBottom:'0px', marginTop:'2px'}}>Track & Trace informatie:</h3>
      {paazlUrl.includes("postnl") ? (
        <PostNLStatus paazlUrl={paazlUrl} setDeliveredStatus={props.setDeliveredStatus} />
      ) : null}
      {paazlUrl.includes("dhl") ? (
        <DHLStatus paazlUrl={paazlUrl} setDeliveredStatus={props.setDeliveredStatus} />
      ) : null}
    {paazlUrl !== 'Er is geen Track & Trace bekend' && (
        <>
          <p className='postNL'><b>Track & Trace</b></p>
          <a href={paazlUrl} target="_blank" rel="noopener noreferrer" className='postNL'>{paazlUrl}</a>
        </>
      )}
    {paazlUrl === 'Er is geen Track & Trace bekend' && (
        <p className='postNL'>{paazlUrl}</p>
    )}
    </div>
  );
}