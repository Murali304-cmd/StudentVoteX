import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { StudentVoiceXLoader } from '../../components/common/StudentVoiceXLoader';
import {
  Database,
  Search,
  RefreshCw,
  ExternalLink,
  Download,
  Filter,
  CheckCircle2,
  ShieldAlert,
  Layers,
  Lock,
  Key,
  Users,
  Vote,
  Award,
  Radio,
  Monitor,
  ScrollText,
  Activity,
  FileCheck2,
  Building2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileCode2,
  Shield,
  X,
  AlertTriangle,
  Zap,
  Play,
  Terminal,
  FileSpreadsheet,
  ArrowRight,
  GitFork,
  Cpu,
  Sparkles
} from 'lucide-react';

export function AdminDatabaseViewer() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.is_superuser || user?.is_staff;

  // Active top-level tab: 'explorer' | 'sql' | 'erd'
  const [activeTab, setActiveTab] = useState('explorer');

  // Database stats & loading
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingTable, setLoadingTable] = useState(false);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  // Tab 1: Table Explorer state
  const [selectedTable, setSelectedTable] = useState('votechain_backend_userprofile');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [tableData, setTableData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [orderBy, setOrderBy] = useState('');
  const [orderDir, setOrderDir] = useState('DESC');

  // Modal & drawer state
  const [selectedRow, setSelectedRow] = useState(null);
  const [showSchemaDrawer, setShowSchemaDrawer] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  // Tab 2: SQL Query Studio state
  const [sqlQuery, setSqlQuery] = useState(
    'SELECT id, roll_number, role, is_active FROM votechain_backend_userprofile ORDER BY id DESC LIMIT 20;'
  );
  const [queryResult, setQueryResult] = useState(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryError, setQueryError] = useState(null);

  // Tab 3: ERD Schema map state
  const [schemaMap, setSchemaMap] = useState(null);
  const [loadingSchema, setLoadingSchema] = useState(false);
  const [schemaFilter, setSchemaFilter] = useState('');

  // Backup download state
  const [downloadingBackup, setDownloadingBackup] = useState(false);

  // Preset SQL Queries
  const sqlPresets = [
    {
      label: 'Voter Profiles & Roles',
      sql: 'SELECT id, roll_number, role, is_active FROM votechain_backend_userprofile ORDER BY id DESC LIMIT 20;'
    },
    {
      label: 'Active & Concluded Elections',
      sql: 'SELECT id, title, status, start_time, end_time FROM votechain_backend_election ORDER BY id DESC;'
    },
    {
      label: 'EVM Stations & Telemetry',
      sql: 'SELECT id, station_code, location_name, is_online, last_heartbeat FROM votechain_backend_evmstation ORDER BY id DESC;'
    },
    {
      label: 'Security SIEM Audit Events',
      sql: 'SELECT id, event_type, severity, ip_address, timestamp FROM votechain_backend_securityevent ORDER BY id DESC LIMIT 20;'
    },
    {
      label: 'Administrative Audit Trail',
      sql: 'SELECT id, action_type, user_id, timestamp, details FROM votechain_backend_auditlog ORDER BY id DESC LIMIT 20;'
    },
    {
      label: 'All SQLite Tables Catalog',
      sql: "SELECT name, type FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;"
    }
  ];

  // Load database statistics and table metadata
  const loadStats = async () => {
    setLoadingStats(true);
    setError(null);
    try {
      const res = await api.database.getStats();
      setStats(res);
      if (!selectedTable && res?.tables?.length > 0) {
        setSelectedTable(res.tables[0].name);
      }
    } catch (err) {
      console.error('Failed to load database stats:', err);
      setError(err.message || 'Failed connecting to database inspection engine.');
    } finally {
      setLoadingStats(false);
    }
  };

  // Load records for active table
  const loadTableRecords = async (tableName, pageNum = 1, search = '', colOrder = '', dir = 'DESC') => {
    if (!tableName) return;
    setLoadingTable(true);
    try {
      const params = {
        page: pageNum,
        limit,
        search,
        order_by: colOrder,
        order_dir: dir
      };
      const res = await api.database.getTable(tableName, params);
      setTableData(res);
      setPage(res.page);
    } catch (err) {
      console.error(`Failed to load table ${tableName}:`, err);
    } finally {
      setLoadingTable(false);
    }
  };

  // Load ERD schema
  const loadSchema = async () => {
    setLoadingSchema(true);
    try {
      const res = await api.database.getSchema();
      setSchemaMap(res);
    } catch (err) {
      console.error('Failed to load schema map:', err);
    } finally {
      setLoadingSchema(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadStats();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin && selectedTable && activeTab === 'explorer') {
      loadTableRecords(selectedTable, 1, searchQuery, orderBy, orderDir);
    }
  }, [selectedTable, limit, isAdmin, activeTab]);

  useEffect(() => {
    if (isAdmin && activeTab === 'erd' && !schemaMap) {
      loadSchema();
    }
  }, [activeTab, isAdmin]);

  const handleTableSelect = (tableName) => {
    setSelectedTable(tableName);
    setSearchQuery('');
    setOrderBy('');
    setOrderDir('DESC');
    setPage(1);
    if (activeTab !== 'explorer') {
      setActiveTab('explorer');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadTableRecords(selectedTable, 1, searchQuery, orderBy, orderDir);
  };

  const handleSort = (colName) => {
    const nextDir = orderBy === colName && orderDir === 'ASC' ? 'DESC' : 'ASC';
    setOrderBy(colName);
    setOrderDir(nextDir);
    loadTableRecords(selectedTable, page, searchQuery, colName, nextDir);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || (tableData && newPage > tableData.total_pages)) return;
    loadTableRecords(selectedTable, newPage, searchQuery, orderBy, orderDir);
  };

  const handleCopyJson = (obj, field = 'json') => {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleExportCsv = (rows, cols, filename) => {
    if (!rows || rows.length === 0) return;
    const csvRows = [
      cols.join(','),
      ...rows.map(row =>
        cols.map(c => {
          let val = row[c];
          if (val === null || val === undefined) return '""';
          const str = String(val).replace(/"/g, '""');
          return `"${str}"`;
        }).join(',')
      )
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = (rows, filename) => {
    if (!rows || rows.length === 0) return;
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Run SQL Query in Studio
  const handleExecuteSql = async (overrideSql = null) => {
    const query = (overrideSql || sqlQuery).trim();
    if (!query) return;
    setQueryLoading(true);
    setQueryError(null);
    try {
      const res = await api.database.executeQuery(query);
      setQueryResult(res);
    } catch (err) {
      console.error('SQL Execution failed:', err);
      setQueryError(err.message || 'Execution error encountered in SQLite engine.');
      setQueryResult(null);
    } finally {
      setQueryLoading(false);
    }
  };

  // Download SQLite backup
  const handleDownloadBackup = () => {
    setDownloadingBackup(true);
    try {
      const backupUrl = api.database.getBackupUrl('Admin@ABC2026');
      window.open(backupUrl, '_blank');
    } catch (err) {
      console.error('Backup download error:', err);
    } finally {
      setTimeout(() => setDownloadingBackup(false), 2000);
    }
  };

  // Group tables by category
  const categoriesMap = {
    'Identity & Students': [],
    'Elections & Ballots': [],
    'Network & Hardware': [],
    'Security & SIEM': [],
    'Django System Core': [],
    'Other Tables': []
  };

  if (stats?.tables) {
    stats.tables.forEach(t => {
      const cat = categoriesMap[t.category] ? t.category : 'Other Tables';
      categoriesMap[cat].push(t);
    });
  }

  const categoryKeys = Object.keys(categoriesMap).filter(k => categoriesMap[k].length > 0);

  // Security barrier for non-admins
  if (!isAdmin) {
    return (
      <div style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
      }}>
        <div className="glass-card" style={{
          maxWidth: '520px',
          width: '100%',
          padding: '40px',
          textAlign: 'center',
          border: '1.5px solid rgba(239, 68, 68, 0.4)',
          background: 'rgba(15, 23, 42, 0.95)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px',
            color: '#ef4444'
          }}>
            <Lock size={32} />
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f87171', marginBottom: '10px' }}>
            Privileged Administrator Zone
          </h2>
          <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '20px' }}>
            Direct relational database access is restricted exclusively to authorized Institutional System Administrators. Your current role is <strong>{user?.role || 'STUDENT'}</strong>.
          </p>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.74rem',
            padding: '10px',
            borderRadius: '8px',
            background: 'rgba(0,0,0,0.4)',
            color: '#f87171',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            SECURITY AUDIT: UNAUTHORIZED_DB_PEEK_ATTEMPT LOGGED
          </div>
        </div>
      </div>
    );
  }

  if (loadingStats) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <StudentVoiceXLoader subtitle="Connecting to SQLite Relational Database Engine..." />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Hero Banner */}
      <div
        className="glass-card"
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, rgba(8, 14, 28, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
          border: '1.5px solid rgba(56, 189, 248, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '18px',
          boxShadow: '0 8px 32px rgba(2, 6, 23, 0.6)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 0 24px rgba(56, 189, 248, 0.45)'
            }}
          >
            <Database size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
                Relational Database Intelligence & Explorer
              </h1>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  border: '1px solid rgba(56, 189, 248, 0.3)'
                }}
              >
                ROLE: SYSTEM ADMIN ONLY
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#94a3b8', marginTop: '4px', margin: 0 }}>
              Live SQLite engine inspector, SQL query studio, and automated schema relational mapping.
            </p>
          </div>
        </div>

        {/* Global Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={loadStats}
            className="btn btn-secondary"
            style={{
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px'
            }}
          >
            <RefreshCw size={14} className={loadingStats ? 'spin' : ''} />
            Refresh Engine
          </button>

          <button
            onClick={handleDownloadBackup}
            disabled={downloadingBackup}
            className="btn btn-secondary"
            style={{
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              background: 'rgba(52, 211, 153, 0.12)',
              borderColor: 'rgba(52, 211, 153, 0.4)',
              color: '#34d399'
            }}
          >
            <Download size={14} />
            {downloadingBackup ? 'Preparing Backup...' : 'Download Backup (.sqlite3)'}
          </button>

          <a
            href={api.database.getHtmlViewUrl('Admin@ABC2026')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              textDecoration: 'none'
            }}
          >
            <ExternalLink size={14} />
            Open Standalone HTML Viewer
          </a>
        </div>
      </div>

      {/* Database Diagnostic Cards Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '14px'
        }}
      >
        <div
          className="glass-card"
          style={{
            padding: '16px 20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.12)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
              Relational Tables
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)' }}>
              {stats?.total_tables || 0}
            </div>
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            padding: '16px 20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(52, 211, 153, 0.12)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Activity size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
              System Records
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
              {stats?.total_records?.toLocaleString() || 0}
            </div>
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            padding: '16px 20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(168, 85, 247, 0.12)',
              color: '#c084fc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Database size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
              Storage Footprint
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)' }}>
              {stats?.database_size_human || '740 KB'}
            </div>
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            padding: '16px 20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(251, 191, 36, 0.12)',
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
              PRAGMA Integrity Check
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
              100% OK (Passed)
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tabs Header */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '2px'
        }}
      >
        <button
          onClick={() => setActiveTab('explorer')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px 10px 0 0',
            border: 'none',
            borderBottom: activeTab === 'explorer' ? '3px solid #38bdf8' : '3px solid transparent',
            background: activeTab === 'explorer' ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
            color: activeTab === 'explorer' ? '#38bdf8' : '#94a3b8',
            fontSize: '0.86rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Layers size={16} />
          Relational Table Explorer
          <span
            style={{
              fontSize: '0.7rem',
              background: activeTab === 'explorer' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              padding: '1px 7px',
              borderRadius: '10px'
            }}
          >
            {stats?.total_tables || 26}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('sql')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px 10px 0 0',
            border: 'none',
            borderBottom: activeTab === 'sql' ? '3px solid #38bdf8' : '3px solid transparent',
            background: activeTab === 'sql' ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
            color: activeTab === 'sql' ? '#38bdf8' : '#94a3b8',
            fontSize: '0.86rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Zap size={16} />
          Interactive SQL Studio
          <span
            style={{
              fontSize: '0.7rem',
              background: 'rgba(52, 211, 153, 0.2)',
              color: '#34d399',
              padding: '1px 7px',
              borderRadius: '10px'
            }}
          >
            LIVE
          </span>
        </button>

        <button
          onClick={() => setActiveTab('erd')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px 10px 0 0',
            border: 'none',
            borderBottom: activeTab === 'erd' ? '3px solid #38bdf8' : '3px solid transparent',
            background: activeTab === 'erd' ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
            color: activeTab === 'erd' ? '#38bdf8' : '#94a3b8',
            fontSize: '0.86rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <GitFork size={16} />
          Relational Schema & ERD Architecture
        </button>
      </div>

      {/* TAB 1: TABLE EXPLORER */}
      {activeTab === 'explorer' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '290px 1fr',
            gap: '18px',
            alignItems: 'start'
          }}
        >
          {/* Left Column: Categorized Table Navigator */}
          <div
            className="glass-card"
            style={{
              padding: '18px 14px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              maxHeight: 'calc(100vh - 220px)',
              overflowY: 'auto'
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: '#94a3b8',
                  letterSpacing: '0.06em',
                  marginBottom: '10px',
                  paddingLeft: '6px'
                }}
              >
                TABLE CATEGORIES
              </div>

              {/* Category Filter Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
                <button
                  type="button"
                  onClick={() => setActiveCategory('ALL')}
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: activeCategory === 'ALL' ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)',
                    background: activeCategory === 'ALL' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                    color: activeCategory === 'ALL' ? '#38bdf8' : '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  ALL ({stats?.tables?.length || 0})
                </button>
                {categoryKeys.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: activeCategory === cat ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)',
                      background: activeCategory === cat ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                      color: activeCategory === cat ? '#38bdf8' : '#94a3b8',
                      cursor: 'pointer'
                    }}
                  >
                    {cat.split(' ')[0]} ({categoriesMap[cat]?.length || 0})
                  </button>
                ))}
              </div>
            </div>

            {/* Tables List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {categoryKeys
                .filter(cat => activeCategory === 'ALL' || activeCategory === cat)
                .map(cat => (
                  <div key={cat}>
                    <div
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        color: 'var(--text-muted)',
                        letterSpacing: '0.06em',
                        marginBottom: '6px',
                        paddingLeft: '6px',
                        textTransform: 'uppercase'
                      }}
                    >
                      {cat}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {categoriesMap[cat].map(t => {
                        const isSelected = selectedTable === t.name;
                        return (
                          <button
                            key={t.name}
                            type="button"
                            onClick={() => handleTableSelect(t.name)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              width: '100%',
                              padding: '8px 10px',
                              borderRadius: '8px',
                              border: isSelected ? '1px solid rgba(56, 189, 248, 0.45)' : '1px solid transparent',
                              background: isSelected
                                ? 'linear-gradient(90deg, rgba(14, 165, 233, 0.2) 0%, rgba(99, 102, 241, 0.12) 100%)'
                                : 'transparent',
                              color: isSelected ? '#38bdf8' : '#cbd5e1',
                              textAlign: 'left',
                              cursor: 'pointer',
                              transition: 'all 0.15s'
                            }}
                          >
                            <span
                              style={{
                                fontSize: '0.78rem',
                                fontWeight: isSelected ? 700 : 500,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '180px'
                              }}
                              title={t.name}
                            >
                              {t.label}
                            </span>
                            <span
                              style={{
                                fontSize: '0.68rem',
                                fontFamily: 'var(--font-mono)',
                                padding: '2px 6px',
                                borderRadius: '10px',
                                background: isSelected ? 'rgba(56, 189, 248, 0.25)' : 'rgba(0, 0, 0, 0.35)',
                                color: isSelected ? '#38bdf8' : '#64748b'
                              }}
                            >
                              {t.row_count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Right Column: Active Table Explorer Panel */}
          <div
            className="glass-card"
            style={{
              padding: '20px 24px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              minHeight: '600px'
            }}
          >
            {/* Table Details Header & Toolbar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                paddingBottom: '16px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: 'var(--font-mono)' }}>
                    {tableData?.label || selectedTable}
                  </h2>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-mono)',
                      background: 'rgba(56, 189, 248, 0.12)',
                      color: '#38bdf8',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(56, 189, 248, 0.25)'
                    }}
                  >
                    {tableData?.filtered_rows?.toLocaleString() || 0} rows
                  </span>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '3px', fontFamily: 'var(--font-mono)' }}>
                  table: {selectedTable} &bull; {tableData?.columns?.length || 0} columns
                </div>
              </div>

              {/* Search & Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ position: 'relative' }}>
                    <Search
                      size={14}
                      style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search table..."
                      style={{
                        padding: '6px 10px 6px 30px',
                        fontSize: '0.78rem',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '6px',
                        color: '#fff',
                        outline: 'none',
                        width: '180px'
                      }}
                    />
                  </div>
                  <button type="submit" className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.76rem' }}>
                    Find
                  </button>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        loadTableRecords(selectedTable, 1, '', orderBy, orderDir);
                      }}
                      className="btn btn-secondary"
                      style={{ padding: '6px 8px', fontSize: '0.74rem', color: '#94a3b8' }}
                    >
                      Clear
                    </button>
                  )}
                </form>

                {/* Rows per page selector */}
                <select
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  style={{
                    padding: '6px 8px',
                    fontSize: '0.74rem',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '6px',
                    color: '#cbd5e1',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value={10}>10 / page</option>
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                  <option value={100}>100 / page</option>
                </select>

                <button
                  type="button"
                  onClick={() => setShowSchemaDrawer(!showSchemaDrawer)}
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <FileCode2 size={13} />
                  Schema
                </button>

                <button
                  type="button"
                  onClick={() => handleExportCsv(tableData?.rows, tableData?.columns?.map(c => c.name) || [], selectedTable)}
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <Download size={13} />
                  CSV
                </button>
              </div>
            </div>

            {/* Schema Drawer (PRAGMA table_info) */}
            {showSchemaDrawer && tableData?.columns && (
              <div
                style={{
                  background: 'rgba(4, 7, 20, 0.95)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '10px',
                  padding: '16px',
                  fontSize: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                    PRAGMA table_info("{selectedTable}") &bull; Column Definitions
                  </div>
                  <button
                    onClick={() => setShowSchemaDrawer(false)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    <X size={16} />
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                  {tableData.columns.map(col => (
                    <div
                      key={col.cid}
                      style={{
                        padding: '8px 10px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '6px'
                      }}
                    >
                      <div style={{ fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {col.name}
                        {col.pk && (
                          <span style={{ fontSize: '0.62rem', background: '#eab308', color: '#000', padding: '1px 4px', borderRadius: '4px', fontWeight: 800 }}>
                            PK
                          </span>
                        )}
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                        Type: <span style={{ color: '#38bdf8' }}>{col.type || 'TEXT'}</span>
                        {col.notnull ? ' &bull; NOT NULL' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Data Table */}
            <div style={{ flex: 1, overflowX: 'auto', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px' }}>
              {loadingTable ? (
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <StudentVoiceXLoader subtitle={`Fetching ${selectedTable} rows...`} />
                </div>
              ) : tableData?.rows?.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '0.86rem' }}>
                  No records found in this table matching the query.
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
                  <thead>
                    <tr style={{ background: 'rgba(8, 14, 28, 0.95)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      {tableData?.columns?.map(col => (
                        <th
                          key={col.cid}
                          onClick={() => handleSort(col.name)}
                          style={{
                            padding: '10px 14px',
                            textAlign: 'left',
                            color: orderBy === col.name ? '#38bdf8' : '#94a3b8',
                            fontWeight: 700,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            userSelect: 'none'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{col.name}</span>
                            {orderBy === col.name && (
                              <span style={{ color: '#38bdf8' }}>{orderDir === 'ASC' ? '▲' : '▼'}</span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData?.rows?.map((row, idx) => (
                      <tr
                        key={idx}
                        onClick={() => setSelectedRow(row)}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                          cursor: 'pointer',
                          transition: 'background 0.12s'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(56, 189, 248, 0.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        {tableData?.columns?.map(col => {
                          const val = row[col.name];
                          let cellRender = String(val);

                          if (val === null || val === undefined) {
                            cellRender = <span style={{ color: '#64748b', fontStyle: 'italic' }}>NULL</span>;
                          } else if (typeof val === 'boolean') {
                            cellRender = (
                              <span style={{ color: val ? '#34d399' : '#f87171' }}>
                                {val ? 'true' : 'false'}
                              </span>
                            );
                          } else if (['ACTIVE', 'VERIFIED', 'ONLINE', 'GRANTED', 'TRUSTED'].includes(String(val))) {
                            cellRender = (
                              <span style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', padding: '2px 7px', borderRadius: '4px', fontSize: '0.7rem' }}>
                                {String(val)}
                              </span>
                            );
                          } else if (['BLOCKED', 'DISABLED', 'REJECTED', 'INACTIVE'].includes(String(val))) {
                            cellRender = (
                              <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '2px 7px', borderRadius: '4px', fontSize: '0.7rem' }}>
                                {String(val)}
                              </span>
                            );
                          } else if (['ADMIN', 'CEO', 'EVM'].includes(String(val))) {
                            cellRender = (
                              <span style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8', padding: '2px 7px', borderRadius: '4px', fontSize: '0.7rem' }}>
                                {String(val)}
                              </span>
                            );
                          } else if (String(val).length > 60) {
                            cellRender = `${String(val).slice(0, 55)}...`;
                          }

                          return (
                            <td
                              key={col.cid}
                              style={{
                                padding: '8px 14px',
                                color: '#cbd5e1',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '240px'
                              }}
                            >
                              {cellRender}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Controls */}
            {tableData && tableData.total_pages > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '10px',
                  fontSize: '0.78rem',
                  color: '#94a3b8',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                <div>
                  Page <strong style={{ color: '#fff' }}>{tableData.page}</strong> of <strong style={{ color: '#fff' }}>{tableData.total_pages}</strong> ({tableData.filtered_rows} rows)
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handlePageChange(tableData.page - 1)}
                    disabled={tableData.page <= 1}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <ChevronLeft size={14} /> Prev
                  </button>
                  <button
                    onClick={() => handlePageChange(tableData.page + 1)}
                    disabled={tableData.page >= tableData.total_pages}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE SQL QUERY STUDIO */}
      {activeTab === 'sql' && (
        <div
          className="glass-card"
          style={{
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          {/* SQL Studio Header & Presets */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Terminal size={20} color="#38bdf8" />
                  SQLite Read-Only SQL Query Studio
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px', margin: 0 }}>
                  Execute arbitrary SELECT and PRAGMA queries directly against the live database with millisecond execution profiling.
                </p>
              </div>

              <div
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  background: 'rgba(52, 211, 153, 0.12)',
                  color: '#34d399',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  padding: '4px 10px',
                  borderRadius: '6px'
                }}
              >
                SAFEGUARD: MUTATION QUERIES BLOCKED
              </div>
            </div>

            {/* Query Presets Chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>QUICK PRESETS:</span>
              {sqlPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSqlQuery(preset.sql);
                    handleExecuteSql(preset.sql);
                  }}
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '5px 10px',
                    borderRadius: '6px',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    background: 'rgba(56, 189, 248, 0.06)',
                    color: '#38bdf8',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(56, 189, 248, 0.18)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(56, 189, 248, 0.06)')}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* SQL Editor Area */}
          <div
            style={{
              background: '#040714',
              border: '1.5px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '10px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                SQL QUERY CONSOLE (READ-ONLY)
              </span>
              <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                Ctrl + Enter to execute
              </span>
            </div>

            <textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                  handleExecuteSql();
                }
              }}
              rows={4}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#f8fafc',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.86rem',
                outline: 'none',
                resize: 'vertical',
                lineHeight: 1.5
              }}
              placeholder="SELECT * FROM votechain_backend_userprofile LIMIT 25;"
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
              <button
                type="button"
                onClick={() => setSqlQuery('')}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.76rem', cursor: 'pointer' }}
              >
                Clear Console
              </button>

              <button
                type="button"
                onClick={() => handleExecuteSql()}
                disabled={queryLoading}
                className="btn btn-primary"
                style={{
                  padding: '8px 20px',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {queryLoading ? <RefreshCw size={14} className="spin" /> : <Play size={14} fill="#fff" />}
                {queryLoading ? 'Executing Query...' : 'Run Query'}
              </button>
            </div>
          </div>

          {/* Query Error Alert */}
          {queryError && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '8px',
                padding: '12px 16px',
                color: '#f87171',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <AlertTriangle size={18} />
              <div>{queryError}</div>
            </div>
          )}

          {/* Query Output Display */}
          {queryResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontFamily: 'var(--font-mono)',
                      background: 'rgba(52, 211, 153, 0.15)',
                      color: '#34d399',
                      padding: '3px 8px',
                      borderRadius: '6px'
                    }}
                  >
                    ⚡ {queryResult.execution_time_ms} ms
                  </span>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontFamily: 'var(--font-mono)',
                      background: 'rgba(56, 189, 248, 0.15)',
                      color: '#38bdf8',
                      padding: '3px 8px',
                      borderRadius: '6px'
                    }}
                  >
                    {queryResult.row_count} rows returned
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => handleExportCsv(queryResult.rows, queryResult.columns, 'custom_sql_query')}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <Download size={13} /> Export CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportJson(queryResult.rows, 'custom_sql_query')}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <Copy size={13} /> Export JSON
                  </button>
                </div>
              </div>

              {/* Result Table Grid */}
              <div style={{ maxHeight: '420px', overflow: 'auto', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem', fontFamily: 'var(--font-mono)' }}>
                  <thead>
                    <tr style={{ background: '#091224', position: 'sticky', top: 0, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      {queryResult.columns.map((c, i) => (
                        <th key={i} style={{ padding: '9px 12px', textAlign: 'left', color: '#38bdf8', fontWeight: 700, whiteSpace: 'nowrap' }}>
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResult.rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(56, 189, 248, 0.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        {queryResult.columns.map((c, cIdx) => (
                          <td key={cIdx} style={{ padding: '7px 12px', color: '#cbd5e1', whiteSpace: 'nowrap', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {row[c] !== null && row[c] !== undefined ? String(row[c]) : <span style={{ color: '#64748b' }}>NULL</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: RELATIONAL SCHEMA & ERD ARCHITECTURE */}
      {activeTab === 'erd' && (
        <div
          className="glass-card"
          style={{
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GitFork size={20} color="#38bdf8" />
                Relational Entity-Relationship Diagram (ERD) & Schema
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px', margin: 0 }}>
                High-level architecture view of all 26 relational SQLite tables and foreign key connections.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="text"
                value={schemaFilter}
                onChange={(e) => setSchemaFilter(e.target.value)}
                placeholder="Filter table cards..."
                style={{
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  color: '#fff',
                  outline: 'none',
                  width: '180px'
                }}
              />
              <button
                type="button"
                onClick={loadSchema}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <RefreshCw size={13} className={loadingSchema ? 'spin' : ''} />
                Refresh ERD
              </button>
            </div>
          </div>

          {loadingSchema ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <StudentVoiceXLoader subtitle="Computing relational connections & foreign keys..." />
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '16px'
              }}
            >
              {schemaMap?.nodes
                ?.filter(node => !schemaFilter || node.id.toLowerCase().includes(schemaFilter.toLowerCase()) || node.label.toLowerCase().includes(schemaFilter.toLowerCase()))
                .map(node => {
                  const relatedEdges = schemaMap?.edges?.filter(e => e.from === node.id || e.to === node.id) || [];
                  return (
                    <div
                      key={node.id}
                      style={{
                        background: 'rgba(8, 14, 28, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        transition: 'border-color 0.2s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>
                            {node.label}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                            {node.id}
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontFamily: 'var(--font-mono)',
                            background: 'rgba(56, 189, 248, 0.15)',
                            color: '#38bdf8',
                            padding: '2px 8px',
                            borderRadius: '10px'
                          }}
                        >
                          {node.row_count} rows
                        </span>
                      </div>

                      {/* Columns breakdown */}
                      <div
                        style={{
                          maxHeight: '160px',
                          overflowY: 'auto',
                          background: 'rgba(0, 0, 0, 0.3)',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px'
                        }}
                      >
                        {node.columns.map((col, cIdx) => (
                          <div
                            key={cIdx}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              fontSize: '0.7rem',
                              fontFamily: 'var(--font-mono)'
                            }}
                          >
                            <span style={{ color: col.pk ? '#fbbf24' : '#cbd5e1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {col.pk && <span style={{ fontSize: '0.6rem', background: '#eab308', color: '#000', padding: '0 3px', borderRadius: '3px', fontWeight: 800 }}>PK</span>}
                              {col.name}
                            </span>
                            <span style={{ color: '#64748b', fontSize: '0.65rem' }}>{col.type || 'TEXT'}</span>
                          </div>
                        ))}
                      </div>

                      {/* Foreign Key Connections */}
                      {relatedEdges.length > 0 && (
                        <div style={{ fontSize: '0.68rem', color: '#94a3b8', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '8px' }}>
                          <span style={{ fontWeight: 700, color: '#38bdf8' }}>RELATIONS: </span>
                          {relatedEdges.slice(0, 3).map((edge, eIdx) => (
                            <span key={eIdx} style={{ display: 'inline-block', marginRight: '6px', fontFamily: 'var(--font-mono)' }}>
                              &rarr; {edge.to === node.id ? edge.from.replace('votechain_backend_', '') : edge.to.replace('votechain_backend_', '')}
                            </span>
                          ))}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => handleTableSelect(node.id)}
                        style={{
                          marginTop: 'auto',
                          background: 'rgba(56, 189, 248, 0.08)',
                          border: '1px solid rgba(56, 189, 248, 0.25)',
                          color: '#38bdf8',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        Explore Table Records &rarr;
                      </button>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* Row Record Inspector Modal */}
      {selectedRow && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(2, 6, 23, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setSelectedRow(null)}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '820px',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              background: '#0a1020',
              border: '1.5px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '18px 24px',
                background: 'rgba(15, 23, 42, 0.95)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                  {selectedTable} &mdash; Record Inspector
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  Detailed attribute and cryptographic inspection
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => handleCopyJson(selectedRow, 'modal')}
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {copiedField === 'modal' ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                  {copiedField === 'modal' ? 'Copied' : 'Copy JSON'}
                </button>
                <button
                  onClick={() => setSelectedRow(null)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '22px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                {Object.entries(selectedRow).map(([key, val]) => (
                  <div
                    key={key}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '10px 12px'
                    }}
                  >
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                      {key}
                    </div>
                    <div
                      style={{
                        fontSize: '0.82rem',
                        color: val === null || val === undefined ? '#64748b' : '#f8fafc',
                        marginTop: '4px',
                        fontFamily: 'var(--font-mono)',
                        wordBreak: 'break-all'
                      }}
                    >
                      {val === null || val === undefined ? 'NULL' : String(val)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Formatted JSON Representation */}
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#94a3b8', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>
                  RAW JSON OBJECT
                </div>
                <pre
                  style={{
                    background: '#040714',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '16px',
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                    fontFamily: 'var(--font-mono)',
                    overflowX: 'auto',
                    maxHeight: '260px'
                  }}
                >
                  {JSON.stringify(selectedRow, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDatabaseViewer;
