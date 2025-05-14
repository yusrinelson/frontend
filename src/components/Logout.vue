<!-- <script setup>
import { ShoppingBagIcon } from "@heroicons/vue/24/outline";
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const isLoggedIn = ref(false);
const user = ref(null);
const API_BASE_URL = import.meta.env.API_BASE_URL || "http://localhost:4000";

// Function to check auth status that can be called from anywhere
const checkAuth = () => {
  try {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      user.value = JSON.parse(userData);
      
      // Get token from cookies to verify we're still logged in
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
      
      isLoggedIn.value = !!token; // Set to true if token exists
    } else {
      isLoggedIn.value = false;
      user.value = null;
    }
  } catch (error) {
    console.error("Auth check error:", error);
    isLoggedIn.value = false;
    user.value = null;
  }
};

// Logout function
const handleLogout = async () => {
  try {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    
    if (token) {
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).catch(error => {
        console.log("Logout API error (continuing anyway):", error);
      });
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Clear cookies
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    // Clear localStorage
    localStorage.removeItem('user');
    
    // Update state
    isLoggedIn.value = false;
    user.value = null;
    
    // Redirect to login
    router.push('/login');
  }
};

// Handle login navigation
const handleLoginClick = () => {
  router.push('/login');
};

// Check auth on component mount
onMounted(() => {
  checkAuth();
  
  // Check auth status every time the component is shown/focused
  window.addEventListener('focus', checkAuth);
  
  // Create a custom event we can listen for when login happens
  window.addEventListener('login-event', checkAuth);
  
  // Set up interval to periodically check token (handles expiration)
  const authCheckInterval = setInterval(checkAuth, 5000);
  
  // Clean up on unmount
  onUnmounted(() => {
    window.removeEventListener('focus', checkAuth);
    window.removeEventListener('login-event', checkAuth);
    clearInterval(authCheckInterval);
  });
});
</script> -->

<!-- <template> -->
  <!-- <div class="bg-blue-200 p-4 flex justify-between items-center">
    <div>
      <h1>LOGO</h1>
    </div>
    <div class="flex gap-4 items-center"> -->
      <!-- Show user email if logged in -->
      <!-- <span v-if="isLoggedIn && user" class="font-medium">{{ user.email }}</span>
      
      <ShoppingBagIcon class="h-6 w-6 text-black cursor-pointer" /> -->
      
      <!-- Conditional rendering for login/logout button -->
      <!-- <p 
        class="border border-black font-semibold p-2 rounded hover:bg-black hover:text-white cursor-pointer"
        @click="isLoggedIn ? handleLogout() : handleLoginClick()"
      >
        {{ isLoggedIn ? 'Logout' : 'Login' }}
      </p>
    </div>
  </div> -->
<!-- </template> -->