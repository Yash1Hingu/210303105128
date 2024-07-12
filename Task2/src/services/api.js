import axios from 'axios';

const BASE_URL = 'https://json-server-c67opnddza-el.a.run.app';
let token = "";
const TIMEOUT = 500;

const data = {
    "companyName": "yashmed",
    "clientID": "dfadd985-f5b0-4fd3-8ff8-9f1945f7604c",
    "clientSecret": "BjeFqKBrYicbYDfd",
    "ownerName": "YashHingu",
    "ownerEmail": "210303105128@paruluniversity.ac.in",
    "rollNo": "210303105128"
};

export const getProducts = async (company, category, top, minPrice, maxPrice) => {

    // try {
    //     const response = await axios.get(
    //         `${BASE_URL}/${company}/categories/${category}/products?top=${top}&minPrice=${minPrice}&maxPrice=${maxPrice}`);
    //     return response.data;
    // } catch (error) {
    //     console.error('Error fetching products:', error);
    //     return [];
    // }
};

export const getCategories = () => {
    axios.get(`${BASE_URL}/categories`).then((res) => {
        const categories = res.data.map(c => c.name);
        return (["All",...categories]);
    })
}