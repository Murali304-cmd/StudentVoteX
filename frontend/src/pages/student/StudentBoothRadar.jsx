import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import { StudentVoiceXLoader } from '../../components/common/StudentVoiceXLoader';
import {
  MapPin,
  Radio,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Ticket,
  AlertTriangle,
  Building2,
  Cpu,
  Layers,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Sparkles,
  QrCode
} from 'lucide-react';

export function StudentBoothRadar() {
  const { user } = useAuth();
  const { isDark } = useTheme();

  const [loading, setLoading] = useState(true);
  const [radarData, setRadarData] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [virtualPass, setVirtualPass] = useState(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [filterBlock, setFilterBlock] = useState('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const fetchRadar = async () => {
    try {
      const data = await api.student.getCampusRadar(user?.section || 'A');
      setRadarData(data);
      if (data?.stations?.length && !selectedStation) {
        setSelectedStation(data.stations[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRadar();
    const interval = setInterval(fetchRadar, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRadar();
  };

  const handleCheckIn = async (station) => {
    setIsCheckingIn(true);
    try {
      const res = await api.student.checkInBoothQueue({
        booth_id: station.id,
        student_id: user?.student_id || user?.username || 'STU2026001'
      });
      setVirtualPass(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsCheckingIn(false);
    }
  };

  if (loading) {
    return <StudentVoiceXLoader message="Calibrating Campus EVM Radar & Hardware Nodes..." />;
  }

  const stations = radarData?.stations || [];
  const summary = radarData?.campus_summary || {};

  const filteredStations = stations.filter(s => {
    if (filterBlock === 'ALL') return true;
    if (filterBlock === 'ASSIGNED') return s.is_assigned;
    return s.block.toLowerCase().includes(filterBlock.toLowerCase());
  });

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div
        className="glass-card"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(16, 185, 129, 0.10) 100%)',
          border: '1.5px solid rgba(2, 132, 199, 0.28)',
          borderRadius: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Radio size={12} className="animate-pulse" />
              <span>LIVE HARDWARE TELEMETRY</span>
            </span>
            <span className="badge badge-cyan">
              Section {user?.section || 'A'} Priority Lane
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
            Campus EVM Booth Radar & Queue Tracker
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, maxWidth: '680px' }}>
            Real-time optical queue monitoring, BFT hardware node health, and automated virtual queue token reservations across all ABC Institution polling stations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={handleRefresh}
            className="btn btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh Radar</span>
          </button>
        </div>
      </div>

      {/* Campus Telemetry Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.80rem', fontWeight: 700, color: 'var(--text-muted)' }}>Assigned Station</span>
            <Building2 size={18} color="#0284c7" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            {summary.assigned_booth?.code || 'EVM-04'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700, marginTop: '4px' }}>
            {summary.assigned_booth?.room} &middot; {summary.assigned_booth?.distance_meters}m away
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.80rem', fontWeight: 700, color: 'var(--text-muted)' }}>Average Campus Wait</span>
            <Clock size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            {summary.average_wait_minutes || 2.8} mins
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>
            Fastest: {summary.fastest_booth || 'EVM-02 (1m)'}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.80rem', fontWeight: 700, color: 'var(--text-muted)' }}>Active Hardware Terminals</span>
            <Cpu size={18} color="#818cf8" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            {summary.total_active_kiosks || 12} EVMs
          </div>
          <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700, marginTop: '4px' }}>
            100% Sealed &amp; Consensus Synced
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.80rem', fontWeight: 700, color: 'var(--text-muted)' }}>Your Virtual Status</span>
            <Ticket size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: virtualPass ? '#10b981' : 'var(--text-primary)' }}>
            {virtualPass ? virtualPass.virtual_token : 'Not Checked In'}
          </div>
          <div style={{ fontSize: '0.78rem', color: virtualPass ? '#10b981' : 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>
            {virtualPass ? `Position #${virtualPass.queue_position} in line` : 'Select booth below to reserve'}
          </div>
        </div>
      </div>

      {/* Main Radar View & Detailed Station Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        
        {/* Left Column: Campus Polling Map & Station Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)' }}>FILTER:</span>
            {[
              { id: 'ALL', label: 'All 6 Booths' },
              { id: 'ASSIGNED', label: `⭐ Section ${user?.section || 'A'} Priority` },
              { id: 'Block C', label: 'Block C' },
              { id: 'Turing', label: 'CS & IT' },
              { id: 'Library', label: 'Library' }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterBlock(f.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: filterBlock === f.id ? '1.5px solid #0284c7' : '1px solid var(--border-subtle)',
                  background: filterBlock === f.id ? 'var(--cyan-light)' : 'var(--bg-surface-translucent)',
                  color: filterBlock === f.id ? '#0284c7' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* List of Polling Stations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredStations.map(station => {
              const isSelected = selectedStation?.id === station.id;
              const crowdBadgeClass =
                station.crowd_level === 'LOW' ? 'badge-emerald' :
                station.crowd_level === 'MODERATE' ? 'badge-cyan' : 'badge-amber';

              return (
                <div
                  key={station.id}
                  onClick={() => setSelectedStation(station)}
                  className="glass-card"
                  style={{
                    padding: '16px 20px',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    border: isSelected
                      ? '2px solid #0284c7'
                      : station.is_assigned
                        ? '1.5px solid rgba(16, 185, 129, 0.4)'
                        : '1px solid var(--border-subtle)',
                    background: isSelected
                      ? (isDark ? 'rgba(2, 132, 199, 0.14)' : '#f0f9ff')
                      : 'var(--bg-surface-translucent)',
                    boxShadow: isSelected ? '0 8px 24px -4px rgba(2, 132, 199, 0.25)' : 'var(--shadow-sm)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        background: station.is_assigned
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          : 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
                        color: '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '0.78rem',
                        flexShrink: 0,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                      }}
                    >
                      <span>{station.code}</span>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {station.name}
                        </span>
                        {station.is_assigned && (
                          <span className="badge badge-emerald" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                            Assigned to You
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {station.block} &middot; {station.room}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Navigation size={11} color="#0284c7" />
                          <span>{station.distance_meters}m ({station.walking_time_mins} min walk)</span>
                        </span>
                        <span>&bull;</span>
                        <span>{station.terminals_active} Active Terminals</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span className={`badge ${crowdBadgeClass}`} style={{ marginBottom: '4px' }}>
                      {station.wait_minutes} min wait
                    </span>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {station.queue_count} in queue
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Station Detailed Inspector & Virtual Check-In */}
        {selectedStation && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Inspector Card */}
            <div
              className="glass-card"
              style={{
                padding: '26px',
                borderRadius: '20px',
                border: '1.5px solid var(--border-medium)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span className="badge badge-indigo">
                      {selectedStation.code}
                    </span>
                    {selectedStation.is_assigned && (
                      <span className="badge badge-emerald">
                        YOUR OFFICIAL BOOTH
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    {selectedStation.name}
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {selectedStation.block} &middot; {selectedStation.room}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10b981' }}>
                    {selectedStation.wait_minutes} mins
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                    ESTIMATED WAIT TIME
                  </div>
                </div>
              </div>

              {/* Hardware Integrity Bar */}
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: '14px',
                  background: 'var(--bg-surface-secondary)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', fontWeight: 700 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Hardware Tamper Seal:</span>
                  <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={13} /> {selectedStation.tamper_seal}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', fontWeight: 700 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>BFT Consensus Link:</span>
                  <span style={{ color: '#0284c7', fontFamily: 'monospace' }}>
                    {selectedStation.bft_node}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', fontWeight: 700 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Presiding Officer:</span>
                  <span style={{ color: 'var(--text-primary)' }}>
                    {selectedStation.presiding_officer}
                  </span>
                </div>
              </div>

              {/* Walking Route Mini Guide */}
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.06) 0%, rgba(99, 102, 241, 0.06) 100%)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.80rem'
                }}
              >
                <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Navigation size={14} color="#0284c7" />
                  <span>Campus Walking Navigation</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  From Dept of IT: Walk through Block C North Corridor, take Staircase B to Floor 2, Hall 204 is on the East Wing immediately opposite Lab 206.
                </div>
              </div>

              {/* Virtual Queue Check-In CTA */}
              {!virtualPass ? (
                <button
                  type="button"
                  onClick={() => handleCheckIn(selectedStation)}
                  disabled={isCheckingIn}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '0.92rem',
                    borderRadius: '14px',
                    boxShadow: '0 4px 16px rgba(2, 132, 199, 0.35)'
                  }}
                >
                  <Ticket size={18} />
                  <span>{isCheckingIn ? 'Reserving Spot...' : `Reserve Virtual Queue Spot at ${selectedStation.code}`}</span>
                </button>
              ) : (
                /* Issued Virtual Pass Card */
                <div
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(2, 132, 199, 0.10) 100%)',
                    border: '1.5px solid rgba(16, 185, 129, 0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-emerald">
                      VIRTUAL QUEUE PASS CONFIRMED
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      {virtualPass.cryptographic_nonce}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10b981' }}>
                        {virtualPass.virtual_token}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        Queue Position #{virtualPass.queue_position} &middot; Estimated {virtualPass.estimated_call_in_minutes} mins
                      </div>
                    </div>

                    <div style={{ background: '#ffffff', padding: '6px', borderRadius: '8px' }}>
                      <QrCode size={48} color="#0f172a" />
                    </div>
                  </div>

                  <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                    {virtualPass.instructions}
                  </p>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

    </div>
  );
}

export default StudentBoothRadar;
