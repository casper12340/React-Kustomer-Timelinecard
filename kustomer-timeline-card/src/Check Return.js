import { useEffect } from 'react';

export default function CheckReturn(props) {
    // Ensure props are present and extract necessary values
    const { data2, setReturnData } = props;
    const kobject = data2?.huts?.customContext?.kobject;
    const orderID = kobject?.custom?.incrementIdStr;

    useEffect(() => {
        // Only proceed if orderID is available
        if (!orderID) return;

        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer 6pSo1h2liM2dahH1h9GmMlphwL1ufIxLGHpRqCUZ");
        myHeaders.append("Accept", "application/json");

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`https://api-v2.returnless.com/2023-01/return-orders?filter[order_number]=${orderID}&include=customer,customer_address,return_order_items`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.data[0]){
                    setReturnData(result);
                    console.log("REturn Data:", result)
                }
                
            })
            .catch((error) => {
                setReturnData("Er is iets fout gegaan");
                console.error(error);
            });
    }, [orderID, setReturnData]);

    // Optionally, you can return some JSX or null here
    return null;
}
