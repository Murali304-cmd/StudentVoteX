import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import { StudentVoiceXLoader } from '../../components/common/StudentVoiceXLoader';
import {
  MessageSquareQuote,
  ThumbsUp,
  ShieldCheck,
  Send,
  PlusCircle,
  HelpCircle,
  CheckCircle2,
  Clock,
  User,
  Sparkles,
  Filter,
  Search,
  Hash,
  X
} from 'lucide-react';

export function StudentTownhall() {
  const { user } = useAuth();
  const { isDark } = useTheme();

  const [loading, setLoading] = useState(true);
  const [townhallData, setTownhallData] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newCategory, setNewCategory] = useState('INFRASTRUCTURE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const fetchTownhall = async () => {
    try {
      const data = await api.student.getTownhallQnA();
      setTownhallData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTownhall();
  }, []);

  const handleUpvote = async (questionId) => {
    try {
      // Optimistic update
      setTownhallData(prev => {
        if (!prev) return prev;
        const updated = prev.questions.map(q => {
          if (q.id === questionId) {
            const nextUpvoted = !q.has_upvoted;
            return {
              ...q,
              has_upvoted: nextUpvoted,
              upvotes: q.upvotes + (nextUpvoted ? 1 : -1)
            };
          }
          return q;
        });
        return { ...prev, questions: updated };
      });

      await api.student.upvoteTownhallQuestion(questionId);
    } catch (e) {
      console.error(e);
      fetchTownhall(); // Rollback if error
    }
  };

  const handlePostQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await api.student.postTownhallQuestion({
        question: newQuestion,
        category: newCategory,
        student_name: user?.full_name || 'Student Voter',
        student_dept: `${user?.department || 'Information Technology'} · Year ${user?.year || 'III'}`
      });

      if (res?.question) {
        setTownhallData(prev => ({
          ...prev,
          questions: [res.question, ...(prev?.questions || [])]
        }));
      }

      setNewQuestion('');
      setIsModalOpen(false);
      setToastMsg('Your question was posted to the candidate townhall!');
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <StudentVoiceXLoader message="Opening Democratic Student Townhall & Candidate AMA..." />;
  }

  const topics = townhallData?.topics || ['ALL', 'INFRASTRUCTURE', 'ACADEMICS', 'CAMPUS_LIFE', 'PLACEMENTS', 'SPORTS'];
  const questions = townhallData?.questions || [];

  const filteredQuestions = questions.filter(q => {
    const matchesTopic = selectedTopic === 'ALL' || q.category === selectedTopic;
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.response && q.response.candidate_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTopic && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Toast Alert */}
      {toastMsg && (
        <div
          style={{
            padding: '12px 20px',
            borderRadius: '12px',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            fontWeight: 700,
            fontSize: '0.86rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'loginFadeUp 0.3s ease'
          }}
        >
          <CheckCircle2 size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hero Header */}
      <div
        className="glass-card"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.12) 0%, rgba(2, 132, 199, 0.10) 100%)',
          border: '1.5px solid rgba(79, 70, 229, 0.28)',
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
            <span className="badge badge-indigo">
              <MessageSquareQuote size={12} />
              <span>OFFICIAL STUDENT AMA FORUM</span>
            </span>
            <span className="badge badge-cyan">
              Verified Candidate Answers
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
            Democratic Townhall &amp; Candidate AMA
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, maxWidth: '680px' }}>
            Direct, verifiable dialogue between students and election candidates. Upvote institutional questions and inspect cryptographically sealed candidate policy pledges.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
          style={{ padding: '12px 20px', fontSize: '0.88rem', borderRadius: '12px' }}
        >
          <PlusCircle size={16} />
          <span>Ask Candidate a Question</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="glass-card"
        style={{
          padding: '16px 20px',
          borderRadius: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          {topics.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedTopic(t)}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: selectedTopic === t ? '1.5px solid #0284c7' : '1px solid var(--border-subtle)',
                background: selectedTopic === t ? 'var(--cyan-light)' : 'transparent',
                color: selectedTopic === t ? '#0284c7' : 'var(--text-secondary)',
                transition: 'all 0.15s ease'
              }}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search questions or candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 14px 8px 34px',
              borderRadius: '10px',
              fontSize: '0.82rem',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface-secondary)',
              color: 'var(--text-primary)'
            }}
          />
        </div>
      </div>

      {/* Question Cards Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {filteredQuestions.length === 0 ? (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <MessageSquareQuote size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
            <div style={{ fontSize: '1rem', fontWeight: 700 }}>No townhall questions found in this category</div>
            <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>Be the first student to post a policy question to the candidates!</div>
          </div>
        ) : (
          filteredQuestions.map(item => (
            <div
              key={item.id}
              className="glass-card"
              style={{
                padding: '24px 28px',
                borderRadius: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              {/* Question Header & Upvote Pill */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 }}>
                  
                  {/* Upvote Button */}
                  <button
                    type="button"
                    onClick={() => handleUpvote(item.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px 12px',
                      borderRadius: '12px',
                      border: item.has_upvoted ? '1.5px solid #0284c7' : '1px solid var(--border-subtle)',
                      background: item.has_upvoted ? 'var(--cyan-light)' : 'var(--bg-surface-secondary)',
                      color: item.has_upvoted ? '#0284c7' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      flexShrink: 0
                    }}
                  >
                    <ThumbsUp size={16} fill={item.has_upvoted ? '#0284c7' : 'none'} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, marginTop: '2px' }}>
                      {item.upvotes}
                    </span>
                  </button>

                  {/* Question Content */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>
                        {item.category.replace('_', ' ')}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        Asked by <strong style={{ color: 'var(--text-primary)' }}>{item.student_name}</strong> ({item.student_dept}) &middot; {item.created_at}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.45 }}>
                      "{item.question}"
                    </h3>
                  </div>
                </div>
              </div>

              {/* Verified Candidate Response Section */}
              {item.response ? (
                <div
                  style={{
                    padding: '18px 20px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)',
                    border: '1px solid var(--border-subtle)',
                    marginLeft: '50px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#0284c7',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.85rem'
                        }}
                      >
                        {item.response.candidate_name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {item.response.candidate_name}
                          </span>
                          <span className="badge badge-emerald" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>
                            <ShieldCheck size={10} /> Candidate Verified
                          </span>
                        </div>
                        <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>
                          {item.response.candidate_role} &middot; Answered {item.response.timestamp}
                        </div>
                      </div>
                    </div>

                    <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#0284c7' }}>
                      Signature: {item.response.signature_hash}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.55 }}>
                    {item.response.text}
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    marginLeft: '50px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'var(--bg-surface-secondary)',
                    border: '1px dashed var(--border-subtle)',
                    fontSize: '0.76rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Clock size={13} />
                  <span>Awaiting official candidate response &middot; Notification dispatched to election council</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Post Question Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '560px',
              padding: '28px',
              borderRadius: '20px',
              background: 'var(--bg-surface)',
              border: '1.5px solid var(--border-medium)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              animation: 'loginFadeUp 0.25s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquareQuote size={20} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Submit Question to Candidates
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePostQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Policy Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.84rem'
                  }}
                >
                  <option value="INFRASTRUCTURE">Campus Infrastructure &amp; Wi-Fi</option>
                  <option value="ACADEMICS">Academics &amp; 24/7 Library Hours</option>
                  <option value="CAMPUS_LIFE">Dining Commons &amp; Hostel Life</option>
                  <option value="PLACEMENTS">Internships &amp; Placements</option>
                  <option value="SPORTS">Sports, Culture &amp; Fest</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Your Question
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ask a specific, constructive question regarding policy, budget, or student welfare..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.84rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newQuestion.trim()}
                  className="btn btn-primary"
                  style={{ padding: '8px 18px', fontSize: '0.84rem' }}
                >
                  <Send size={14} />
                  <span>{isSubmitting ? 'Posting...' : 'Publish Question'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default StudentTownhall;
