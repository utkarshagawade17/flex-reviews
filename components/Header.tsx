'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Edit, User, Calendar, Share2, Star, Power, Settings, Bell, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Trigger search on every keystroke for real-time filtering
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleEdit = () => {
    // Open bulk edit mode or create new review
    console.log('Edit mode activated');
    alert('Edit mode: Select multiple reviews to perform bulk actions');
  };

  const handleUserProfile = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleCalendar = () => {
    // Open calendar view or date picker
    console.log('Calendar view opened');
    alert('Calendar: View reviews by date range');
  };

  const handleShare = () => {
    // Share dashboard or export data
    console.log('Share functionality');
    alert('Share: Export reviews or share dashboard link');
  };

  const handleFavorites = () => {
    // Toggle favorites view
    console.log('Favorites view toggled');
    alert('Favorites: Show only starred/favorite reviews');
  };

  const handleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleLogout = () => {
    // Handle logout
    console.log('Logout initiated');
    alert('Logout: Redirecting to login page');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search here..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </form>
        </div>

        {/* Action Icons */}
        <div className="flex items-center space-x-4 ml-6">
          <button 
            onClick={handleEdit}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit Mode"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button 
            onClick={handleUserProfile}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="User Profile"
          >
            <User className="w-5 h-5" />
          </button>
          <button 
            onClick={handleCalendar}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Calendar View"
          >
            <Calendar className="w-5 h-5" />
          </button>
          <button 
            onClick={handleShare}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Share & Export"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button 
            onClick={handleFavorites}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Favorites"
          >
            <Star className="w-5 h-5" />
          </button>
          <button 
            onClick={handleNotifications}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {showNotifications && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3 ml-6 relative" ref={userMenuRef}>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">Hi</p>
          </div>
          <div 
            onClick={handleUserProfile}
            className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors"
            title="User Profile"
          >
            <span className="text-white text-sm font-medium">UG</span>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Logout"
          >
            <Power className="w-5 h-5" />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">User Profile</p>
                <p className="text-xs text-gray-500">ug@flexliving.com</p>
              </div>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                <HelpCircle className="w-4 h-4 mr-2" />
                Help & Support
              </button>
              <div className="border-t border-gray-100 mt-2 pt-2">
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <Power className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">Notifications</p>
              </div>
              <div className="px-4 py-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">New review received</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 mt-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Review approved</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 mt-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Tag assignment needed</p>
                    <p className="text-xs text-gray-500">3 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
