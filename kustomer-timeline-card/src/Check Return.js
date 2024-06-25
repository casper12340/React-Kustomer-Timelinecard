import { useEffect } from 'react';

export default function CheckReturn(props) {
    const { data2, setReturnData } = props;
    const kobject = data2?.huts?.customContext?.kobject;
    const orderID = kobject?.custom?.incrementIdStr;

    useEffect(() => {
        if (!orderID) {
            console.warn("orderID is not available");
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer 6pSo1h2liM2dahH1h9GmMlphwL1ufIxLGHpRqCUZ");
        myHeaders.append("Accept", "application/json");

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`https://api-v2.returnless.com/2023-01/return-orders?filter[order_number]=${orderID}&include=customer,customer_address,return_order_items`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(result => {
                if (result?.data?.length > 0) {
                    setReturnData(result.data[0]);
                } else {
                    console.log(result)
                    setReturnData("No return data found");
                }
            })
            .catch(error => {
                setReturnData("Er is iets fout gegaan");
                console.error("Fetch error: ", error);
            });
    }, [orderID, setReturnData]);

    return null;
}
