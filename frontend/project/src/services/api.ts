import axios from 'axios';
import { Hotel, Room, Booking } from '../types';

// Base API URL - should be configured based on environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle different error cases
    if (error.response) {
      // Handle 401 Unauthorized - redirect to login
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      // Handle 403 Forbidden
      else if (error.response.status === 403) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      // Handle 400 Bad Request
      else if (error.response.status === 400) {
        console.error('Bad Request:', error.response.data);
        throw new Error(error.response.data.message || 'Bad Request');
      }
      // Handle other errors
      else {
        console.error('API Error:', error.response.data);
        throw new Error(error.response.data.message || 'An error occurred');
      }
    } else {
      console.error('Network Error:', error.message);
      throw new Error('Network error. Please check your connection.');
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password, role: 'CUSTOMER' });
    return response.data;
  },

  // Hotel services
  getHotels: async () => {
    const response = await api.get('/hotels');
    return response.data;
  },
  getHotelById: async (id: number) => {
    const response = await api.get(`/hotels/${id}`);
    return response.data;
  },
  createHotel: async (hotelData: any) => {
    const response = await api.post('/hotels', hotelData);
    return response.data;
  },
  updateHotel: async (id: number, hotelData: any) => {
    const response = await api.put(`/hotels/${id}`, hotelData);
    return response.data;
  },
  deleteHotel: async (id: number) => {
    const response = await api.delete(`/hotels/${id}`);
    return response.data;
  },

  // Room services
  getRoomsByHotel: async (hotelId: number) => {
    const response = await api.get(`/rooms/hotel/${hotelId}`);
    return response.data;
  },
  getAvailableRoomsByHotel: async (hotelId: number) => {
    const response = await api.get(`/rooms/hotel/${hotelId}/available`);
    return response.data;
  },
  createRoom: async (roomData: any) => {
    const response = await api.post('/rooms', roomData);
    return response.data;
  },
  updateRoom: async (id: number, roomData: any) => {
    const response = await api.put(`/rooms/${id}`, roomData);
    return response.data;
  },
  deleteRoom: async (id: number) => {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  },
};

// Hotel services
export const hotelService = {
  getAllHotels: async () => {
    const response = await api.get('/hotels');
    return response.data;
  },
  getHotelById: async (id: number) => {
    const response = await api.get(`/hotels/${id}`);
    return response.data;
  },
  createHotel: async (hotelData: Partial<Hotel>) => {
    const response = await api.post('/hotels', hotelData);
    return response.data;
  },
  updateHotel: async (id: number, hotelData: Partial<Hotel>) => {
    const response = await api.put(`/hotels/${id}`, hotelData);
    return response.data;
  },
  deleteHotel: async (id: number) => {
    const response = await api.delete(`/hotels/${id}`);
    return response.data;
  },
};

// Room services
export const roomService = {
  getRoomsByHotelId: async (hotelId: number) => {
    const response = await api.get(`/hotels/${hotelId}/rooms`);
    return response.data;
  },
  createRoom: async (roomData: Partial<Room>) => {
    const response = await api.post('/rooms', roomData);
    return response.data;
  },
  updateRoom: async (id: number, roomData: Partial<Room>) => {
    const response = await api.put(`/rooms/${id}`, roomData);
    return response.data;
  },
  deleteRoom: async (id: number) => {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  },
  checkRoomAvailability: async (roomId: number, checkIn: string, checkOut: string) => {
    const response = await api.get(`/rooms/${roomId}/availability`, {
      params: { checkIn, checkOut }
    });
    return response.data;
  }
};

// Booking services
export const bookingService = {
  createBooking: async (bookingData: Partial<Booking>) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },
  getUserBookings: async () => {
    const response = await api.get('/bookings/my');
    return response.data;
  },
  getAllBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },
  cancelBooking: async (id: number) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },
  getBookingById: async (id: number) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
};

// Billing services
export const billingService = {
  getBillByBookingId: async (bookingId: number) => {
    const response = await api.get(`/billings/${bookingId}`);
    return response.data;
  },
};

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  }
};

export type { Hotel, Room, Booking, Bill } from '../types';
export default api;