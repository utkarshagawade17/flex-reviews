'use client';

import { useState } from 'react';
import { Star, MapPin, Wifi, Car, Coffee, ChefHat, Dumbbell, Waves, Shield } from 'lucide-react';

export default function TestPropertyPage() {
  const [testData] = useState({
    amenities: [
      { icon: Wifi, name: 'Free WiFi' },
      { icon: Car, name: 'Parking' },
      { icon: Coffee, name: 'Coffee Maker' },
      { icon: ChefHat, name: 'Kitchen' },
      { icon: Dumbbell, name: 'Gym' },
      { icon: Waves, name: 'Pool' },
      { icon: Shield, name: 'Security' },
    ],
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Property Component Test</h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities Test</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {testData.amenities.map((amenity, index) => {
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

        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Icon Test</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col items-center space-y-2">
              <Wifi className="w-8 h-8 text-blue-600" />
              <span className="text-sm">Wifi</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Car className="w-8 h-8 text-green-600" />
              <span className="text-sm">Car</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Coffee className="w-8 h-8 text-yellow-600" />
              <span className="text-sm">Coffee</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <ChefHat className="w-8 h-8 text-red-600" />
              <span className="text-sm">ChefHat</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Dumbbell className="w-8 h-8 text-purple-600" />
              <span className="text-sm">Dumbbell</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Waves className="w-8 h-8 text-cyan-600" />
              <span className="text-sm">Waves</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Shield className="w-8 h-8 text-indigo-600" />
              <span className="text-sm">Shield</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

