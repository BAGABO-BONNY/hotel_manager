import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CreditCard, Calendar, User, Hotel as HotelIcon, Check } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { bookingService, hotelService, roomService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface LocationState {
  hotelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  price: number;
}

const BookingPage: React.FC = () => {
  const { hotelId, roomId } = useParams<{ hotelId: string; roomId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { auth } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
    paymentMethod: 'credit-card'
  });
  
  const [bookingDetails, setBookingDetails] = useState<LocationState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!auth.isAuthenticated) {
      toast.error('Please log in to book a room');
      navigate('/login');
      return;
    }
    
    const state = location.state as LocationState;
    
    if (state) {
      setBookingDetails(state);
      setFormData(prev => ({
        ...prev,
        firstName: auth.user?.name.split(' ')[0] || '',
        lastName: auth.user?.name.split(' ').slice(1).join(' ') || '',
        email: auth.user?.email || ''
      }));
    } else {
      // If state is not available (e.g., direct URL access), fetch the data
      const fetchBookingData = async () => {
        if (!hotelId || !roomId) {
          navigate('/hotels');
          return;
        }
        
        try {
          const hotel = await hotelService.getHotelById(parseInt(hotelId));
          const roomsData = await roomService.getRoomsByHotelId(parseInt(hotelId));
          const room = roomsData.find(r => r.id === parseInt(roomId));
          
          if (!room) {
            toast.error('Room not found');
            navigate(`/hotels/${hotelId}`);
            return;
          }
          
          // Set default dates (today and tomorrow)
          const today = new Date();
          const tomorrow = new Date();
          tomorrow.setDate(today.getDate() + 1);
          
          setBookingDetails({
            hotelName: hotel.name,
            roomType: room.roomType,
            checkIn: today.toISOString(),
            checkOut: tomorrow.toISOString(),
            price: room.price
          });
          
          setFormData(prev => ({
            ...prev,
            firstName: auth.user?.name.split(' ')[0] || '',
            lastName: auth.user?.name.split(' ').slice(1).join(' ') || '',
            email: auth.user?.email || ''
          }));
        } catch (error) {
          toast.error('Failed to load booking details');
          navigate('/hotels');
        }
      };
      
      fetchBookingData();
    }
  }, [hotelId, roomId, location.state, navigate, auth]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    if (!bookingDetails) return;
    
    setIsLoading(true);
    
    try {
      // For demo purposes, simulate a successful booking
      setTimeout(() => {
        toast.success('Booking confirmed successfully!');
        navigate('/booking-confirmation', {
          state: {
            bookingId: Math.floor(Math.random() * 10000),
            hotelName: bookingDetails.hotelName,
            roomType: bookingDetails.roomType,
            checkIn: bookingDetails.checkIn,
            checkOut: bookingDetails.checkOut,
            price: bookingDetails.price,
            totalAmount: calculateTotal(bookingDetails)
          }
        });
      }, 1500);
      
      // In a real implementation, you would call the API
      // const bookingData = {
      //   userId: auth.user?.id,
      //   roomId: parseInt(roomId || '0'),
      //   hotelId: parseInt(hotelId || '0'),
      //   checkIn: bookingDetails.checkIn,
      //   checkOut: bookingDetails.checkOut,
      // };
      // const response = await bookingService.createBooking(bookingData);
    } catch (error) {
      toast.error('Failed to complete booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = (details: LocationState) => {
    if (!details) return 0;
    
    const checkInDate = new Date(details.checkIn);
    const checkOutDate = new Date(details.checkOut);
    const nights = Math.floor((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const roomTotal = details.price * nights;
    const tax = roomTotal * 0.12;
    const serviceFee = 25;
    
    return roomTotal + tax + serviceFee;
  };

  if (!bookingDetails) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading booking details...</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-bold mb-8 text-center">Complete Your Booking</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <Card className="mb-8">
                <Card.Body>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <User size={20} className="mr-2 text-primary-600" />
                    Guest Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      error={errors.firstName}
                      required
                    />
                    
                    <Input
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      error={errors.lastName}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      error={errors.email}
                      required
                    />
                    
                    <Input
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      error={errors.phone}
                      required
                    />
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Requests (optional)
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Let us know if you have any special requests"
                    ></textarea>
                  </div>
                </Card.Body>
              </Card>
              
              <Card className="mb-8">
                <Card.Body>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <CreditCard size={20} className="mr-2 text-primary-600" />
                    Payment Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="credit-card"
                          checked={formData.paymentMethod === 'credit-card'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <span className="ml-2">Credit or Debit Card</span>
                      </label>
                    </div>
                    
                    {formData.paymentMethod === 'credit-card' && (
                      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                        <Input
                          label="Card Number"
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Expiry Date"
                            placeholder="MM/YY"
                            required
                          />
                          
                          <Input
                            label="CVC"
                            placeholder="123"
                            required
                          />
                        </div>
                        
                        <Input
                          label="Name on Card"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    )}
                    
                    <div>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="pay-at-hotel"
                          checked={formData.paymentMethod === 'pay-at-hotel'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <span className="ml-2">Pay at Hotel</span>
                      </label>
                    </div>
                  </div>
                </Card.Body>
              </Card>
              
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Back
                </Button>
                
                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  isLoading={isLoading}
                >
                  Complete Booking
                </Button>
              </div>
            </form>
          </div>

          {/* Booking summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <Card.Body>
                <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <HotelIcon size={20} className="mr-3 text-primary-600 mt-1" />
                    <div>
                      <h3 className="font-medium">{bookingDetails.hotelName}</h3>
                      <p className="text-gray-600">{bookingDetails.roomType}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Calendar size={20} className="mr-3 text-primary-600 mt-1" />
                    <div>
                      <div className="font-medium">
                        {format(new Date(bookingDetails.checkIn), 'EEE, MMM d, yyyy')} to {format(new Date(bookingDetails.checkOut), 'EEE, MMM d, yyyy')}
                      </div>
                      <p className="text-gray-600">
                        {Math.floor((new Date(bookingDetails.checkOut).getTime() - new Date(bookingDetails.checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights
                      </p>
                    </div>
                  </div>
                </div>
                
                <hr className="my-4 border-gray-200" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room rate</span>
                    <span>${bookingDetails.price} / night</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      ${bookingDetails.price} x {
                        Math.floor((new Date(bookingDetails.checkOut).getTime() - new Date(bookingDetails.checkIn).getTime()) / (1000 * 60 * 60 * 24))
                      } nights
                    </span>
                    <span>
                      ${bookingDetails.price * Math.floor((new Date(bookingDetails.checkOut).getTime() - new Date(bookingDetails.checkIn).getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes & fees (12%)</span>
                    <span>
                      ${(bookingDetails.price * Math.floor((new Date(bookingDetails.checkOut).getTime() - new Date(bookingDetails.checkIn).getTime()) / (1000 * 60 * 60 * 24)) * 0.12).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service fee</span>
                    <span>$25.00</span>
                  </div>
                </div>
                
                <hr className="my-4 border-gray-200" />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${calculateTotal(bookingDetails).toFixed(2)}</span>
                </div>
                
                <div className="mt-6 space-y-3 bg-gray-50 p-4 rounded-lg">
                  <div className="flex">
                    <Check size={18} className="text-success-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Free cancellation until 24 hours before check-in</span>
                  </div>
                  <div className="flex">
                    <Check size={18} className="text-success-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Pay now or at the property</span>
                  </div>
                  <div className="flex">
                    <Check size={18} className="text-success-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Best price guaranteed</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingPage;