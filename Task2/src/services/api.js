import axios from 'axios';

const BASE_URL = 'http://20.244.56.144/test/companies';
let token = "";
const TIMEOUT = 500;

const data = {
    "companyName": "yashMart",
    "clientID": "e1ddf76f-74ff-48bc-8211-e0189b138ccf",
    "clientSecret": "ytoKZTnGgmpdmOgs",
    "ownerName": "YashHingu",
    "ownerEmail": "210303105128@paruluniversity.ac.in",
    "rollNo": "210303105128"
};

export const getProducts = async (company, category, top, minPrice, maxPrice) => {
    try {
        const tokenresponse = await axios.post('http://20.244.56.144/test/auth', data);
        token = tokenresponse.data.access_token;
        
        const response = await axios.get(
            `${BASE_URL}/${company}/categories/${category}/products?top=${top}&minPrice=${minPrice}&maxPrice=${maxPrice}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                timeout: TIMEOUT
            }

        );
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};
