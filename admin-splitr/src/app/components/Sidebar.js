'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        </svg>
      )
    },
    {
      name: 'Transactions',
      path: '/transactions',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md hover:bg-gray-50 transition-colors"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>



      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-screen w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-center">
            <img 
              src="/assets/splitr.png"
              alt="SPLITR Logo"
              className="h-10 object-contain"
            />
          </div>
        </div>

        <nav className="mt-6 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                router.push(item.path);
                setIsOpen(false);
              }}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                pathname === item.path 
                  ? 'bg-orange-50 text-gray-600 border-r-2 border-orange-500' 
                  : 'text-gray-700'
              }`}
            >
              {item.icon}
              <span className="ml-3 font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-orange-200">
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              router.push('/');
            }}
            className="w-full flex items-center px-4 py-2 text-grey-600 hover:bg-orange-700 rounded-md transition-colors border border-orange-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="ml-3 font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}