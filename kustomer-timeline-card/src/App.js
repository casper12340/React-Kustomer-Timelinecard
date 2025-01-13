import './App.css';
import React from 'react';
import Tabs from './Tabs/Tabs Status';

const App = (props) => {
  // Ensure useState is always called at the top level
  

  // Early return pattern
  const data2 = props.data2;
  if (!data2 || !data2.huts) {
    return <div>Je hebt geen toegang.</div>; // Or return null, if you don't want to render anything
  }

  // Extract necessary data from props
  const huts = data2.huts;
  const tt = props.paazlUrl;

  return (
    <div>
      <Tabs
        data2={{ huts }}
        paazlUrl={tt}
        setDeliveredStatus={props.setDeliveredStatus}
        delivered={props.delivered}
        pickupInfo={props.pickupInfo}
        deliveryTime={props.deliveryTime}
        returnData={props.returnData}
      />
    </div>
  );
};

export default App;
