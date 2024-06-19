const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const EXTERNAL_API_URL = 'http://20.244.56.144/test';
const TIMEOUT = 500;
let numbersWindow = [];
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE4Nzc3OTg4LCJpYXQiOjE3MTg3Nzc2ODgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImUxZGRmNzZmLTc0ZmYtNDhiYy04MjExLWUwMTg5YjEzOGNjZiIsInN1YiI6IjIxMDMwMzEwNTEyOEBwYXJ1bHVuaXZlcnNpdHkuYWMuaW4ifSwiY29tcGFueU5hbWUiOiJ5YXNoTWFydCIsImNsaWVudElEIjoiZTFkZGY3NmYtNzRmZi00OGJjLTgyMTEtZTAxODliMTM4Y2NmIiwiY2xpZW50U2VjcmV0IjoieXRvS1pUbkdnbXBkbU9ncyIsIm93bmVyTmFtZSI6Illhc2hIaW5ndSIsIm93bmVyRW1haWwiOiIyMTAzMDMxMDUxMjhAcGFydWx1bml2ZXJzaXR5LmFjLmluIiwicm9sbE5vIjoiMjEwMzAzMTA1MTI4In0.ddK5sFnWkZAqGp5ZoiKv6nei11tOc7Zp2obOVEXYYPk";


const fetchNumber = async (numberId) => {
    try {
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