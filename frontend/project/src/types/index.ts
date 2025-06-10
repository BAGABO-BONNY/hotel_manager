export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
}

export interface Hotel {
  id: number;
  name: string;
  location: string;
  description?: string;
  imageUrl?: string;
}

export interface Room {
  id: number;
  hotelId: number;
  roomType: string;
  price: number;
  isAvailable: boolean;
  imageUrl?: string;
  description?: string;
  capacity?: number;
  amenities?: string[];
}

export interface Booking {
  id: number;
  userId: number;
  roomId: number;
  hotelId?: number;
  hotelName?: string;
  roomType?: string;
  checkIn: string;
  checkOut: string;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt?: string;
}

export interface Bill {
  id: number;
  bookingId: number;
  amount: number;
  generatedAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface AuthContextType {
  auth: AuthState;
  login: (token: string) => void;
  logout: () => void;
  isAdmin: () => boolean;
}