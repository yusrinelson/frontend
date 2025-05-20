import { ref, capitalize } from "vue";
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
        // console.warn("No refresh token found, logging out.");
        handleUnauthorized();
        return false;
      }

      const refreshResponse = await refreshToken(refreshTokenValue) // Call the refreshToken/service function to get the new token
      const newToken = refreshResponse.token;

      // Update token in cookies
      document.cookie = `token=${newToken}; path=/; max-age=1h; secure; samesite=strict;`;

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
        return await handleTokenExpired();
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

  const init = async () => {
    if (user.value) {
      console.log("User already logged in, skipping login check.", user.value);
      return;
    };
    // console.log("Initializing user data on app load...");
    await fetchUserData();
  }

  const message = ref('Guest');
  const emailMessage = ref('');


  // Function to update user data from localStorage
  const updateMessage = () => {
    const userName = user.value?.name;
    message.value = userName ? capitalize(userName) :  'Guest';

    emailMessage.value = user.value?.email;

  }

  return {
    user,
    setUser,
    clearUser,
    handleUnauthorized,
    handleTokenExpired,
    fetchUserData,
    logoutUser,
    init,
    message,
    updateMessage,
    emailMessage
  };
}
