import React from 'react';

/**
 * StudentVoiceX Official Vector Brand Logo Component
 * Renders the custom V & X dynamic checkmark monogram with graduation cap,
 * campus dome silhouette, sparkles, and modern typography.
 *
 * @param {Object} props
 * @param {number} props.size - Dimension of the logo (default: 36)
 * @param {boolean} props.showText - Whether to render "StudentVoiceX" text alongside (default: true)
 * @param {boolean} props.showTagline - Whether to render "YOUR VOICE SHAPES TOMORROW" (default: false)
 * @param {boolean} props.isDark - Dark background mode optimization (default: false)
 * @param {string} props.className - Custom CSS class
 */
export function StudentVoiceXLogo({
  size = 38,
  showText = true,
  showTagline = false,
  taglineText = "Your Voice Builds Tomorrow.",
  institutionLabel = null,
  isDark = false,
  className = ''
}) {
  const gradientId = React.useId();

  return (
    <div
      className={`studentvoicex-brand-logo ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: showText ? '12px' : '0px',
        userSelect: 'none',
        textDecoration: 'none'
      }}
    >
      {/* Dynamic Vector Monogram (V-Checkmark + Cap + X + Dome) */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, filter: 'drop-shadow(0 2px 8px rgba(14, 165, 233, 0.25))' }}
      >
        <defs>
          {/* Main Primary Cyan to Electric Purple Gradient */}
          <linearGradient id={`${gradientId}-primary`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="35%" stopColor="#0284c7" />
            <stop offset="70%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>

          {/* Accent Pink/Magenta Gradient for X leg */}
          <linearGradient id={`${gradientId}-accent`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>

          {/* Glow filter */}
          <linearGradient id={`${gradientId}-star`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>

        {/* 1. Monogram 'X' Right Arm (Diagonal down-right) */}
        <path
          d="M62 44 L88 88 L104 88 L78 44 Z"
          fill={`url(#${gradientId}-accent)`}
        />

        {/* 2. Monogram 'X' Top-Right to Center-Left Accent */}
        <path
          d="M84 28 L64 56 L72 62 L94 30 Z"
          fill={`url(#${gradientId}-accent)`}
          opacity="0.9"
        />

        {/* 3. Main Checkmark 'V' Swoop (Left down, swooping up dynamically) */}
        <path
          d="M20 32 L34 32 C37 42 42 56 46 68 C50 56 64 38 88 18 L94 24 C68 46 52 70 47 90 C42 74 30 52 20 32 Z"
          fill={`url(#${gradientId}-primary)`}
        />

        {/* 4. Student Silhouette & Graduation Cap at the Vertex */}
        <circle cx="44" cy="38" r="9" fill={`url(#${gradientId}-primary)`} />
        <polygon points="44,20 62,26 44,32 26,26" fill={`url(#${gradientId}-primary)`} />
        <path d="M34 29 C34 33 54 33 54 29 Z" fill="#ffffff" opacity="0.8" />
        <path d="M30 27 L28 35 L26 35 L28 27 Z" fill="#38bdf8" />

        {/* 5. Campus Dome & Column Building Silhouette at Base */}
        <g fill={isDark ? '#e2e8f0' : '#1e293b'} opacity="0.95">
          <path d="M58 84 A 6 6 0 0 1 70 84 Z" />
          <rect x="63.5" y="75" width="1" height="9" />
          <polygon points="64.5,75 69,77 64.5,79" fill="#0284c7" />
          <polygon points="54,84 74,84 64,80" />
          <rect x="56" y="85" width="16" height="2" />
          <rect x="57" y="87" width="2" height="7" />
          <rect x="61" y="87" width="2" height="7" />
          <rect x="65" y="87" width="2" height="7" />
          <rect x="69" y="87" width="2" height="7" />
          <rect x="53" y="94" width="22" height="2" rx="1" />
        </g>

        {/* 6. Sparkle / Stars Rising in Top-Right Arc */}
        <path
          d="M98 8 L100 13 L105 15 L100 17 L98 22 L96 17 L91 15 L96 13 Z"
          fill={`url(#${gradientId}-star)`}
        />
        <path
          d="M86 16 L87 19 L90 20 L87 21 L86 24 L85 21 L82 20 L85 19 Z"
          fill={`url(#${gradientId}-star)`}
          transform="scale(0.85) translate(14, 0)"
        />
        <circle cx="80" cy="28" r="1.5" fill="#38bdf8" />
        <circle cx="106" cy="26" r="1.2" fill="#c084fc" />
      </svg>

      {/* Typography Lockup */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          {institutionLabel && (
            <div style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: '#38bdf8',
              textTransform: 'uppercase',
              marginBottom: '3px'
            }}>
              {institutionLabel}
            </div>
          )}

          <div style={{
            fontSize: `${Math.max(size * 0.46, 16)}px`,
            fontWeight: 900,
            letterSpacing: '-0.03em',
            color: isDark ? '#ffffff' : '#0f172a',
            fontFamily: 'var(--font-heading, "Outfit", "Inter", sans-serif)',
            display: 'flex',
            alignItems: 'baseline'
          }}>
            <span>StudentVoice</span>
            <span style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 40%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 900,
              marginLeft: '1px'
            }}>
              X
            </span>
          </div>

          {showTagline && (
            <div style={{
              marginTop: '4px',
              fontSize: `${Math.max(size * 0.16, 9)}px`,
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: isDark ? '#94a3b8' : '#64748b'
            }}>
              {taglineText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StudentVoiceXLogo;
