import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StudentVoiceXLoader } from '../../components/common/StudentVoiceXLoader';
import {
  UserPlus,
  Users,
  Vote,
  PlusCircle,
  Building2,
  FileText,
  Trash2,
  Edit2
} from 'lucide-react';

export function AdminCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const initialForm = {
    election: '',
    candidate_id: '',
    name: '',
    department: 'Information Technology',
    year: 'III',
    section: 'A',
    manifesto: ''
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [candData, elData] = await Promise.all([
        api.candidates.list(),
        api.elections.list()
      ]);
      setCandidates(candData);
      setElections(elData);
      if (elData.length > 0) {
        setFormData(f => ({ ...f, election: elData[0].id }));
      }
    } catch (e) {
      console.error("Error fetching candidates:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.candidates.create(formData);
      setShowModal(false);
      fetchData();
    } catch (e) {
      alert("Error adding candidate: " + e.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Candidate Management
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Official student candidates running for ABC Institution elections.
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <PlusCircle size={16} />
          <span>Add Candidate</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1' }}>
            <StudentVoiceXLoader
              mode="card"
              label="Loading Verified Candidates & Ballots..."
              sublabel="Fetching Candidate Symbols & Department Affiliations..."
            />
          </div>
        ) : candidates.map((cand) => (
          <div key={cand.id} className="glass-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="badge badge-cyan" style={{ fontWeight: 700 }}>
                  {cand.candidate_id}
                </span>
                <span className="badge badge-indigo">
                  {cand.election_title}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #e0f2fe 0%, #c7d2fe 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--cyan-primary)',
                  fontWeight: 800,
                  fontSize: '1.1rem'
                }}>
                  {cand.name.charAt(0)}
                </div>

                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {cand.name}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {cand.department} • Year {cand.year} (Sec {cand.section})
                  </div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginBottom: '12px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>
                  Candidate Manifesto
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.4, fontStyle: 'italic' }}>
                  "{cand.manifesto || 'Committed to ABC Institution excellence and student welfare.'}"
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Ballot Choice Reference</span>
              <span className="badge badge-emerald">Active on Ballot</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '20px'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '520px', padding: '28px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
              Add Candidate
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Election *
                </label>
                <select
                  required
                  className="input-field"
                  value={formData.election}
                  onChange={(e) => setFormData({ ...formData, election: e.target.value })}
                >
                  {elections.map((el) => (
                    <option key={el.id} value={el.id}>{el.title}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Candidate Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="e.g. Devika Raman"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Candidate ID
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. CAN-2026-04"
                    value={formData.candidate_id}
                    onChange={(e) => setFormData({ ...formData, candidate_id: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Department
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Year
                  </label>
                  <select
                    className="input-field"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  >
                    <option value="I">I</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Section
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Candidate Manifesto / Statement
                </label>
                <textarea
                  className="input-field"
                  rows="3"
                  placeholder="Outline key objectives and student representation promises..."
                  value={formData.manifesto}
                  onChange={(e) => setFormData({ ...formData, manifesto: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Register Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
