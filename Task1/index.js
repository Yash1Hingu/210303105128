const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const EXTERNAL_API_URL = 'http://20.244.56.144/test';
const TIMEOUT = 500;
let numbersWindow = [];
let token = "";

const data = {
    "companyName": "yashMart",
    "clientID": "e1ddf76f-74ff-48bc-8211-e0189b138ccf",
    "clientSecret": "ytoKZTnGgmpdmOgs",
    "ownerName": "YashHingu",
    "ownerEmail": "210303105128@paruluniversity.ac.in",
    "rollNo": "210303105128"
};

const fetchNumber = async (numberId) => {
    try {
        const tokenresponse = await axios.post('http://20.244.56.144/test/auth', data);
        token = tokenresponse.data.access_token;
        
        const response = await axios.get(`${EXTERNAL_API_URL}/${numberId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            timeout: TIMEOUT
        });
        console.log(response.data);
        if (response.status === 200) {
            return response.data.numbers;
        }
    } catch (error) {
        return error;
    }
    return null;
};

const calculateAverage = (numbers) => {
    if (!numbers.length) return 0;
    return numbers.reduce((acc, num) => acc + num, 0) / numbers.length;
};

app.get('/numbers/:numberId', async (req, res) => {
    const numberId = req.params.numberId;
    const newNumber = await fetchNumber(numberId);
    console.log(newNumber);
    const windowPrevState = [...numbersWindow];

    if (newNumber !== null && !numbersWindow.includes(newNumber)) {
        if (numbersWindow.length >= WINDOW_SIZE) {
            numbersWindow.shift();
        }
        numbersWindow.push(newNumber);
    }

    const windowCurrState = [...numbersWindow];
    const avg = numbersWindow.length === WINDOW_SIZE ? calculateAverage(numbersWindow) : 0;

    res.json({
        windowPrevState,
        windowCurrState,
        numbers: newNumber !== null ? [newNumber] : [],
        avg: parseFloat(avg.toFixed(2)),
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});