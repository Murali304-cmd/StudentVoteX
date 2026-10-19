import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  ShieldCheck,
  ShieldAlert,
  Wifi,
  Cpu,
  Lock,
  Unlock,
  AlertTriangle,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Radio,
  Sliders,
  Server,
  Activity,
  Search,
  Filter,
  Clock,
  Laptop,
  Monitor,
  Terminal,
  Save,
  Check,
  Smartphone,
  Tablet,
  Zap,
  UserCheck,
  Play,
  CheckCircle,
  Flame,
  Shield,
  WifiOff
} from 'lucide-react';

export function AdminAccessControl() {
  const [telemetry, setTelemetry] = useState(null);
  const [devices, setDevices] = useState([]);
  const [policy, setPolicy] = useState({
    ssid_name: 'COLLEGE_WIFI',
    allowed_cidrs: '10.0.0.0/8, 172.16.0.0/12, 192.168.1.0/24, 127.0.0.1/32, ::1/128',
    enforcement_mode: 'DEVELOPMENT',
    is_active: true,
    election_access_required: true,
    voting_start_time: '09:00',
    voting_end_time: '16:30'
  });
  const [loading, setLoading] = useState(true);
  const [savingPolicy, setSavingPolicy] = useState(false);
  const [policySuccess, setPolicySuccess] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Real-time Policy & Hardware Access Simulator State
  const [activeScenario, setActiveScenario] = useState('EVM_LAN');
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  // New device form state
  const [newDevice, setNewDevice] = useState({
    device_name: '',
    device_id: '',
    department: 'CSE',
    location: 'Main Campus Lab',
    role_target: 'EVM',
    status: 'TRUSTED'
  });

  const loadGatewayData = async () => {
    setLoading(true);
    try {
      const [telemetryRes, devicesRes, policyRes] = await Promise.all([
        api.gateway.getTelemetry().catch(() => null),
        api.gateway.listDevices().catch(() => []),
        api.gateway.getPolicy().catch(() => null)
      ]);

      if (telemetryRes) setTelemetry(telemetryRes);
      if (devicesRes) setDevices(devicesRes);
      if (policyRes) setPolicy(policyRes);
    } catch (e) {
      console.error('Failed loading gateway control data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGatewayData();
  }, []);

  const handleDeviceAction = async (deviceId, action) => {
    try {
      await api.gateway.deviceAction(deviceId, action);
      loadGatewayData();
    } catch (e) {
      alert(`Action failed: ${e.message}`);
    }
  };

  const handleRegisterDevice = async (e) => {
    e.preventDefault();
    try {
      await api.gateway.registerDevice(newDevice);
      setIsModalOpen(false);
      setNewDevice({
        device_name: '',
        device_id: '',
        department: 'CSE',
        location: 'Main Campus Lab',
        role_target: 'EVM',
        status: 'TRUSTED'
      });
      loadGatewayData();
    } catch (err) {
      alert(`Registration failed: ${err.message}`);
    }
  };

  const handleSavePolicy = async (e) => {
    e.preventDefault();
    setSavingPolicy(true);
    try {
      const updated = await api.gateway.updatePolicy(policy);
      setPolicy(updated);
      setPolicySuccess(true);
      setTimeout(() => setPolicySuccess(false), 3000);
      loadGatewayData();
    } catch (err) {
      alert(`Policy update failed: ${err.message}`);
    } finally {
      setSavingPolicy(false);
    }
  };

  const runScenarioSimulation = async (scenarioKey) => {
    setActiveScenario(scenarioKey);
    setSimulating(true);
    try {
      let payload = {};
      if (scenarioKey === 'EVM_LAN') {
        payload = {
          role_target: 'EVM',
          simulate_scenario: 'EVM_LAN',
          connection_type: 'WIRED_LAN',
          is_lan: true,
          device_id: 'DEV-EVM01-8F29A1',
          device_name: 'EVM-01 (CSE Lab 301)'
        };
      } else if (scenarioKey === 'WIFI_MOBILE') {
        payload = {
          role_target: 'BALLOT',
          simulate_scenario: 'WIFI_MOBILE',
          connection_type: 'WIFI',
          is_wifi: true,
          device_type: 'MOBILE',
          student_id: 'STU2026001',
          action: 'CAST_BALLOT'
        };
      } else if (scenarioKey === 'WIFI_LAPTOP') {
        payload = {
          role_target: 'BALLOT',
          simulate_scenario: 'WIFI_LAPTOP',
          connection_type: 'WIFI',
          is_wifi: true,
          device_type: 'LAPTOP_WIFI',
          student_id: 'STU2026001',
          action: 'CAST_BALLOT'
        };
      } else if (scenarioKey === 'AFTER_COLLEGE_HOURS') {
        payload = {
          role_target: 'STUDENT',
          simulate_scenario: 'AFTER_COLLEGE_HOURS',
          student_id: 'STU2026001'
        };
      } else if (scenarioKey === 'EXTERNAL_NETWORK') {
        payload = {
          role_target: 'STUDENT',
          simulate_scenario: 'EXTERNAL_NETWORK',
          connection_type: 'EXTERNAL_WAN',
          student_id: 'STU2026001'
        };
      }
      const res = await api.gateway.checkAccess(payload);
      setSimulationResult({
        key: scenarioKey,
        status: res.status || (res.access_granted ? 'GRANTED' : 'BLOCKED'),
        granted: Boolean(res.access_granted),
        message: res.message || (res.access_granted ? 'Access Granted' : 'Access Restricted by Institutional Policy'),
        payload: res
      });
      loadGatewayData();
    } catch (err) {
      const errData = err.response?.data || err.data || { error: err.message };
      setSimulationResult({
        key: scenarioKey,
        status: errData.status || 'BLOCKED',
        granted: false,
        message: errData.message || errData.error || err.message || 'Access Denied by Institutional Policy',
        payload: errData
      });
      loadGatewayData();
    } finally {
      setSimulating(false);
    }
  };

  const handleApplyQuickHours = async (start, end, enforce = true) => {
    setSavingPolicy(true);
    try {
      const updated = await api.gateway.updatePolicy({
        ...policy,
        voting_start_time: start,
        voting_end_time: end,
        election_access_required: enforce
      });
      setPolicy(updated);
      setPolicySuccess(true);
      setTimeout(() => setPolicySuccess(false), 3000);
      loadGatewayData();
    } catch (e) {
      alert(`Hours update failed: ${e.message}`);
    } finally {
      setSavingPolicy(false);
    }
  };

  // Filtered devices
  const filteredDevices = devices.filter((d) => {
    const matchStatus = filterStatus === 'ALL' || d.status === filterStatus;
    const matchQuery =
      !searchQuery ||
      d.device_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.device_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.location?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchQuery;
  });

  const totalTrusted = devices.filter((d) => d.status === 'TRUSTED').length;
  const totalBlocked = devices.filter((d) => d.status === 'BLOCKED').length;
  const totalEvms = devices.filter((d) => d.role_target === 'EVM' && d.status === 'TRUSTED').length;

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
                color: '#ffffff',
                padding: '8px',
                borderRadius: '10px'
              }}
            >
              <Radio size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Campus Access Gateway Control
              </h1>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
                Enforce authoritative college infrastructure perimeter, device trust registry, and election time windows.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={16} />
            <span>Register New Device</span>
          </button>
          <button onClick={loadGatewayData} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* 5 KPI Metric Overview Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        {/* Card 1: Authorized Network */}
        <div className="glass-card" style={{ padding: '18px 20px', borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Authorized Network
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
                {policy.ssid_name || 'COLLEGE_WIFI'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, marginTop: '2px' }}>
                ● Subnets Active ({policy.allowed_cidrs.split(',').length} CIDRs)
              </div>
            </div>
            <div style={{ background: 'rgba(2, 132, 199, 0.12)', padding: '10px', borderRadius: '12px', color: '#0284c7' }}>
              <Wifi size={20} />
            </div>
          </div>
        </div>

        {/* Card 2: Trusted Hardware Devices */}
        <div className="glass-card" style={{ padding: '18px 20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Trusted Devices
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
                {totalTrusted}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Hardware credentials verified
              </div>
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '10px', borderRadius: '12px', color: '#10b981' }}>
              <ShieldCheck size={20} />
            </div>
          </div>
        </div>

        {/* Card 3: Active EVM Terminals */}
        <div className="glass-card" style={{ padding: '18px 20px', borderLeft: '4px solid #6366f1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Active EVM Kiosks
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
                {totalEvms} Terminals
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Stationed in designated labs
              </div>
            </div>
            <div style={{ background: 'rgba(99, 102, 241, 0.12)', padding: '10px', borderRadius: '12px', color: '#6366f1' }}>
              <Monitor size={20} />
            </div>
          </div>
        </div>

        {/* Card 4: Blocked / Revoked Devices */}
        <div className="glass-card" style={{ padding: '18px 20px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Blocked / Revoked
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
                {totalBlocked}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Zero unauthorized egress
              </div>
            </div>
            <div style={{ background: 'rgba(239, 68, 68, 0.12)', padding: '10px', borderRadius: '12px', color: '#ef4444' }}>
              <ShieldAlert size={20} />
            </div>
          </div>
        </div>

        {/* Card 5: Enforcement Status */}
        <div className="glass-card" style={{ padding: '18px 20px', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Enforcement Mode
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: policy.enforcement_mode === 'STRICT' ? '#10b981' : '#38bdf8', marginTop: '4px' }}>
                {policy.enforcement_mode === 'STRICT' ? 'STRICT CAMPUS' : 'DEVELOPMENT'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Hours: {policy.voting_start_time.substring(0, 5)} - {policy.voting_end_time.substring(0, 5)}
              </div>
            </div>
            <div style={{ background: 'rgba(139, 92, 246, 0.12)', padding: '10px', borderRadius: '12px', color: '#8b5cf6' }}>
              <Clock size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* College Working Hours Live Control Ribbon */}
      <div
        className="glass-card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          borderLeft: policy.is_active && (telemetry?.college_open !== false) ? '4px solid #10b981' : '4px solid #f59e0b',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
          color: '#f8fafc'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              padding: '10px',
              borderRadius: '12px',
              background: policy.is_active && (telemetry?.college_open !== false) ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              color: policy.is_active && (telemetry?.college_open !== false) ? '#34d399' : '#fbbf24'
            }}
          >
            <Clock size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.96rem', color: '#f8fafc' }}>
                COLLEGE OPERATING HOURS POLICY
              </span>
              <span
                className={`badge ${policy.is_active && (telemetry?.college_open !== false) ? 'badge-emerald' : 'badge-amber'}`}
                style={{ fontSize: '0.7rem', padding: '3px 8px' }}
              >
                {policy.is_active && (telemetry?.college_open !== false) ? '● SERVER ONLINE (COLLEGE OPEN)' : '● SERVER LOCKED (COLLEGE CLOSED)'}
              </span>
            </div>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
              Authorized Election Window: <strong style={{ color: '#38bdf8' }}>{policy.voting_start_time.substring(0, 5)} - {policy.voting_end_time.substring(0, 5)}</strong>. Voting server is strictly closed outside college hours.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => handleApplyQuickHours('09:00', '16:30', true)}
            disabled={savingPolicy}
            className="btn btn-sm btn-secondary"
            style={{ fontSize: '0.74rem', padding: '6px 12px' }}
          >
            <Clock size={13} />
            <span>Standard College Hours (09:00 - 16:30)</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyQuickHours('09:00', '12:00', true)}
            disabled={savingPolicy}
            className="btn btn-sm btn-secondary"
            style={{ fontSize: '0.74rem', padding: '6px 12px' }}
          >
            <Lock size={13} />
            <span>Morning Only (09:00 - 12:00)</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyQuickHours('00:00', '23:59', false)}
            disabled={savingPolicy}
            className="btn btn-sm btn-secondary"
            style={{ fontSize: '0.74rem', padding: '6px 12px' }}
          >
            <Unlock size={13} />
            <span>All-Day 24/7 Access (Override)</span>
          </button>
        </div>
      </div>

      {/* Interactive Visual Realtime Campus Network Architecture Map */}
      <div
        className="glass-card"
        style={{
          padding: '24px',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #070b14 0%, #0b1120 50%, #0f172a 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          color: '#f8fafc',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#0284c7', padding: '8px', borderRadius: '10px', color: '#fff' }}>
              <Server size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Live Campus Network Perimeter & Hardware Mesh
              </h2>
              <div style={{ fontSize: '0.74rem', color: '#38bdf8' }}>
                Wired LAN EVM Terminals vs. Campus Wi-Fi Endpoints • Active Student Voter Verification
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.74rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
              <span style={{ color: '#cbd5e1' }}>Institutional Hardwired LAN (Allowed)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
              <span style={{ color: '#cbd5e1' }}>Campus Wi-Fi (Portal Only, Ballot Blocked)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
              <span style={{ color: '#cbd5e1' }}>External Subnet (Blocked)</span>
            </div>
          </div>
        </div>

        {/* Interactive Diagram Canvas */}
        <div
          style={{
            background: 'rgba(2, 6, 23, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '28px 20px',
            position: 'relative'
          }}
        >
          {/* Central Gateway Node */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px 28px',
                background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.3) 0%, rgba(79, 70, 229, 0.3) 100%)',
                border: '1.5px solid #38bdf8',
                borderRadius: '16px',
                boxShadow: '0 0 24px rgba(56, 189, 248, 0.35)',
                position: 'relative',
                zIndex: 2
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 900, fontSize: '0.95rem' }}>
                <Radio size={18} className="pulse-glow" />
                <span>STUDENTVOICEX CAMPUS GATEWAY</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                SSID: <strong style={{ color: '#f8fafc' }}>{policy.ssid_name}</strong> • Subnet Policy: <strong style={{ color: '#34d399' }}>LAN EVM EXCLUSIVE FOR BALLOT</strong>
              </div>
            </div>
          </div>

          {/* Connected Peripheral Nodes Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              position: 'relative',
              zIndex: 2
            }}
          >
            {/* Node 1: EVM Lab 1 (Hardwired LAN) */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1.5px solid rgba(16, 185, 129, 0.6)',
                borderRadius: '12px',
                padding: '14px',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.2)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Monitor size={16} color="#34d399" />
                  <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#f8fafc' }}>EVM-01</span>
                </div>
                <span className="badge badge-emerald" style={{ fontSize: '0.66rem' }}>HARDWIRED LAN</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>CSE Lab 301 (Voter Kiosk)</div>
              <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#34d399', marginTop: '4px' }}>
                IP: 10.10.4.12 • Latency: 1ms
              </div>
              <div style={{ fontSize: '0.66rem', color: '#10b981', fontWeight: 700, marginTop: '4px' }}>
                ✓ Ballot Casting: UNLOCKED
              </div>
            </div>

            {/* Node 2: EVM Lab 2 (Hardwired LAN) */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1.5px solid rgba(16, 185, 129, 0.6)',
                borderRadius: '12px',
                padding: '14px',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.2)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Monitor size={16} color="#34d399" />
                  <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#f8fafc' }}>EVM-02</span>
                </div>
                <span className="badge badge-emerald" style={{ fontSize: '0.66rem' }}>HARDWIRED LAN</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Auditorium Hall Kiosk</div>
              <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#34d399', marginTop: '4px' }}>
                IP: 10.10.4.15 • Latency: 2ms
              </div>
              <div style={{ fontSize: '0.66rem', color: '#10b981', fontWeight: 700, marginTop: '4px' }}>
                ✓ Ballot Casting: UNLOCKED
              </div>
            </div>

            {/* Node 3: Admin Terminal */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(99, 102, 241, 0.5)',
                borderRadius: '12px',
                padding: '14px',
                boxShadow: '0 4px 16px rgba(99, 102, 241, 0.15)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Laptop size={16} color="#818cf8" />
                  <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#f8fafc' }}>ADMIN-PC-01</span>
                </div>
                <span className="badge badge-indigo" style={{ fontSize: '0.66rem' }}>TRUSTED</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Dean Suite Terminal</div>
              <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#38bdf8', marginTop: '4px' }}>
                IP: 10.10.1.5 • Latency: 1ms
              </div>
              <div style={{ fontSize: '0.66rem', color: '#818cf8', fontWeight: 700, marginTop: '4px' }}>
                Admin Portal: ACTIVE
              </div>
            </div>

            {/* Node 4: Muralidharan K - Active Verified Student on WiFi */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(14, 116, 144, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)',
                border: '1.5px solid #38bdf8',
                borderRadius: '12px',
                padding: '14px',
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.25)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserCheck size={16} color="#38bdf8" />
                  <span style={{ fontWeight: 900, fontSize: '0.84rem', color: '#f8fafc' }}>Muralidharan K</span>
                </div>
                <span className="badge badge-cyan" style={{ fontSize: '0.66rem' }}>ACTIVE VOTER</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                Roll: <strong style={{ color: '#38bdf8' }}>2024IT001</strong> • IT 3rd Year
              </div>
              <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#94a3b8', marginTop: '4px' }}>
                WiFi IP: 172.16.4.88 • SSID: {policy.ssid_name}
              </div>
              <div style={{ fontSize: '0.66rem', color: '#f87171', fontWeight: 700, marginTop: '4px' }}>
                ⚠ WiFi Ballot: BLOCKED (EVM Required)
              </div>
            </div>

            {/* Node 5: External Rogue Subnet */}
            <div
              style={{
                background: 'rgba(30, 10, 15, 0.85)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                borderRadius: '12px',
                padding: '14px',
                boxShadow: '0 4px 16px rgba(239, 68, 68, 0.15)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldAlert size={16} color="#ef4444" />
                  <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#fca5a5' }}>EXTERNAL WAN</span>
                </div>
                <span className="badge badge-rose" style={{ fontSize: '0.66rem' }}>BLOCKED</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Off-Campus Public Internet</div>
              <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#ef4444', marginTop: '4px' }}>
                IP: 198.51.100.44 • Rejected
              </div>
              <div style={{ fontSize: '0.66rem', color: '#f87171', fontWeight: 700, marginTop: '4px' }}>
                Zero Egress Allowed
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Hardware & Network Policy Simulator (Live Test Bench) */}
      <div
        className="glass-card"
        style={{
          padding: '24px',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #0b1120 0%, #111827 100%)',
          border: '1.5px solid rgba(99, 102, 241, 0.35)',
          color: '#f8fafc'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)', padding: '8px', borderRadius: '10px', color: '#fff' }}>
              <Zap size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Real-Time Hardware & Network Policy Simulator
              </h2>
              <div style={{ fontSize: '0.74rem', color: '#a5b4fc' }}>
                Test and verify: Hardwired EVM Terminal (Allowed) vs. Student Mobile/Laptop Wi-Fi (Blocked) vs. After Hours (Closed).
              </div>
            </div>
          </div>
          <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>LIVE BACKEND VERIFICATION</span>
        </div>

        {/* 4 Interactive Test Bench Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          {/* Action 1: EVM Hardwired LAN */}
          <button
            type="button"
            onClick={() => runScenarioSimulation('EVM_LAN')}
            disabled={simulating}
            className="btn"
            style={{
              padding: '14px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              background: activeScenario === 'EVM_LAN' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(15, 23, 42, 0.7)',
              border: activeScenario === 'EVM_LAN' ? '1.5px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#f8fafc',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.82rem', color: '#34d399' }}>
                <Monitor size={15} />
                <span>1. Hardwired EVM Terminal</span>
              </div>
              <span className="badge badge-emerald" style={{ fontSize: '0.62rem' }}>EXPECT: ALLOWED</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Hardwired Institutional LAN (10.10.4.12)
            </div>
          </button>

          {/* Action 2: Student Mobile WiFi */}
          <button
            type="button"
            onClick={() => runScenarioSimulation('WIFI_MOBILE')}
            disabled={simulating}
            className="btn"
            style={{
              padding: '14px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              background: activeScenario === 'WIFI_MOBILE' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(15, 23, 42, 0.7)',
              border: activeScenario === 'WIFI_MOBILE' ? '1.5px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#f8fafc',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.82rem', color: '#f87171' }}>
                <Smartphone size={15} />
                <span>2. Student Mobile on Wi-Fi</span>
              </div>
              <span className="badge badge-rose" style={{ fontSize: '0.62rem' }}>EXPECT: BLOCKED</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Muralidharan K via COLLEGE_WIFI (172.16.4.88)
            </div>
          </button>

          {/* Action 3: Student Laptop WiFi */}
          <button
            type="button"
            onClick={() => runScenarioSimulation('WIFI_LAPTOP')}
            disabled={simulating}
            className="btn"
            style={{
              padding: '14px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              background: activeScenario === 'WIFI_LAPTOP' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(15, 23, 42, 0.7)',
              border: activeScenario === 'WIFI_LAPTOP' ? '1.5px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#f8fafc',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.82rem', color: '#f87171' }}>
                <Laptop size={15} />
                <span>3. Student Laptop on Wi-Fi</span>
              </div>
              <span className="badge badge-rose" style={{ fontSize: '0.62rem' }}>EXPECT: BLOCKED</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Personal BYOD Laptop on Wireless Subnet
            </div>
          </button>

          {/* Action 4: After College Hours */}
          <button
            type="button"
            onClick={() => runScenarioSimulation('AFTER_COLLEGE_HOURS')}
            disabled={simulating}
            className="btn"
            style={{
              padding: '14px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              background: activeScenario === 'AFTER_COLLEGE_HOURS' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(15, 23, 42, 0.7)',
              border: activeScenario === 'AFTER_COLLEGE_HOURS' ? '1.5px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#f8fafc',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.82rem', color: '#fbbf24' }}>
                <Clock size={15} />
                <span>4. After College Hours</span>
              </div>
              <span className="badge badge-amber" style={{ fontSize: '0.62rem' }}>EXPECT: CLOSED</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Voting Session Attempt Outside College Hours
            </div>
          </button>

          {/* Action 5: External / Off-Campus Network */}
          <button
            type="button"
            onClick={() => runScenarioSimulation('EXTERNAL_NETWORK')}
            disabled={simulating}
            className="btn"
            style={{
              padding: '14px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              background: activeScenario === 'EXTERNAL_NETWORK' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(15, 23, 42, 0.7)',
              border: activeScenario === 'EXTERNAL_NETWORK' ? '1.5px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#f8fafc',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.82rem', color: '#f87171' }}>
                <WifiOff size={15} />
                <span>5. External Network (Home/Hotspot)</span>
              </div>
              <span className="badge badge-rose" style={{ fontSize: '0.62rem' }}>EXPECT: BLOCKED</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Home Wi-Fi, 4G/5G Hotspot (Off-Campus)
            </div>
          </button>
        </div>

        {/* Live Simulation Response Terminal Box */}
        {simulationResult && (
          <div
            style={{
              background: 'rgba(2, 6, 23, 0.9)',
              border: simulationResult.granted ? '1.5px solid #10b981' : simulationResult.status === 'COLLEGE_CLOSED' ? '1.5px solid #f59e0b' : '1.5px solid #ef4444',
              borderRadius: '12px',
              padding: '16px',
              animation: 'fadeIn 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {simulationResult.granted ? (
                  <CheckCircle size={18} color="#34d399" />
                ) : (
                  <ShieldAlert size={18} color="#f87171" />
                )}
                <span style={{ fontWeight: 800, fontSize: '0.88rem', color: simulationResult.granted ? '#34d399' : '#f87171' }}>
                  GATEWAY VERIFICATION RESULT: {simulationResult.status}
                </span>
              </div>
              <span className="badge badge-slate" style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>
                SIEM SECURITY AUDIT LOGGED
              </span>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#e2e8f0', marginBottom: '10px', lineHeight: 1.5 }}>
              {simulationResult.message}
            </div>

            <pre
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.74rem',
                color: '#94a3b8',
                fontFamily: 'var(--font-mono)',
                margin: 0,
                overflowX: 'auto'
              }}
            >
              {JSON.stringify(simulationResult.payload, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* 2-Column Split: Device Registry (Left 65%) + Network Policy Configuration (Right 35%) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.85fr) minmax(0, 1.15fr)', gap: '24px', marginBottom: '24px' }}>
        {/* Left Column: Device Registry Table */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Campus Hardware Device Registry
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                {devices.length} registered institutional voting terminals, kiosk stations, and admin PCs.
              </p>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {['ALL', 'TRUSTED', 'PENDING', 'BLOCKED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`badge ${filterStatus === st ? 'badge-cyan' : 'badge-slate'}`}
                  style={{ cursor: 'pointer', border: 'none', padding: '6px 10px', fontSize: '0.72rem', fontWeight: 700 }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by device name, hardware ID, location, or department..."
              className="input-field"
              style={{ paddingLeft: '38px', width: '100%', fontSize: '0.82rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Device Table */}
          <div className="table-container" style={{ maxHeight: '480px', overflowY: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Device & Hardware ID</th>
                  <th>Role / Dept</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Last Seen IP</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      No devices matching the current filter.
                    </td>
                  </tr>
                ) : (
                  filteredDevices.map((dev) => (
                    <tr key={dev.id}>
                      <td>
                        <div style={{ fontWeight: 800, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                          {dev.device_name}
                        </div>
                        <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                          {dev.device_id}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${dev.role_target === 'EVM' ? 'badge-emerald' : dev.role_target === 'ADMIN' ? 'badge-indigo' : 'badge-cyan'}`} style={{ fontSize: '0.7rem' }}>
                          {dev.role_target}
                        </span>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {dev.department}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {dev.location}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            dev.status === 'TRUSTED'
                              ? 'badge-emerald'
                              : dev.status === 'BLOCKED'
                              ? 'badge-rose'
                              : 'badge-amber'
                          }`}
                          style={{ fontSize: '0.72rem' }}
                        >
                          {dev.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        {dev.last_verified_ip || '—'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          {dev.status !== 'TRUSTED' && (
                            <button
                              type="button"
                              onClick={() => handleDeviceAction(dev.id, 'APPROVE')}
                              className="btn btn-sm"
                              style={{ background: '#10b981', color: '#fff', padding: '4px 8px', fontSize: '0.72rem' }}
                              title="Approve / Trust Device"
                            >
                              <Check size={13} />
                              <span>Trust</span>
                            </button>
                          )}
                          {dev.status !== 'BLOCKED' && (
                            <button
                              type="button"
                              onClick={() => handleDeviceAction(dev.id, 'REVOKE')}
                              className="btn btn-sm"
                              style={{ background: '#ef4444', color: '#fff', padding: '4px 8px', fontSize: '0.72rem' }}
                              title="Revoke / Block Device"
                            >
                              <XCircle size={13} />
                              <span>Revoke</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeviceAction(dev.id, 'DELETE')}
                            className="btn btn-sm"
                            style={{ background: '#f1f5f9', color: '#64748b', padding: '4px 8px', fontSize: '0.72rem' }}
                            title="Delete Device"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Campus Network Policy & Election Window Config */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Sliders size={20} color="#0284c7" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Gateway Policy Controls
            </h2>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            Modify server-enforced CIDR blocks and configure automated voting hours access windows.
          </p>

          <form onSubmit={handleSavePolicy} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* SSID */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Authorized Campus SSID
              </label>
              <input
                type="text"
                className="input-field"
                value={policy.ssid_name}
                onChange={(e) => setPolicy({ ...policy, ssid_name: e.target.value })}
                required
              />
            </div>

            {/* Allowed CIDRs */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Allowed Subnet CIDR Blocks (Comma separated)
              </label>
              <textarea
                className="input-field"
                rows={3}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', resize: 'vertical' }}
                value={policy.allowed_cidrs}
                onChange={(e) => setPolicy({ ...policy, allowed_cidrs: e.target.value })}
                required
              />
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                Supports standard IPv4/IPv6 CIDRs (e.g. 10.0.0.0/8, 172.16.0.0/12, 127.0.0.1/32).
              </div>
            </div>

            {/* Enforcement Mode */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Perimeter Enforcement Mode
              </label>
              <select
                className="input-field"
                value={policy.enforcement_mode}
                onChange={(e) => setPolicy({ ...policy, enforcement_mode: e.target.value })}
              >
                <option value="STRICT">STRICT (Only allowed campus CIDRs & registered devices)</option>
                <option value="DEVELOPMENT">DEVELOPMENT (Allow localhost & loopback simulation)</option>
              </select>
            </div>

            {/* Election Access Window Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'var(--bg-subtle, #f8fafc)', borderRadius: '10px' }}>
              <input
                type="checkbox"
                id="election_access_required"
                checked={policy.election_access_required}
                onChange={(e) => setPolicy({ ...policy, election_access_required: e.target.checked })}
                style={{ width: '16px', height: '16px' }}
              />
              <label htmlFor="election_access_required" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer' }}>
                Enforce Election Hours Window
              </label>
            </div>

            {/* Voting Hours */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '3px' }}>
                  Daily Start (HH:MM:SS)
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={policy.voting_start_time}
                  onChange={(e) => setPolicy({ ...policy, voting_start_time: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '3px' }}>
                  Daily End (HH:MM:SS)
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={policy.voting_end_time}
                  onChange={(e) => setPolicy({ ...policy, voting_end_time: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingPolicy}
              className="btn btn-primary"
              style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {savingPolicy ? <RefreshCw size={15} className="spin" /> : policySuccess ? <CheckCircle2 size={15} /> : <Save size={15} />}
              <span>{policySuccess ? 'Policy Saved & Enforced!' : savingPolicy ? 'Saving...' : 'Update & Apply Policy'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Modal: Register New Device */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px'
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '480px',
              padding: '28px',
              background: '#ffffff',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} color="#0284c7" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Register Campus Device
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleRegisterDevice} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Device Name / Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. EVM-03 (Science Block)"
                  className="input-field"
                  value={newDevice.device_name}
                  onChange={(e) => setNewDevice({ ...newDevice, device_name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Hardware Identifier / Serial Fingerprint
                </label>
                <input
                  type="text"
                  placeholder="e.g. EVM-HW-994827"
                  className="input-field"
                  style={{ fontFamily: 'var(--font-mono)' }}
                  value={newDevice.device_id}
                  onChange={(e) => setNewDevice({ ...newDevice, device_id: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Role Target
                  </label>
                  <select
                    className="input-field"
                    value={newDevice.role_target}
                    onChange={(e) => setNewDevice({ ...newDevice, role_target: e.target.value })}
                  >
                    <option value="EVM">EVM Kiosk</option>
                    <option value="ADMIN">Admin Terminal</option>
                    <option value="STUDENT">Student BYOD Device</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Initial Status
                  </label>
                  <select
                    className="input-field"
                    value={newDevice.status}
                    onChange={(e) => setNewDevice({ ...newDevice, status: e.target.value })}
                  >
                    <option value="TRUSTED">TRUSTED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="BLOCKED">BLOCKED</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Department
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CSE / IT / ECE"
                    className="input-field"
                    value={newDevice.department}
                    onChange={(e) => setNewDevice({ ...newDevice, department: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Physical Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lab 402"
                    className="input-field"
                    value={newDevice.location}
                    onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Register Device
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAccessControl;
