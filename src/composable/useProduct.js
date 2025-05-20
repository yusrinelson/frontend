import { ref } from "vue";
import { useAuth } from "./useAuth";
import {
  fetchSellerProducts,
  deleteProductById,
} from "@/services/productServices";

export function useProduct() {
  //reactive state for products data
  const products = ref([]);
  const isLoading = ref(false);
  const errorMessage = ref("");

  //Access user data from auth to get seller ID
  const { user } = useAuth();

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
        return;
      }
      const fetchedProducts = await fetchSellerProducts(sellerId);
      products.value = fetchedProducts;
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
    } finally {
      isLoading.value = false;
    }
  };

  // Placeholder functions for Add, Edit, and Delete actions
  const addProduct = () => {
    console.log(
      "Add Product clicked. Implement modal or form for adding product."
    );
    // Future: Open a modal or navigate to a form page for adding a new product
  };

  const editProduct = (productId) => {
    console.log("Edit Product clicked for ID:", productId);
    // Future: Navigate to edit page with productId or open edit modal
  };

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

  return {
    products,
    isLoading,
    errorMessage,
    fetchProducts,
    addProduct,
    editProduct,
    deleteProduct,
  };
}
