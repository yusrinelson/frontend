<script setup>
import { PlusCircleIcon } from "@heroicons/vue/24/outline";
import { onMounted, ref } from "vue";
import { useProduct } from "@/composable/useProduct";
import UpdateProducts from "./UpdateProducts.vue";

// Get product state and functions from composable
const {
  products,
  isLoading,
  errorMessage,
  fetchProducts,
  addProducts,
  editProduct,
  deleteProduct,
} = useProduct();


onMounted(async () => {
  await fetchProducts();
});

const isModalOpen = ref(false);
const modalMode = ref("add");
const selectedProduct = ref(null);
const isSaving = ref(false);
const saveError = ref("");
const refreshKey = ref(0); // Used to force re-render of images

const openAddModal = () => {
  modalMode.value = "add";
  selectedProduct.value = null;
  isModalOpen.value = true;
  saveError.value = "";
};

const openEditModal = (product) => {
  modalMode.value = "edit";
  selectedProduct.value = { ...product };
  isModalOpen.value = true;
  saveError.value = "";
};

const closeModal = () => {
  isModalOpen.value = false;
  isSaving.value = false;
  saveError.value = "";
};

const handleSaveProduct = async ({ mode, data }) => {
  try {
    isSaving.value = true;
    saveError.value = "";
    if (mode === "add") {
      await addProducts(data);
    } else {
      await editProduct(selectedProduct.value._id, data);
    }
    refreshKey.value += 1; // Increment to force image reload
    await fetchProducts(); // Refresh product list to ensure updates are reflected
    closeModal();
  } catch (error) {
    console.error("Error saving product:", error);
    saveError.value =
      error.message || "Failed to save product. Please try again.";
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div class="">
    <h1 class="text-3xl font-semibold text-[#2E8B57] my-4 p-4">
      Product Management
    </h1>
    <div class="flex justify-between items-center border-t border-gray-400 py-4">
      <h1 class="text-2xl font-semibold p-4">All Products</h1>
      <span
        class="bg-primary text-white px-4 py-2 rounded-md flex flex-row mx-4 cursor-pointer hover:bg-secondary transition-colors"
        @click="openAddModal">
        <PlusCircleIcon class="h-6 w-6 text-white mr-2" /> Add Product
      </span>
      <UpdateProducts :isOpen="isModalOpen" @closeModal="closeModal" :mode="modalMode" :product="selectedProduct"
        @close="closeModal" @save="handleSaveProduct" />
    </div>

    <!-- Error Message if Fetch Fails -->
    <div v-if="errorMessage" class="bg-red-100 text-red-700 p-3 mb-4 rounded-md text-sm mx-4">
      {{ errorMessage }}
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center p-4 text-gray-600 mx-4">
      Loading products...
    </div>

    <div v-else-if="products.length > 0" class="overflow-x-auto rounded-md my-2 mx-4">
      <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead class="bg-gray-100">
          <tr>
            <th class="seller_table-head">Image</th>
            <th class="seller_table-head">Product</th>
            <th class="seller_table-head">Category</th>
            <th class="seller_table-head">Price</th>
            <th class="seller_table-head">Stock</th>
            <th class="seller_table-head">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <!-- Use <template> to wrap the <tr> when adding v-if directly inside v-for -->
          <template v-for="product in products" :key="product?._id">
            <!-- Add a v-if to ensure product is not null/undefined -->
            <tr v-if="product" class="hover:bg-gray-50 transition-colors">
              <td class="seller_table-data">
                <img :src="`${product.thumbnail || 'path/to/placeholder-image.jpg'}?v=${refreshKey}`"
                  alt="Product thumbnail" class="w-12 h-12 object-cover rounded-md" />
              </td>
              <td class="seller_table-data">{{ product.title }}</td>
              <td class="seller_table-data">{{ product.category }}</td>
              <td class="seller_table-data">R{{ product.price?.toFixed(2) }}</td>
              <!-- Added optional chaining for price -->
              <td class="seller_table-data">{{ product.stock }}</td>
              <td class="seller_table-data">
                <span class="text-blue-600 hover:text-blue-800 cursor-pointer mr-3"
                  @click="openEditModal(product)">Edit</span>
                <span class="text-red-600 hover:text-red-800 cursor-pointer"
                  @click="deleteProduct(product._id)">Delete</span>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Empty State if No Products -->
    <div v-else class="text-center p-4 text-gray-600 mx-4 bg-gray-50 rounded-md">
      No products found. Add a new product to get started.
    </div>
  </div>
</template>

<style lang="scss" scoped></style>