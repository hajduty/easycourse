import type { Tokens } from "@/types/auth";
import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

export const apiUrl = import.meta.env.VITE_API_URL || 'https://localhost:7009/api';

// Queue management
interface QueuedRequest {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}

class RefreshTokenManager {
  private isRefreshing = false;
  private failedQueue: QueuedRequest[] = [];

  addToQueue(prom: QueuedRequest) {
    this.failedQueue.push(prom);
  }

  processQueue(error: any = null, token: string | null = null) {
    this.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token!);
      }
    });
    this.failedQueue = [];
  }

  setRefreshing(state: boolean) {
    this.isRefreshing = state;
  }

  getRefreshing() {
    return this.isRefreshing;
  }
}

const refreshManager = new RefreshTokenManager();

const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getStoredTokens = (): Tokens | null => {
  try {
    const stored = localStorage.getItem('tokens');
    if (!stored) return null;
    
    const tokens = JSON.parse(stored);
    if (typeof tokens?.accessToken !== 'string' || 
        typeof tokens?.refreshToken !== 'string') {
      return null;
    }
    return tokens;
  } catch (e) {
    console.error("Failed to parse tokens from localStorage", e);
    return null;
  }
};

const clearAuthData = () => {
  localStorage.removeItem('tokens');
  localStorage.removeItem('user');
};

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const tokens = getStoredTokens();
  
  if (tokens?.accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Only handle 401 errors and avoid retry loops
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Handle concurrent refresh requests
    if (refreshManager.getRefreshing()) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        refreshManager.addToQueue({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          },
          reject: (err: any) => {
            reject(err);
          },
        });
      });
    }

    refreshManager.setRefreshing(true);

    try {
      const tokens = getStoredTokens();
      if (!tokens?.refreshToken) {
        throw new Error("No refresh token available");
      }

      const { data } = await axios.post(`${apiUrl}/auth/refresh`, {
        refreshToken: tokens.refreshToken,
        refreshTokenId: tokens.refreshTokenId,
      });

      const refreshed = data.data;

      if (!refreshed?.tokens?.accessToken) {
        throw new Error("Invalid response from refresh endpoint");
      }

      localStorage.setItem("tokens", JSON.stringify(refreshed.tokens));
      refreshManager.processQueue(null, refreshed.tokens.accessToken);

      // Retry all queued requests
      refreshManager.processQueue(null, refreshed.tokens.accessToken);
      
      originalRequest.headers.Authorization = `Bearer ${refreshed.tokens.accessToken}`;
      return apiClient(originalRequest);

    } catch (refreshError) {
      clearAuthData();
      refreshManager.processQueue(refreshError);
      return Promise.reject(refreshError);
    } finally {
      refreshManager.setRefreshing(false);
    }
  }
);

export default apiClient;