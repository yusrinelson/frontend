<script setup>
import { PlusCircleIcon } from "@heroicons/vue/24/outline";
import { onMounted } from "vue";
import { useProduct } from "@/composable/useProduct";

//get product state and functions from composable
const {
  products,
  isLoading,
  errorMessage,
  fetchProducts,
  addProduct,
  editProduct,
  deleteProduct,
} = useProduct();

onMounted(async () => {
  await fetchProducts();
});
</script>

<template>
  <div class="">
    <h1 class="text-3xl font-semibold text-[#2E8B57] my-4 p-4">
      Product Management
    </h1>
    <div
      class="flex justify-between items-center border-t border-gray-400 py-4"
    >
      <h1 class="text-2xl font-semibold p-4">All Products</h1>
      <span
        class="bg-[#2E8B57] text-white px-4 py-2 rounded-md flex flex-row mx-4"
        @click="addProduct"
      >
        <PlusCircleIcon class="h-6 w-6 text-white mr-2" /> Add Product
      </span>
    </div>

    <!-- Error Message if Fetch Fails -->
    <div
      v-if="errorMessage"
      class="bg-red-100 text-red-700 p-3 mb-4 rounded-md text-sm mx-4"
    >
      {{ errorMessage }}
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center p-4 text-gray-600 mx-4">
      Loading products...
    </div>

    <div
      v-else-if="products.length > 0"
      class="overflow-x-auto rounded-md my-2 mx-4"
    >
      <table
        class="min-w-full bg-white border border-gray-200 rounded-lg shadow-md"
      >
        <thead class="bg-gray-100">
          <tr>
            <th class="seller_table-head">Product</th>
            <th class="seller_table-head">Category</th>
            <th class="seller_table-head">Price</th>
            <th class="seller_table-head">Stock</th>
            <!-- <th class="seller_table-head">Status</th> -->
            <th class="seller_table-head">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="product in products"
            :key="product._id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="seller_table-data">
              {{ product.title }}
            </td>
            <td class="seller_table-data">{{ product.category }}</td>
            <td class="seller_table-data">R{{ product.price.toFixed(2) }}</td>
            <td class="seller_table-data">{{ product.stock }}</td>
            <!-- <td class="seller_table-data">
              <span
                :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  product.status === 'active'
                    ? 'text-green-800 bg-green-100'
                    : 'text-red-800 bg-red-100',
                ]"
                >  {{ product.status === 'active' ? 'Active' : 'Inactive' }}</span
              >
            </td> -->
            <td class="seller_table-data">
              <span
                class="text-blue-600 hover:text-blue-800 cursor-pointer mr-3"
                @click="editProduct(product._id)"
                >Edit</span
              >
              <span
                class="text-red-600 hover:text-red-800 cursor-pointer"
                @click="deleteProduct(product._id)"
                >Delete</span
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State if No Products -->
    <div
      v-else
      class="text-center p-4 text-gray-600 mx-4 bg-gray-50 rounded-md"
    >
      No products found. Add a new product to get started.
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
