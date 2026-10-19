import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Sparkles,
  Sun,
  Moon,
  Zap,
  Sliders,
  X,
  Layers,
  Activity,
  Check
} from 'lucide-react';

export function BackgroundControls() {
  const {
    theme,
    isDark,
    toggleTheme,
    bgMode,
    setBgMode,
    particleDensity,
    setParticleDensity,
    triggerTestPulse
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);

  const fxModes = [
    { id: 'cyber', label: 'Cyber Pipeline', icon: '⛓️', desc: '6-Stage BFT Blockchain lifecycle & traveling packets' },
    { id: 'aurora', label: 'Aurora Flow', icon: '🌊', desc: 'Fluid undulating chromatic plasma waves & cosmic nebulas' },
    { id: 'matrix', label: 'Matrix Grid', icon: '🌐', desc: '3D perspective holographic grid & cryptographic glyphs' }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 50,
        fontFamily: 'var(--font-sans)'
      }}
    >
      {/* Collapsed Pill Trigger */}
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '9999px',
            background: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(16px)',
            border: `1.5px solid ${isDark ? 'rgba(56, 189, 248, 0.4)' : 'rgba(2, 132, 199, 0.35)'}`,
            color: isDark ? '#38bdf8' : '#0284c7',
            boxShadow: isDark
              ? '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(56, 189, 248, 0.25)'
              : '0 10px 25px rgba(15, 23, 42, 0.12), 0 0 15px rgba(2, 132, 199, 0.15)',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.82rem',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: 'scale(1)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Sparkles size={16} />
          <span>Ambiance FX</span>
          <span
            style={{
              padding: '2px 7px',
              borderRadius: '9999px',
              background: isDark ? 'rgba(56, 189, 248, 0.18)' : '#e0f2fe',
              fontSize: '0.72rem',
              fontWeight: 800
            }}
          >
            {bgMode.toUpperCase()}
          </span>
        </button>
      ) : (
        /* Expanded Floating Control Panel */
        <div
          style={{
            width: '320px',
            borderRadius: '20px',
            background: isDark ? 'rgba(15, 23, 42, 0.94)' : 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(24px)',
            border: `1.5px solid ${isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(2, 132, 199, 0.3)'}`,
            boxShadow: isDark
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(56, 189, 248, 0.2)'
              : '0 20px 45px -10px rgba(15, 23, 42, 0.18), 0 0 20px rgba(2, 132, 199, 0.15)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            animation: 'loginFadeUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: isDark ? 'rgba(56, 189, 248, 0.2)' : '#e0f2fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isDark ? '#38bdf8' : '#0284c7'
                }}
              >
                <Sliders size={15} />
              </div>
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Visual Ambiance
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Theme Switcher (Dark / Light) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '12px',
              background: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Color Theme
            </span>
            <button
              type="button"
              onClick={toggleTheme}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: isDark ? '#38bdf8' : '#0284c7',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {isDark ? <Moon size={13} /> : <Sun size={13} />}
              <span>{isDark ? 'Dark Cyber' : 'Light Glass'}</span>
            </button>
          </div>

          {/* Background FX Mode Selector */}
          <div>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Background FX Style
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {fxModes.map((m) => {
                const isSelected = bgMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setBgMode(m.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      background: isSelected
                        ? (isDark ? 'rgba(56, 189, 248, 0.16)' : '#e0f2fe')
                        : 'transparent',
                      border: isSelected
                        ? `1.5px solid ${isDark ? '#38bdf8' : '#0284c7'}`
                        : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.15rem' }}>{m.icon}</span>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {m.label}
                        </div>
                        <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>
                          {m.desc}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <Check size={16} color={isDark ? '#38bdf8' : '#0284c7'} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Particle Density */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Particle Density
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {['low', 'normal', 'high'].map((density) => (
                <button
                  key={density}
                  type="button"
                  onClick={() => setParticleDensity(density)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.70rem',
                    fontWeight: 700,
                    textTransform: 'capitalize',
                    border: '1px solid var(--border-subtle)',
                    background: particleDensity === density
                      ? (isDark ? '#38bdf8' : '#0284c7')
                      : 'transparent',
                    color: particleDensity === density
                      ? '#ffffff'
                      : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {density}
                </button>
              ))}
            </div>
          </div>

          {/* Test Pulse Shockwave Button */}
          <button
            type="button"
            onClick={triggerTestPulse}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
              transition: 'transform 0.15s ease'
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Zap size={14} />
            <span>Emit Test Shockwave Pulse</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default BackgroundControls;
