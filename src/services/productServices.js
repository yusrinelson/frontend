import { API_BASE_URL } from "@/config/apiConfig";
import { getCookie } from "@/utils/cookieUtils";
import axios from "axios";


export const fetchSellerProducts = async (sellerId) => {
        if (!sellerId) {
            throw new Error('Seller ID is required to fetch products.');
        }

        const token = getCookie('token');
        if (!token) {
            throw new Error('Authentication token not found. Please log in.');
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/api/products/seller/${sellerId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            return response.data.products; // Assuming backend returns { products: [...] }
        } catch (error) {
            console.error('Error fetching products from backend:', error);
            throw error; // Let the caller handle the error
        }
}

export const deleteProductById = async (productId) => {
    if (!productId) {
        throw new Error('Product ID is required to delete a product.');
    }

    const token = getCookie('token');
    if (!token) {
        throw new Error('Authentication token not found. Please log in.');
    }

    try {
        await axios.delete(`${API_BASE_URL}/api/products/${productId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return true; // Indicate success
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error; // Let the caller handle the error
    }
}
