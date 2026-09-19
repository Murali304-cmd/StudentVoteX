/**
 * StudentVoiceX Event Bus for Real-Time Background & System Visual FX
 * Connects React frontend user actions & Django backend responses to visual cues
 */

export const BG_EVENTS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  ID_VERIFIED: 'ID_VERIFIED',
  VOTE_CAST: 'VOTE_CAST',
  BLOCK_MINED: 'BLOCK_MINED',
  TX_CONFIRMED: 'TX_CONFIRMED',
  MERKLE_VERIFY: 'MERKLE_VERIFY',
  BFT_CONSENSUS: 'BFT_CONSENSUS',
  CHAIN_VALIDATED: 'CHAIN_VALIDATED',
  SECURITY_ALERT: 'SECURITY_ALERT',
  PIPELINE_PULSE: 'PIPELINE_PULSE'
};

const EVENT_NAME = 'svx-bg-event';

/**
 * Emit a background animation event across the application
 * @param {string} type - Event type from BG_EVENTS
 * @param {object} payload - Optional extra metadata (e.g. blockIndex, txHash, studentId)
 */
export function emitBackgroundEvent(type, payload = {}) {
  if (typeof window === 'undefined') return;
  try {
    const event = new CustomEvent(EVENT_NAME, {
      detail: {
        type,
        timestamp: Date.now(),
        ...payload
      }
    });
    window.dispatchEvent(event);
  } catch (err) {
    console.warn('[EventBus] Failed to emit event:', err);
  }
}

/**
 * Subscribe to background animation events
 * @param {Function} handler - Callback taking the event detail
 * @returns {Function} Unsubscribe cleanup function
 */
export function subscribeBackgroundEvent(handler) {
  if (typeof window === 'undefined') return () => {};
  
  const listener = (event) => {
    if (event.detail && typeof handler === 'function') {
      handler(event.detail);
    }
  };

  window.addEventListener(EVENT_NAME, listener);
  return () => {
    window.removeEventListener(EVENT_NAME, listener);
  };
}
