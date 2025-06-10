import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import { Search, Star, Clock, Shield } from 'lucide-react';

const HomePage: React.FC = () => {
  // Sample featured hotels
  const featuredHotels = [
    {
      id: 1,
      name: ' Grand Resort',
      location: 'Malibu, California',
      image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 4.8
    },
    {
      id: 2,
      name: ' City Center',
      location: 'New York, NY',
      image: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 4.6
    },
    {
      id: 3,
      name: ' Oceanfront',
      location: 'Miami, Florida',
      image: 'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 4.9
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ 
            backgroundImage: 'url(https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)' 
          }}
        ></div>
        
        <div className="relative container mx-auto px-4 py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 animate-fade-in">
            Luxury Accommodations for the Perfect Stay
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mb-8 animate-fade-in">
            Experience unparalleled comfort and elegance at  Hotel. Your journey to relaxation begins here.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-slide-up">
            <Link to="/hotels">
              <Button variant="accent" size="lg">
                Browse Hotels
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:bg-opacity-10">
                Sign Up Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-card -mt-16 p-6 relative z-10">
            <form className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Where are you going?"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in / Check-out
                </label>
                <input
                  type="text"
                  placeholder="Add dates"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guests
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option>1 Guest</option>
                  <option>2 Guests</option>
                  <option>3 Guests</option>
                  <option>4+ Guests</option>
                </select>
              </div>
              
              <div>
                <Button variant="primary" size="lg" type="submit">
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Featured Hotels</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover our most popular properties, known for their exceptional service and luxurious accommodations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredHotels.map((hotel) => (
              <div key={hotel.id} className="bg-white rounded-lg shadow-elegant overflow-hidden transition-transform duration-300 hover:-translate-y-2">
                <div className="relative overflow-hidden h-64">
                  <img 
                    src={hotel.image} 
                    alt={hotel.name} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
                  />
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-3 py-1 flex items-center">
                    <Star size={16} className="text-accent-500 mr-1" />
                    <span className="font-medium">{hotel.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                  <p className="text-gray-600 mb-4">{hotel.location}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-700 font-semibold">From $199/night</span>
                    <Link to={`/hotels/${hotel.id}`}>
                      <Button variant="outline" size="sm">View Details</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/hotels">
              <Button variant="primary" size="lg">View All Hotels</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Why Choose  Hotel?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We pride ourselves on delivering exceptional experiences that go beyond traditional hospitality.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={28} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Luxury Experience</h3>
              <p className="text-gray-600">
                Indulge in the highest quality accommodations with premium amenities and attentive service.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={28} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Booking</h3>
              <p className="text-gray-600">
                Our streamlined booking process makes it simple to reserve your perfect room in minutes.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={28} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Payments</h3>
              <p className="text-gray-600">
                Rest easy knowing your payment and personal information are protected by advanced security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Ready to Experience Luxury?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Join thousands of satisfied guests who have experienced the  difference. Book your stay today.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <Link to="/register">
              <Button variant="accent" size="lg">
                Create an Account
              </Button>
            </Link>
            <Link to="/hotels">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:bg-opacity-10">
                Browse Hotels
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;