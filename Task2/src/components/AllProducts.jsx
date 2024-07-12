import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    CardActions,
    Button,
    Badge,
    Box,
    Chip,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios from 'axios';

const BASE_URL = 'https://json-server-c67opnddza-el.a.run.app';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [topN, setTopN] = useState(10);
    const [minPrice, setMinPrice] = useState(1);
    const [maxPrice, setMaxPrice] = useState(10000);

    useEffect(() => {
        axios.get(`${BASE_URL}/categories`).then((res) => {
            const categories = res.data.map(c => c.name);
            setCategories(["All", ...categories]);
        })
        axios.get(`${BASE_URL}/companies`).then((res) => {
            const companies = res.data.map(c => c.name);
            setCompanies(["All", ...companies]);
        })
        fetchProducts();
    }, [selectedCompany, selectedCategory, topN, minPrice, maxPrice]);

    const fetchProducts = () => {
        if (selectedCompany === 'All' && selectedCategory !== 'All') {
            axios.get(`${BASE_URL}/categories/${selectedCategory}/products?top=${topN}&minPrice=${minPrice}&maxPrice=${maxPrice}`).then((res) => {
                setProducts(res.data);
            })
        } else if (selectedCompany === 'All' && selectedCategory === 'All') {
            axios.get(`${BASE_URL}/products`).then((res) => {
                console.log(res.data);
                setProducts(res.data);
            })
        } else if (selectedCompany !== 'All' && selectedCategory !== 'All') {
            axios.get(`${BASE_URL}/companies/${selectedCompany}/categories/${selectedCategory}/products?top=${topN}&minPrice=${minPrice}&maxPrice=${maxPrice}`).then((res) => {
                console.log(res.data);
                setProducts(res.data);
            })
        } else if (selectedCompany !== 'All' && selectedCategory === 'All') {
            axios.get(`${BASE_URL}/companies/${selectedCompany}/products?top=${topN}&minPrice=${minPrice}&maxPrice=${maxPrice}`).then((res) => {
                console.log(res.data);
                setProducts(res.data);
            })
        }
        // else {
        //     axios.get(`${BASE_URL}/${company}/categories/${category}/products`).then((res) => {
        //         console.log(res.data);
        //         setProducts(res.data);
        //     })
        // }

    };

    return (
        <div>
            <h1>All Products</h1>
            <FormControl>
                <InputLabel>Company</InputLabel>
                <Select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
                    {companies?.map((company) => (
                        <MenuItem key={company} value={company}>
                            {company}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Category</InputLabel>
                <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    {categories?.map((category) => (
                        <MenuItem key={category} value={category}>
                            {category}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                label="Top N"
                type="number"
                value={topN}
                onChange={(e) => setTopN(e.target.value)}
                inputProps={{ min: 1, max: 100 }}
                style={{ margin: '0 10px' }}
            />
            <TextField
                label="Min Price"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                inputProps={{ min: 1 }}
                style={{ margin: '0 10px' }}
            />
            <TextField
                label="Max Price"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                inputProps={{ min: 1 }}
                style={{ margin: '0 10px' }}
            />
            <Grid container spacing={2}>
                {products.map(({ availability, category, company, discount, price, productName, rating, id }) => (
                    <Card
                        key={id}
                        sx={{ maxWidth: 345, m: 2, position: 'relative', cursor: 'pointer' }}
                        onClick={() => navigate(`/product/${id}`)}
                    >
                        <Badge
                            badgeContent="Unavailable"
                            color="error"
                            invisible={availability !== "no"}
                            sx={{ position: 'absolute', top: 20, left: 50 }}
                        />
                        <CardMedia
                            component="img"
                            height="140"
                            image={`https://picsum.photos/200/300`}
                            alt={productName}
                            loading="lazy"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {productName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {category} by {company}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <StarIcon sx={{ color: 'gold' }} />
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                                    {rating}
                                </Typography>
                            </Box>
                            <Typography variant="h6" component="div" sx={{ mt: 1 }}>
                                ${price}
                                {discount > 0 && (
                                    <Chip
                                        label={`${discount}% OFF`}
                                        color="success"
                                        size="small"
                                        sx={{ ml: 1 }}
                                    />
                                )}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                size="small"
                                color="primary"
                                startIcon={<ShoppingCartIcon />}
                                disabled={availability === "no"}
                            >
                                Add to Cart
                            </Button>
                        </CardActions>
                    </Card>
                ))}
            </Grid>
        </div>
    );
};

export default AllProducts;
