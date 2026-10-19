import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { StudentSidebar } from './StudentSidebar';

export function StudentLayout() {
  const location = useLocation();
  const isVotingSession = location.pathname.includes('/voting-session');

  if (isVotingSession) {
    return (
      <div style={{ minHeight: '100vh', width: '100vw', background: 'rgba(9, 13, 22, 0.94)', backdropFilter: 'blur(16px)', color: '#f8fafc', overflowX: 'hidden' }}>
        <main style={{ minHeight: '100vh', width: '100%' }}>
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'radial-gradient(ellipse at 15% 15%, rgba(2, 132, 199, 0.05) 0%, transparent 60%), radial-gradient(ellipse at 85% 85%, rgba(99, 102, 241, 0.05) 0%, transparent 60%), var(--bg-main-translucent)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        transition: 'background 0.3s ease'
      }}
    >
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

export default StudentLayout;
