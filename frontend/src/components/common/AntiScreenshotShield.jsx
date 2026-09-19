import React, { useState, useEffect } from 'react';
import { ShieldAlert, EyeOff, Lock, AlertTriangle } from 'lucide-react';

/**
 * Institutional EVM Anti-Screenshot & Ballot Privacy Shield
 * Protects voter secrecy by:
 * 1. Blocking PrintScreen, Win+Shift+S, DevTools, Ctrl+P, Mac screenshot shortcuts
 * 2. Deploying a full-screen obfuscation privacy curtain on window blur (Snipping tool defeat)
 * 3. Sanitizing the system clipboard with security watermarks
 * 4. Disabling right-click context menu and drag operations
 */
export function AntiScreenshotShield({ onViolation, isActive = true, isPollingActive = false }) {
  const [screenshotAttempted, setScreenshotAttempted] = useState(false);
  const [windowBlurred, setWindowBlurred] = useState(false);
  const [violationMsg, setViolationMsg] = useState('');

  // Wipe clipboard with security watermark
  const wipeClipboard = () => {
    const warningText = '[SECURITY VIOLATION] Screen capture and screenshots are strictly prohibited in EVM Kiosk Mode to protect secret ballot integrity (Institutional Election Guidelines).';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(warningText).catch(() => {});
      }
    } catch (e) {}

    try {
      const el = document.createElement('textarea');
      el.value = warningText;
      el.style.position = 'fixed';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    } catch (e) {}
  };

  const triggerScreenshotShield = (reason = 'Screenshot key combination detected') => {
    wipeClipboard();
    setScreenshotAttempted(true);
    setViolationMsg(reason);
    if (onViolation) {
      onViolation('SCREENSHOT_ATTEMPT_BLOCKED', reason);
    }
    setTimeout(() => {
      setScreenshotAttempted(false);
    }, 3500);
  };

  useEffect(() => {
    if (!isActive) return;

    // Apply active class to body for print blocking
    document.body.classList.add('evm-mode-active');

    const handleKeyDown = (e) => {
      // 1. Physical PrintScreen key
      if (e.key === 'PrintScreen' || e.keyCode === 44 || e.which === 44) {
        e.preventDefault();
        e.stopPropagation();
        triggerScreenshotShield('PrintScreen key pressed.');
        return;
      }

      // 2. Windows Snipping Tool (Win + Shift + S) or Ctrl + Shift + S
      if ((e.shiftKey && (e.metaKey || e.ctrlKey)) && (e.key === 's' || e.key === 'S' || e.code === 'KeyS')) {
        e.preventDefault();
        e.stopPropagation();
        triggerScreenshotShield('Snipping tool shortcut (Shift+S) detected.');
        return;
      }

      // 3. Mac Screenshot shortcuts (Cmd + Shift + 3 / 4 / 5 / 6)
      if (e.metaKey && e.shiftKey && ['3', '4', '5', '6'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        triggerScreenshotShield('macOS screen capture shortcut detected.');
        return;
      }

      // 4. Print Dialog (Ctrl + P / Cmd + P)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P' || e.code === 'KeyP')) {
        e.preventDefault();
        e.stopPropagation();
        triggerScreenshotShield('Page printing is prohibited.');
        return;
      }

      // 5. Save Page (Ctrl + S / Cmd + S)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S' || e.code === 'KeyS') && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        triggerScreenshotShield('Saving EVM terminal page is prohibited.');
        return;
      }

      // 6. Developer Tools (F12, Ctrl+Shift+I/J/C)
      if (e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key))) {
        e.preventDefault();
        e.stopPropagation();
        triggerScreenshotShield('Developer inspection tools are disabled on EVM terminal.');
        return;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'PrintScreen' || e.keyCode === 44 || e.which === 44) {
        wipeClipboard();
        triggerScreenshotShield('PrintScreen key released.');
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleDragStart = (e) => {
      e.preventDefault();
    };

    // Window focus loss (Anti-Snipping Tool & External Screen Grabber Curtain)
    const handleBlur = () => {
      wipeClipboard();
      setWindowBlurred(true);
      if (onViolation && isPollingActive) {
        onViolation('WINDOW_BLUR_SNIP_DEFENSE', 'Window lost focus — privacy curtain engaged.');
      }
    };

    const handleFocus = () => {
      setWindowBlurred(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        wipeClipboard();
        setWindowBlurred(true);
      } else {
        setWindowBlurred(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('dragstart', handleDragStart);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.body.classList.remove('evm-mode-active');
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, isPollingActive]);

  // 1. Direct Screenshot Shortcut Intercept Overlay
  if (screenshotAttempted) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(2, 6, 23, 0.98)',
          backdropFilter: 'blur(30px)',
          zIndex: 999999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          textAlign: 'center',
          padding: '24px',
          animation: 'fadeIn 0.15s ease'
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '2px solid #ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            boxShadow: '0 0 40px rgba(239, 68, 68, 0.4)'
          }}
        >
          <ShieldAlert size={44} color="#ef4444" />
        </div>

        <h1 style={{ color: '#ffffff', fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
          ⛔ SCREENSHOT PROHIBITED
        </h1>

        <p style={{ color: '#fca5a5', fontSize: '1.05rem', maxWidth: '560px', marginTop: '14px', lineHeight: 1.6 }}>
          Voter anonymity and secret ballot laws strictly forbid taking screenshots, photographs, or screen recordings on the EVM terminal.
        </p>

        <div
          style={{
            marginTop: '20px',
            padding: '10px 18px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid #334155',
            borderRadius: '10px',
            color: '#94a3b8',
            fontSize: '0.82rem',
            fontFamily: 'var(--font-mono)'
          }}
        >
          SECURITY PROTOCOL ACTIVE • CLIPBOARD WIPED • AUDIT EVENT LOGGED
        </div>
      </div>
    );
  }

  // 2. Focus-Loss Privacy Curtain (Blocks external snipping tools like Win+Shift+S)
  if (windowBlurred) {
    return (
      <div
        onClick={() => {
          window.focus();
          setWindowBlurred(false);
        }}
        style={{
          position: 'fixed',
          inset: 0,
          background: '#020617',
          zIndex: 999998,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          textAlign: 'center',
          padding: '24px',
          cursor: 'pointer'
        }}
      >
        <div
          style={{
            width: '70px',
            height: '70px',
            borderRadius: '20px',
            background: 'rgba(2, 132, 199, 0.15)',
            border: '2px solid #38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 0 30px rgba(56, 189, 248, 0.3)'
          }}
        >
          <Lock size={36} color="#38bdf8" />
        </div>

        <h2 style={{ color: '#ffffff', fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>
          🔒 EVM PRIVACY SHIELD ACTIVE
        </h2>

        <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '520px', marginTop: '10px', lineHeight: 1.5 }}>
          Screen contents are obscured while application is out of focus or screen capture is active to prevent unauthorized recording.
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            window.focus();
            setWindowBlurred(false);
          }}
          style={{
            marginTop: '22px',
            padding: '12px 28px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            border: 'none',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.92rem',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(2, 132, 199, 0.4)'
          }}
        >
          Resume EVM Voting Session
        </button>

        <div style={{ marginTop: '16px', color: '#64748b', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
          SECURE KIOSK • CLICK ANYWHERE TO RESTORE FOCUS
        </div>
      </div>
    );
  }

  return null;
}

export default AntiScreenshotShield;
