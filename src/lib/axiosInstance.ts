import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken") || null;

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const { response, config } = error;
    const originalRequest = config as InternalAxiosRequestConfig;

    if (response?.status === 401 && !originalRequest?._retry) {
      originalRequest!._retry = true;
      try {
        const { data } = await axios.post(
          `api/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (err) {
        localStorage.removeItem("accessToken");
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
