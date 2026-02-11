import axios, { 
  InternalAxiosRequestConfig, 
  AxiosResponse, 
  AxiosError 
} from 'axios';

const api = axios.create({
  // NEXT_PUBLIC_ wajib digunakan agar variable bisa dibaca di sisi browser oleh Next.js
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor Request: Menambahkan Token ke Header secara otomatis
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Pastikan kita berada di browser sebelum mengakses localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor Response: Menangani error 401 (Unauthorized) secara global
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Jika token tidak valid atau expired
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Gunakan window.location.replace agar user tidak bisa klik 'back' ke halaman terproteksi
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;