// src/layouts/AdminDashboardLayout.jsx
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../componets/Admin/AdminSidebar';
import AdminHeader from '../componets/Admin/AdminHeader';
import api from '../componets/api/api';

const AdminDashboardLayout = () => {
  const navigate = useNavigate();

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

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;