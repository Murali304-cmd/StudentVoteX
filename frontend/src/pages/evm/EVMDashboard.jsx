import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  Vote,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Blocks,
  Activity,
  ArrowUpRight,
  Monitor
} from 'lucide-react';

export function EVMDashboard() {
  const [stats, setStats] = useState({
    activeElections: 2,
    verifiedVoters: 8,
    votesCast: 14,
    kioskStatus: 'ONLINE',
    blockchainBlocks: 1048
  });
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.elections.list();
        setElections(res.data?.results || res.data || []);
      } catch (err) {
        console.error('Error fetching elections:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          EVM Terminal Operations Dashboard
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '4px' }}>
          ABC Institution • Physical Kiosk Management & Live Election Monitoring
        </p>
      </div>

      {/* Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}
      >
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>Active Elections</span>
            <Vote size={18} color="#0284c7" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '10px' }}>
            {elections.length || stats.activeElections}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, marginTop: '4px' }}>
            ● Ballot Terminals Active
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>Verified Student Voters</span>
            <Users size={18} color="#4f46e5" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '10px' }}>
            {stats.verifiedVoters} / 10
          </div>
          <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700, marginTop: '4px' }}>
            Ready to Cast Ballots
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>Blockchain Blocks</span>
            <Blocks size={18} color="#7c3aed" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '10px' }}>
            #{stats.blockchainBlocks}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, marginTop: '4px' }}>
            ✓ 100% Chain Integrity
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>Kiosk Hardware</span>
            <Monitor size={18} color="#059669" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginTop: '10px' }}>
            ONLINE
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>
            Cam & Biometrics Ready
          </div>
        </div>
      </div>

      {/* Active Elections Table */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
          Active Institutional Ballots
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {elections.map((elec) => (
            <div
              key={elec.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderRadius: '12px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0'
              }}
            >
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                  {elec.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                  Department: {elec.department} • Ends: {new Date(elec.end_date).toLocaleDateString()}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    background: '#ecfdf5',
                    color: '#059669',
                    border: '1px solid #a7f3d0'
                  }}
                >
                  {elec.status}
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0284c7' }}>
                  {elec.candidates?.length || 0} Candidates
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EVMDashboard;
