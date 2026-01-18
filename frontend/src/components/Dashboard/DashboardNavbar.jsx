import React, { useState, useEffect } from 'react';
import { Search, Bell } from 'lucide-react';

export default function DashboardNavbar({ searchTerm, onSearchChange }) {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('discovery');

  // Get user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  // Listen for storage changes to update user in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Also check periodically for changes (in case of same-window updates)
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left Section: Logo & Branding */}
          <div className="flex items-center gap-3">
            {/* Logo - Circular with teal outline and diamond */}
            <div className="relative w-10 h-10 rounded-full border border-teal-500 flex items-center justify-center">
              <div className="w-5 h-5 bg-teal-500 transform rotate-45"></div>
            </div>

            {/* Brand Name */}
            <div className="flex flex-col">
              <span className="text-xl font-serif font-bold text-white leading-none">
                TalentAI
              </span>
              <span className="text-[10px] font-sans uppercase tracking-widest text-teal-500 leading-none mt-0.5">
                GALLERY
              </span>
            </div>
          </div>

          {/* Middle Section: Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => setActiveTab('discovery')}
              className={`text-sm font-sans transition-colors ${activeTab === 'discovery' ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
            >
              Discovery
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`text-sm font-sans transition-colors ${activeTab === 'saved' ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
            >
              Saved
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`text-sm font-sans transition-colors ${activeTab === 'analytics' ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
            >
              Analytics
            </button>
          </div>

          {/* Right Section: Search, Notifications, Profile */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search the gallery..."
                value={searchTerm || ''}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-teal-500/50 focus:bg-white/10 transition-colors w-64"
              />
            </div>

            {/* Notifications Icon */}
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  {/* User Avatar */}
                  <div className="w-10 h-10 rounded-full border border-gray-700 bg-gradient-to-br from-teal-500/20 to-teal-600/20 flex items-center justify-center overflow-hidden">
                    {user.email ? (
                      <span className="text-sm font-semibold text-teal-400">
                        {getUserInitials()}
                      </span>
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-xs text-white">{getUserInitials()}</span>
                      </div>
                    )}
                  </div>
                  {/* User Email (hidden on mobile) */}
                  <span className="hidden lg:block text-sm text-gray-400 font-sans">
                    {getUserDisplayName()}
                  </span>
                </>
              ) : (
                <div className="w-10 h-10 rounded-full border border-gray-700 bg-gray-800 flex items-center justify-center">
                  <span className="text-xs text-gray-500">U</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
