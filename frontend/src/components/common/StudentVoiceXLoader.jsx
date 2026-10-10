import React from 'react';

/**
 * StudentVoiceXLoader - Simple, Elegant Centered Circle Rolling Spinner
 * 
 * Features:
 * - 100% Dead-Center Alignment: Vertically and horizontally centered at all times.
 * - Simple Circle Rolling: Pure, lightweight circular spinner ring with smooth rotation.
 * - Clean Background: Zero heavy cards, zero dark overlays, zero cluttered HUD boxes.
 */
export function StudentVoiceXLoader({
  label = 'Loading...',
  sublabel = null,
  size = 46,
  mode = 'card', // 'fullscreen' | 'card' | 'inline' | 'compact'
  minHeight = null,
  isDark = false
}) {
  const spinnerSize = size || 46;
  const strokeWidth = Math.max(3, Math.round(spinnerSize * 0.08));

  // Spinner Circle Element
  const renderCircleSpinner = (customSize = spinnerSize, customStroke = strokeWidth) => (
    <div
      className="svx-circle-roller"
      style={{
        width: `${customSize}px`,
        height: `${customSize}px`,
        borderWidth: `${customStroke}px`,
        borderStyle: 'solid',
        borderColor: isDark ? 'rgba(56, 189, 248, 0.16)' : 'rgba(2, 132, 199, 0.16)',
        borderTopColor: '#0284c7',
        borderRightColor: '#38bdf8',
        borderRadius: '50%',
        flexShrink: 0
      }}
    />
  );

  // 1. Compact / Inline Mode (Buttons, chips, small badges)
  if (mode === 'compact' || mode === 'inline') {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          userSelect: 'none'
        }}
      >
        {renderCircleSpinner(size || 20, 2.5)}
        {label && (
          <span
            style={{
              fontSize: '0.84rem',
              fontWeight: 600,
              color: isDark ? '#cbd5e1' : '#475569'
            }}
          >
            {label}
          </span>
        )}
      </div>
    );
  }

  // 2. Fullscreen Mode (Strictly centered on screen with minimal transparent backdrop)
  if (mode === 'fullscreen') {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: isDark ? 'rgba(15, 23, 42, 0.55)' : 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          zIndex: 99999,
          userSelect: 'none',
          boxSizing: 'border-box',
          padding: '20px'
        }}
      >
        {renderCircleSpinner()}
        {label && (
          <div
            style={{
              marginTop: '16px',
              fontSize: '0.94rem',
              fontWeight: 600,
              color: isDark ? '#f1f5f9' : '#1e293b',
              letterSpacing: '0.01em',
              textAlign: 'center'
            }}
          >
            {label}
          </div>
        )}
        {sublabel && (
          <div
            style={{
              marginTop: '4px',
              fontSize: '0.8rem',
              color: isDark ? '#94a3b8' : '#64748b',
              textAlign: 'center'
            }}
          >
            {sublabel}
          </div>
        )}
      </div>
    );
  }

  // 3. Card / Default In-Page Mode (Centered horizontally & vertically with transparent background)
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: minHeight || '320px',
        margin: 'auto',
        background: 'transparent',
        userSelect: 'none',
        boxSizing: 'border-box',
        padding: '24px'
      }}
    >
      {renderCircleSpinner()}
      {label && (
        <div
          style={{
            marginTop: '14px',
            fontSize: '0.92rem',
            fontWeight: 600,
            color: isDark ? '#e2e8f0' : '#334155',
            letterSpacing: '0.01em',
            textAlign: 'center'
          }}
        >
          {label}
        </div>
      )}
      {sublabel && (
        <div
          style={{
            marginTop: '4px',
            fontSize: '0.78rem',
            color: isDark ? '#94a3b8' : '#64748b',
            textAlign: 'center'
          }}
        >
          {sublabel}
        </div>
      )}
    </div>
  );
}

export default StudentVoiceXLoader;
