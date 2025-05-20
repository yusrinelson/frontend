<script setup>
import { onMounted, ref } from 'vue';
import { PlusCircleIcon } from '@heroicons/vue/24/outline';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig'; // Assuming you have this config for your backend URL
import { getCookie } from '@/utils/cookieUtils'; // For fetching auth token
import { useAuth } from '@/composable/useAuth';

// Reactive state for products data
const products = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');

const {user} = useAuth();

// Fetch products from backend on component mount
onMounted(async () => {
    await fetchProducts();
});

// Function to fetch products for the seller
const fetchProducts = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
        const token = getCookie('token');
        if (!token) {
            errorMessage.value = 'Authentication token not found. Please log in.';
            console.error('No token found for authentication.');
            return;
        }

        // Use the seller ID from logged-in user data (adjust based on your user object)
        const sellerId = user.value?._id;
        if (!sellerId) {
            errorMessage.value = 'Seller ID not found. Please log in.';
            console.error('No seller ID available.');
            return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/products/seller/${sellerId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        products.value = response.data.products; // Assuming backend returns { products: [...] }
        console.log('Products fetched:', products.value);
    } catch (error) {
        console.error('Error fetching products:', error);
        if (error.response) {
            errorMessage.value = error.response.data.message || 'Failed to fetch products.';
        } else if (error.request) {
            errorMessage.value = 'No response from server. Please try again.';
        } else {
            errorMessage.value = 'An error occurred while fetching products.';
        }
    } finally {
        isLoading.value = false;
    }
};

// Placeholder functions for Add, Edit, and Delete actions
const addProduct = () => {
    console.log('Add Product clicked. Implement modal or form for adding product.');
    // Future: Open a modal or navigate to a form page for adding a new product
};

const editProduct = (productId) => {
    console.log('Edit Product clicked for ID:', productId);
    // Future: Navigate to edit page with productId or open edit modal
};

const deleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const token = getCookie('token');
        if (!token) {
            alert('Authentication token not found. Please log in.');
            return;
        }

        await axios.delete(`${API_BASE_URL}/api/products/${productId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        // Remove the product from the list after successful deletion
        products.value = products.value.filter(p => p._id !== productId);
        console.log('Product deleted:', productId);
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
    }
};
</script>

<template>
    <div class="p-4">
        <h1 class="text-3xl font-semibold text-[#2E8B57] my-4">Product Management</h1>
        <div class="flex justify-between items-center border-t border-gray-400 py-4">
            <h1 class="text-2xl font-semibold p-4">All Products</h1>
            <button 
                @click="addProduct" 
                class="bg-[#2E8B57] text-white px-4 py-2 rounded-md flex flex-row mx-4 hover:bg-[#257a47] transition-colors"
            >
                <PlusCircleIcon class="h-6 w-6 text-white mr-2" />
                Add Product
            </button>
        </div>

        <!-- Error Message if Fetch Fails -->
        <div v-if="errorMessage" class="bg-red-100 text-red-700 p-3 mb-4 rounded-md text-sm mx-4">
            {{ errorMessage }}
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center p-4 text-gray-600 mx-4">
            Loading products...
        </div>

        <!-- Products Table -->
        <div v-else-if="products.length > 0" class="overflow-x-auto rounded-md my-2 mx-4">
            <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="seller_table-head">Product</th>
                        <th class="seller_table-head">Category</th>
                        <th class="seller_table-head">Price</th>
                        <th class="seller_table-head">Stock</th>
                        <th class="seller_table-head">Status</th>
                        <th class="seller_table-head">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    <tr v-for="product in products" :key="product._id" class="hover:bg-gray-50 transition-colors">
                        <td class="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{{ product.title }}</td>
                        <td class="seller_table-data">{{ product.category || 'N/A' }}</td>
                        <td class="seller_table-data">R{{ product.price.toFixed(2) }}</td>
                        <td class="seller_table-data">{{ product.stock }}</td>
                        <td class="seller_table-data">
                            <span 
                                :class="[
                                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                                    product.status === 'active' ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'
                                ]"
                            >
                                {{ product.status === 'active' ? 'Active' : 'Inactive' }}
                            </span>
                        </td>
                        <td class="px-4 py-4 text-sm whitespace-nowrap">
                            <button 
                                @click="editProduct(product._id)" 
                                class="text-blue-600 hover:text-blue-800 cursor-pointer mr-3"
                            >
                                Edit
                            </button>
                            <button 
                                @click="deleteProduct(product._id)" 
                                class="text-red-600 hover:text-red-800 cursor-pointer"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Empty State if No Products -->
        <div v-else class="text-center p-4 text-gray-600 mx-4 bg-gray-50 rounded-md">
            No products found. Add a new product to get started.
        </div>
    </div>
</template>

<style lang="scss" scoped>

</style>