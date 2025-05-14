<script setup>
import { RouterLink, useRoute } from "vue-router";
import axios from "axios";
import { ref } from "vue";
import router from "@/router";
import { useAuth } from '../composable/useAuth'
import { API_BASE_URL } from "@/config/apiConfig";


const route = useRoute();

const { setUser } = useAuth();

// form data
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const isLoading = ref(false);

const handleLogin = async () => {
  errorMessage.value = "";

  isLoading.value = true;

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/login`,
      {
        email: email.value,
        password: password.value,
      }
    );

    const data = response.data;
    console.log("Response:", data);

    //store in cookies
    document.cookie = `token=${data.token}; path=/; max-age=120; secure; samesite=strict;`;
    document.cookie = `refreshToken=${data.refreshToken}; path=/; max-age=300; secure; samesite=strict;`;

    //update reactive shared state
    setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      })




    //redirect
    await router.push("/");

  } catch (error) {
    if (error.response) {
      errorMessage.value = error.response.data.message || "Invalid Credentials";
      console.error("login error: ", error.response.data.message);
    } else if (error.request) {
      errorMessage.value = "No repsonse from server. Please try again";
      console.error("No response: ", error.request);
    } else {
      errorMessage.value = error.message || "An error occurred during login";
      console.error("Request error:", error.message);
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="bg-blue-200 h-[100vh] flex justify-center items-center">
    <div
      class="bg-white p-3 md:p-10 w-[90vw] md:w-[70vw] lg:w-[40vw] h-fit rounded-md drop-shadow-md border-gray-300"
    >
      <h1 class="text-3xl text-center font-bold mb-2">VueMarket</h1>
      <p class="text-center mb-2 text-gray-500">Sign in to your account</p>

      <!-- login / signup  buttons -->
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

      <div
        v-if="errorMessage"
        class="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm"
      >
        {{ errorMessage }}
      </div>

      <!-- login form -->
      <form @submit.prevent="handleLogin">
        <div class="flex flex-col">
          <label for="email" class="form_label">Email:</label>
          <input
            type="text"
            id="email"
            v-model="email"
            placeholder="Enter your email"
            required
            class="form_input"
            autocomplete="email"
          />
          <label for="password" class="form_label">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Enter your password"
            required
            class="form_input"
            autocomplete="current-password"
          />
          <button type="submit" class="btn_submit mt-2 flex items-center justify-center flex-row" :disabled="isLoading">
            <span v-if="isLoading" class="mr-2">
              <!-- Simple loading spinner -->
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isLoading ? "Logging in..." : "Login" }}
          </button>

          <!-- remember me /forget password -->
          <!-- <div class="flex justify-between mt-3">
            <div class="flex items-center">
              <input type="checkbox" id="remember" class="mr-2" />
              <label for="remember" class="text-sm">Remember me</label>
            </div>

            <RouterLink to="/forgot-password" class="text-sm text-blue-600 hover:underline">
              Forgot password?
            </RouterLink>
          </div> -->
        </div>
      </form>
      <RouterLink
        to="/signup"
        class="mt-6 flex justify-center items-center cursor-pointer"
        >Don't have an account?
        <span class="font-semibold ml-1">Sign up</span></RouterLink
      >
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
