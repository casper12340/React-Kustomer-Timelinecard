import React, { useEffect } from 'react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Tab } from '@mui/material';
import './Tabs.css';
import Pending from "./1. Pending/Pending Tab"
import Preparing from './2. Preparing Shipment/Preparing Shipment Tab';
import Shipped from './3. Shipped/Shipped Tab';
import Delivered from './4. Delivered/Delivered Tab';

export default function Tabs(props) {
    let state = props.data2.huts.customContext.kobject.custom.statusStr;
    if (props.paazlUrl && state === 'processing') {
       // Set status to 'shipped'
        state = 'shipped';
    }
    if (props.delivered && (state === "Shipped" || state === "shipped")){
        state = "delivered"
    }

    const statusMap = {
      "new": "Pending",
      "pending": "Pending",
      "processing": "Preparing Shipment",
      "shipped": "Shipped",
      "delivered": "Delivered",
      "canceled": "Canceled",
      "closed": "Closed"
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
    const pendingColors = {"Pending":["#e3a4c0", "bold"], "Preparing Shipment":["#fce8f1","normal"], "Shipped":["#fce8f1","normal"], "Delivered":["#fce8f1","normal"]}
    const preparingColors = {"Pending":["#fff","normal"], "Preparing Shipment":["#e3a4c0","bold"], "Shipped":["#fce8f1","normal"], "Delivered":["#fce8f1","normal"]}
    const shippedColors = {"Pending":["#fff","normal"], "Preparing Shipment":["#fff","normal"], "Shipped":["#e3a4c0", "bold"], "Delivered":["#fce8f1","normal"]}
    const deliveredColors = {"Pending":["#fff","normal"], "Preparing Shipment":["#fff","normal"], "Shipped":["#fff","normal"], "Delivered":["#e3a4c0", "bold"]}

    const disableTabs = {
        "Pending": ["Preparing Shipment", "Shipped", "Delivered"],
        "Preparing Shipment": ["Shipped", "Delivered"],
        "Shipped": ["Delivered"],
        "Delivered": []
    };

    const shouldDisplayTabs = status !== "Closed" && status !== "Canceled"; // Check if status is not "Closed" or "Canceled"

    return (       
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                {shouldDisplayTabs && ( // Conditionally render the TabList and TabPanels
                    <>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Pending" value="Pending" disabled={disableTabs[status].includes("Pending")} sx={{ backgroundColor: pendingColors[status][0], color:"black", fontWeight:pendingColors[status][1] }}/>
                                <Tab label="Preparing Shipment" value="Preparing Shipment" disabled={disableTabs[status].includes("Preparing Shipment")} sx={{ backgroundColor: preparingColors[status][0], color:"black", fontWeight:preparingColors[status][1] }}/>
                                <Tab label="Shipped" value="Shipped" disabled={disableTabs[status].includes("Shipped")} sx={{ backgroundColor: shippedColors[status][0], color:"black", fontWeight:shippedColors[status][1] }}/>
                                <Tab label="Delivered" value="Delivered" disabled={disableTabs[status].includes("Delivered")} sx={{ backgroundColor: deliveredColors[status][0], color:"black", fontWeight:deliveredColors[status][1] }}/>
                            </TabList>
                        </Box>

                        <TabPanel value="Pending">
                            <Pending />
                        </TabPanel>

                        <TabPanel value="Preparing Shipment">
                            <Preparing />
                        </TabPanel>
                        
                        <TabPanel value="Shipped">
                            <Shipped paazlUrl={props.paazlUrl} setDeliveredStatus={props.setDeliveredStatus}/>
                        </TabPanel>

                        <TabPanel value="Delivered">
                            <Delivered />
                        </TabPanel>
                    </>
                )}
            </TabContext>
        </Box>
    );
}
