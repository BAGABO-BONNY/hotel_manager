import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Search } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { hotelService, Hotel } from '../../services/api';
import { toast } from 'react-hot-toast';

const HotelsListPage: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await hotelService.getAllHotels();
        setHotels(data);
        setFilteredHotels(data);
      } catch (error) {
        toast.error('Failed to load hotels. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // For demo purposes, create sample data if API fails
  useEffect(() => {
    if (!isLoading && hotels.length === 0) {
      const sampleHotels = [
        {
          id: 1,
          name: ' Grand Resort',
          location: 'Malibu, California',
          description: 'Luxury beachfront resort with panoramic ocean views and world-class amenities.',
          imageUrl: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        },
        {
          id: 2,
          name: ' City Center',
          location: 'New York, NY',
          description: 'Premium downtown hotel in the heart of Manhattan, steps away from major attractions.',
          imageUrl: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        },
        {
          id: 3,
          name: ' Oceanfront',
          location: 'Miami, Florida',
          description: 'Beachside luxury with private balconies and direct access to pristine white sands.',
          imageUrl: 'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        },
        {
          id: 4,
          name: ' Mountain Lodge',
          location: 'Aspen, Colorado',
          description: 'Cozy mountain retreat with stunning views and ski-in/ski-out access.',
          imageUrl: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        },
        {
          id: 5,
          name: ' Lakeside Resort',
          location: 'Lake Tahoe, Nevada',
          description: 'Serene lakeside property with private beach and water sports facilities.',
          imageUrl: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        },
        {
          id: 6,
          name: ' Historic Downtown',
          location: 'Charleston, South Carolina',
          description: 'Charming boutique hotel in a restored historic building with period features.',
          imageUrl: 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        }
      ];
      
      setHotels(sampleHotels);
      setFilteredHotels(sampleHotels);
    }
  }, [isLoading, hotels]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = hotels.filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHotels(filtered);
    } else {
      setFilteredHotels(hotels);
    }
  }, [searchTerm, hotels]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search already handled by useEffect
  };

  return (
    <Layout>
      <div className="bg-primary-900 text-white">
        <div className="container mx-auto px-4 py-20">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-center">
            Discover Our Hotels
          </h1>
          <p className="text-lg text-center max-w-3xl mx-auto mb-8">
            Browse our collection of luxurious hotels in prime locations around the world.
          </p>
          
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="flex w-full">
              <div className="relative flex-grow">
                <Input
                  placeholder="Search by hotel name or location"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-3 rounded-r-none"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={20} className="text-gray-400" />
                </div>
              </div>
              <Button
                type="submit"
                variant="accent"
                className="rounded-l-none"
              >
                Search
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {filteredHotels.length === 0 ? (
              <div className="text-center py-16">
                <h2 className="text-2xl font-semibold mb-4">No hotels found</h2>
                <p className="text-gray-600 mb-8">
                  We couldn't find any hotels matching your search criteria.
                </p>
                <Button variant="primary" onClick={() => setSearchTerm('')}>
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredHotels.map((hotel) => (
                  <Card key={hotel.id} hoverEffect className="h-full flex flex-col">
                    <Card.Image
                      src={hotel.imageUrl || 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
                      alt={hotel.name}
                      className="h-56"
                    />
                    <Card.Body className="flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <Card.Title>{hotel.name}</Card.Title>
                        <div className="flex items-center bg-accent-100 text-accent-800 px-2 py-1 rounded-md">
                          <Star size={16} className="text-accent-500 mr-1" />
                          <span className="font-medium">4.8</span>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin size={16} className="mr-1" />
                        <span>{hotel.location}</span>
                      </div>
                      <p className="text-gray-700 flex-grow mb-4">
                        {hotel.description || "Experience luxury and comfort at this premium  property featuring top-tier amenities and exceptional service."}
                      </p>
                      <div className="mt-auto">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-primary-700 font-semibold">From $199</span>
                            <span className="text-gray-600"> / night</span>
                          </div>
                          <Link to={`/hotels/${hotel.id}`}>
                            <Button variant="primary" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default HotelsListPage;