import React from 'react';
import { StudentVoiceXLogo } from '../StudentVoiceXLogo';

/**
 * StudentVoiceXLoader - Ultra-Premium Futuristic Zoom In & Out Brand Loader
 * Features:
 * - Dynamic breathing Zoom In & Out animation on the official StudentVoiceX monogram
 * - Luminous cybernetic pulse wave rings radiating behind the logo
 * - Shimmer gradient loading typography with dynamic status updates
 * - Supports modes: 'fullscreen', 'card', 'inline', and 'compact'
 */
export function StudentVoiceXLoader({
  label = 'Loading StudentVoiceX...',
  sublabel = 'Syncing BFT Consensus & Cryptographic Integrity...',
  size = 64,
  mode = 'card', // 'fullscreen' | 'card' | 'inline' | 'compact'
  isDark = false,
  showTagline = true
}) {
  if (mode === 'compact') {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '6px 12px',
          userSelect: 'none'
        }}
      >
        <div className="svx-zoom-in-out" style={{ display: 'inline-flex' }}>
          <StudentVoiceXLogo size={size || 28} showText={false} isDark={isDark} />
        </div>
        {label && (
          <span
            className="svx-shimmer-text"
            style={{ fontSize: '0.82rem', letterSpacing: '0.02em' }}
          >
            {label}
          </span>
        )}
      </div>
    );
  }

  if (mode === 'fullscreen') {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: isDark
            ? 'linear-gradient(135deg, #070b14 0%, #0b1120 50%, #0f172a 100%)'
            : 'linear-gradient(135deg, rgba(248, 250, 252, 0.96) 0%, rgba(241, 245, 249, 0.94) 50%, rgba(224, 231, 255, 0.92) 100%)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '24px',
          userSelect: 'none'
        }}
      >
        {/* Luminous Center Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, rgba(168, 85, 247, 0.12) 50%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* Outer Pulsing Wave Ring */}
        <div
          className="svx-pulse-ring"
          style={{
            position: 'absolute',
            width: `${size * 2.2}px`,
            height: `${size * 2.2}px`,
            borderRadius: '50%',
            border: '2px solid rgba(56, 189, 248, 0.4)',
            pointerEvents: 'none'
          }}
        />

        {/* Second Delayed Wave Ring */}
        <div
          className="svx-pulse-ring"
          style={{
            position: 'absolute',
            width: `${size * 2.8}px`,
            height: `${size * 2.8}px`,
            borderRadius: '50%',
            border: '1.5px solid rgba(168, 85, 247, 0.35)',
            animationDelay: '0.8s',
            pointerEvents: 'none'
          }}
        />

        {/* Main Brand Logo with Zoom In and Out Animation */}
        <div
          className="svx-zoom-in-out"
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px'
          }}
        >
          <StudentVoiceXLogo
            size={size || 80}
            showText={false}
            isDark={isDark}
          />
        </div>

        {/* Shimmer Typography */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div
            style={{
              fontSize: '1.25rem',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              color: isDark ? '#ffffff' : '#0f172a',
              marginBottom: '4px'
            }}
          >
            <span>StudentVoice</span>
            <span
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 40%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 900,
                marginLeft: '1px'
              }}
            >
              X
            </span>
          </div>

          <div
            className="svx-shimmer-text"
            style={{
              fontSize: '0.88rem',
              letterSpacing: '0.04em',
              marginBottom: '4px'
            }}
          >
            {label}
          </div>

          {sublabel && (
            <div style={{ fontSize: '0.74rem', color: isDark ? '#94a3b8' : '#64748b' }}>
              {sublabel}
            </div>
          )}

          {showTagline && (
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#0284c7',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginTop: '12px'
              }}
            >
              "Your Voice Builds Tomorrow." • ABC Institution
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default: Card / In-page Container Mode
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 20px',
        position: 'relative',
        userSelect: 'none',
        width: '100%'
      }}
    >
      {/* Background Pulsing Halo */}
      <div
        style={{
          position: 'absolute',
          width: `${size * 1.8}px`,
          height: `${size * 1.8}px`,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, rgba(168, 85, 247, 0.08) 60%, transparent 80%)',
          pointerEvents: 'none'
        }}
      />

      {/* Outer Pulse Ring */}
      <div
        className="svx-pulse-ring"
        style={{
          position: 'absolute',
          width: `${size * 1.6}px`,
          height: `${size * 1.6}px`,
          borderRadius: '50%',
          border: '1.5px solid rgba(56, 189, 248, 0.3)',
          pointerEvents: 'none'
        }}
      />

      {/* Zoom In and Out Animated Brand Monogram */}
      <div
        className="svx-zoom-in-out"
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '14px'
        }}
      >
        <StudentVoiceXLogo
          size={size || 56}
          showText={false}
          isDark={isDark}
        />
      </div>

      {/* Shimmer Label */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div
          className="svx-shimmer-text"
          style={{
            fontSize: '0.86rem',
            letterSpacing: '0.03em'
          }}
        >
          {label}
        </div>
        {sublabel && (
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentVoiceXLoader;
