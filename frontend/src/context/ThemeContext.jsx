import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { triggerBackgroundEvent, BG_EVENTS } from '../services/eventBus';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Theme: 'light' or 'dark' (defaults to saved or light)
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem('votechain_theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  });

  // Background FX Mode: 'cyber' (pipeline), 'aurora' (fluid glow), 'matrix' (grid nodes)
  const [bgMode, setBgModeState] = useState(() => {
    try {
      return localStorage.getItem('votechain_bg_mode') || 'cyber';
    } catch (e) {
      return 'cyber';
    }
  });

  // Particle Density: 'high' | 'normal' | 'low'
  const [particleDensity, setParticleDensityState] = useState(() => {
    try {
      return localStorage.getItem('votechain_particle_density') || 'normal';
    } catch (e) {
      return 'normal';
    }
  });

  // Update HTML data-theme attribute
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('votechain_theme', theme);
    } catch (e) {
      console.warn('Failed to set theme in localStorage', e);
    }
  }, [theme]);

  // Persist background mode
  useEffect(() => {
    try {
      localStorage.setItem('votechain_bg_mode', bgMode);
      window.dispatchEvent(new CustomEvent('votechain:bg-mode-changed', { detail: { mode: bgMode } }));
    } catch (e) {
      console.warn('Failed to set bgMode', e);
    }
  }, [bgMode]);

  // Persist particle density
  useEffect(() => {
    try {
      localStorage.setItem('votechain_particle_density', particleDensity);
      window.dispatchEvent(new CustomEvent('votechain:density-changed', { detail: { density: particleDensity } }));
    } catch (e) {
      console.warn('Failed to set particle density', e);
    }
  }, [particleDensity]);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setTheme = useCallback((newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setThemeState(newTheme);
    }
  }, []);

  const setBgMode = useCallback((mode) => {
    if (['cyber', 'aurora', 'matrix'].includes(mode)) {
      setBgModeState(mode);
    }
  }, []);

  const setParticleDensity = useCallback((density) => {
    if (['low', 'normal', 'high'].includes(density)) {
      setParticleDensityState(density);
    }
  }, []);

  const triggerTestPulse = () => {
    triggerBackgroundEvent(BG_EVENTS.VOTE_CAST, { timestamp: Date.now() });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        toggleTheme,
        setTheme,
        bgMode,
        setBgMode,
        particleDensity,
        setParticleDensity,
        triggerTestPulse
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'light',
      isDark: false,
      toggleTheme: () => {},
      setTheme: () => {},
      bgMode: 'cyber',
      setBgMode: () => {},
      particleDensity: 'normal',
      setParticleDensity: () => {},
      triggerTestPulse: () => {}
    };
  }
  return context;
}
