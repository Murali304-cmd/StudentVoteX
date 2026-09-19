import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [idleWarning, setIdleWarning] = useState(false);

  const lastActivityRef = useRef(Date.now());

  // Activity tracker for Section 4 Session Management (5 min idle timeout, warning at 4:30)
  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
      if (idleWarning) setIdleWarning(false);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    const interval = setInterval(() => {
      if (!user) return;
      const idleTimeSeconds = (Date.now() - lastActivityRef.current) / 1000;

      // Warning at 4 minutes 30 seconds (270 seconds)
      if (idleTimeSeconds >= 270 && idleTimeSeconds < 300) {
        setIdleWarning(true);
      }
      // Logout at 5 minutes (300 seconds)
      else if (idleTimeSeconds >= 300) {
        logout();
      }
    }, 5000);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      clearInterval(interval);
    };
  }, [user, idleWarning]);

  useEffect(() => {
    // Check saved local session
    const savedUser = localStorage.getItem('studentvoicex_user') || localStorage.getItem('votanova_user') || localStorage.getItem('votechain_user');
    const savedRole = localStorage.getItem('studentvoicex_role') || localStorage.getItem('votanova_role') || localStorage.getItem('votechain_role');
    if (savedUser && savedRole) {
      try {
        setUser(JSON.parse(savedUser));
        setRole(savedRole);
      } catch (e) {
        localStorage.removeItem('studentvoicex_user');
        localStorage.removeItem('studentvoicex_role');
        localStorage.removeItem('votanova_user');
        localStorage.removeItem('votanova_role');
        localStorage.removeItem('votechain_user');
        localStorage.removeItem('votechain_role');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password, mfaCode = '') => {
    const res = await api.auth.login(username, password, mfaCode);
    if (res.mfa_required) {
      return res; // Signal that MFA second factor is required
    }

    setUser(res.user);
    setRole(res.role);
    localStorage.setItem('studentvoicex_token', res.token);
    localStorage.setItem('studentvoicex_user', JSON.stringify(res.user));
    localStorage.setItem('studentvoicex_role', res.role);
    lastActivityRef.current = Date.now();
    setIdleWarning(false);
    return res;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('studentvoicex_token');
    localStorage.removeItem('studentvoicex_user');
    localStorage.removeItem('studentvoicex_role');
    localStorage.removeItem('votanova_token');
    localStorage.removeItem('votanova_user');
    localStorage.removeItem('votanova_role');
    localStorage.removeItem('votechain_token');
    localStorage.removeItem('votechain_user');
    localStorage.removeItem('votechain_role');
    setIdleWarning(false);
  };

  const refreshUser = async () => {
    if (user) {
      try {
        const fresh = await api.auth.getMe(user.username);
        setUser(fresh);
        localStorage.setItem('studentvoicex_user', JSON.stringify(fresh));
      } catch (e) {
        console.error("Failed to refresh user profile:", e);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, idleWarning, login, logout, refreshUser }}>
      {idleWarning && (
        <div style={{
          position: 'fixed',
          top: '70px',
          right: '24px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(245, 158, 11, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          <span>⚠️ Session Warning: You have been idle. Automatic security logout in 30 seconds.</span>
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
