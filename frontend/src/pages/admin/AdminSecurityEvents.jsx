import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StudentVoiceXLoader } from '../../components/common/StudentVoiceXLoader';
import {
  ShieldAlert,
  AlertTriangle,
  AlertOctagon,
  Info,
  Filter,
  RefreshCw,
  Search,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Sparkles,
  Activity,
  Zap
} from 'lucide-react';

export function AdminSecurityEvents() {
  const [data, setData] = useState({ counts: {}, events: [] });
  const [threatData, setThreatData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (severityFilter) params.severity = severityFilter;
      if (typeFilter) params.event_type = typeFilter;
      
      const [res, threat] = await Promise.all([
        api.security.list(params),
        api.security.getThreatAssessment().catch(() => null)
      ]);
      setData(res);
      setThreatData(threat);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [severityFilter, typeFilter]);

  const counts = data.counts || {};

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Security Telemetry & AI Threat Matrix
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Real-time controlled environment proctoring, anti-coercion duress alarms, and AI anomaly detection.
          </p>
        </div>

        <button onClick={fetchEvents} className="btn btn-secondary">
          <RefreshCw size={15} />
          <span>Refresh Live Feed</span>
        </button>
      </div>

      {/* AI Threat Assessment Radar Card */}
      {threatData && (
        <div className="glass-card" style={{ padding: '24px', marginBottom: '24px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#f8fafc', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: '#0284c7', padding: '8px', borderRadius: '10px', color: '#fff' }}>
                <Sparkles size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                  AI Election Anomaly & Threat Assessment
                </h2>
                <div style={{ fontSize: '0.74rem', color: '#38bdf8' }}>
                  Engine: {threatData.engineVersion} • Continuous Heuristic Scanning
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span className={`badge ${
                threatData.threatLevel === 'CRITICAL' ? 'badge-rose' :
                threatData.threatLevel === 'ELEVATED' ? 'badge-amber' : 'badge-emerald'
              }`} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                THREAT LEVEL: {threatData.threatLevel}
              </span>
              <span className="badge badge-cyan" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                INTEGRITY INDEX: {threatData.integrityIndex}%
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {threatData.threatVectors?.map((vec, i) => (
              <div key={i} style={{ background: 'rgba(2, 6, 23, 0.5)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, color: '#f8fafc' }}>{vec.vector}</span>
                  <span style={{ color: vec.riskScore > 30 ? '#fb7185' : '#34d399', fontWeight: 700 }}>
                    {vec.riskScore}%
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#334155', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
                  <div style={{ width: `${vec.riskScore}%`, height: '100%', background: vec.riskScore > 30 ? '#f43f5e' : '#0284c7' }} />
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', lineHeight: 1.35 }}>
                  {vec.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Severity Counters Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '16px', borderLeft: '4px solid #e11d48' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#e11d48', textTransform: 'uppercase' }}>Critical Alerts</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {counts.critical || 0}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px', borderLeft: '4px solid #f43f5e' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f43f5e', textTransform: 'uppercase' }}>High Severity</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {counts.high || 0}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px', borderLeft: '4px solid #d97706' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase' }}>Medium Alerts</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {counts.medium || 0}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px', borderLeft: '4px solid #0284c7' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>Low / Informational</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {counts.low || 0}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px', borderLeft: '4px solid #4f46e5' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase' }}>Total Logged</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {counts.total || 0}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
        <select
          className="input-field"
          style={{ width: '180px' }}
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
        >
          <option value="">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        <select
          className="input-field"
          style={{ width: '240px' }}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All Event Types</option>
          <option value="FULLSCREEN_EXIT">Fullscreen Exited</option>
          <option value="TAB_SWITCH">Tab Switched / Hidden</option>
          <option value="WINDOW_FOCUS_LOST">Window Focus Lost</option>
          <option value="COERCION_DURESS_TRIGGERED">Coercion / Duress Alarm</option>
          <option value="INSPECTION_ATTEMPT">Inspection / DevTools</option>
          <option value="DUPLICATE_VOTE_ATTEMPT">Duplicate Vote Blocked</option>
          <option value="UNAUTHORIZED_ACCESS">Unauthorized Access</option>
        </select>
      </div>

      {/* Security Events Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Severity</th>
              <th>Event Type</th>
              <th>Voter Subject</th>
              <th>Details & Technical Description</th>
              <th>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>
                  <StudentVoiceXLoader
                    mode="card"
                    size={48}
                    label="Loading Security Telemetry & SIEM Events..."
                    sublabel="Scanning AI Fraud Vectors & Replay Attempt Logs..."
                  />
                </td>
              </tr>
            ) : data.events.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No security events matching filter criteria.
                </td>
              </tr>
            ) : (
              data.events.map((ev) => (
                <tr key={ev.id}>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(ev.timestamp).toLocaleTimeString()} • {new Date(ev.timestamp).toLocaleDateString()}
                  </td>
                  <td>
                    <span className={`badge ${
                      ev.severity === 'CRITICAL' ? 'badge-rose' :
                      ev.severity === 'HIGH' ? 'badge-rose' :
                      ev.severity === 'MEDIUM' ? 'badge-amber' : 'badge-cyan'
                    }`}>
                      {ev.severity}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                    {ev.event_type}
                  </td>
                  <td style={{ fontSize: '0.82rem' }}>
                    {ev.student ? <strong>{ev.student.student_id}</strong> : <span style={{ color: 'var(--text-muted)' }}>System / Anonymous</span>}
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {ev.details}
                  </td>
                  <td style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {ev.ip_address || '127.0.0.1'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
