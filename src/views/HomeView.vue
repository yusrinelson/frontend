<script setup>
import Navbar from '@/components/Navbar.vue';
import { ShoppingBagIcon, DevicePhoneMobileIcon, FireIcon, PaintBrushIcon, SparklesIcon, StarIcon } from '@heroicons/vue/24/solid';
import { useAuth } from '../composable/useAuth';
import { capitalize, onMounted } from 'vue';
import { useProduct } from '../composable/useProduct';
import { HeartIcon } from '@heroicons/vue/24/outline';

const { user, setUser } = useAuth();
const { fetchPublicProducts, products, getProductImage } = useProduct();


onMounted(async () => {
  await fetchPublicProducts();
})
</script>

<template>
  <Navbar />
  <header class="bg-[#2E8B57] text-white text-center h-[80vh] flex flex-col justify-center">
    <h1 class="text-4xl font-bold">Welcome to VueMarket</h1>
    <p class="text-lg mt-2">The best place to buy and sell products</p>
  </header>

  <main class="max-w-4xl mx-auto py-8">
    <h2 class="text-3xl font-semibold text-center text-[#2E8B57]">Shop by Category</h2>
    <ul class="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-6 text-lg">
      <li class="sort_Items-list">
        <DevicePhoneMobileIcon class="h-6 w-6 text-[#2E8B57]" />
        <a href="#">Electronics</a>
      </li>
      <li class="sort_Items-list">
        <FireIcon class="h-6 w-6 text-[#2E8B57]" />
        <a href="#">Clothing</a>
      </li>
      <li class="sort_Items-list">
        <ShoppingBagIcon class="h-6 w-6 text-[#2E8B57]" />
        <a href="#">Shoes</a>
      </li>
      <li class="sort_Items-list">
        <PaintBrushIcon class="h-6 w-6 text-[#2E8B57]" />
        <a href="#">Art</a>
      </li>
      <li class="sort_Items-list">
        <SparklesIcon class="h-6 w-6 text-[#2E8B57]" />
        <a href="#">Jewelry</a>
      </li>
    </ul>

    <div class="mt-10 ">
      <h2 class="text-2xl font-semibold text-primary">Featured Products</h2>
      <ul class="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4 text-lg ">
        <li v-for="product in products" :key="product.id"
          class="relative bg-gray-100 rounded-lg shadow-lg p-4 border border-secondary">
          <!-- Category in Top Left -->
          <span class="absolute top-2 left-2 bg-primary text-white text-sm px-3 py-1 rounded">
            {{ product.category }}
          </span>

          <!-- Heart Icon in Top Right -->
          <button class="absolute top-2 right-2 text-gray-500 hover:text-red-500">
            <HeartIcon class="h-6 w-6" />
          </button>

          <!-- Product Image -->
          <img :src="getProductImage(product)" :alt="product.title" class="w-full h-40 object-cover rounded-lg">

          <!-- Rating -->
          <div class="flex items-center justify-initial mt-2 text-yellow-500">
            <StarIcon class="w-4 h-4" />
            <p class="text-black">4.9</p>
          </div>

          <!-- Title -->
          <h3 class="mt-2 text-xl font-semibold text-gray-800">{{ product.title }}</h3>

          <!-- Price & Add to Cart -->
          <div class="flex justify-between items-center mt-2">
            <span class="text-lg font-bold text-primary">R{{ product.price }}</span>
            <button class="bg-primary text-white px-4 py-2 rounded hover:bg-secondary text-sm">
              Add to Cart
            </button>
          </div>
          <p class="text-sm mt-2 text-gray-500">Seller: <span class="font-semibold">{{ capitalize(product.createdBy.name) }}</span></p>
        </li>
      </ul>
    </div>

    <div v-if="!user" class="mt-12 text-center bg-primary text-white p-8 rounded-lg">
      <h2 class="text-2xl font-bold">Are You a Local Vendor?</h2>
      <p class="mt-2 mb-6">Join our platform to showcase your products to customers across South Africa.</p>
      <RouterLink to="/signup" class=" px-6 py-2 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100">
        Register Now
      </RouterLink>
    </div>
  </main>

  <footer class="text-center py-6 bg-gray-100 mt-10">
    <p>&copy; 2025 VueMarket. All rights reserved.</p>
  </footer>
</template>