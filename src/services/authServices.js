import { API_BASE_URL } from "@/config/apiConfig";
import { getCookie } from "@/utils/cookieUtils";
import axios from "axios";


export const fetchCurrentUser = async (token) => {
    if (!token) {
        throw new Error('No token provided');
    }
    const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const refreshToken = async (refreshToken) => {
if (!refreshToken) {
        throw new Error("No refresh token provided");
      }

      const response = axios.post(`${API_BASE_URL}/api/auth/refresh-token`, {
        refreshToken,
      });

      return response.data;
    
};

export const logoutUser = async () => {
  const token = getCookie("token");
  if (token) {
    await axios.post(
      `${API_BASE_URL}/api/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
};
