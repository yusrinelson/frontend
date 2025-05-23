<script setup>
import { ShoppingBagIcon,UserCircleIcon } from "@heroicons/vue/24/outline";
import {  onMounted, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useAuth } from '@/composable/useAuth';


const route = useRoute(); // Use route to detect changes
// const message = ref('Guest');

const { user, fetchUserData, message, updateMessage } = useAuth();

//watch for changes in user data
watch(() => user.value, () => {
    updateMessage();
});

// Watch for route changes to update user data (login redirects to a new route)
watch(() => route.path, () => {
    updateMessage();
});

onMounted(async () => {
    // Initial load of user data
    updateMessage();
    await fetchUserData();// Fetch the latest user data from the backend to ensure the token is valid
});


</script>

<template>
    <div class="bg-[#2E8B57] p-4 flex justify-between items-center sticky top-0 text-white z-10">
        <div>
            <h1>LOGO</h1>
        </div>
        <div class="flex gap-4 items-center">
            <p class="font-semibold">Hi, {{ message }}</p>
            <div class=" bg-transparent p-2 relative">
                <span class="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs border border-red-700 text-center">10</span>
                <ShoppingBagIcon class="h-6 w-6 cursor-pointer" />
            </div>

            <router-link v-if="user && user.role === 'user'" to="/user-dashboard/orders">
                <UserCircleIcon class="h-8 w-8 cursor-pointer" />
            </router-link>
            <router-link v-if="user && user.role === 'seller'" to="/seller-dashboard/overview">
                <UserCircleIcon class="h-8 w-8 cursor-pointer" />
            </router-link>
            <UserCircleIcon v-else-if="user && user.role === ''" class="h-8 w-8 cursor-pointer hidden" />

            <RouterLink v-if="!user"
                class="border border-black font-semibold p-2 rounded hover:bg-black hover:text-white cursor-pointer"
                to="/login">
                login
            </RouterLink>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>