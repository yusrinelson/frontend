<script setup>
import { 
    UserCircleIcon, 
    ShoppingBagIcon, 
    HeartIcon, 
    DocumentTextIcon, 
    CogIcon, 
    ArrowRightStartOnRectangleIcon,
    ArrowRightEndOnRectangleIcon 
} from '@heroicons/vue/24/outline';
import { useAuth } from '../composable/useAuth';

const { logoutUser } = useAuth();

// Logout function
const logout = async () => {
    await logoutUser()
};

</script>

<template>
    <div class="flex h-screen">
        <!-- Left side (Sidebar, 25% of screen width) -->
        <div class="w-[25%] bg-gray-100 flex flex-col h-full">
            <!-- Header Section -->
            <div class="p-4 border-b border-gray-300">
                <RouterLink to="/" class="flex items-center cursor-pointer mb-4">
                    <ArrowRightEndOnRectangleIcon class="h-5 w-5 text-gray-500" />
                    <p>Home</p>
                </RouterLink>
                <h1 class="text-2xl font-bold text-gray-800">VueMarket</h1>
                <p class="text-sm text-gray-600">User Dashboard</p>
            </div>

            <!-- Navigation Menu (positioned at the top of the remaining space) -->
            <div class="flex-1 overflow-y-auto">
                <ul class="flex flex-col gap-4 p-4">
                    <li >
                        <router-link to="/user-dashboard/orders" class="dashboard_sidebar" active-class="dashboard_active" exact>
                            <ShoppingBagIcon class="h-5 w-5" />
                            <span>My Orders</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/user-dashboard/wishlist" class="dashboard_sidebar" active-class="dashboard_active">
                            <HeartIcon class="h-5 w-5" />
                            <span>Wishlist</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/user-dashboard/accountDetails" class="dashboard_sidebar" active-class="dashboard_active">
                            <DocumentTextIcon class="h-5 w-5" />
                            <span>Account Details</span>
                        </router-link>
                    </li>
                </ul>
            </div>

            <!-- Bottom Section (User, Settings, Logout) -->
            <div class="p-4 border-t border-gray-300 flex flex-col gap-3">
                <div class="flex items-center gap-3 text-gray-700">
                    <UserCircleIcon class="h-6 w-6" />
                    <span class="flex flex-col">
                        <p class="font-semibold text-sm">John Doe</p>
                        <p class="text-xs text-gray-500">john@gmail.com</p>
                    </span>
                </div>
                <div class="dashboard_sidebar">
                    <CogIcon class="h-5 w-5" />
                    <span>Settings</span>
                </div>
                <div class="flex items-center gap-3 text-gray-700 hover:text-red-600 cursor-pointer" @click="logout">
                    <ArrowRightStartOnRectangleIcon class="h-5 w-5" />
                    <span >Logout</span>
                </div>
            </div>
        </div>

        <!-- Right side (Main Content Area) -->
        <div class="flex-1 overflow-y-auto bg-blue-500">
            <router-view></router-view>
        </div>
    </div>
</template>

<style lang="scss" scoped>
</style>