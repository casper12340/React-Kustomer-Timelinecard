import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';




export default function GetCSONumber(){
    const firebaseConfig = {
        apiKey: "AIzaSyBYDxpBmKqnoSRmuCpAHtYEI1bc0UAh4Uk",
        authDomain: "cso-project-bccee.firebaseapp.com",
        projectId: "cso-project-bccee",
        storageBucket: "cso-project-bccee.appspot.com",
        messagingSenderId: "872034137581",
        appId: "1:872034137581:web:8498f8995024a517eee3e4"
      };
      const app = initializeApp(firebaseConfig);

      console.log(app)
      
      }
