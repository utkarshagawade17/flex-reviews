'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, MapPin, Wifi, Car, Coffee, ChefHat, Dumbbell, Waves, Shield, Tv, AirVent, TreePine, Mountain } from 'lucide-react';
import { NormalizedReview } from '@/types/review';

export default function PropertyPage() {
  const params = useParams();
  const propertyId = params.id;
  const [reviews, setReviews] = useState<NormalizedReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedReviews();
  }, [propertyId]);

  const fetchApprovedReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reviews/approved');
      const data = await response.json();
      
      if (data.success) {
        // Filter reviews for this specific property
        const propertyReviews = data.data.filter((review: NormalizedReview) => 
          review.listingName.includes('Covent Garden') || 
          review.id.toString() === propertyId
        );
        setReviews(propertyReviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock property data for Covent Garden
  const property = {
    id: propertyId,
    name: '2B N4 D - 8 Covent Garden',
    location: 'Covent Garden, London',
    price: 180,
    rating: 4.7,
    reviewCount: reviews.length,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    ],
    amenities: [
      { icon: Wifi, name: 'Free WiFi' },
      { icon: Car, name: 'Parking' },
      { icon: Coffee, name: 'Coffee Maker' },
      { icon: ChefHat, name: 'Kitchen' },
      { icon: Dumbbell, name: 'Gym' },
      { icon: Waves, name: 'Pool' },
      { icon: Shield, name: 'Security' },
      { icon: Tv, name: 'Smart TV' },
      { icon: AirVent, name: 'Air Conditioning' },
      { icon: TreePine, name: 'Garden' },
      { icon: Mountain, name: 'City Views' },
    ],
    description: 'Elegant 2-bedroom apartment in the heart of Covent Garden. This sophisticated property offers the perfect blend of historic charm and modern luxury. Located steps away from the Royal Opera House, Leicester Square, and the West End theaters, this apartment provides an ideal base for experiencing London\'s cultural attractions and entertainment district.',
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length 
    : property.rating;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Flex Living</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/properties" className="text-gray-600 hover:text-gray-900">Properties</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property Images */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              <img
                src={property.images[0]}
                alt={property.name}
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
          <div className="space-y-4">
            {property.images.slice(1).map((image, index) => (
              <div key={index} className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={`${property.name} ${index + 2}`}
                  className="w-full h-44 object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Property Info */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.name}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-1" />
                <span>{property.location}</span>
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-lg font-semibold">{averageRating.toFixed(1)}</span>
                </div>
                <span className="text-gray-600">({reviews.length} reviews)</span>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity, index) => {
                  const IconComponent = amenity.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <IconComponent className="w-5 h-5 text-primary-600" />
                      <span className="text-gray-700">{amenity.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Guest Reviews</h2>
              
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews selected yet</h3>
                    <p className="text-gray-500 mb-6">This property doesn't have any approved reviews to display publicly.</p>
                    <a 
                      href="/dashboard" 
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Go to Dashboard
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium text-sm">
                            {review.guestName?.charAt(0) || '?'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {review.guestName}
                            </h3>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < (review.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          
                          <p className="text-gray-700 leading-relaxed mb-3">
                            {review.text}
                          </p>
                          
                          <div className="text-sm text-gray-500">
                            {new Date(review.submittedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  £{property.price}
                  <span className="text-lg font-normal text-gray-600">/night</span>
                </div>
                <div className="flex items-center justify-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {averageRating.toFixed(1)} ({reviews.length} reviews)
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-in
                    </label>
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-out
                    </label>
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guests
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>1 guest</option>
                    <option>2 guests</option>
                    <option>3 guests</option>
                    <option>4 guests</option>
                    <option>5+ guests</option>
                  </select>
                </div>

                <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                  Book Now
                </button>

                <p className="text-xs text-gray-500 text-center">
                  You won't be charged yet
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
