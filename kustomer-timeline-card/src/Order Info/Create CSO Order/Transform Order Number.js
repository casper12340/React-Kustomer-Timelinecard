import React from 'react'

export default function transformOrderNumber(orderNumber) {

    // // Find the position of the first '-' in the string
    // let firstDashIndex = orderNumber.indexOf('-');

    // // Replace the first '-' with '_' temporarily
    // let transformedOrderNumber = orderNumber;
    // if (firstDashIndex !== -1) {
    //     transformedOrderNumber = transformedOrderNumber.slice(0, firstDashIndex) + '_' + 
    //                              transformedOrderNumber.slice(firstDashIndex + 1);
    // }

    // // Remove any additional dashes that follow the first one
    // let secondDashIndex = transformedOrderNumber.indexOf('-', firstDashIndex + 1);
    // if (secondDashIndex !== -1) {
    //     transformedOrderNumber = transformedOrderNumber.slice(0, secondDashIndex) + 
    //                              transformedOrderNumber.slice(secondDashIndex + 1);
    // }

    // // Append 'OS' if the string ends with '00'
    // if (transformedOrderNumber.endsWith('00')) {
    //     transformedOrderNumber += 'OS';
    // }

    // // Check if the transformed order number ends with _1500 or _1200 followed by a random letter
    // const regex = /_(1500|1200)[A-Za-z]$/;
    // if (regex.test(transformedOrderNumber)) {
    //     transformedOrderNumber += 'OS';
    // }

    // // Now replace '_' with spaces or another delimiter of your choice (if needed)
    // transformedOrderNumber = transformedOrderNumber.replace(/_/g, ' ');

    // Split the final string into an array using spaces as a delimiter
    let orderNumberArray = orderNumber.split('_');
    console.log("JAJA",orderNumberArray)

    return orderNumberArray;
}

