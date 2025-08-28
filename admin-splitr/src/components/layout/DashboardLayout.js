import { useState } from 'react';
import Sidebar from './Sidebar';
import AuthGuard from '../AuthGuard';
import PageHeader from './PageHeader';
import IdleLogout from '../IdleLogout';

const DashboardLayout = ({ 
  children, 
  title, 
  subtitle, 
  showUser = true 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <IdleLogout />
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className={`flex flex-col min-h-screen transition-all duration-300 ${
          sidebarOpen ? "md:ml-64" : "ml-0"
        }`}>
          <PageHeader title={title} subtitle={subtitle} showUser={showUser} />
          <main className="flex-1 px-4 md:px-6 py-6 md:py-8">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
};

export default DashboardLayout;