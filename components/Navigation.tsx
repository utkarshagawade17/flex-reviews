'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, TestTube, Building, Tag, Search, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Navigation() {
  const pathname = usePathname();
  const { user, isLoggedIn, logout } = useAuth();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/tags', label: 'Tags', icon: Tag },
    { href: '/google-exploration', label: 'Google Reviews', icon: Search },
    { href: '/api-test-comprehensive', label: 'API Test', icon: TestTube },
    { href: '/property/1', label: 'Shoreditch Heights', icon: Building },
    { href: '/property/2', label: 'Camden Square', icon: Building },
    { href: '/property/3', label: 'Notting Hill', icon: Building },
    { href: '/property/4', label: 'Covent Garden', icon: Building },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
        
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
