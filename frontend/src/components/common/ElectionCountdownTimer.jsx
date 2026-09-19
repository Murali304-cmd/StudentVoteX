import React, { useState, useEffect } from 'react';
import { Clock, Radio, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

export function ElectionCountdownTimer({ election, compact = false }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    status: 'ACTIVE', // 'UPCOMING' | 'ACTIVE' | 'CLOSED'
    label: 'Voting in Progress'
  });

  useEffect(() => {
    if (!election) return;

    const calculateTime = () => {
      const now = new Date().getTime();
      const start = election.start_date ? new Date(election.start_date).getTime() : now - 1000;
      const end = election.end_date ? new Date(election.end_date).getTime() : now + 86400000;

      let target = end;
      let currentStatus = election.status || 'ACTIVE';
      let currentLabel = 'Voting in Progress';

      if (currentStatus === 'CLOSED' || currentStatus === 'COMPLETED') {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, status: 'CLOSED', label: 'Polls Closed • Certified' });
        return;
      }

      if (now < start && currentStatus !== 'ACTIVE') {
        target = start;
        currentStatus = 'UPCOMING';
        currentLabel = 'Voting Opens In';
      } else if (now >= end) {
        currentStatus = 'CLOSED';
        currentLabel = 'Polls Closed';
      } else {
        target = end;
        currentStatus = 'ACTIVE';
        currentLabel = 'Voting Closes In';
      }

      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        status: currentStatus,
        label: currentLabel
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [election]);

  const pad = (n) => String(n).padStart(2, '0');

  if (compact) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '20px',
          background:
            timeLeft.status === 'ACTIVE'
              ? 'rgba(16, 185, 129, 0.12)'
              : timeLeft.status === 'UPCOMING'
              ? 'rgba(245, 158, 11, 0.12)'
              : 'rgba(148, 163, 184, 0.12)',
          border:
            timeLeft.status === 'ACTIVE'
              ? '1px solid #10b981'
              : timeLeft.status === 'UPCOMING'
              ? '1px solid #f59e0b'
              : '1px solid #94a3b8',
          fontSize: '0.74rem',
          fontWeight: 800,
          color:
            timeLeft.status === 'ACTIVE'
              ? '#10b981'
              : timeLeft.status === 'UPCOMING'
              ? '#d97706'
              : '#64748b'
        }}
      >
        <Clock size={13} />
        {timeLeft.status === 'CLOSED' ? (
          <span>POLLS CLOSED</span>
        ) : (
          <span>
            {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
            {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        background:
          timeLeft.status === 'ACTIVE'
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 95, 70, 0.15) 100%)'
            : timeLeft.status === 'UPCOMING'
            ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(180, 83, 9, 0.15) 100%)'
            : 'linear-gradient(135deg, rgba(148, 163, 184, 0.1) 0%, rgba(71, 85, 105, 0.15) 100%)',
        border:
          timeLeft.status === 'ACTIVE'
            ? '1.5px solid #10b981'
            : timeLeft.status === 'UPCOMING'
            ? '1.5px solid #f59e0b'
            : '1.5px solid #cbd5e1',
        borderRadius: '16px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background:
              timeLeft.status === 'ACTIVE'
                ? '#10b981'
                : timeLeft.status === 'UPCOMING'
                ? '#f59e0b'
                : '#64748b',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow:
              timeLeft.status === 'ACTIVE'
                ? '0 0 16px rgba(16, 185, 129, 0.4)'
                : '0 0 16px rgba(245, 158, 11, 0.3)'
          }}
        >
          {timeLeft.status === 'ACTIVE' ? (
            <Radio size={22} className="pulse-glow" />
          ) : timeLeft.status === 'UPCOMING' ? (
            <Calendar size={22} />
          ) : (
            <CheckCircle2 size={22} />
          )}
        </div>

        <div>
          <div
            style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color:
                timeLeft.status === 'ACTIVE'
                  ? '#059669'
                  : timeLeft.status === 'UPCOMING'
                  ? '#d97706'
                  : '#64748b'
            }}
          >
            {timeLeft.label}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Daily Hours: <strong>{election?.daily_start_time || '09:00'} - {election?.daily_end_time || '16:00'}</strong> • ABC Institution
          </div>
        </div>
      </div>

      {/* Countdown Digits */}
      {timeLeft.status !== 'CLOSED' ? (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {timeLeft.days > 0 && (
            <div style={{ textAlign: 'center', minWidth: '46px', background: 'rgba(255,255,255,0.85)', padding: '6px 8px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                {timeLeft.days}
              </div>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Days</div>
            </div>
          )}

          <div style={{ textAlign: 'center', minWidth: '46px', background: 'rgba(255,255,255,0.85)', padding: '6px 8px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {pad(timeLeft.hours)}
            </div>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Hours</div>
          </div>

          <span style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--text-muted)' }}>:</span>

          <div style={{ textAlign: 'center', minWidth: '46px', background: 'rgba(255,255,255,0.85)', padding: '6px 8px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {pad(timeLeft.minutes)}
            </div>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mins</div>
          </div>

          <span style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--text-muted)' }}>:</span>

          <div style={{ textAlign: 'center', minWidth: '46px', background: 'rgba(255,255,255,0.85)', padding: '6px 8px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: timeLeft.status === 'ACTIVE' ? '#10b981' : '#f59e0b', fontFamily: 'var(--font-mono)' }}>
              {pad(timeLeft.seconds)}
            </div>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Secs</div>
          </div>
        </div>
      ) : (
        <span className="badge badge-indigo" style={{ padding: '8px 14px', fontSize: '0.84rem', fontWeight: 800 }}>
          ✓ FINAL CERTIFIED RESULTS
        </span>
      )}
    </div>
  );
}

export default ElectionCountdownTimer;
