<script setup>
import { 
    UserCircleIcon, 
    ChartPieIcon, 
    CubeIcon, 
    ShoppingBagIcon, 
    ArrowTrendingUpIcon,
    CogIcon, 
    ArrowRightStartOnRectangleIcon,
    ArrowRightEndOnRectangleIcon 
} from '@heroicons/vue/24/outline';

import { useAuth } from '../composable/useAuth';
import Navbar from '@/components/Navbar.vue';
import { onMounted } from 'vue';


const { logoutUser } = useAuth();
const { message, updateMessage, emailMessage } = useAuth();
// Logout function
const logout = async () => {
    await logoutUser()
};

onMounted(async () => {
    updateMessage();
})
</script>

<template>
    <Navbar/>
    <div class="flex h-screen">
        <!-- Left side -->
        <div class="w-[25%] bg-gray-100 flex flex-col h-full">
            <!-- Header Section -->
            <div class="p-4 border-b border-gray-300">
                <RouterLink to="/" class="flex items-center cursor-pointer mb-4">
                    <ArrowRightEndOnRectangleIcon class="h-5 w-5 text-gray-500" />
                    <p>Home</p>
                </RouterLink>
                <h1 class="text-2xl font-bold text-gray-800">VueMarket</h1>
                <p class="text-sm text-gray-600">Seller Dashboard</p>
            </div>

           <!-- Navigation Menu -->
           <div class="flex-1 overflow-y-auto">
                <ul class="flex flex-col gap-4 p-4">
                    <li>
                        <router-link 
                            to="/seller-dashboard/overview" 
                            class="dashboard_sidebar"
                            active-class="dashboard_active"
                            exact
                        >
                            <ChartPieIcon class="h-5 w-5" />
                            <span>Overview</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link 
                            to="/seller-dashboard/products" 
                            class="dashboard_sidebar"
                            active-class="dashboard_active "
                        >
                            <CubeIcon class="h-5 w-5" />
                            <span>Products</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link 
                            to="/seller-dashboard/orders" 
                            class="dashboard_sidebar"
                            active-class="dashboard_active"
                        >
                            <ShoppingBagIcon class="h-5 w-5" />
                            <span>Orders</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link 
                            to="/seller-dashboard/analytics" 
                            class="dashboard_sidebar"
                            active-class="dashboard_active"
                        >
                            <ArrowTrendingUpIcon class="h-5 w-5" />
                            <span>Analytics</span>
                        </router-link>
                    </li>
                </ul>
            </div>

            <!-- Bottom Section -->
            <div class="p-4 border-t border-gray-300 flex flex-col gap-3">
                <div class="flex items-center gap-3 text-gray-700">
                    <UserCircleIcon class="h-6 w-6" />
                    <span class="flex flex-col">
                        <p class="font-semibold text-sm">{{message}}</p>
                        <p class="text-xs text-gray-500">{{ emailMessage }}</p>
                    </span>
                </div>
                <div class="dashboard_sidebar">
                    <CogIcon class="h-5 w-5" />
                    <span>Settings</span>
                </div>
                <div class="flex items-center gap-3 text-gray-700 hover:text-red-600 cursor-pointer " @click="logout">
                    <ArrowRightStartOnRectangleIcon class="h-5 w-5" />
                    <span>Logout</span>
                </div>
            </div>
        </div>

        <!-- Right side -->
        <div class="flex-1 overflow-y-auto bg-gray-200">
            <router-view></router-view>
        </div>
    </div>
</template>

<style>
.dashboard_active {
    color: #2E8B57;
    font-weight: bold;
    
    .icon {
        color: #2E8B57;
    }
}
</style>