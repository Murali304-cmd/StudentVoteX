import React from 'react';
import { Lock, ShieldCheck, Check } from 'lucide-react';

/**
 * SecurityStatus - Light-Themed Institutional Security & Privacy Guarantee Footer
 * Transitions seamlessly between active cryptographic protection and session connection.
 */
export function SecurityStatus({ isVerified = false, detectedRole = null }) {
  return (
    <div
      style={{
        marginTop: '22px',
        paddingTop: '16px',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.76rem',
        color: isVerified ? '#059669' : '#64748b',
        transition: 'all 0.3s ease'
      }}
    >
      {isVerified ? (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 700,
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#d1fae5',
              border: '1.5px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669',
              boxShadow: '0 0 8px rgba(16, 185, 129, 0.3)'
            }}
          >
            <Check size={12} strokeWidth={3} />
          </div>
          <span>Identity Confirmed • Connecting to {detectedRole || 'Campus'} Session...</span>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            color: '#64748b',
            fontSize: '0.73rem',
            fontWeight: 600
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#0284c7' }}>
            <Lock size={12} />
            <span>256-Bit Institutional TLS</span>
          </div>
          <span style={{ color: '#cbd5e1' }}>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#475569' }}>
            <ShieldCheck size={12} color="#059669" />
            <span>Zero-Knowledge Privacy</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default SecurityStatus;
