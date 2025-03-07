import React, { useEffect, useState } from 'react';

export default function Preparing(props) {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "ordernumber": props?.data2?.customContext?.kobject?.data?.increment_id
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            try {
                const response = await fetch("https://europe-west4-mj-customer-service-tools.cloudfunctions.net/get-packing-machine-images-to-kustomer", requestOptions);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const resultData = await response.json();
                setResult(resultData); // Update state with fetched data
                console.log(resultData); // Log the parsed JSON result
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false); // Set loading to false when the fetch is complete
            }
        };

        fetchData();
    }, [props]); // Include props in dependencies array if needed

    return (
        <div>
            {loading ? (
                <p>Aan het zoeken...</p>
            ) : (
                result?.files ? (
                    <img src={"data:image/jpeg;base64,"+result?.files[0]?.url } alt="Packing Machine" style={{maxWidth: '100%'}}/>
                ) : (
                    <p>Er is (nog) geen afbeelding van de inpakmachine gevonden.</p>
                )
            )}
        </div>
    );
}
