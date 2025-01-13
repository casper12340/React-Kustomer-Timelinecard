import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../config/firestore';  // Make sure this path is correct
import Swal from 'sweetalert2';

export const getNumber = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "order_numbers"));
    let highestNumber = 0;

    querySnapshot.forEach((doc) => {
      const oldOrderNumber = doc.data().order_number;
      const numericPart = parseInt(oldOrderNumber.replace('CSO25-K', ''), 10);  // Extract numeric part
      console.log("Numeric part", numericPart)
      if (isNaN(numericPart)) {
        Swal.fire({
          title: 'Oeps...',
          text: `Er is iets fout gegaan bij het ophalen het ordernummer.`,
          icon: 'error',
          confirmButtonText: 'Terug',
          position: "center"
        });
        throw new Error(`Invalid order number format: ${oldOrderNumber}`);  // Throw an error if NaN
      }

      if (numericPart > highestNumber) {
        highestNumber = numericPart;  // Keep track of the highest number
      }
    });

    // Generate the next order number by incrementing the highest number
    const nextNumber = highestNumber + 1;
    const formattedNextNumber = `CSO25-K${String(nextNumber).padStart(5, '0')}`;  // Format with leading zeros

    return formattedNextNumber;

  } catch (error) {
    console.error("Error getting document:", error);
    Swal.fire({
      title: 'Oeps...',
      text: `Er is iets fout gegaan bij het ophalen het ordernummer.`,
      icon: 'error',
      confirmButtonText: 'Terug',
      position: "center"
    });
    throw error;
  }
};

export default async function setCSONumber() {
  try {
    // Get the next order number from getNumber
    const nextOrderNumber = await getNumber();

    // Now set the new order number in Firestore
    const docRef = doc(db, 'order_numbers', '4o20ij6Go7v9XcEG9ZlZ');  // Specify a document ID
    await setDoc(docRef, {
      order_number: nextOrderNumber
    });
    
    console.log("New order number set:", nextOrderNumber);
    
    // Return the next order number after Firestore operation is done
    return nextOrderNumber;

  } catch (error) {
    console.error("Error setting document:", error);
    Swal.fire({
      title: 'Oeps...',
      text: `Er is iets fout gegaan bij het verzenden van het ordernummer.`,
      icon: 'error',
      confirmButtonText: 'Terug',
      position: "center"
    });
    throw error;  // Propagate the error for further handling if needed
  }
}

