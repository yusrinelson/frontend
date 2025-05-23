import { API_BASE_URL } from "@/config/apiConfig";
import { getCookie } from "@/utils/cookieUtils";
import axios from "axios";

export const fetchSellerProducts = async (sellerId) => {
  if (!sellerId) {
    throw new Error("Seller ID is required to fetch products.");
  }

  const token = getCookie("token");
  if (!token) {
    throw new Error("Authentication token not found. Please log in.");
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/products/seller/${sellerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.products; // Assuming backend returns { products: [...] }
  } catch (error) {
    console.error("Error fetching products from backend:", error);
    throw error; // Let the caller handle the error
  }
};

//fetch all products (public access)
export const fetchAllProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/products`);
    return response.data.products;
  } catch (error) {
    console.error("Error fetching products from backend:", error);
    throw error;
  }
};

export const deleteProductById = async (productId) => {
  if (!productId) {
    throw new Error("Product ID is required to delete a product.");
  }

  const token = getCookie("token");
  if (!token) {
    throw new Error("Authentication token not found. Please log in.");
  }

  try {
    await axios.delete(`${API_BASE_URL}/api/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return true; // Indicate success
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error; // Let the caller handle the error
  }
};

//update product
export const updateProductById = async (productId, updatedData) => {
  if (!productId) {
    throw new Error("Product ID is required to update a product.");
  }

  const token = getCookie("token");
  if (!token) {
    throw new Error("Authentication token not found. Please log in.");
  }

  try {
    //create formData for file upload
    const formData = new FormData();
    formData.append("title", updatedData.title);
    formData.append("description", updatedData.description);
    formData.append("price", updatedData.price);
    formData.append("category", updatedData.category);
    formData.append("stock", updatedData.stock);
    if(updatedData.thumbnailFile){
      formData.append("thumbnail", updatedData.thumbnailFile);
      console.log("Thumbnail file: updated", updatedData.thumbnailFile);
    }

    const response = await axios.patch(
      `${API_BASE_URL}/api/products/${productId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    // Return the updated product from the response
    const updatedProduct = response.data.updatedProduct;
    console.log("Backend response for update:", updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    throw error; // Let the caller handle the error
  }
};

// add products
export const addProduct = async (productData) => {
  const token = getCookie("token");
  if (!token) {
    throw new Error("Authentication token not found. Please log in.");
  }
  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('title', productData.title);
    formData.append('category', productData.category);
    formData.append('description', productData.description || '');
    formData.append('price', productData.price);
    formData.append('stock', productData.stock);
    // Append thumbnail file if provided
    if (productData.thumbnailFile) {
      formData.append('thumbnail', productData.thumbnailFile);
       console.log("Thumbnail file appended for add:", productData.thumbnailFile.name);
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/products`,
      formData,
       {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.products;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error; // Let the caller handle the error
  }
};
