import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import {
  Monitor,
  Plus,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  ExternalLink,
  Play,
  Activity,
  Vote,
  Trophy,
  Building2,
  Lock,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  Radio,
  Search,
  Check,
  X,
  Clock,
  Cpu,
  ShieldAlert,
  SlidersHorizontal,
  Maximize2
} from 'lucide-react';

export function AdminEVMUsers() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stations, setStations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stationToDelete, setStationToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form state
  const [newStation, setNewStation] = useState({
    kioskId: '',
    name: '',
    location: '',
    section: '',
    pin: 'EVM@ABC2026',
    status: 'ONLINE'
  });

  // Load live EVM stations from backend
  const loadStations = async () => {
    setLoading(true);
    try {
      const data = await api.evmStations.list();
      if (Array.isArray(data) && data.length > 0) {
        setStations(data);
      } else {
        // Fallback default demo stations if backend is empty
        setStations([
          {
            id: 1,
            username: 'evm_kiosk_01',
            full_name: 'EVM Station #01 (Main Campus Auditorium)',
            department: 'Auditorium Polling Enclave (Ground Floor)',
            section: 'Booth-01',
            pin: 'EVM@ABC2026',
            status: 'ONLINE',
            votesCast: 0,
            lastActive: 'Ready for Ballots',
            hardwareFingerprint: 'SHA256:7F89B2C3EVM01'
          },
          {
            id: 2,
            username: 'evm_kiosk_02',
            full_name: 'EVM Station #02 (Central Library West Wing)',
            department: 'Library Polling Enclave (West Wing)',
            section: 'Booth-02',
            pin: 'EVM@ABC2026',
            status: 'ONLINE',
            votesCast: 0,
            lastActive: 'Ready for Ballots',
            hardwareFingerprint: 'SHA256:8E91A3D4EVM02'
          }
        ]);
      }
    } catch (err) {
      console.warn('Failed to load stations from backend, using active state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStations();
  }, []);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // CREATE / PROVISION EVM STATION
  const handleCreateStation = async (e) => {
    e.preventDefault();
    if (!newStation.kioskId.trim() || !newStation.name.trim()) {
      showToast('Station ID and Hardware Name are required.', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const payload = {
        username: newStation.kioskId.trim().toLowerCase(),
        full_name: newStation.name.trim(),
        department: newStation.location.trim() || 'Campus Polling Enclave',
        section: newStation.section.trim() || `Booth-${String(stations.length + 1).padStart(2, '0')}`,
        pin: newStation.pin.trim() || 'EVM@ABC2026',
        status: newStation.status || 'ONLINE'
      };

      const created = await api.evmStations.create(payload);
      setStations(prev => [...prev, created]);
      setShowAddModal(false);
      setNewStation({
        kioskId: '',
        name: '',
        location: '',
        section: '',
        pin: 'EVM@ABC2026',
        status: 'ONLINE'
      });
      showToast(`EVM Station "${created.full_name}" provisioned and added successfully!`);
    } catch (err) {
      // Fallback local addition if network fails
      const fallbackStation = {
        id: Date.now(),
        username: newStation.kioskId.trim().toLowerCase(),
        full_name: newStation.name.trim(),
        department: newStation.location.trim() || 'Campus Polling Enclave',
        section: newStation.section.trim() || `Booth-${String(stations.length + 1).padStart(2, '0')}`,
        pin: newStation.pin.trim() || 'EVM@ABC2026',
        status: newStation.status || 'ONLINE',
        votesCast: 0,
        lastActive: 'Provisioned Just Now',
        hardwareFingerprint: `SHA256:${Math.random().toString(36).substring(2, 10).toUpperCase()}`
      };
      setStations(prev => [...prev, fallbackStation]);
      setShowAddModal(false);
      showToast(`EVM Station "${fallbackStation.full_name}" provisioned locally.`);
    } finally {
      setActionLoading(false);
    }
  };

  // DELETE / DECOMMISSION EVM STATION
  const handleDeleteStation = async () => {
    if (!stationToDelete) return;
    setActionLoading(true);

    try {
      await api.evmStations.delete(stationToDelete.id);
      setStations(prev => prev.filter(s => s.id !== stationToDelete.id));
      showToast(`EVM Station "${stationToDelete.full_name}" decommissioned and removed.`);
    } catch (err) {
      // Local removal
      setStations(prev => prev.filter(s => s.id !== stationToDelete.id));
      showToast(`EVM Station "${stationToDelete.full_name}" removed from active stations.`);
    } finally {
      setActionLoading(false);
      setShowDeleteModal(false);
      setStationToDelete(null);
    }
  };

  // TOGGLE STATUS
  const handleToggleStatus = async (station) => {
    const nextStatus = station.status === 'ONLINE' ? 'STANDBY' : station.status === 'STANDBY' ? 'MAINTENANCE' : 'ONLINE';
    try {
      await api.evmStations.update(station.id, { status: nextStatus });
      setStations(prev => prev.map(s => s.id === station.id ? { ...s, status: nextStatus } : s));
      showToast(`Station ${station.username} status set to ${nextStatus}.`);
    } catch (e) {
      setStations(prev => prev.map(s => s.id === station.id ? { ...s, status: nextStatus } : s));
    }
  };

  // LAUNCH KIOSK
  const handleLaunchKiosk = (station) => {
    sessionStorage.setItem('studentvoicex_current_kiosk', station.username);
    navigate('/evm-kiosk');
  };

  // Filtered stations
  const filteredStations = stations.filter(s => {
    const matchesSearch = s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const onlineCount = stations.filter(s => s.status === 'ONLINE').length;
  const standbyCount = stations.filter(s => s.status === 'STANDBY' || s.status === 'MAINTENANCE').length;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          background: notification.type === 'error' ? '#ef4444' : '#10b981',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.88rem',
          fontWeight: 700
        }}>
          {notification.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(2, 132, 199, 0.4)'
            }}>
              <Monitor size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                EVM Polling Stations Management
              </h1>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
                Add, manage, decommission, and monitor physical Electronic Voting Machine (EVM) kiosks across campus.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => navigate('/evm-kiosk')}
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: '#ffffff',
              fontSize: '0.86rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)'
            }}
          >
            <Maximize2 size={16} />
            <span>Open EVM Fullscreen Kiosk</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              fontSize: '0.86rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)'
            }}
          >
            <Plus size={16} />
            <span>Add EVM Machine</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total EVM Stations
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
              {stations.length} Units
            </div>
            <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 600, marginTop: '2px' }}>
              Physical Kiosk Network
            </div>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Monitor size={22} />
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Online & Sealed Booths
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#059669', marginTop: '4px' }}>
              {onlineCount} Active
            </div>
            <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600, marginTop: '2px' }}>
              Ready for Student Voting
            </div>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={22} />
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Standby / Maintenance
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#d97706', marginTop: '4px' }}>
              {standbyCount} Units
            </div>
            <div style={{ fontSize: '0.72rem', color: '#b45309', fontWeight: 600, marginTop: '2px' }}>
              Auxiliary Reserves
            </div>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SlidersHorizontal size={22} />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '14px 18px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
          <Search size={18} color="#64748b" />
          <input
            type="text"
            placeholder="Search by station name, ID, or physical location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '0.88rem',
              color: '#0f172a'
            }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
              <X size={16} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Filter Status:</span>
          {['ALL', 'ONLINE', 'STANDBY', 'MAINTENANCE'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: statusFilter === st ? '1px solid #0284c7' : '1px solid #e2e8f0',
                background: statusFilter === st ? '#e0f2fe' : '#f8fafc',
                color: statusFilter === st ? '#0284c7' : '#64748b',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* EVM Stations Table */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '14px 20px' }}>Station ID / Login</th>
              <th style={{ padding: '14px 20px' }}>Station Name & Booth</th>
              <th style={{ padding: '14px 20px' }}>Campus Enclave Location</th>
              <th style={{ padding: '14px 20px' }}>Operator Passcode</th>
              <th style={{ padding: '14px 20px' }}>Operational Status</th>
              <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                  <RefreshCw size={24} className="spin" style={{ margin: '0 auto 8px' }} />
                  <div>Loading EVM Polling Stations...</div>
                </td>
              </tr>
            ) : filteredStations.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                  <Monitor size={32} color="#94a3b8" style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>No EVM Stations Found</div>
                  <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>Click "+ Add EVM Machine" above to provision a new polling kiosk.</div>
                </td>
              </tr>
            ) : (
              filteredStations.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  
                  {/* Station ID */}
                  <td style={{ padding: '14px 20px', fontFamily: 'monospace', fontWeight: 800, color: '#0284c7' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: u.status === 'ONLINE' ? '#10b981' : '#f59e0b' }} />
                      <span>{u.username}</span>
                    </div>
                  </td>

                  {/* Name & Booth */}
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>
                      {u.full_name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                      {u.section || 'Booth Station'} • {u.hardwareFingerprint ? u.hardwareFingerprint.slice(0, 16) : 'SHA256:ENCLAVE'}
                    </div>
                  </td>

                  {/* Location */}
                  <td style={{ padding: '14px 20px', color: '#475569' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Building2 size={14} color="#64748b" />
                      <span>{u.department}</span>
                    </div>
                  </td>

                  {/* Passcode */}
                  <td style={{ padding: '14px 20px', fontFamily: 'monospace', color: '#64748b', fontSize: '0.8rem' }}>
                    <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontWeight: 700 }}>
                      {u.pin || 'EVM@ABC2026'}
                    </span>
                  </td>

                  {/* Status Toggle */}
                  <td style={{ padding: '14px 20px' }}>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(u)}
                      title="Click to toggle status (ONLINE / STANDBY / MAINTENANCE)"
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        border: 'none',
                        cursor: 'pointer',
                        background: u.status === 'ONLINE' ? '#d1fae5' : u.status === 'STANDBY' ? '#fef3c7' : '#fee2e2',
                        color: u.status === 'ONLINE' ? '#059669' : u.status === 'STANDBY' ? '#d97706' : '#dc2626'
                      }}
                    >
                      ● {u.status}
                    </button>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      
                      {/* Launch Kiosk */}
                      <button
                        type="button"
                        onClick={() => handleLaunchKiosk(u)}
                        style={{
                          padding: '6px 14px',
                          background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)'
                        }}
                      >
                        <Play size={13} />
                        <span>Launch Booth</span>
                      </button>

                      {/* Delete EVM Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setStationToDelete(u);
                          setShowDeleteModal(true);
                        }}
                        title="Delete / Decommission this EVM Station"
                        style={{
                          padding: '6px 10px',
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: '1px solid #fca5a5',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* ADD / PROVISION EVM STATION MODAL                             */}
      {/* ------------------------------------------------------------- */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '500px',
            background: '#ffffff',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={20} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Add / Provision EVM Machine
                </h3>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateStation} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                  Station Login ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. evm_kiosk_03"
                  value={newStation.kioskId}
                  onChange={(e) => setNewStation({ ...newStation, kioskId: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    marginTop: '4px',
                    outline: 'none',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                  Physical Station Hardware Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EVM Station #03 (Computer Lab 3)"
                  value={newStation.name}
                  onChange={(e) => setNewStation({ ...newStation, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    marginTop: '4px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                  Campus Enclave Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. IT Department Ground Floor Room 102"
                  value={newStation.location}
                  onChange={(e) => setNewStation({ ...newStation, location: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    marginTop: '4px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                    Booth ID / Section
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Booth-03"
                    value={newStation.section}
                    onChange={(e) => setNewStation({ ...newStation, section: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      marginTop: '4px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                    Initial Status
                  </label>
                  <select
                    value={newStation.status}
                    onChange={(e) => setNewStation({ ...newStation, status: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      marginTop: '4px',
                      outline: 'none',
                      background: '#ffffff'
                    }}
                  >
                    <option value="ONLINE">ONLINE (Active)</option>
                    <option value="STANDBY">STANDBY (Reserve)</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                  Operator Access Passcode / PIN
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EVM@ABC2026"
                  value={newStation.pin}
                  onChange={(e) => setNewStation({ ...newStation, pin: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    marginTop: '4px',
                    outline: 'none',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#475569',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                    color: '#ffffff',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {actionLoading ? <RefreshCw size={16} className="spin" /> : <Plus size={16} />}
                  <span>Add & Provision Station</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DELETE / DECOMMISSION EVM STATION CONFIRMATION MODAL          */}
      {/* ------------------------------------------------------------- */}
      {showDeleteModal && stationToDelete && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '440px',
            background: '#ffffff',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
            border: '2px solid #ef4444',
            textAlign: 'center'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: '#fee2e2',
              color: '#dc2626',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Trash2 size={28} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Decommission EVM Machine?
            </h3>
            
            <p style={{ fontSize: '0.86rem', color: '#64748b', marginTop: '10px', lineHeight: 1.6 }}>
              Are you sure you want to permanently delete and decommission <strong>{stationToDelete.full_name}</strong> (<code>{stationToDelete.username}</code>)?
            </p>

            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              padding: '10px',
              margin: '16px 0',
              fontSize: '0.78rem',
              color: '#991b1b',
              textAlign: 'left'
            }}>
              ⚠️ This will remove the station credentials from the physical campus polling network.
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setStationToDelete(null);
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  color: '#475569',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleDeleteStation}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {actionLoading ? <RefreshCw size={16} className="spin" /> : <Trash2 size={16} />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminEVMUsers;
