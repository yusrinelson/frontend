import { ref } from "vue";
import { useRouter } from 'vue-router';
import { getCookie } from '@/utils/cookieUtils';
//imports servcie functions
import { fetchCurrentUser, refreshToken, logoutUser as logoutUserService } from "@/services/authServices";


const user = ref(null);

export function useAuth() {
    const router = useRouter();

  // Initialize from localStorage
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    user.value = JSON.parse(storedUser);
  }

  const setUser = (userData) => {
    user.value = userData;
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const clearUser = () => {
    user.value = null;
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; max-age=0; secure; samesite=strict;";
    document.cookie =
      "refreshToken=; path=/; max-age=0; secure; samesite=strict;";
  };

  const handleUnauthorized = () => {
    clearUser();
    router.push({ name: "home" });
  };

  /**
   * Handle token expiration with refresh token
   * @returns {boolean} true if the token was successfully refreshed and user data updated, false otherwise.
   */
  const handleTokenExpired = async () => {
    try {
      const refreshTokenValue = getCookie("refreshToken");
      if (!refreshTokenValue) {
        handleUnauthorized();
        return false;
      }

      const refreshResponse = await refreshToken(refreshToken) // Call the refreshToken/service function to get the new token
      const newToken = refreshResponse.token;

      // Update token in cookies
      document.cookie = `token=${newToken}; path=/; max-age=120; secure; samesite=strict;`;

      // Fetch user data again with the new token
      const userData = await fetchCurrentUser(newToken);

      localStorage.setItem("user", JSON.stringify(userData.user));
      user.value = userData.user;
      return true;
    } catch (refreshError) {
      console.error("Error refreshing token:", refreshError);
      handleUnauthorized();
      return false;
    }
  };

  /**
   * Fetches user data from the backend and updates the user reactive state.
   * If no token is present, it will handle the unauthorized case.
   * If the token is expired, it will attempt to refresh the token and fetch the user data again.
   * @returns {boolean} true if the user data was successfully fetched and updated, false otherwise.
   */
  const fetchUserData = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        handleUnauthorized();
        return false;
      }

      const userData = await fetchCurrentUser(token); // call service function to fetch user data

      localStorage.setItem("user", JSON.stringify(userData.user));
      user.value = userData.user;
      return true;

    } catch (error) {
      if (error.response?.status === 401) {
        return handleTokenExpired();
      } else {
        console.error("Error fetching user data:", error);
        return false;
      }
    }
  };

 
  /**
   * Logs out the user by sending a logout request to the backend
   * and then clearing the user data and cookies.
   * If the token is invalid or missing, it will simply clear the user data and cookies.
   * @returns {void}
   */
  const logoutUser = async () => {
    try {
       await logoutUserService() // calls the service function to perform backen logout
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      handleUnauthorized(); // Clear data and redirect regardless of backend response
    }
  };

  return {
    user,
    setUser,
    clearUser,
    handleUnauthorized,
    handleTokenExpired,
    fetchUserData,
    logoutUser
  };
}
