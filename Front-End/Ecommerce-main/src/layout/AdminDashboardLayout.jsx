import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../componets/Admin/AdminSidebar';
import AdminHeader from '../componets/Admin/AdminHeader';
import api from '../componets/api/api';

const AdminDashboardLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile: closed by default
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); // Desktop: expanded by default

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/SignIn');
        return;
      }

      try {
        const { data } = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (data.role !== 'ADMIN') {
          localStorage.removeItem('token');
          navigate('/SignIn');
        }
      } catch (error) {
        console.error('Session check failed:', error);
        localStorage.removeItem('token');
        navigate('/SignIn');
      }
    };

    checkSession();
  }, [navigate]);

  const toggleSidebar = () => {
    console.log('Toggle Sidebar clicked, isSidebarOpen:', !isSidebarOpen); // Debug log
    setIsSidebarOpen(prev => !prev);
  };

  const toggleSidebarExpansion = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar
        isOpen={isSidebarOpen}
        isExpanded={isSidebarExpanded}
        toggleSidebar={toggleSidebar}
        toggleExpansion={toggleSidebarExpansion}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;