'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import useAuthStore from '../../store/authStore';

export default function Sidebar({ isOpen = false, setIsOpen = () => {} }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isDashboardOpen, setIsDashboardOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        </svg>
      ),
      hasSubMenu: true,
      subMenuItems: [
        { name: ' Trends', path: '/dashboard' },
        { name: 'Daily Amount Split', path: '/dashboard' },
        { name: 'Payment Methods', path: '/dashboard' },
        { name: 'User Retention', path: '/dashboard' }
      ]
    },
    {
      name: 'Transactions',
      path: '/transactions',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      name: 'Geographic Analytics',
      path: '/analytics/geographic',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  const { logout } = useAuthStore();
  
  const handleLogout = async () => {
    try {
      const sessionId = document.cookie
        .split('; ')
        .find(row => row.startsWith('sessionId='))
        ?.split('=')[1];
      
      if (sessionId) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId })
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      router.push('/');
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`${isOpen ? 'w-64' : 'w-0'} h-screen bg-white shadow-lg border-r border-gray-200 flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden fixed left-0 top-0 z-40 md:z-30`}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-center">
            <Image 
              src="/assets/splitr.png"
              alt="SPLITR Logo"
              width={120}
              height={48}
              className="h-12 object-contain"
            />
          </div>
        </div>

        <nav className="mt-6 flex-1">
          {menuItems.map((item) => (
            <div key={item.name}>
              <div className={`w-full flex items-center justify-between hover:bg-gray-50 transition-colors ${
                pathname === item.path 
                  ? 'bg-orange-50 text-gray-600 border-r-2 border-orange-500' 
                  : 'text-gray-700'
              }`}>
                <button
                  onClick={() => {
                    router.push(item.path);
                    setIsOpen(false);
                  }}
                  className="flex-1 flex items-center px-6 py-3 text-left"
                >
                  {item.icon}
                  <span className="ml-3 font-medium">{item.name}</span>
                </button>
                {item.hasSubMenu && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDashboardOpen(!isDashboardOpen);
                    }}
                    className="px-3 py-3 hover:bg-gray-100 rounded-r"
                  >
                    <svg 
                      className={`w-4 h-4 transition-transform ${isDashboardOpen ? 'rotate-90' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
              
              {item.hasSubMenu && isDashboardOpen && (
                <div className="bg-gray-50">
                  {item.subMenuItems.map((subItem) => (
                    <button
                      key={subItem.name}
                      onClick={() => {
                        router.push(subItem.path);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center px-12 py-2 text-left hover:bg-gray-100 transition-colors text-gray-600 text-xs"
                    >
                      <span>{subItem.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center px-4 py-2 text-white rounded-md transition-colors border border-orange-500" 
            style={{backgroundColor: '#E58025'}}
            suppressHydrationWarning
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="ml-3 font-medium">Logout</span>
          </button>
        </div>
      </div>
      
      {/* Hamburger Button - Desktop */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:block fixed top-7 z-50 p-2 bg-white border border-gray-300 rounded-md shadow-md hover:bg-gray-50 transition-all duration-300"
        style={{left: isOpen ? '280px' : '24px'}}
        suppressHydrationWarning
      >
        <svg className="w-6 h-6" fill="none" stroke="#E58025" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      {/* Hamburger Button - Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-28 left-4 z-50 p-2 bg-white border border-gray-300 rounded-md shadow-md hover:bg-gray-50 transition-all duration-300"
        suppressHydrationWarning
      >
        <svg className="w-6 h-6" fill="none" stroke="#E58025" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} suppressHydrationWarning>
          <div className="bg-white rounded-lg p-4 md:p-6 max-w-sm w-full mx-4 shadow-xl" suppressHydrationWarning>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Logout</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
              <div className="flex space-x-3 w-full">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLogoutModal(false);
                    handleLogout();
                  }}
                  className="flex-1 px-4 py-2 text-white rounded-md transition-colors"
                  style={{backgroundColor: '#FF8500'}}
                  suppressHydrationWarning
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}