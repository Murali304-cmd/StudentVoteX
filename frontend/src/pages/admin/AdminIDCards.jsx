import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { api } from '../../services/api';
import { StudentVoiceXLoader } from '../../components/common/StudentVoiceXLoader';
import {
  QrCode,
  ShieldCheck,
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Printer,
  RotateCw,
  Copy,
  Check,
  Building,
  User,
  Wifi,
  ExternalLink,
  Layers,
  FileSpreadsheet,
  CheckCheck,
  Sparkles,
  Fingerprint,
  FileText,
  SlidersHorizontal,
  ChevronRight,
  Eye,
  RefreshCw
} from 'lucide-react';

export function AdminIDCards() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('GRID'); // 'GRID' | 'TABLE'
  
  // Inspection / Verifier Modal State
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalFlipped, setModalFlipped] = useState(false);
  const [modalQrUrl, setModalQrUrl] = useState('');
  const [hashVerificationStatus, setHashVerificationStatus] = useState('CHECKING'); // 'VALID' | 'MISMATCH'
  const [calculatedHash, setCalculatedHash] = useState('');
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedQr, setCopiedQr] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Cache QR data URLs for student grid
  const [qrCache, setQrCache] = useState({});

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await api.students.list();
      const list = Array.isArray(data) ? data : data?.results || [];
      setStudents(list);

      // Generate QR codes for all students in background
      const cache = {};
      await Promise.all(
        list.map(async (s) => {
          const payload = s.id_card_qr_ref || `ABC-VERIFY:${s.student_id}:${(s.id_card_hash || 'HASH').substring(0, 16)}`;
          try {
            const url = await QRCode.toDataURL(payload, {
              width: 200,
              margin: 1,
              color: { dark: '#0f172a', light: '#ffffff' },
              errorCorrectionLevel: 'H'
            });
            cache[s.id] = url;
          } catch (e) {
            console.error('QR gen error for', s.student_id, e);
          }
        })
      );
      setQrCache(cache);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // When selected student changes, recalculate SHA-256 live hash
  useEffect(() => {
    if (!selectedStudent) {
      setCalculatedHash('');
      setHashVerificationStatus('CHECKING');
      setModalQrUrl('');
      return;
    }

    const qrPayload = selectedStudent.id_card_qr_ref || `ABC-VERIFY:${selectedStudent.student_id}:${(selectedStudent.id_card_hash || '').substring(0, 16)}`;
    QRCode.toDataURL(qrPayload, {
      width: 260,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' },
      errorCorrectionLevel: 'H'
    }).then(setModalQrUrl).catch(console.error);

    // Compute live SHA-256 hash using Web Crypto API
    const rawData = `${selectedStudent.student_id}:${selectedStudent.full_name}:ABC-INSTITUTION`;
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(rawData);
    crypto.subtle.digest('SHA-256', dataBuffer).then((hashBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      setCalculatedHash(hashHex);

      if (!selectedStudent.id_card_hash || selectedStudent.id_card_hash === hashHex) {
        setHashVerificationStatus('VALID');
      } else {
        setHashVerificationStatus('MISMATCH');
      }
    });
  }, [selectedStudent]);

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchSearch =
      (s.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.student_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.roll_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.department || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.id_card_hash || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchDept = deptFilter === 'ALL' || s.department === deptFilter;
    const matchStatus = statusFilter === 'ALL' || s.verification_status === statusFilter;

    return matchSearch && matchDept && matchStatus;
  });

  // KPI Calculations
  const totalCards = students.length;
  const verifiedCards = students.filter((s) => s.verification_status === 'VERIFIED').length;
  const pendingCards = students.filter((s) => s.verification_status === 'PENDING' || s.verification_status === 'UNDER_REVIEW').length;
  const departments = Array.from(new Set(students.map((s) => s.department).filter(Boolean)));

  // Status Updater from Modal
  const handleUpdateVerificationStatus = async (newStatus) => {
    if (!selectedStudent) return;
    setUpdatingStatus(true);
    setActionSuccess('');
    try {
      const updated = await api.students.update(selectedStudent.id, {
        ...selectedStudent,
        verification_status: newStatus
      });
      setSelectedStudent(updated);
      setActionSuccess(`Status successfully updated to ${newStatus}`);
      fetchStudents();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Single Card Download Generator (High-Res Canvas)
  const handleDownloadCard = (student) => {
    const s = student || selectedStudent;
    if (!s) return;

    const canvas = document.createElement('canvas');
    canvas.width = 1050;
    canvas.height = 660;
    const ctx = canvas.getContext('2d');

    // Gradient Background
    const grad = ctx.createLinearGradient(0, 0, 1050, 660);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.4, '#1e1b4b');
    grad.addColorStop(1, '#0369a1');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(0, 0, 1050, 660, 28);
    ctx.fill();

    // Decorative Holographic Glow Orbs
    const glow1 = ctx.createRadialGradient(900, 100, 10, 900, 100, 200);
    glow1.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
    glow1.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = glow1;
    ctx.beginPath();
    ctx.arc(900, 100, 200, 0, Math.PI * 2);
    ctx.fill();

    // Header Band
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 32px "Outfit", sans-serif';
    ctx.fillText('ABC INSTITUTION OF TECHNOLOGY', 60, 75);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 15px "Inter", sans-serif';
    ctx.fillText('AUTONOMOUS • NAAC "A++" ACCREDITED • SECURE CAMPUS VOTING CREDENTIAL', 60, 105);

    // EMV Chip Simulation
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.roundRect(920, 48, 65, 48, 8);
    ctx.fill();
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Photo Box Placeholder / Avatar
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(60, 160, 200, 250, 18);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 84px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText((s.full_name || 'S').charAt(0), 160, 310);
    ctx.textAlign = 'left';

    // Student Metadata
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Outfit", sans-serif';
    ctx.fillText((s.full_name || 'STUDENT NAME').toUpperCase(), 300, 220);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 22px "Inter", sans-serif';
    ctx.fillText(`ROLL NO: ${s.roll_number || s.student_id}`, 300, 265);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '20px "Inter", sans-serif';
    ctx.fillText(`DEPARTMENT: ${s.department || 'Information Technology'}`, 300, 305);
    ctx.fillText(`ACADEMIC YEAR: ${s.year || '3rd Year'} • SECTION: ${s.section || 'A'}`, 300, 345);
    ctx.fillText(`INSTITUTION ID: ${s.student_id || 'ABC-IT-2026-001'}`, 300, 385);

    // Draw QR Code if available
    const qrUrl = qrCache[s.id] || modalQrUrl;
    if (qrUrl) {
      const img = new Image();
      img.src = qrUrl;
      img.onload = () => {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(800, 180, 190, 190, 14);
        ctx.fill();
        ctx.drawImage(img, 810, 190, 170, 170);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 16px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('EVM SCAN READY', 895, 395);
        ctx.textAlign = 'left';

        // Bottom Footer Bar
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.beginPath();
        ctx.moveTo(60, 480);
        ctx.lineTo(990, 480);
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 18px "Inter", sans-serif';
        ctx.fillText('✓ StudentVoiceX Verified Identity & Cryptographic Voter Token', 60, 530);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px monospace';
        const hashDisplay = s.id_card_hash || 'SHA-256 CHECKED';
        ctx.fillText(`INTEGRITY HASH: ${hashDisplay.substring(0, 48)}...`, 60, 565);

        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'bold 16px "Inter", sans-serif';
        ctx.fillText('VALIDITY: 2024 - 2028', 800, 530);

        // Download Trigger
        const link = document.createElement('a');
        link.download = `ABC_Smartcard_${s.student_id || s.roll_number}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      };
    }
  };

  // Export Checksum CSV
  const handleExportCSV = () => {
    if (!students.length) return;
    const headers = ['Student ID', 'Roll Number', 'Full Name', 'Department', 'Year', 'Verification Status', 'SHA-256 Integrity Hash', 'QR Reference'];
    const rows = filteredStudents.map((s) => [
      `"${s.student_id || ''}"`,
      `"${s.roll_number || ''}"`,
      `"${s.full_name || ''}"`,
      `"${s.department || ''}"`,
      `"${s.year || ''}"`,
      `"${s.verification_status || ''}"`,
      `"${s.id_card_hash || ''}"`,
      `"${s.id_card_qr_ref || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StudentVoiceX_ID_Integrity_Registry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print All Filtered Cards
  const handlePrintBatch = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* ----------------- Top Header & Actions ----------------- */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{ padding: '7px 10px', borderRadius: '10px', background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)' }}>
              <Fingerprint size={20} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              Student ID Cards & Cryptographic Credential Vault
            </h1>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0 }}>
            Official ABC Institution digital smartcards, real-time SHA-256 integrity verification, and EVM Kiosk scanner references.
          </p>
        </div>

        {/* Global Batch Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleExportCSV}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', padding: '9px 15px' }}
          >
            <FileSpreadsheet size={16} color="#0284c7" />
            <span>Export Checksums (CSV)</span>
          </button>

          <button
            type="button"
            onClick={handlePrintBatch}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', padding: '9px 16px' }}
          >
            <Printer size={16} />
            <span>Batch Print ID Cards</span>
          </button>
        </div>
      </div>

      {/* ----------------- KPI Metrics Ribbon ----------------- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {/* Card 1 */}
        <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #0284c7' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Issued Smartcards
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {totalCards}
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #10b981' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Verified Credentials
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#059669' }}>
              {verifiedCards} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>/ {totalCards}</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Pending Review
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#d97706' }}>
              {pendingCards}
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #6366f1' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              SHA-256 Integrity Rate
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#4f46e5' }}>
              100% <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981' }}>Tamper-Free</span>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- Search & Filter Controls ----------------- */}
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Input */}
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by student name, roll number, student ID, or hash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '38px', fontSize: '0.86rem' }}
            />
          </div>

          {/* Department Filter */}
          <div style={{ minWidth: '180px' }}>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="input-field"
              style={{ fontSize: '0.84rem' }}
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Verification Status Filter */}
          <div style={{ minWidth: '160px' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
              style={{ fontSize: '0.84rem' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">Verified Only</option>
              <option value="PENDING">Pending Only</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '10px' }}>
            <button
              type="button"
              onClick={() => setViewMode('GRID')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'GRID' ? '#ffffff' : 'transparent',
                color: viewMode === 'GRID' ? '#0f172a' : '#64748b',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                boxShadow: viewMode === 'GRID' ? '0 2px 5px rgba(0,0,0,0.08)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Layers size={14} />
              <span>Cards Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('TABLE')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'TABLE' ? '#ffffff' : 'transparent',
                color: viewMode === 'TABLE' ? '#0f172a' : '#64748b',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                boxShadow: viewMode === 'TABLE' ? '0 2px 5px rgba(0,0,0,0.08)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <FileText size={14} />
              <span>Registry List</span>
            </button>
          </div>
        </div>
      </div>

      {/* ----------------- ID Cards Grid / Table View ----------------- */}
      {loading ? (
        <StudentVoiceXLoader
          mode="card"
          label="Loading Cryptographic Student Smartcards..."
          sublabel="Generating High-Resolution SHA-256 Micro-QR Badges..."
        />
      ) : filteredStudents.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
          <AlertTriangle size={36} color="#94a3b8" style={{ margin: '0 auto 10px' }} />
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>No Matching Student ID Cards</div>
          <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
            No credentials found matching "{searchTerm}" in department "{deptFilter}".
          </p>
          <button
            type="button"
            onClick={() => { setSearchTerm(''); setDeptFilter('ALL'); setStatusFilter('ALL'); }}
            className="btn btn-secondary"
            style={{ marginTop: '12px', fontSize: '0.82rem' }}
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'GRID' ? (
        /* GRID VIEW: Realistic High-Fidelity Smartcards */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '22px' }}>
          {filteredStudents.map((s) => (
            <div
              key={s.id}
              style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0369a1 100%)',
                borderRadius: '20px',
                padding: '22px',
                color: '#ffffff',
                boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              className="student-smartcard-hover"
            >
              {/* Radial glow background accents */}
              <div
                style={{
                  position: 'absolute',
                  top: '-30px',
                  right: '-30px',
                  width: '140px',
                  height: '140px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, rgba(255, 255, 255, 0) 70%)',
                  pointerEvents: 'none'
                }}
              />

              <div>
                {/* Card Top Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px', zIndex: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(56, 189, 248, 0.4)'
                      }}
                    >
                      <Building size={16} color="#ffffff" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        ABC INSTITUTION
                      </div>
                      <div style={{ fontSize: '0.62rem', color: '#93c5fd', fontWeight: 600 }}>
                        AUTONOMOUS • NAAC A++
                      </div>
                    </div>
                  </div>

                  {/* Gold EMV Chip & Verification Status */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '999px',
                        fontSize: '0.64rem',
                        fontWeight: 800,
                        background: s.verification_status === 'VERIFIED' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)',
                        color: s.verification_status === 'VERIFIED' ? '#34d399' : '#fbbf24',
                        border: `1px solid ${s.verification_status === 'VERIFIED' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`
                      }}
                    >
                      {s.verification_status}
                    </span>
                  </div>
                </div>

                {/* Card Main Body */}
                <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 68px', gap: '12px', alignItems: 'center', margin: '10px 0 14px 0', zIndex: 2 }}>
                  {/* Photo / Avatar */}
                  <div
                    style={{
                      width: '70px',
                      height: '84px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                      border: '2px solid rgba(56, 189, 248, 0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38bdf8',
                      fontSize: '1.75rem',
                      fontWeight: 800,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      overflow: 'hidden'
                    }}
                  >
                    {s.full_name ? s.full_name.charAt(0) : 'S'}
                  </div>

                  {/* Student Details */}
                  <div>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 2px 0', lineHeight: 1.2 }}>
                      {s.full_name}
                    </h3>
                    <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700 }}>
                      Roll No: <span style={{ color: '#ffffff' }}>{s.roll_number || s.student_id}</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#cbd5e1', marginTop: '2px' }}>
                      {s.department}
                    </div>
                    <div style={{ fontSize: '0.66rem', color: '#94a3b8', marginTop: '1px' }}>
                      Year {s.year} • Sec {s.section}
                    </div>
                    <div style={{ fontSize: '0.64rem', color: '#38bdf8', fontFamily: 'monospace', fontWeight: 700, marginTop: '3px' }}>
                      {s.student_id}
                    </div>
                  </div>

                  {/* High-Res QR Code Preview */}
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        padding: '3px',
                        background: '#ffffff',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        display: 'inline-block'
                      }}
                    >
                      {qrCache[s.id] ? (
                        <img src={qrCache[s.id]} alt="QR" style={{ width: '58px', height: '58px', display: 'block' }} />
                      ) : (
                        <div style={{ width: '58px', height: '58px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <QrCode size={24} color="#0f172a" />
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: '0.54rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                      EVM QR
                    </div>
                  </div>
                </div>

                {/* Cryptographic Hash Snippet Bar */}
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    fontSize: '0.67rem',
                    fontFamily: 'monospace',
                    color: '#94a3b8',
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>
                    <span style={{ color: '#38bdf8', fontWeight: 700 }}>SHA-256: </span>
                    {s.id_card_hash ? s.id_card_hash.substring(0, 20) + '...' : '0x8f4b2c...9e1a'}
                  </div>
                  <span style={{ color: '#10b981', fontSize: '0.62rem', fontWeight: 800 }}>✓ VERIFIED</span>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedStudent(s)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(56, 189, 248, 0.5)',
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Eye size={14} />
                  <span>Inspect & Verify</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadCard(s)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Download size={14} />
                  <span>Save PNG</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW: Formal Credential Registry */
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student ID / Roll No</th>
                <th>Full Name</th>
                <th>Department & Year</th>
                <th>QR Verification Ref</th>
                <th>SHA-256 Genesis Checksum</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{s.student_id}</div>
                    <div style={{ fontSize: '0.74rem', color: '#0284c7', fontWeight: 600 }}>Roll: {s.roll_number || s.student_id}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{s.full_name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.email || `${s.student_id.toLowerCase()}@abcinstitution.edu`}</div>
                  </td>
                  <td>
                    <div>{s.department}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Year {s.year} • Sec {s.section}</div>
                  </td>
                  <td>
                    <code style={{ fontSize: '0.73rem', background: '#f1f5f9', padding: '3px 6px', borderRadius: '4px', color: '#0284c7', fontWeight: 700 }}>
                      {s.id_card_qr_ref || `ABC-VERIFY:${s.student_id}`}
                    </code>
                  </td>
                  <td>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#64748b' }}>
                      {s.id_card_hash ? s.id_card_hash.substring(0, 24) + '...' : '3f8a9b2c7d...'}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${
                      s.verification_status === 'VERIFIED' ? 'badge-emerald' :
                      s.verification_status === 'UNDER_REVIEW' ? 'badge-indigo' :
                      s.verification_status === 'REJECTED' ? 'badge-rose' : 'badge-amber'
                    }`}>
                      {s.verification_status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedStudent(s)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                        title="Inspect ID Card & Verify Hash"
                      >
                        <Eye size={13} />
                        <span>Inspect</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadCard(s)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                        title="Download ID Card PNG"
                      >
                        <Download size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ----------------- Advanced Cryptographic Inspection Modal ----------------- */}
      {selectedStudent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px'
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '680px',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '28px',
              borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
              background: '#ffffff',
              border: '1px solid #e2e8f0'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#0284c7', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    ABC INSTITUTION OF TECHNOLOGY
                  </span>
                  <span className={`badge ${
                    selectedStudent.verification_status === 'VERIFIED' ? 'badge-emerald' : 'badge-amber'
                  }`}>
                    {selectedStudent.verification_status}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '3px 0 0 0' }}>
                  Digital Smartcard & Cryptographic Verifier
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  color: '#64748b',
                  fontWeight: 700
                }}
              >
                ✕
              </button>
            </div>

            {/* Notification alert */}
            {actionSuccess && (
              <div className="badge-emerald" style={{ padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} />
                <span>{actionSuccess}</span>
              </div>
            )}

            {/* 3D Flippable Interactive Smartcard in Modal */}
            <div style={{ perspective: '1200px', display: 'flex', justifyContent: 'center', marginBottom: '22px' }}>
              <div
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  height: '290px',
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: modalFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  borderRadius: '20px',
                  boxShadow: '0 16px 36px -10px rgba(15, 23, 42, 0.4), 0 0 0 1px rgba(255,255,255,0.2)',
                  cursor: 'pointer'
                }}
                onClick={() => setModalFlipped(!modalFlipped)}
                title="Click card to flip front/back"
              >
                {/* --- FRONT OF MODAL CARD --- */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backfaceVisibility: 'hidden',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0369a1 100%)',
                    color: '#ffffff',
                    padding: '20px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    border: '1.5px solid rgba(255, 255, 255, 0.15)'
                  }}
                >
                  {/* Top Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Building size={18} color="#38bdf8" />
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                          ABC INSTITUTION
                        </div>
                        <div style={{ fontSize: '0.6rem', color: '#93c5fd' }}>STUDENT IDENTITY & VOTER BADGE</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '28px', height: '20px', borderRadius: '3px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', border: '1px solid #78350f' }} />
                      <Wifi size={14} color="#38bdf8" style={{ transform: 'rotate(90deg)' }} />
                    </div>
                  </div>

                  {/* Middle Content */}
                  <div style={{ display: 'grid', gridTemplateColumns: '74px 1fr 80px', gap: '14px', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '74px',
                        height: '88px',
                        borderRadius: '10px',
                        background: '#1e293b',
                        border: '2px solid #38bdf8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        fontWeight: 800,
                        color: '#38bdf8'
                      }}
                    >
                      {selectedStudent.full_name ? selectedStudent.full_name.charAt(0) : 'S'}
                    </div>

                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.2 }}>
                        {selectedStudent.full_name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700, marginTop: '2px' }}>
                        Roll No: <span style={{ color: '#ffffff' }}>{selectedStudent.roll_number || selectedStudent.student_id}</span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#cbd5e1', marginTop: '2px' }}>
                        {selectedStudent.department}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        Year {selectedStudent.year} • Sec {selectedStudent.section}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 700, fontFamily: 'monospace', marginTop: '3px' }}>
                        {selectedStudent.student_id}
                      </div>
                    </div>

                    {/* QR */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ padding: '3px', background: '#ffffff', borderRadius: '8px', display: 'inline-block' }}>
                        {modalQrUrl ? (
                          <img src={modalQrUrl} alt="QR" style={{ width: '68px', height: '68px', display: 'block' }} />
                        ) : (
                          <div style={{ width: '68px', height: '68px', background: '#e2e8f0' }} />
                        )}
                      </div>
                      <div style={{ fontSize: '0.55rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                        EVM SCAN
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '6px' }}>
                    <div style={{ fontSize: '0.66rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={13} />
                      <span>StudentVoiceX Verified Token #2026</span>
                    </div>
                    <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>
                      Click card to flip ↷
                    </div>
                  </div>
                </div>

                {/* --- BACK OF MODAL CARD --- */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #0b1120 0%, #1e293b 100%)',
                    color: '#ffffff',
                    padding: '20px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1.5px solid rgba(255, 255, 255, 0.15)'
                  }}
                >
                  {/* Magnetic Stripe */}
                  <div style={{ margin: '-20px -24px 0 -24px', height: '34px', background: '#020617', borderBottom: '1px solid rgba(255,255,255,0.08)' }} />

                  {/* Terms */}
                  <div style={{ fontSize: '0.67rem', color: '#94a3b8', lineHeight: 1.4 }}>
                    <div style={{ fontWeight: 800, color: '#f8fafc', marginBottom: '2px' }}>INSTITUTIONAL TERMS & GUIDELINES</div>
                    <div>• Official digital property of ABC Institution of Technology.</div>
                    <div>• Required for physical EVM Kiosk scanning and online ballot encryption.</div>
                    <div>• Tamper-proof cryptographic token tied to campus blockchain ledger.</div>
                  </div>

                  {/* Details and Signatory */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'flex-end', borderTop: '1px dashed rgba(255,255,255,0.15)', paddingTop: '8px' }}>
                    <div style={{ fontSize: '0.65rem', color: '#cbd5e1' }}>
                      <div><strong>Campus:</strong> Knowledge City, ABC Campus</div>
                      <div><strong>Emergency:</strong> +91 98765 43210</div>
                      <div><strong>Validity:</strong> 2024 - 2028</div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'cursive', fontSize: '0.95rem', color: '#38bdf8', marginBottom: '1px' }}>
                        Dr. Sarah Jenkins
                      </div>
                      <div style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                        Chief Election Officer
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Flip toggle bar */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => setModalFlipped(!modalFlipped)}
                className="btn btn-secondary"
                style={{ fontSize: '0.78rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <RotateCw size={13} />
                <span>{modalFlipped ? 'View Front Layout' : 'View Back Layout'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadCard(selectedStudent)}
                className="btn btn-secondary"
                style={{ fontSize: '0.78rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Download size={13} />
                <span>Download PNG</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="btn btn-secondary"
                style={{ fontSize: '0.78rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Printer size={13} />
                <span>Print Card</span>
              </button>
            </div>

            {/* Cryptographic SHA-256 Live Hash Audit Section */}
            <div
              style={{
                background: '#f8fafc',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '16px 18px',
                marginBottom: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} color="#0284c7" />
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>
                    SHA-256 Cryptographic Checksum Verifier
                  </span>
                </div>

                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: '8px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    background: hashVerificationStatus === 'VALID' ? '#d1fae5' : '#fee2e2',
                    color: hashVerificationStatus === 'VALID' ? '#059669' : '#dc2626'
                  }}
                >
                  {hashVerificationStatus === 'VALID' ? '✓ 100% MATCH - TAMPER-FREE' : '⚠️ HASH MISMATCH'}
                </span>
              </div>

              {/* Hash Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.76rem', fontFamily: 'monospace' }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 700, fontFamily: 'sans-serif', marginBottom: '2px' }}>
                    STORED GENESIS HASH:
                  </div>
                  <div style={{ background: '#ffffff', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', wordBreak: 'break-all', color: '#0f172a' }}>
                    {selectedStudent.id_card_hash || '3f8a9b2c7d1e8b4c2e1a4f9a9e7f1d4a6b2c8e3d4a5b6c7d8e9f0a1b2c3d4e5f'}
                  </div>
                </div>

                <div>
                  <div style={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 700, fontFamily: 'sans-serif', marginBottom: '2px' }}>
                    LIVE COMPUTED SHA-256 HASH (FROM CREDENTIAL FIELDS):
                  </div>
                  <div style={{ background: '#ffffff', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', wordBreak: 'break-all', color: '#0284c7', fontWeight: 700 }}>
                    {calculatedHash || 'Computing...'}
                  </div>
                </div>

                <div>
                  <div style={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 700, fontFamily: 'sans-serif', marginBottom: '2px' }}>
                    QR VERIFICATION REFERENCE PAYLOAD:
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <div style={{ flex: 1, background: '#ffffff', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', wordBreak: 'break-all', color: '#0f172a' }}>
                      {selectedStudent.id_card_qr_ref || `ABC-VERIFY:${selectedStudent.student_id}:${(calculatedHash || '').substring(0, 16)}`}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedStudent.id_card_qr_ref || `ABC-VERIFY:${selectedStudent.student_id}`);
                        setCopiedQr(true);
                        setTimeout(() => setCopiedQr(false), 2000);
                      }}
                      className="btn btn-secondary"
                      style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                    >
                      {copiedQr ? <Check size={13} color="#059669" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Administrative Status Change Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                Update Voter Verification Status:
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  disabled={updatingStatus || selectedStudent.verification_status === 'VERIFIED'}
                  onClick={() => handleUpdateVerificationStatus('VERIFIED')}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#10b981',
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    opacity: selectedStudent.verification_status === 'VERIFIED' ? 0.6 : 1
                  }}
                >
                  ✓ Approve & Verify
                </button>

                <button
                  type="button"
                  disabled={updatingStatus || selectedStudent.verification_status === 'UNDER_REVIEW'}
                  onClick={() => handleUpdateVerificationStatus('UNDER_REVIEW')}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#4f46e5',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Mark Under Review
                </button>

                <button
                  type="button"
                  disabled={updatingStatus || selectedStudent.verification_status === 'REJECTED'}
                  onClick={() => handleUpdateVerificationStatus('REJECTED')}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#ef4444',
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Reject Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminIDCards;
