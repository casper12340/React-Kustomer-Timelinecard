import './App.css';
import React from 'react';
import Tabs from './Tabs/Tabs Status'




const App = (props) => {
  if (!props.data2 || !props.data2.huts) {
    return null; // Do not render anything if props.data2.huts is not present
  }

  let huts = props.data2.huts
  let tt = props.data2.paazlUrl
  return (
    <div>

      <Tabs data2={{huts}} paazlUrl={tt}/>
    </div>
  );
};

export default App;
