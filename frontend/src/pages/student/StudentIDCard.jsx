import React, { useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Download, ShieldCheck, QrCode, CheckCircle2, Building2, User, Award } from 'lucide-react';

export function StudentIDCard() {
  const { user } = useAuth();
  const cardRef = useRef(null);

  const handleDownload = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Digital Student ID Card
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '4px' }}>
            Official cryptographic smart credential issued by ABC Institution.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          style={{
            padding: '10px 18px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
            color: '#ffffff',
            fontSize: '0.86rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
          }}
        >
          <Download size={16} />
          <span>Download ID Card</span>
        </button>
      </div>

      {/* ID Card Display */}
      <div
        ref={cardRef}
        style={{
          width: '100%',
          maxWidth: '520px',
          margin: '0 auto',
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
          border: '2px solid #bae6fd',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: '0 20px 40px -15px rgba(2, 132, 199, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.9) inset',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #e0f2fe', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', color: '#0284c7', textTransform: 'uppercase' }}>
              ABC INSTITUTION
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
              STUDENT ID CARD
            </div>
          </div>

          <div
            style={{
              padding: '4px 10px',
              borderRadius: '20px',
              background: '#d1fae5',
              border: '1px solid #a7f3d0',
              color: '#059669',
              fontSize: '0.72rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ShieldCheck size={13} />
            <span>VERIFIED VOTER</span>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
          {/* Photo Box */}
          <div
            style={{
              width: '110px',
              height: '130px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
              border: '2px solid #ffffff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0284c7',
              flexShrink: 0
            }}
          >
            <User size={48} strokeWidth={1.5} />
            <span style={{ fontSize: '0.62rem', fontWeight: 700, marginTop: '4px' }}>PHOTO</span>
          </div>

          {/* Details */}
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
              {user?.full_name || 'Muralidharan K'}
            </h2>
            <div style={{ fontSize: '0.84rem', color: '#475569', marginBottom: '4px' }}>
              Roll No: <strong style={{ color: '#0f172a' }}>{user?.roll_number || '2024IT001'}</strong>
            </div>
            <div style={{ fontSize: '0.84rem', color: '#475569', marginBottom: '4px' }}>
              {user?.department || 'Information Technology'}
            </div>
            <div style={{ fontSize: '0.84rem', color: '#475569', marginBottom: '10px' }}>
              {user?.year || '3rd Year'}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.82rem',
                fontWeight: 800,
                color: '#0284c7',
                background: '#e0f2fe',
                padding: '4px 10px',
                borderRadius: '8px',
                display: 'inline-block'
              }}
            >
              {user?.student_id || 'ABC-IT-2026-001'}
            </div>
          </div>
        </div>

        {/* Footer with QR Code */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '2px solid #e0f2fe', paddingTop: '16px' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>
              StudentVoiceX Verified Identity
            </div>
            <div style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#94a3b8', marginTop: '2px' }}>
              SHA-256 Hash: {user?.id_card_hash ? user.id_card_hash.substring(0, 20) + '...' : '0x8f4b2c...9e1a'}
            </div>
          </div>

          {/* QR Code Container */}
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              background: '#0284c7',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <QrCode size={30} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentIDCard;
