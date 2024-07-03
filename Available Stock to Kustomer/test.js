const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const snowflake = require('snowflake-sdk');
const express = require('express');

// Initialize Express app
const app = express();
app.use(express.json());

// Function to retrieve secrets from Google Cloud Secret Manager
async function getSecret(secretId, jsonAttribute = null, projectId = "mj-dwh", versionId = "latest") {
    const client = new SecretManagerServiceClient();
    const [version] = await client.accessSecretVersion({
        name: `projects/${projectId}/secrets/${secretId}/versions/${versionId}`,
    });

    const payload = version.payload.data.toString('utf-8');

    if (jsonAttribute) {
        return JSON.parse(payload)[jsonAttribute];
    }
    return payload;
}

// Function to execute query on Snowflake and retrieve data
async function getDataFromSnowflake(username, password, urlAccount, warehouse, query) {
    return new Promise((resolve, reject) => {
        const connection = snowflake.createConnection({
            account: urlAccount,
            username: username,
            password: password,
            warehouse: warehouse,
            database: 'ACCESS_TST',
            schema: 'B2B',
            role: 'ACCOUNTADMIN',
        });

        connection.connect((err, conn) => {
            if (err) {
                reject(`Unable to connect: ${err.message}`);
                return;
            }

            connection.execute({
                sqlText: query,
                complete: (err, stmt, rows) => {
                    if (err) {
                        reject(`Failed to execute query: ${err.message}`);
                        return;
                    }
                    resolve(rows);
                },
            });
        });
    });
}

// Function to create the SQL query
function createQuery() {
    return `
        SELECT *
        FROM DWH_PRD.TRANSACTION.STORED_PROCEDURE_TRUE_STOCK
        WHERE 1=1
    `;
}

// Function to create the payload to send to Magento (or any other system)
function createPayload(data) {
    return JSON.stringify(data);
}

// Main function to handle HTTP request
app.get('/get-stock', async (req, res) => {
    console.log("DSKLFS:JDSL")
    try {
        const sku  = "MJ10380_120017";

        const query = createQuery();

        const snowflakeUsername = await getSecret('Snowflake_Service_Account_All_Tables', 'Username');
        const snowflakePassword = await getSecret('Snowflake_Service_Account_All_Tables', 'Password');
        const snowflakeUrl = 'cv10725.europe-west4.gcp';
        const snowflakeWarehouse = 'CONSUMER_WH';

        const data = await getDataFromSnowflake(snowflakeUsername, snowflakePassword, snowflakeUrl, snowflakeWarehouse, query);

        const payload = createPayload(data);
        const payloadData = JSON.parse(payload);

        let availableStock = null;

        for (const item of payloadData) {
            if (item.product_id === sku) {
                availableStock = item.available_stock;
                break;
            }
        }

        if (availableStock !== null) {
            console.log("Available Stock:", availableStock); // Log the available stock
            res.send(availableStock.toString());
        } else {
            console.log("Item not found for SKU:", sku); // Log that the item was not found
            res.status(404).send('Item not found');
        }
    } catch (error) {
        console.error("Error:", error); // Log any errors that occur
        res.status(500).send(error.toString());
    }
});


const PORT = process.env.PORT || 3000;

// Define a route handler for the root path
app.get('/', (req, res) => {
    res.send('Hello, world!!!'); // Replace with your desired response
});

// Define other route handlers as needed
app.get('/sample', (req, res) => {
    res.send('Sample route works!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




