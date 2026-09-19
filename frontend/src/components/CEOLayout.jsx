import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { CEOSidebar } from './CEOSidebar';

export function CEOLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <CEOSidebar />
        <main style={{ flex: 1, padding: '28px', maxWidth: '1400px', width: '100%', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
