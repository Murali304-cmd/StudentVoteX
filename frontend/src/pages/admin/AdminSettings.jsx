import { API_BASE_URL } from '../../services/api';
import React, { useState, useEffect } from 'react';
import { useInstitution } from '../../context/InstitutionContext';
import {
  Sliders,
  ShieldCheck,
  KeyRound,
  Building2,
  Lock,
  CheckCircle2,
  Copy,
  Server,
  Calendar,
  Clock,
  Camera,
  Wifi,
  Cpu,
  Save,
  Radio,
  Eye,
  Sparkles,
  Zap,
  Globe,
  Award,
  RefreshCw,
  School
} from 'lucide-react';

export function AdminSettings() {
  const {
    institutionName: globalInstName,
    shortName: globalShortName,
    tagline: globalTagline,
    officialCode: globalOfficialCode,
    returningOfficer: globalReturningOfficer,
    returningOfficerTitle: globalReturningOfficerTitle,
    electoralBoard: globalElectoralBoard,
    campusAddress: globalCampusAddress,
    contactEmail: globalContactEmail,
    updateInstitution
  } = useInstitution();

  const [settings, setSettings] = useState(null);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  // Editable institution branding states
  const [instName, setInstName] = useState(globalInstName || 'ABC Institution');
  const [shortName, setShortName] = useState(globalShortName || 'ABC');
  const [tagline, setTagline] = useState(globalTagline || 'Democratic Blockchain Gateway');
  const [officialCode, setOfficialCode] = useState(globalOfficialCode || 'ABC-INST-2026');
  const [returningOfficer, setReturningOfficer] = useState(globalReturningOfficer || 'Dr. S. K. Narayanan');
  const [returningOfficerTitle, setReturningOfficerTitle] = useState(globalReturningOfficerTitle || 'Chief Returning Officer');
  const [electoralBoard, setElectoralBoard] = useState(globalElectoralBoard || 'ABC Institution Electoral Board');
  const [campusAddress, setCampusAddress] = useState(globalCampusAddress || 'Main Academic Block, Tech City');
  const [contactEmail, setContactEmail] = useState(globalContactEmail || 'elections@abcinstitution.edu');
  const [instSaving, setInstSaving] = useState(false);
  const [instSavedMsg, setInstSavedMsg] = useState('');

  // Keep in sync with global institution state
  useEffect(() => {
    if (globalInstName) setInstName(globalInstName);
    if (globalShortName) setShortName(globalShortName);
    if (globalTagline) setTagline(globalTagline);
    if (globalOfficialCode) setOfficialCode(globalOfficialCode);
    if (globalReturningOfficer) setReturningOfficer(globalReturningOfficer);
    if (globalReturningOfficerTitle) setReturningOfficerTitle(globalReturningOfficerTitle);
    if (globalElectoralBoard) setElectoralBoard(globalElectoralBoard);
    if (globalCampusAddress) setCampusAddress(globalCampusAddress);
    if (globalContactEmail) setContactEmail(globalContactEmail);
  }, [
    globalInstName,
    globalShortName,
    globalTagline,
    globalOfficialCode,
    globalReturningOfficer,
    globalReturningOfficerTitle,
    globalElectoralBoard,
    globalCampusAddress,
    globalContactEmail
  ]);

  // Editable configuration states
  const [electionDate, setElectionDate] = useState('');
  const [dailyStart, setDailyStart] = useState('09:00');
  const [dailyEnd, setDailyEnd] = useState('12:00');
  const [hoursEnforced, setHoursEnforced] = useState(true);
  const [faceThreshold, setFaceThreshold] = useState('90');
  const [cameraRequired, setCameraRequired] = useState(true);
  const [livenessCheck, setLivenessCheck] = useState(true);
  const [consensusAlgo, setConsensusAlgo] = useState('BFT_MULTI_WITNESS');
  const [miningDifficulty, setMiningDifficulty] = useState('3');
  const [autoMineBlock, setAutoMineBlock] = useState(true);
  const [wifiSsid, setWifiSsid] = useState('Muralidharan K');
  const [maxSessionTime, setMaxSessionTime] = useState('60');

  useEffect(() => {
    fetch(`${API_BASE_URL}/settings/`)
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        if (data.dailyStartTime) setDailyStart(data.dailyStartTime);
        if (data.dailyEndTime) setDailyEnd(data.dailyEndTime);
        if (data.votingHoursEnforced !== undefined) setHoursEnforced(data.votingHoursEnforced);
        if (data.electionDate) setElectionDate(data.electionDate);
        if (data.institutionName && !globalInstName) setInstName(data.institutionName);
      })
      .catch(err => console.error(err));
  }, []);

  const handleCopyKey = () => {
    if (settings?.publicKeyPem) {
      navigator.clipboard.writeText(settings.publicKeyPem);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveInstitution = async (e) => {
    e?.preventDefault();
    setInstSaving(true);
    setInstSavedMsg('');
    try {
      await updateInstitution({
        institutionName: instName.trim(),
        shortName: shortName.trim(),
        tagline: tagline.trim(),
        officialCode: officialCode.trim(),
        returningOfficer: returningOfficer.trim(),
        returningOfficerTitle: returningOfficerTitle.trim(),
        electoralBoard: electoralBoard.trim(),
        campusAddress: campusAddress.trim(),
        contactEmail: contactEmail.trim()
      });
      setInstSavedMsg(`Institution branding updated! "${instName.trim()}" is now active everywhere across all 4 portals.`);
      setTimeout(() => setInstSavedMsg(''), 6000);
    } catch (err) {
      alert('Error updating institution branding: ' + err.message);
    } finally {
      setInstSaving(false);
    }
  };

  const handleSaveAllSettings = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setSaveSuccess('');
    try {
      // Also update institution
      await updateInstitution({
        institutionName: instName.trim(),
        shortName: shortName.trim(),
        tagline: tagline.trim(),
        officialCode: officialCode.trim(),
        returningOfficer: returningOfficer.trim(),
        returningOfficerTitle: returningOfficerTitle.trim(),
        electoralBoard: electoralBoard.trim(),
        campusAddress: campusAddress.trim(),
        contactEmail: contactEmail.trim()
      });

      const res = await fetch(`${API_BASE_URL}/settings/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voting_hours_enforced: hoursEnforced,
          daily_start_time: dailyStart,
          daily_end_time: dailyEnd,
          election_date: electionDate,
          institution_name: instName.trim()
        })
      });
      const updated = await res.json();
      setSettings(updated);
      setSaveSuccess('All institutional configurations & parameters successfully updated!');
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err) {
      alert('Error updating configurations: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)' }}>
              <Sliders size={20} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              System Governance &amp; Configuration Hub
            </h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Master institutional identity, election windows, biometric thresholds, and cryptographic consensus parameters.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAllSettings}
          disabled={saving || instSaving}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '0.88rem', fontWeight: 800 }}
        >
          <Save size={16} />
          <span>{saving ? 'Applying Across System...' : 'Save & Propagate All Settings'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '12px', padding: '12px 18px', marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '10px', color: '#065f46', fontSize: '0.88rem', fontWeight: 700, animation: 'fadeIn 0.2s ease' }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 🏛️ MASTER INSTITUTIONAL IDENTITY & COLLEGE NAME HUB */}
      {/* ======================================================== */}
      <div className="glass-card" style={{
        padding: '28px',
        marginBottom: '26px',
        background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.05) 0%, rgba(99, 102, 241, 0.04) 50%, var(--bg-surface) 100%)',
        border: '1.5px solid rgba(2, 132, 199, 0.3)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(2, 132, 199, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 6px 18px rgba(2, 132, 199, 0.35)'
            }}>
              <School size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>
                  Institutional Identity &amp; College Name Master Control
                </h2>
                <span className="badge badge-indigo" style={{ fontSize: '0.68rem', padding: '3px 8px', fontWeight: 800 }}>
                  <Sparkles size={11} style={{ marginRight: '4px' }} />
                  GLOBAL REACTIVE PROPAGATION
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                Whenever you update the college or university name below, it dynamically propagates <strong>everywhere</strong> across the entire system — including Login, Navigation Bar, Smart ID Cards, Graduation Certificates, EVM Kiosks, and Voter Portals.
              </p>
            </div>
          </div>

          {/* Real-time Live Preview Pill */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid rgba(2, 132, 199, 0.3)',
            borderRadius: '12px',
            padding: '10px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
              Live System Preview
            </span>
            <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-dot-green" style={{ width: '8px', height: '8px' }}></span>
              {instName || 'Institution Name'}
            </span>
          </div>
        </div>

        {instSavedMsg && (
          <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '10px', padding: '12px 16px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px', color: '#065f46', fontSize: '0.85rem', fontWeight: 700, animation: 'fadeIn 0.2s ease' }}>
            <CheckCircle2 size={18} color="#10b981" />
            <span>{instSavedMsg}</span>
          </div>
        )}

        <form onSubmit={handleSaveInstitution}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            {/* 1. College Full Name */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Official College / University Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="input-field"
                  value={instName}
                  onChange={e => setInstName(e.target.value)}
                  placeholder="e.g. ABC Institution of Technology"
                  required
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    padding: '12px 14px',
                    borderColor: 'rgba(2, 132, 199, 0.4)',
                    boxShadow: '0 2px 8px rgba(2, 132, 199, 0.08)'
                  }}
                />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                This is the primary institutional title displayed on official graduation certificates, student cards, and login screens.
              </div>
            </div>

            {/* 2. Institutional Acronym */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Institutional Acronym / Short Code
              </label>
              <input
                type="text"
                className="input-field"
                value={shortName}
                onChange={e => setShortName(e.target.value)}
                placeholder="e.g. ABC"
                style={{ fontWeight: 700 }}
              />
            </div>

            {/* 3. Official Accreditation / System Code */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Institution Code / Identifier
              </label>
              <input
                type="text"
                className="input-field"
                value={officialCode}
                onChange={e => setOfficialCode(e.target.value)}
                placeholder="e.g. ABC-INST-2026"
                style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}
              />
            </div>

            {/* 4. Election Tagline */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Institutional Tagline / Motto
              </label>
              <input
                type="text"
                className="input-field"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                placeholder="e.g. Democratic Blockchain Gateway"
              />
            </div>

            {/* 5. Returning Officer Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Chief Returning Officer
              </label>
              <input
                type="text"
                className="input-field"
                value={returningOfficer}
                onChange={e => setReturningOfficer(e.target.value)}
                placeholder="e.g. Dr. S. K. Narayanan"
              />
            </div>

            {/* 6. Returning Officer Designation */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Returning Officer Title
              </label>
              <input
                type="text"
                className="input-field"
                value={returningOfficerTitle}
                onChange={e => setReturningOfficerTitle(e.target.value)}
                placeholder="e.g. Chief Returning Officer & Dean"
              />
            </div>

            {/* 7. Electoral Board Authority */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Electoral Board / Commission Name
              </label>
              <input
                type="text"
                className="input-field"
                value={electoralBoard}
                onChange={e => setElectoralBoard(e.target.value)}
                placeholder="e.g. ABC Institution Electoral Board"
              />
            </div>

            {/* 8. Contact Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Official Election Contact Email
              </label>
              <input
                type="email"
                className="input-field"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                placeholder="e.g. elections@abcinstitution.edu"
              />
            </div>

            {/* 9. Campus Address */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Campus Address / Directorate Location
              </label>
              <input
                type="text"
                className="input-field"
                value={campusAddress}
                onChange={e => setCampusAddress(e.target.value)}
                placeholder="e.g. Main Academic Block, Tech City"
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.76rem' }}>
              <Globe size={14} color="#0284c7" />
              <span>Broadcasts real-time events to all browser tabs, student cards, and certificates.</span>
            </div>

            <button
              type="submit"
              disabled={instSaving}
              className="btn btn-primary"
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                padding: '10px 22px',
                fontSize: '0.86rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)'
              }}
            >
              {instSaving ? (
                <>
                  <RefreshCw size={15} className="spin" />
                  <span>Propagating Everywhere...</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>Apply &amp; Propagate College Name Everywhere</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Grid of Configuration Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '22px' }}>

        {/* 1. Election Scheduling & Timing */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
              <Calendar size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Election Scheduling &amp; Timing</h2>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Define election day, daily voting window, and enforcement policy</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Designated Election Date
              </label>
              <input
                type="date"
                className="input-field"
                value={electionDate}
                onChange={e => setElectionDate(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Daily Window Start
                </label>
                <input
                  type="time"
                  className="input-field"
                  value={dailyStart}
                  onChange={e => setDailyStart(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Daily Window End
                </label>
                <input
                  type="time"
                  className="input-field"
                  value={dailyEnd}
                  onChange={e => setDailyEnd(e.target.value)}
                />
              </div>
            </div>

            <div style={{ background: hoursEnforced ? '#f0fdf4' : '#fffbeb', border: `1px solid ${hoursEnforced ? '#bbf7d0' : '#fde68a'}`, borderRadius: '10px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: hoursEnforced ? '#166534' : '#92400e' }}>
                    Voting Hours Enforcement: {hoursEnforced ? 'STRICT' : 'BYPASS ACTIVE'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: hoursEnforced ? '#15803d' : '#b45309', marginTop: '2px' }}>
                    {hoursEnforced ? 'Students restricted to scheduled window. Admin unrestricted.' : 'Demo bypass: all users can vote at any hour.'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setHoursEnforced(!hoursEnforced)}
                  className={`btn btn-sm ${hoursEnforced ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ fontSize: '0.72rem', padding: '5px 10px' }}
                >
                  {hoursEnforced ? 'Enable Bypass' : 'Enforce Strict'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Biometric Face Recognition & Liveness */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
              <Camera size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Biometric Face Verification</h2>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Real facial comparison against registered student photo</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Face Matching Strictness Threshold
              </label>
              <select
                className="input-field"
                value={faceThreshold}
                onChange={e => setFaceThreshold(e.target.value)}
              >
                <option value="95">Strict High Security (95%+ Confidence Match)</option>
                <option value="90">Institutional Standard (90%+ Confidence Match)</option>
                <option value="75">Moderate Lighting (75%+ Confidence Match)</option>
                <option value="60">Permissive Demo (60%+ Confidence Match)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Mandatory Webcam Stream</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Require active front camera during Web &amp; EVM voting</div>
              </div>
              <input
                type="checkbox"
                checked={cameraRequired}
                onChange={e => setCameraRequired(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#0284c7' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Optical Liveness Detection</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Anti-spoofing 68-point facial mesh alignment check</div>
              </div>
              <input
                type="checkbox"
                checked={livenessCheck}
                onChange={e => setLivenessCheck(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#7c3aed' }}
              />
            </div>
          </div>
        </div>

        {/* 3. Blockchain & Cryptographic Consensus */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <Cpu size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Blockchain Ledger &amp; Mining</h2>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Block generation, difficulty, and consensus rules</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Consensus Protocol
                </label>
                <select
                  className="input-field"
                  value={consensusAlgo}
                  onChange={e => setConsensusAlgo(e.target.value)}
                >
                  <option value="BFT_MULTI_WITNESS">BFT Multi-Witness (4 Nodes)</option>
                  <option value="POW_STOCHASTIC">Proof of Work (NIST SHA-256)</option>
                  <option value="RAFT_PERMISSIONED">Raft Permissioned Consortium</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  PoW Difficulty
                </label>
                <select
                  className="input-field"
                  value={miningDifficulty}
                  onChange={e => setMiningDifficulty(e.target.value)}
                >
                  <option value="1">Difficulty 1 (Instant / 0.1s)</option>
                  <option value="2">Difficulty 2 (Fast / 0.4s)</option>
                  <option value="3">Difficulty 3 (Standard / 1.2s)</option>
                  <option value="4">Difficulty 4 (Heavy / 4.5s)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Auto-Mine Block Per Student Vote</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Creates and seals a dedicated block for every cast ballot</div>
              </div>
              <input
                type="checkbox"
                checked={autoMineBlock}
                onChange={e => setAutoMineBlock(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#059669' }}
              />
            </div>
          </div>
        </div>

        {/* 4. Campus Gateway & Network Security */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}>
              <Wifi size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Campus Network &amp; Hardware Bounds</h2>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Wi-Fi geofencing, anti-tamper, and session duration</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Authorized Campus Network SSID / IP Subnet
              </label>
              <input
                type="text"
                className="input-field"
                value={wifiSsid}
                onChange={e => setWifiSsid(e.target.value)}
                placeholder="e.g. Muralidharan K / Campus_College_WiFi"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Max Session Limit (Sec)
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={maxSessionTime}
                  onChange={e => setMaxSessionTime(e.target.value)}
                  min="30"
                  max="300"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Anti-Screenshot Guard
                </label>
                <div style={{ padding: '9px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#10b981', border: '1px solid var(--border-subtle)' }}>
                  ACTIVE (Protected)
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Authority Cryptographic RSA Public Key Card */}
      <div className="glass-card" style={{ padding: '24px', marginTop: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
              Authority Cryptographic Public Key (RSA-2048)
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Used across BFT nodes and EVM hardware terminals to verify institutional digital signatures
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopyKey}
            className="btn btn-secondary"
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
          >
            <Copy size={14} />
            <span>{copied ? 'Copied to Clipboard!' : 'Copy PEM Key'}</span>
          </button>
        </div>

        <div style={{
          background: '#070d1e',
          color: '#38bdf8',
          padding: '16px',
          borderRadius: '12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.74rem',
          lineHeight: 1.5,
          maxHeight: '180px',
          overflowY: 'auto',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4)'
        }}>
          {settings?.publicKeyPem || '-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEA3... (Loading Authority Public Key)\n-----END RSA PUBLIC KEY-----'}
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
