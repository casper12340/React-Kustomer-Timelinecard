import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

export default function DHLStatus(props) {
    const { paazlUrl, setDeliveredStatus } = props;

    const [trackingNumber, setTrackingNumber] = useState('');
    const [trackingInfo, setTrackingInfo] = useState(null); // State to hold the tracking info

    console.log("DHL Info", trackingInfo)

    function changeDate(date) {
        // Parse the original date string to a Date object
        const dateObject = new Date(date);
      
        // Add 2 hours to the date
        dateObject.setUTCHours(dateObject.getUTCHours() + 2);
      
        // Function to format numbers to two digits
        const padToTwoDigits = (num) => String(num).padStart(2, '0');
      
        // Format the Date object to the desired string format
        const formattedDateTime =
          `${padToTwoDigits(dateObject.getUTCDate())}-${padToTwoDigits(dateObject.getUTCMonth() + 1)}-${dateObject.getUTCFullYear()} ` +
          `${padToTwoDigits(dateObject.getUTCHours())}:${padToTwoDigits(dateObject.getUTCMinutes())}`;
        return formattedDateTime;
    }

    useEffect(() => {
        if (paazlUrl) {
            // Extract the tracking number from the URL
            const segments = (paazlUrl).split('/');
            const trackNumber = segments[segments.indexOf('tracktrace') + 1];
            setTrackingNumber(trackNumber);
        }
    }, [paazlUrl]);

    useEffect(() => {
        if (trackingNumber) {
            const myHeaders = new Headers();
            myHeaders.append("DHL-API-Key", "vHyvvXxMaL7CYmQGYGy623FHRTsxozrf");
            myHeaders.append("Authorization", "Basic SU5URUdSQVRJT05fUFJEOm9rVjUkKmZMaEk2QFZweTExR3QzUzlDWThCV25BMkh0TkMkbnomMFk=");

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            fetch(`https://api-eu.dhl.com/track/shipments?trackingNumber=${trackingNumber}&lang=nl`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    setTrackingInfo(result);
                })
                .catch((error) => {
                    setTrackingInfo("Er is nog geen data beschikbaar");
                    console.error('Error:', error)});
        }
    }, [trackingNumber]);

    useEffect(() => {
        if (trackingInfo && trackingInfo.shipments && trackingInfo.shipments[0] && trackingInfo.shipments[0].status.statusCode === 'delivered') {
            setDeliveredStatus(true, trackingInfo.shipments[0].status.description, deliveryTimeFormat(trackingInfo.shipments[0].status.timestamp));
        }
    }, [trackingInfo, setDeliveredStatus]);

    function deliveryTimeFormat(dateString) {
        const date = new Date(dateString);
        return format(date, "d MMMM yyyy 'om' HH:mm", { locale: nl });
    }

    return (
        <div>
            {/* {trackingNumber && <p>Tracking Number: {trackingNumber}</p>} */}
            {((trackingInfo === null) || trackingInfo.status === 404) ? (<p>Er is nog geen data beschikbaar in de Track & Trace</p>) : null }
            {trackingInfo && trackingInfo.shipments && trackingInfo.shipments[0] && (
                <div>
                    <p className='bodyItems'><b>Huidige Status DHL</b></p>
                    <p className='bodyItems'>{trackingInfo.shipments[0].status.description}</p>
                    <p className='bodyItems'><b>Laatste Update DHL</b></p>
                    <p className='bodyItems'>{changeDate(trackingInfo.shipments[0].status.timestamp)}</p>
                </div>
            )}
        </div>
    );
}