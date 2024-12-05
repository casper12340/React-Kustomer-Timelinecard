export default function LogUser(csoNumber, orderNumber, User, reason, customerId, itemsList) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    console.log("logging")
    const raw = JSON.stringify({
    "csonumber": csoNumber,
    "ordernumber": orderNumber,
    "created_by": User,
    "reason_code": reason,
    "customer_id": customerId,
    "items_list": itemsList,
    });

    const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
    };

    fetch("https://europe-west4-mj-customer-service-tools.cloudfunctions.net/CSO-log-user_prd", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}