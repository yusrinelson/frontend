<script setup>
import { UserIcon, BuildingStorefrontIcon } from "@heroicons/vue/24/outline";
import { RouterLink, useRoute } from "vue-router";
import axios from "axios";
import router from "@/router";
import { ref } from "vue";
import { API_BASE_URL } from "@/config/apiConfig";

const route = useRoute();


const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const role = ref("user");
const errorMessage = ref("");
const passwordMatchError = ref("");
const passwordFormatError = ref("");

// Function to validate password format
const validatePasswordFormat = (password) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 8;
  
  return (hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough);
}

const handleSignup = async () => {
  // Reset all error messages
  errorMessage.value = "";
  passwordMatchError.value = "";
  passwordFormatError.value = "";

  //check if passwords match
  if (password.value !== confirmPassword.value) {
    passwordMatchError.value = "Password do not match";
    return
  }

  // Check password format
  if (!validatePasswordFormat(password.value)) {
    passwordFormatError.value = "Password must contain at least 8 characters including uppercase, lowercase, number, and special character";
    return;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, {
    name: name.value,
    email: email.value,
    password: password.value,
    role: role.value
    });

    const data = response.data;
    console.log("Response:", data);

    //store in cookies
    document.cookie = `token=${data.token}; path=/; max-age=3600; secure; samesite=strict`;
    document.cookie = `refreshToken=${data.refreshToken}; path=/; max-age=604800; secure; samesite=strict`;

    //store in local storage
     // Store in local storage
     localStorage.setItem("user", JSON.stringify({
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role
    }));

    //redirect
    await router.push(role.value === 'seller' ? '/seller-dashboard' : '/user-dashboard');

  } catch (error) {
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      errorMessage.value = error.data.message || "Server error occurred";
      console.error("Server error:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage.value = "No response from server. Please try again.";
      console.error("No response:", error.request);
    } else {
      // Something happened in setting up the request
      errorMessage.value = error.message || "An error occurred during sign up";
      console.error("Request error:", error.message);
    }
  }
}
</script>

<template>
  <div class="bg-blue-200 h-fit flex justify-center items-center py-10">
    <div
      class="bg-white p-3 md:p-10 w-[90vw] md:w-[70vw] lg:w-[40vw] h-fit rounded-md drop-shadow-md border-gray-300 border"
    >
      <h1 class="text-3xl text-center font-bold mb-2">VueMarket</h1>
      <p class="text-center mb-2 text-gray-500">Create new Account</p>

      <div class="flex justify-center items-center my-6">
        <div class="bg-[#83e6ae] py-1 px-1 rounded-md w-[90vw] flex justify-center items-center">
          <RouterLink
          to="/login"
          class="btn_auth"
          :class="route.path === '/login' ? 'bg-[#2E8B57] text-white' : 'text-gray-500'"
          >Login</RouterLink
        >
        <RouterLink
          to="/signup"
          class="btn_auth"
          :class="route.path === '/signup' ? 'bg-[#2E8B57] text-white' : 'text-gray-500'"
          >Signup</RouterLink
        >
        </div>
      </div>

 <!-- Main error message -->
      <div v-if="errorMessage" class="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm">
        {{ errorMessage }}
      </div>

  
      <form @submit.prevent="handleSignup">
        <div class="flex flex-col">
          <label for="name" class="form_label">Name:</label>
          <input
            type="text"
            id="name"
            v-model="name"
            placeholder="Enter your full name"
            required
            class="form_input"
          />
          <label for="email" class="form_label">Email:</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Enter your email"
            required
            class="form_input"
          />
          <label for="password" class="form_label">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Enter your password"
            required
            class="form_input"
          />
          <small v-if="passwordFormatError" class="text-red-500 mt-1">
            {{ passwordFormatError }}
          </small>

          <label for="password" class="form_label">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            v-model="confirmPassword"
            placeholder="Enter your password"
            required
            class="form_input"
          />
          <small v-if="passwordMatchError" class="text-red-500 mt-1">
            {{ passwordMatchError }}
          </small>

          <p class="font-semibold">I am a</p>
          <div class="flex justify-center items-center gap-4 mt-4 mb-6">
            <button
              type="button"
              :class="[
                'w-[90vw] p-4 border border-[#2E8B57] rounded-md flex justify-center items-center flex-col',
                role === 'user' ? 'bg-[#2E8B57] text-white' : ''
              ]"
              @click="role = 'user'"
            >
            <span><UserIcon class="h-6 w-6 mb-2" :class="role === 'user' ? 'text-white' : 'text-black'" /></span><span>Customer</span>
            </button>
            <button
            type="button"
              :class="[
                'w-[90vw] p-4 border border-[#2E8B57] rounded-md flex justify-center items-center flex-col',
                role === 'seller' ? 'bg-[#2E8B57] text-white' : ''
              ]"
              @click="role = 'seller'"
            >
            <span><BuildingStorefrontIcon class="h-6 w-6 mb-2" :class="role === 'seller' ? 'text-white' : 'text-black'" /></span><span>Seller</span>
            </button>
          </div>

          <button type="submit" class="btn_submit mt-2">Submit</button>
        </div>
      </form>
      <RouterLink to="/login" class="mt-6 flex justify-center items-center cursor-pointer">
        Already have an account? <span class="font-semibold ml-1">Log in</span>
      </RouterLink>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
