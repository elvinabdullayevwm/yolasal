const scriptURL = "https://script.google.com/macros/s/AKfycbxCi2iat2YMZMj5-zBP2P50BYCf8mN53pCmiZcwTIy0COs8_Q1Glyz4nMMHKHAMCA3h0A/exec";

async function apiCall(data) {
    try {
        const response = await fetch(scriptURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return await response.json();

    } catch (error) {
        console.error("Şəbəkə xətası:", error);

        return {
            status: 'error',
            message: error.toString()
        };
    }
}

async function apiNewOrder(orderData, customerID) {

    const realCustomerID =
        customerID ||
        localStorage.getItem('userID') ||
        "650001";

    const sequenceNum = String(Date.now()).slice(-4);

    const customOrderID =
        `YL-${realCustomerID}-${sequenceNum}`;

    orderData.orderID = customOrderID;

    const payload = {
        action: "createNewOrder",
        customerID: realCustomerID,
        data: orderData
    };

    try {

        const response = await fetch(scriptURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.status !== 'success') {
            throw new Error(result.message || 'Backend xətası');
        }

        return {
            status: 'success',
            orderId: customOrderID
        };

    } catch(error) {

        console.error(error);

        return {
            status: 'error',
            message: error.toString()
        };
    }
}
