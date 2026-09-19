import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { AdminSidebar } from './AdminSidebar';

export function AdminLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'rgba(248, 250, 252, 0.85)', position: 'relative', zIndex: 1 }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <AdminSidebar />
        <main style={{ flex: 1, padding: '28px 36px', overflowY: 'auto', minWidth: 0, position: 'relative', zIndex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
