<script setup>
import { ShoppingBagIcon } from "@heroicons/vue/24/outline";
import { capitalize, onMounted, ref, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useAuth } from '@/composable/useAuth';


const route = useRoute(); // Use route to detect changes
const message = ref('Guest');

const {user, logoutUser, fetchUserData } = useAuth();

// Function to update user data from localStorage
const updateMessage  = () => {
    const userName = user.value?.name;
    message.value = userName ? capitalize(userName) : ( user.value?.email || 'Guest');
};

//watch for changes in user data
watch(() => user.value, () => {
    updateMessage ();
});

// Watch for route changes to update user data (login redirects to a new route)
watch(() => route.path, () => {
    updateMessage ();
});

onMounted(async () => {
    // Initial load of user data
    updateMessage ();
    await fetchUserData();// Fetch the latest user data from the backend to ensure the token is valid
});

// Logout function
const logout = async () => {
    await logoutUser()
};

</script>

<template>
    <div class="bg-blue-200 p-4 flex justify-between items-center">
        <div>
            <h1>LOGO</h1>
        </div>
        <div class="flex gap-4 items-center">
            <p class="font-semibold">Hi, {{ message }}</p>
            <ShoppingBagIcon class="h-6 w-6 text-black cursor-pointer" />
            <p v-if="user"
                class="border border-black font-semibold p-2 rounded hover:bg-black hover:text-white cursor-pointer"
                @click="logout"
            >
                Logout
            </p>
            <RouterLink v-else
                class="border border-black font-semibold p-2 rounded hover:bg-black hover:text-white cursor-pointer"
                to="/login"
            >
                login
            </RouterLink>
        </div>
    </div>
</template>

<style lang="scss" scoped>
</style>