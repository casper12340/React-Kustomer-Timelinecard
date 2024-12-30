import React from 'react'

export default function transformOrderNumber(orderNumber) {
    let orderNumberArray = orderNumber.split('_');
    return orderNumberArray;
}

