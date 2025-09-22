'use client';

import { useState } from 'react';
import { Star, MapPin, Wifi, Car, Coffee, ChefHat, Dumbbell, Waves, Shield } from 'lucide-react';
import Link from 'next/link';

export default function PropertiesPage() {
  const properties = [
    {
      id: '1',
      name: '2B N1 A - 29 Shoreditch Heights',
      location: 'Shoreditch, London',
      price: 150,
      rating: 4.8,
      reviewCount: 19,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      amenities: ['Free WiFi', 'Parking', 'Coffee Maker']
    },
    {
      id: '2',
      name: 'Camden Square Luxury Apartment',
      location: 'Camden, London',
      price: 180,
      rating: 4.6,
      reviewCount: 12,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      amenities: ['Free WiFi', 'Gym', 'Pool']
    },
    {
      id: '3',
      name: 'Notting Hill Garden Flat',
      location: 'Notting Hill, London',
      price: 200,
      rating: 4.9,
      reviewCount: 8,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      amenities: ['Free WiFi', 'Garden', 'Kitchen']
    },
    {
      id: '4',
      name: 'Covent Garden Studio',
      location: 'Covent Garden, London',
      price: 120,
      rating: 4.4,
      reviewCount: 15,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      amenities: ['Free WiFi', 'Central Location', 'Modern Design']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-gray-900">Flex Living</Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/properties" className="text-gray-600 hover:text-gray-900 font-medium">Properties</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Properties</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated collection of premium short-term rental properties in London's most desirable neighborhoods.
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-w-16 aspect-h-12">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{property.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{property.rating}</span>
                  </div>
                </div>
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-900">£{property.price}/night</span>
                  <span className="text-sm text-gray-500">({property.reviewCount} reviews)</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {property.amenities.slice(0, 3).map((amenity, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      {amenity}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/property/${property.id}`}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 text-center block"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
