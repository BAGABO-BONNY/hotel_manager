import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CheckCircle, Download, Hotel, Calendar, CreditCard, Mail, Phone } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Button from '../../components/common/Button';

interface BookingConfirmationState {
  bookingId: number;
  hotelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  price: number;
  totalAmount: number;
}

const BookingConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state as BookingConfirmationState;

  if (!bookingDetails) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Booking information not found</h2>
          <p className="text-gray-600 mb-8">Please return to the bookings page to view your reservations.</p>
          <Button variant="primary" onClick={() => navigate('/bookings')}>
            My Bookings
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-success-100 rounded-full mb-4">
              <CheckCircle size={32} className="text-success-500" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">
              Your reservation has been successfully completed. You'll receive a confirmation email shortly.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-elegant overflow-hidden mb-8">
            <div className="bg-primary-800 text-white p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Booking Confirmation</h2>
                <span className="text-sm bg-white text-primary-800 px-3 py-1 rounded-full">
                  #{bookingDetails.bookingId.toString().padStart(6, '0')}
                </span>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Hotel & Room Details */}
              <div className="flex items-start">
                <Hotel size={24} className="mr-4 text-primary-600" />
                <div>
                  <h3 className="text-lg font-semibold">{bookingDetails.hotelName}</h3>
                  <p className="text-gray-700">{bookingDetails.roomType}</p>
                </div>
              </div>
              
              {/* Dates */}
              <div className="flex items-start">
                <Calendar size={24} className="mr-4 text-primary-600" />
                <div>
                  <h3 className="text-lg font-semibold">Your Stay</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">Check-in</p>
                      <p className="font-medium">{format(new Date(bookingDetails.checkIn), 'EEE, MMM d, yyyy')}</p>
                      <p className="text-gray-600">After 3:00 PM</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Check-out</p>
                      <p className="font-medium">{format(new Date(bookingDetails.checkOut), 'EEE, MMM d, yyyy')}</p>
                      <p className="text-gray-600">Before 11:00 AM</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment */}
              <div className="flex items-start">
                <CreditCard size={24} className="mr-4 text-primary-600" />
                <div>
                  <h3 className="text-lg font-semibold">Payment Information</h3>
                  <div className="mt-2 bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Room rate</span>
                      <span>${bookingDetails.price} / night</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">
                        ${bookingDetails.price} x {
                          Math.floor((new Date(bookingDetails.checkOut).getTime() - new Date(bookingDetails.checkIn).getTime()) / (1000 * 60 * 60 * 24))
                        } nights
                      </span>
                      <span>
                        ${bookingDetails.price * Math.floor((new Date(bookingDetails.checkOut).getTime() - new Date(bookingDetails.checkIn).getTime()) / (1000 * 60 * 60 * 24))}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Taxes & fees</span>
                      <span>
                        ${(bookingDetails.totalAmount - (bookingDetails.price * Math.floor((new Date(bookingDetails.checkOut).getTime() - new Date(bookingDetails.checkIn).getTime()) / (1000 * 60 * 60 * 24)) + 25)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Service fee</span>
                      <span>$25.00</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                      <span>Total</span>
                      <span>${bookingDetails.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact */}
              <div className="flex items-start">
                <Mail size={24} className="mr-4 text-primary-600" />
                <div>
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  <p className="text-gray-700">
                    For any questions or changes to your booking, please contact us:
                  </p>
                  <div className="flex items-center mt-2">
                    <Mail size={16} className="mr-2 text-gray-600" />
                    <a href="mailto:reservations@hotel.com" className="text-primary-600 hover:underline">
                      reservations@hotel.com
                    </a>
                  </div>
                  <div className="flex items-center mt-1">
                    <Phone size={16} className="mr-2 text-gray-600" />
                    <a href="tel:+18001234567" className="text-primary-600 hover:underline">
                      +1 (800) 123-4567
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="flex items-center justify-center"
            >
              <Download size={18} className="mr-2" />
              Download Confirmation
            </Button>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                onClick={() => navigate('/bookings')}
              >
                View My Bookings
              </Button>
              
              <Button
                variant="accent"
                onClick={() => navigate('/')}
              >
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingConfirmationPage;