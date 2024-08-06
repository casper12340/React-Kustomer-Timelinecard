import React, { useEffect } from 'react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Tab } from '@mui/material';
import './Tabs.css';
import Pending from './1. Pending/Pending Tab';
import Preparing from './2. Processing/Processing Tab';
import Shipped from './3. Shipped/Shipped Tab';
import Delivered from './4. Delivered/Delivered Tab';
import Returned from './5. Returned/Returned Tab';
import ReturnRequest from './6. Return Request/Return Request Tab';

export default function Tabs(props) {   
    let kobject = props.data2.huts.customContext.kobject
    let state = kobject.custom.statusStr;
    if (props.paazlUrl && state === 'processing') {
       // Set status to 'shipped'
        state = 'shipped';
    }
    if (props.delivered && (state === "Shipped" || state === "shipped")){
        state = "delivered"
    }
    if (kobject.data?.returnless){
        state = 'request'
    }
    // State = Returned
    if (props.returnData){
        if (props.returnData !== "No return data found"){
        state = "returned"
    }}

    const statusMap = {
      "new": "Pending",
      "pending": "Pending",
      "pending_payment": "Pending",
      "payment_review": "Pending",
      "processing": "Processing",
      "shipped": "Shipped",
      "delivered": "Delivered",
      "canceled": "Canceled",
      "returned": "Returned",
      'request': "Return Request",
      "closed": "Returned"
    };
    
    let status = statusMap[state] || state;

    const [value, setValue] = React.useState(status);

    useEffect(() => {
        setValue(status);
    }, [status]);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    
    // Button background and text colors
    const pendingColors = {"Pending":["#e3a4c0", "bold"], "Processing":["#fce8f1","normal"], "Shipped":["#fce8f1","normal"], "Delivered":["#fce8f1","normal"], "Returned":["#fce8f1", "normal"], "Return Request":["#fce8f1", "normal"]}
    const preparingColors = {"Pending":["#fff","normal"], "Processing":["#e3a4c0","bold"], "Shipped":["#fce8f1","normal"], "Delivered":["#fce8f1","normal"], "Returned":["#fce8f1", "normal"], "Return Request":["#fce8f1", "normal"]}
    const shippedColors = {"Pending":["#fff","normal"], "Processing":["#fff","normal"], "Shipped":["#e3a4c0", "bold"], "Delivered":["#fce8f1","normal"], "Returned":["#fce8f1", "normal"], "Return Request":["#fce8f1", "normal"]}
    const deliveredColors = {"Pending":["#fff","normal"], "Processing":["#fff","normal"], "Shipped":["#fff","normal"], "Delivered":["#e3a4c0", "bold"], "Returned":["#fce8f1", "normal"], "Return Request":["#fce8f1", "normal"]}
    const returnedColors = {"Pending":["#fff","normal"], "Processing":["#fff","normal"], "Shipped":["#fff","normal"], "Delivered":["#fff", "normal"], "Returned":["#e3a4c0", "bold"]}
    const requestColors = {"Pending":["#fff","normal"], "Processing":["#fff","normal"], "Shipped":["#fff","normal"], "Delivered":["#fff", "normal"], "Return Request":["#e3a4c0", "bold"]}

    const disableTabs = {
        "Pending": ["Processing", "Shipped", "Delivered"],
        "Processing": ["Shipped", "Delivered"],
        "Shipped": ["Delivered"],
        "Delivered": [],
        "Returned":[],
        "Return Request":[]
    };

    // Change tab size if status === Returned
    if (status === "Returned"){
        const tabs = document.getElementsByClassName('MuiButtonBase-root');
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].style.width = '20%';
    }}
    if (status === "Return Request"){
        const tabs = document.getElementsByClassName('MuiButtonBase-root');
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].style.width = '20%';
    }}

    const shouldDisplayTabs = status !== "Canceled"; // Check if status is not "Closed" or "Canceled"

    return (       
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                {shouldDisplayTabs && ( // Conditionally render the TabList and TabPanels
                    <>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Pending" value="Pending" disabled={disableTabs[status].includes("Pending")} sx={{ backgroundColor: pendingColors[status][0], color:"black", fontWeight:pendingColors[status][1] }}/>
                                <Tab label="Processing" value="Processing" disabled={disableTabs[status].includes("Processing")} sx={{ backgroundColor: preparingColors[status][0], color:"black", fontWeight:preparingColors[status][1] }}/>
                                <Tab label="Shipped" value="Shipped" disabled={disableTabs[status].includes("Shipped")} sx={{ backgroundColor: shippedColors[status][0], color:"black", fontWeight:shippedColors[status][1] }}/>
                                <Tab label="Delivered" value="Delivered" disabled={disableTabs[status].includes("Delivered")} sx={{ backgroundColor: deliveredColors[status][0], color:"black", fontWeight:deliveredColors[status][1] }}/>
                                {status === "Returned" && <Tab label="Returned" value="Returned" sx={{ backgroundColor: returnedColors[status][0], color:"black", fontWeight:returnedColors[status][1] }}/>}
                                {status === "Return Request" && <Tab label="Return Request" value="Return Request" sx={{ backgroundColor: requestColors[status][0], color:"black", fontWeight:requestColors[status][1] }}/>}
                            </TabList>
                        </Box>

                        <TabPanel value="Pending">
                            <Pending data2={props.data2.huts}/>
                        </TabPanel>

                        <TabPanel value="Processing">
                            <Preparing data2={props.data2.huts}/>
                        </TabPanel>
                        
                        <TabPanel value="Shipped">
                            <Shipped paazlUrl={props.paazlUrl} setDeliveredStatus={props.setDeliveredStatus} />
                        </TabPanel>

                        <TabPanel value="Delivered">
                            <Delivered pickupInfo={props.pickupInfo} deliveryTime={props.deliveryTime}/>
                        </TabPanel>

                        {status === "Returned" && 
                            <TabPanel value="Returned">
                                <Returned data2={props.data2.huts} returnData={props.returnData}/>
                            </TabPanel>}
                        
                        {status === "Return Request" && 
                        <TabPanel value="Return Request">
                            <ReturnRequest data2={props.data2.huts}/>
                        </TabPanel>}
                    </>
                )}
            </TabContext>
        </Box>
    );
}
