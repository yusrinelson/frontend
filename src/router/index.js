import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '@/components/Login.vue'
import Signup from '@/components/Signup.vue'
import SellerDashboardView from '@/views/SellerDashboardView.vue'
import UserDashboard from '@/views/UserDashboard.vue'
import Overview from '@/components/seller/Overview.vue'
import Products from '@/components/seller/Products.vue'
import Orders from '@/components/seller/Orders.vue'
import Analytics from '@/components/seller/Analytics.vue'
import UserOrders from '@/components/user/Orders.vue'
import Wishlist from '@/components/user/Wishlist.vue'
import AccountDetails from '@/components/user/AccountDetails.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/seller-dashboard',
      name: 'seller',
      component: SellerDashboardView,
      children: [
        {path: 'overview', name: 'seller-overview', component: Overview},
        {path: 'orders', name: 'seller-orders', component: Orders},
        {path: 'products', name: 'seller-products',component: Products },
        {path: 'analytics', name: 'seller-analytics',component: Analytics },
      ]
    },
    {
      path: '/user-dashboard',
      name: 'user',
      component: UserDashboard,
      children: [
        {path: 'orders', name: 'user-overview', component: UserOrders},
        {path: 'wishlist', name: 'user-orders', component: Wishlist},
        {path: 'accountDetails', name: 'user-products',component: AccountDetails },
      ]
    }

  ],
})

export default router
