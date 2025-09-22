'use client';

import { Star, Users, Shield, Heart, Award, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Flex Living</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're passionate about providing exceptional short-term rental experiences in London's most vibrant neighborhoods.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">500+</h3>
            <p className="text-gray-600">Happy Guests</p>
          </div>
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">4</h3>
            <p className="text-gray-600">Prime Locations</p>
          </div>
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">4.7</h3>
            <p className="text-gray-600">Average Rating</p>
          </div>
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">3</h3>
            <p className="text-gray-600">Years Experience</p>
          </div>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 mb-4">
              Founded in 2021, Flex Living began with a simple vision: to provide travelers with exceptional short-term rental experiences in London's most desirable neighborhoods.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              We carefully curate each property to ensure it meets our high standards for comfort, style, and location. Every space is designed to feel like a home away from home.
            </p>
            <p className="text-lg text-gray-600">
              Our commitment to excellence has earned us a reputation as one of London's premier short-term rental providers, with consistently high ratings and glowing reviews from our guests.
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Values</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Guest-First Approach</h4>
                  <p className="text-gray-600">Every decision we make is guided by what's best for our guests' experience.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Quality Assurance</h4>
                  <p className="text-gray-600">We maintain the highest standards for cleanliness, safety, and comfort.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Excellence</h4>
                  <p className="text-gray-600">We strive for excellence in every interaction and every stay.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sarah Johnson</h3>
              <p className="text-purple-600 font-medium mb-2">Founder & CEO</p>
              <p className="text-gray-600">Passionate about creating exceptional guest experiences.</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Michael Chen</h3>
              <p className="text-blue-600 font-medium mb-2">Operations Manager</p>
              <p className="text-gray-600">Ensuring every property meets our high standards.</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Emma Wilson</h3>
              <p className="text-green-600 font-medium mb-2">Guest Relations</p>
              <p className="text-gray-600">Dedicated to making your stay unforgettable.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
