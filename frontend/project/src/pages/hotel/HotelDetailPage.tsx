import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Check, Info, Wifi, Coffee, Tv, Car, Users, ArrowLeft } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import DateRangePicker from '../../components/common/DateRangePicker';
import Select from '../../components/common/Select';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { hotelService, roomService, Hotel, Room } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const HotelDetailPage: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  const { auth } = useAuth();
  
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      if (!hotelId) return;
      
      setIsLoading(true);
      
      try {
        const hotelData = await hotelService.getHotelById(parseInt(hotelId));
        setHotel(hotelData);
        
        const roomsData = await roomService.getRoomsByHotelId(parseInt(hotelId));
        setRooms(roomsData);
      } catch (error) {
        console.error('Error fetching hotel details:', error);
        toast.error('Failed to load hotel details. Please try again later.');
        
        // For demo purposes, create sample data if API fails
        const sampleHotel = {
          id: parseInt(hotelId),
          name: ' Grand Resort',
          location: 'Malibu, California',
          description: 'Luxury beachfront resort with panoramic ocean views and world-class amenities. Featuring multiple pools, spa facilities, and gourmet dining options. Perfect for both relaxation and adventure seekers.',
          imageUrl: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        };
        
        const sampleRooms = [
          {
            id: 1,
            hotelId: parseInt(hotelId),
            roomType: 'Deluxe King Room',
            price: 299,
            isAvailable: true,
            imageUrl: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            description: 'Spacious room with king-sized bed, ocean view, and luxury bathroom.',
            capacity: 2,
            amenities: ['Ocean View', 'King Bed', 'Minibar', 'Free WiFi', 'Room Service']
          },
          {
            id: 2,
            hotelId: parseInt(hotelId),
            roomType: 'Executive Suite',
            price: 499,
            isAvailable: true,
            imageUrl: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            description: 'Luxurious suite with separate living area, premium amenities, and panoramic views.',
            capacity: 3,
            amenities: ['Ocean View', 'King Bed', 'Living Room', 'Jacuzzi', 'Premium Bar']
          },
          {
            id: 3,
            hotelId: parseInt(hotelId),
            roomType: 'Double Queen Room',
            price: 349,
            isAvailable: true,
            imageUrl: 'https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            description: 'Comfortable room with two queen beds, perfect for families or groups.',
            capacity: 4,
            amenities: ['Garden View', 'Two Queen Beds', 'Minibar', 'Free WiFi']
          }
        ];
        
        setHotel(sampleHotel);
        setRooms(sampleRooms);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotelDetails();
  }, [hotelId]);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleRoomSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRoom(e.target.value);
  };

  const handleBookNow = () => {
    if (!auth.isAuthenticated) {
      toast.error('Please log in to book a room');
      navigate('/login');
      return;
    }
    
    if (!selectedRoom) {
      toast.error('Please select a room type');
      return;
    }
    
    if (!startDate || !endDate) {
      toast.error('Please select check-in and check-out dates');
      return;
    }
    
    setIsBooking(true);
    
    // Simulate API call for demo
    setTimeout(() => {
      navigate(`/booking/${hotelId}/${selectedRoom}`, {
        state: {
          hotelName: hotel?.name,
          roomType: rooms.find(r => r.id.toString() === selectedRoom)?.roomType,
          checkIn: startDate?.toISOString(),
          checkOut: endDate?.toISOString(),
          price: rooms.find(r => r.id.toString() === selectedRoom)?.price
        }
      });
      setIsBooking(false);
    }, 1000);
  };

  return (
    <Layout>
      {isLoading ? (
        <div className="flex justify-center py-32">
          <LoadingSpinner size="lg" />
        </div>
      ) : hotel ? (
        <>
          {/* Hero section */}
          <div className="relative h-96 bg-gray-900">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
              style={{ 
                backgroundImage: `url(${hotel.imageUrl || 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'})` 
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900"></div>
            
            <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-8">
              <button 
                onClick={() => navigate('/hotels')}
                className="absolute top-8 left-4 md:left-8 bg-white bg-opacity-20 backdrop-blur-sm p-2 rounded-full hover:bg-opacity-30 transition-colors"
              >
                <ArrowLeft size={24} className="text-white" />
              </button>
              
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2">
                    {hotel.name}
                  </h1>
                  <div className="flex items-center text-white space-x-4 mb-2">
                    <div className="flex items-center">
                      <MapPin size={18} className="mr-1" />
                      <span>{hotel.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Star size={18} className="text-accent-400 mr-1" />
                      <span>4.8 (120 reviews)</span>
                    </div>
                  </div>
                </div>
                
                <div className="hidden md:block">
                  <div className="text-white text-lg">
                    From <span className="font-semibold text-2xl">${Math.min(...rooms.map(r => r.price))}</span> / night
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Hotel details */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-elegant p-6 mb-8">
                  <h2 className="text-2xl font-serif font-semibold mb-4">About this hotel</h2>
                  <p className="text-gray-700 mb-6">
                    {hotel.description || "Experience luxury and comfort at this premium  property featuring top-tier amenities and exceptional service. Our spacious rooms offer stunning views and modern conveniences for an unforgettable stay."}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center">
                      <div className="bg-primary-100 p-2 rounded-full mr-3">
                        <Wifi size={20} className="text-primary-700" />
                      </div>
                      <span>Free WiFi</span>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-primary-100 p-2 rounded-full mr-3">
                        <Coffee size={20} className="text-primary-700" />
                      </div>
                      <span>Breakfast</span>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-primary-100 p-2 rounded-full mr-3">
                        <Tv size={20} className="text-primary-700" />
                      </div>
                      <span>Smart TV</span>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-primary-100 p-2 rounded-full mr-3">
                        <Car size={20} className="text-primary-700" />
                      </div>
                      <span>Parking</span>
                    </div>
                  </div>
                  
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <Info size={20} className="text-primary-700 mr-2 mt-1 flex-shrink-0" />
                      <p className="text-primary-900">
                        This property has enhanced cleaning and safety measures in place for your protection.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-semibold mb-4">Available Rooms</h2>
                  <div className="space-y-6">
                    {rooms.map((room) => (
                      <Card key={room.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3">
                            <img 
                              src={room.imageUrl || 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} 
                              alt={room.roomType} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="md:w-2/3 p-6">
                            <div className="flex justify-between items-start">
                              <h3 className="text-xl font-semibold mb-2">{room.roomType}</h3>
                              <div className="text-right">
                                <div className="text-primary-700 font-semibold text-xl">${room.price}</div>
                                <div className="text-gray-600 text-sm">per night</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center mb-3">
                              <Users size={16} className="text-gray-500 mr-1" />
                              <span className="text-gray-600">
                                Up to {room.capacity || 2} guests
                              </span>
                            </div>
                            
                            <p className="text-gray-700 mb-4">
                              {room.description || "Comfortable and well-appointed room with modern amenities for a pleasant stay."}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-2 mb-4">
                              {(room.amenities || ['Free WiFi', 'Air Conditioning', 'Flat-screen TV', 'Private Bathroom']).map((amenity, index) => (
                                <div key={index} className="flex items-center">
                                  <Check size={16} className="text-success-500 mr-2" />
                                  <span className="text-gray-700">{amenity}</span>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex justify-end">
                              <Button 
                                variant="outline"
                                onClick={() => setSelectedRoom(room.id.toString())}
                                className={selectedRoom === room.id.toString() ? 'bg-primary-50' : ''}
                              >
                                {selectedRoom === room.id.toString() ? 'Selected' : 'Select'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              {/* Booking widget */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-elegant p-6 sticky top-24">
                  <h3 className="text-xl font-semibold mb-4">Book Your Stay</h3>
                  
                  <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    label="Check-in / Check-out Dates"
                  />
                  
                  <Select
                    label="Room Type"
                    value={selectedRoom}
                    onChange={handleRoomSelect}
                    options={rooms.map(room => ({
                      value: room.id.toString(),
                      label: `${room.roomType} - $${room.price}/night`
                    }))}
                  />
                  
                  {startDate && endDate && selectedRoom && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium mb-2">Price Summary</h4>
                      
                      {(() => {
                        const room = rooms.find(r => r.id.toString() === selectedRoom);
                        if (!room) return null;
                        
                        const nights = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                        const roomTotal = room.price * nights;
                        const tax = roomTotal * 0.12;
                        const total = roomTotal + tax;
                        
                        return (
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">${room.price} x {nights} nights</span>
                              <span>${roomTotal}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Taxes & fees (12%)</span>
                              <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-semibold pt-2 border-t">
                              <span>Total</span>
                              <span>${total.toFixed(2)}</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                  
                  <Button
                    variant="accent"
                    fullWidth
                    onClick={handleBookNow}
                    isLoading={isBooking}
                  >
                    Book Now
                  </Button>
                  
                  <p className="text-gray-600 text-sm mt-4 text-center">
                    You won't be charged yet
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-semibold mb-4">Hotel not found</h2>
          <p className="text-gray-600 mb-8">
            The hotel you are looking for does not exist or has been removed.
          </p>
          <Button variant="primary" onClick={() => navigate('/hotels')}>
            View All Hotels
          </Button>
        </div>
      )}
    </Layout>
  );
};

export default HotelDetailPage;