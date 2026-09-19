import React from 'react';
import { CheckCircle2, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export function VerificationProgress({ currentStep, totalSteps = 5, steps = [], onComplete }) {
  const defaultSteps = [
    'Header & State Check',
    'SHA-256 / SHA-3 Hash Verification',
    'Asymmetric Signature Verification',
    'Merkle Proof Tree Inclusion',
    'BFT 2/3+ Multi-Witness Consensus'
  ];

  const activeSteps = steps.length > 0 ? steps : defaultSteps;

  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '16px',
        padding: '16px 18px',
        margin: '16px 0'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="#38bdf8" />
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc' }}>
            CRYPTOGRAPHIC VERIFICATION PIPELINE
          </span>
        </div>
        <span style={{ fontSize: '0.74rem', color: currentStep >= activeSteps.length ? '#10b981' : '#38bdf8', fontWeight: 700 }}>
          {currentStep >= activeSteps.length ? '✓ 100% VERIFIED' : `Step ${currentStep} of ${activeSteps.length}`}
        </span>
      </div>

      {/* Steps List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {activeSteps.map((stepName, idx) => {
          const stepNum = idx + 1;
          const isDone = currentStep > stepNum;
          const isCurrent = currentStep === stepNum;
          const isPending = currentStep < stepNum;

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 12px',
                background: isDone
                  ? 'rgba(16, 185, 129, 0.1)'
                  : isCurrent
                  ? 'rgba(56, 189, 248, 0.15)'
                  : 'rgba(255, 255, 255, 0.02)',
                border: isDone
                  ? '1px solid rgba(16, 185, 129, 0.3)'
                  : isCurrent
                  ? '1px solid rgba(56, 189, 248, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                transition: 'all 0.25s ease'
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: isDone
                    ? '#10b981'
                    : isCurrent
                    ? '#0284c7'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  boxShadow: isCurrent ? '0 0 10px #0284c7' : 'none'
                }}
              >
                {isDone ? <CheckCircle2 size={14} /> : isCurrent ? <RefreshCw size={12} className="spin-slow" /> : stepNum}
              </div>

              <div style={{ flex: 1, fontSize: '0.78rem', fontWeight: isCurrent ? 700 : 500, color: isDone ? '#a7f3d0' : isCurrent ? '#38bdf8' : '#64748b' }}>
                {stepName}
              </div>

              <div style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                {isDone && <span style={{ color: '#10b981' }}>PASSED</span>}
                {isCurrent && <span style={{ color: '#38bdf8' }}>VERIFYING...</span>}
                {isPending && <span style={{ color: '#475569' }}>QUEUED</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VerificationProgress;
