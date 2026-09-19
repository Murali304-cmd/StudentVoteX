import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { StudentSidebar } from './StudentSidebar';

export function StudentLayout() {
  const location = useLocation();
  const isVotingSession = location.pathname.includes('/voting-session');

  if (isVotingSession) {
    return (
      <div style={{ minHeight: '100vh', width: '100vw', background: '#090d16', color: '#f8fafc', overflowX: 'hidden' }}>
        <main style={{ minHeight: '100vh', width: '100%' }}>
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <StudentSidebar />
        <main style={{ flex: 1, padding: '28px 36px', overflowY: 'auto', minWidth: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
