<script setup>
import Navbar from '@/components/Navbar.vue';
import { ShoppingBagIcon, DevicePhoneMobileIcon, FireIcon , PaintBrushIcon, SparklesIcon,StarIcon } from '@heroicons/vue/24/solid';
import { useAuth } from '../composable/useAuth';
import { onMounted } from 'vue';
import { useProduct } from '../composable/useProduct';

const { user } = useAuth();
const { fetchProducts, products } = useProduct();


onMounted(async () => {
  await fetchProducts();
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
      <li class="flex items-center gap-2 bg-slate-50 p-2 hover:bg-slate-100 rounded-md">
        <DevicePhoneMobileIcon class="h-6 w-6 text-[#2E8B57]" />
        <a href="#">Electronics</a>
      </li>
      <li class="flex items-center gap-2 bg-slate-50 p-2 hover:bg-slate-100 rounded-md">
        <FireIcon  class="h-6 w-6 text-[#2E8B57]" />
        <a href="#">Clothing</a>
      </li>
      <li class="flex items-center gap-2 bg-slate-50 p-2 hover:bg-slate-100 rounded-md">
        <ShoppingBagIcon class="h-6 w-6 text-[#2E8B57]" />
        <a href="#">Shoes</a>
      </li>
      <li class="flex items-center gap-2 bg-slate-50 p-2 hover:bg-slate-100 rounded-md">
        <PaintBrushIcon class="h-6 w-6 text-[#2E8B57]" />
        <a href="#">Art</a>
      </li>
      <li class="flex items-center gap-2 bg-slate-50 p-2 hover:bg-slate-100 rounded-md">
        <SparklesIcon class="h-6 w-6 text-[#2E8B57]" />
        <a href="#">Jewelry</a>
      </li>
    </ul>

<div class="mt-10 ">
  <h2 class="text-2xl font-semibold text-primary">Featured Products</h2>
  <ul class="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4 text-lg ">
    <li v-for="product in products" :key="product.id" class="relative bg-gray-100 rounded-lg shadow-lg p-4 border border-secondary">
      <!-- Category in Top Left -->
      <span class="absolute top-2 left-2 bg-primary text-white text-sm px-3 py-1 rounded">
        {{product.category}}
      </span>

      <!-- Heart Icon in Top Right -->
      <button class="absolute top-2 right-2 text-gray-500 hover:text-red-500">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
          viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l8.84 8.84a.75.75 0 0 0 1.06 0l8.84-8.84a5.5 5.5 0 0 0 0-7.78z">
          </path>
        </svg>
      </button>

      <!-- Product Image -->
      <img src="https://via.placeholder.com/150" alt="Product Image"
        class="w-full h-40 object-cover rounded-lg">

      <!-- Rating -->
      <div class="flex items-center justify-initial mt-2 text-yellow-500">
        <StarIcon class="w-4 h-4" /> <p class="text-black">4.9</p>
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
    </li>
  </ul>
</div>

    <div v-if="user" class="mt-12 text-center bg-primary] text-white p-8 rounded-lg : hidden">
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