import { ref } from "vue";
import { useAuth } from "./useAuth";
import {
  fetchSellerProducts,
  deleteProductById,
  fetchAllProducts,
  addProduct,
  updateProductById
} from "@/services/productServices";

export function useProduct() {
  //reactive state for products data
  const products = ref([]);
  const isLoading = ref(false);
  const errorMessage = ref("");

  //Access user data from auth to get seller ID
  const { user } = useAuth();

//----------------------------------------------------------------------------------------------------
  //fetch seller products
  const fetchProducts = async () => {
    isLoading.value = true;
    errorMessage.value = "";

    try {
      const sellerId = user.value?._id;
      //use seller ID from the logged in user
      if (!sellerId) {
        errorMessage.value = "Seller ID not found. Please log in.";
        console.error("No seller ID available.");
        products.value = [];
        return;
      }
      const fetchedProducts = await fetchSellerProducts(sellerId);
      products.value = fetchedProducts || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      if (error.response) {
        errorMessage.value =
          error.response.data.message || "Failed to fetch products.";
      } else if (error.request) {
        errorMessage.value = "No response from server. Please try again.";
      } else {
        errorMessage.value = "An error occurred while fetching products.";
      }
      products.value = [];
    } finally {
      isLoading.value = false;
    }
  };
//----------------------------------------------------------------------------------------------------
  //fetch all products (public access)
  const fetchPublicProducts = async () => {
    isLoading.value = true;
    errorMessage.value = "";

    try {
      // Use the new public API service
      products.value = await fetchAllProducts();
      console.log('Products loaded:', products.value);
    } catch (err) {
      console.error('Error fetching products:', err);
      errorMessage.value = err.message || 'Failed to load products';
      products.value = [];
    } finally {
      isLoading.value = false;
    }
  }
//----------------------------------------------------------------------------------------------------

  //get image
  const getProductImage = (product) => {
    //first tries to use the thumbnial
    if (product.thumbnail && product.thumbnail !== "") {
      return product.thumbnail;
    }

    // if no thumbnail or images, return a default image
    return "no image";
  }

  //----------------------------------------------------------------------------------------------------

  // Placeholder functions for Add, Edit, and Delete actions
  const addProducts = async (productData) => {
    isLoading.value = true;
    errorMessage.value = "";

   try{
     // Call the service to add the product
      const newProduct = await addProduct(productData);
      // Append the new product to the existing list rather than overwriting
      products.value.push(newProduct);
   } catch(error){
    console.error("Error adding product:", error);
    errorMessage.value = error.message || "Failed to add product.";
    throw error;
   } finally {
    isLoading.value = false;
   }
    // Future: Open a modal or navigate to a form page for adding a new product
  };

  //----------------------------------------------------------------------------------------------------

  const editProduct = async (productId, productData) => {
     try {
            const updatedProduct = await updateProductById(productId, productData);
            const index = products.value.findIndex((p) => p._id === productId);
            if (index !== -1) {
                products.value[index] = updatedProduct;
            }
            return updatedProduct;
        } catch (error) {
            console.error("Error updating product:", error);
            throw error.response?.data?.message || error.message || "Failed to update product";
        }
  };

  //----------------------------------------------------------------------------------------------------

  const deleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProductById(productId);

      // Remove the product from the list after successful deletion
      products.value = products.value.filter((p) => p._id !== productId);
      console.log("Product deleted:", productId);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

//----------------------------------------------------------------------------------------------------

  return {
    products,
    isLoading,
    errorMessage,
    fetchProducts,
    addProducts,
    editProduct,
    deleteProduct,
    getProductImage,
    fetchPublicProducts
  };
}
