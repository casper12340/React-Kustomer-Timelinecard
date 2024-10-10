import React from 'react';

export default function AddNote ( noteID, id ) {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer XhPeDPsNuaHf7pw2GAWNBA2HmKNuGQyRZ1ZDpm1hd0649e8c");
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "note": noteID,
    "actor": "string",
    "is_visible_for_customer": false
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  // Change this to id
  return fetch(`https://api-v2.returnless.com/2023-01/request-orders/${id}/notes`, requestOptions)
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => console.error('Error:', error));
}

