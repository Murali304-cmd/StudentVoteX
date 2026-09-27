/**
 * StudentVoiceX API Service Layer
 * Decentralized Campus Democratic Voting Client
 */
import { emitBackgroundEvent, BG_EVENTS } from './eventBus';

const rawApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
export const API_BASE_URL = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '') + '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = localStorage.getItem('studentvoicex_token') || localStorage.getItem('votanova_token') || localStorage.getItem('votechain_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type');
  let data = null;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    let errorMsg = (data && data.error) || (data && data.detail) || (typeof data === 'string' ? data : 'An API error occurred');
    if (typeof errorMsg === 'string' && errorMsg.includes('<!DOCTYPE html>')) {
      const match = errorMsg.match(/<title>(.*?)<\/title>/i);
      errorMsg = match ? match[1] : `Server Error (${response.status})`;
    }
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  auth: {
    login: async (username, password, mfaCode = '') => {
      const res = await request('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ username, password, mfa_code: mfaCode })
      });
      emitBackgroundEvent(BG_EVENTS.LOGIN_SUCCESS, { user: username });
      return res;
    },
    getMe: (userId) => request(`/auth/me/?userId=${encodeURIComponent(userId)}`),
    enrollMFA: (username) => request('/auth/mfa/enroll/', {
      method: 'POST',
      body: JSON.stringify({ username })
    }),
    verifyMFA: (username, secret, code) => request('/auth/mfa/verify/', {
      method: 'POST',
      body: JSON.stringify({ username, secret, code })
    }),
    registerFIDO2: (username, keyId) => request('/auth/mfa/fido2/', {
      method: 'POST',
      body: JSON.stringify({ username, keyId })
    })
  },

  gateway: {
    checkAccess: (data = {}) => request('/gateway/check-access/', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    getPolicy: () => request('/admin/gateway/policy/'),
    updatePolicy: (data) => request('/admin/gateway/policy/', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    listDevices: () => request('/admin/gateway/devices/'),
    registerDevice: (data) => request('/admin/gateway/devices/', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    deviceAction: (id, action) => request(`/admin/gateway/devices/${id}/action/`, {
      method: 'POST',
      body: JSON.stringify({ action })
    }),
    getTelemetry: () => request('/admin/gateway/telemetry/')
  },

  students: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/admin/students/${query ? '?' + query : ''}`);
    },
    get: (id) => request(`/admin/students/${id}/`),
    create: (data) => request('/admin/students/', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => request(`/admin/students/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => request(`/admin/students/${id}/`, {
      method: 'DELETE'
    })
  },

  verifications: {
    upload: async (data) => {
      const res = await request('/student/id-verification/upload/', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      emitBackgroundEvent(BG_EVENTS.ID_VERIFIED);
      return res;
    },
    ocrScan: async (data) => {
      const res = await request('/student/id-verification/ocr-scan/', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      emitBackgroundEvent(BG_EVENTS.ID_VERIFIED);
      return res;
    },
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/admin/verifications/${query ? '?' + query : ''}`);
    },
    review: async (id, data) => {
      const res = await request(`/admin/verifications/${id}/review/`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      emitBackgroundEvent(BG_EVENTS.ID_VERIFIED);
      return res;
    },
    autoVerifyQR: async () => {
      const res = await request('/admin/verifications/auto-verify-qr/', {
        method: 'POST'
      });
      emitBackgroundEvent(BG_EVENTS.ID_VERIFIED);
      return res;
    }
  },

  elections: {
    list: () => request('/elections/'),
    get: (id) => request(`/elections/${id}/`),
    create: (data) => request('/elections/', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => request(`/elections/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  candidates: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/candidates/${query ? '?' + query : ''}`);
    },
    create: (data) => request('/candidates/', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  voting: {
    initSession: (studentId, electionId) => request('/voting/session-init/', {
      method: 'POST',
      body: JSON.stringify({ student_id: studentId, election_id: electionId })
    }),
    castVote: async (data) => {
      const res = await request('/voting/cast/', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      emitBackgroundEvent(BG_EVENTS.VOTE_CAST, { txId: res?.tx_hash || res?.txId });
      return res;
    }
  },

  security: {
    logEvent: (data) => request('/security/log-event/', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/admin/security-events/${query ? '?' + query : ''}`);
    },
    getThreatAssessment: () => request('/security/ai-threat-assessment/')
  },

  blockchain: {
    getStats: () => request('/blockchain/stats/'),
    getBlocks: () => request('/blockchain/blocks/'),
    getBlock: (index) => request(`/blockchain/blocks/${index}/`),
    getTransactions: (search = '') => request(`/blockchain/transactions/${search ? '?search=' + encodeURIComponent(search) : ''}`),
    getMerkleTree: async (blockIndex) => {
      const res = await request(`/blockchain/merkle-tree/${blockIndex}/`);
      emitBackgroundEvent(BG_EVENTS.MERKLE_VERIFY, { blockIndex });
      return res;
    },
    getNetwork: () => request('/blockchain/network/'),
    mineBlock: async (difficulty = 0) => {
      const res = await request('/blockchain/mine/', {
        method: 'POST',
        body: JSON.stringify({ difficulty })
      });
      emitBackgroundEvent(BG_EVENTS.BLOCK_MINED, { blockIndex: res?.block?.index || res?.index || '1' });
      return res;
    },
    validateChain: async () => {
      const res = await request('/blockchain/validate/');
      emitBackgroundEvent(BG_EVENTS.CHAIN_VALIDATED);
      return res;
    },
    tamperDemo: (action = 'tamper', blockIndex = 1) => request('/blockchain/tamper-demo/', {
      method: 'POST',
      body: JSON.stringify({ action, block_index: blockIndex })
    }),
    verifyReceipt: async (identifier) => {
      const res = await request('/blockchain/verify-receipt/', {
        method: 'POST',
        body: JSON.stringify({ identifier })
      });
      emitBackgroundEvent(BG_EVENTS.MERKLE_VERIFY);
      return res;
    }
  },

  admin: {
    getAuditLogs: () => request('/admin/audit-logs/'),
    getResults: (electionId) => request(`/admin/results/${electionId}/`),
    getRankedChoiceResults: (electionId) => request(`/admin/results/${electionId}/ranked-choice/`)
  },

  evm: {
    verifyVoter: async (identifier) => {
      const res = await request('/evm/verify-voter/', {
        method: 'POST',
        body: JSON.stringify({ identifier })
      });
      emitBackgroundEvent(BG_EVENTS.ID_VERIFIED);
      return res;
    }
  },

  evmStations: {
    list: () => request('/admin/evm-stations/'),
    create: (data) => request('/admin/evm-stations/', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => request(`/admin/evm-stations/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => request(`/admin/evm-stations/${id}/`, {
      method: 'DELETE'
    })
  },

  certificates: {
    getByElection: (electionId) => request(`/elections/${electionId}/certificates/`),
    generate: (electionId) => request(`/elections/${electionId}/certificates/generate/`, {
      method: 'POST'
    }),
    getMyCertificates: () => request('/student/my-certificates/'),
    verify: (certId) => request(`/certificates/verify/${encodeURIComponent(certId)}/`),
    verifyPost: (identifier) => request('/certificates/verify/', {
      method: 'POST',
      body: JSON.stringify({ identifier })
    })
  }
};

// Compatibility aliases
api.verification = api.verifications;
api.audit = {
  list: (params = {}) => api.admin.getAuditLogs(params)
};
api.blockchain.getChain = api.blockchain.getBlocks;
api.blockchain.blocks = api.blockchain.getBlocks;
api.blockchain.transactions = api.blockchain.getTransactions;
api.blockchain.stats = api.blockchain.getStats;
api.blockchain.network = api.blockchain.getNetwork;
api.blockchain.merkleTree = api.blockchain.getMerkleTree;
api.blockchain.validate = api.blockchain.validateChain;
api.blockchain.broadcastTransaction = async (txData) => {
  // Can submit via voting cast or custom audit transaction
  const res = await request('/voting/cast/', {
    method: 'POST',
    body: JSON.stringify(txData)
  });
  emitBackgroundEvent(BG_EVENTS.VOTE_CAST, { txId: res?.tx_hash || res?.txId });
  return res;
};

