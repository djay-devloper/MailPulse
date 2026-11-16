const API_BASE = '/api';

function getHeaders() {
  const headers = {
    'Content-Type': 'application/json',
  };
  const customKey = localStorage.getItem('mailpulse_gemini_key');
  if (customKey) {
    headers['x-gemini-key'] = customKey;
  }
  return headers;
}

export const api = {
  // Threads
  async getThreads(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const res = await fetch(`${API_BASE}/threads?${query.toString()}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  async getMetrics() {
    const res = await fetch(`${API_BASE}/threads/metrics`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  async getThreadById(id) {
    const res = await fetch(`${API_BASE}/threads/${id}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  async updateThread(id, updates) {
    const res = await fetch(`${API_BASE}/threads/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async overrideResponsibility(id, responsibility, reason = '') {
    const res = await fetch(`${API_BASE}/threads/${id}/override`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ responsibility, reason }),
    });
    return res.json();
  },

  async delegateThread(id, handoffNote = '') {
    const res = await fetch(`${API_BASE}/threads/${id}/delegate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ handoffNote }),
    });
    return res.json();
  },

  async approveReply(id, draftBody, senderName = 'Alex Vance') {
    const res = await fetch(`${API_BASE}/threads/${id}/approve-reply`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ draftBody, senderName }),
    });
    return res.json();
  },

  async simulateIncomingReply(id, messageData) {
    const res = await fetch(`${API_BASE}/threads/${id}/simulate-reply`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(messageData),
    });
    return res.json();
  },

  async simulateNewThread(threadData) {
    const res = await fetch(`${API_BASE}/threads/simulate-new`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(threadData),
    });
    return res.json();
  },

  async resetSeedData() {
    const res = await fetch(`${API_BASE}/threads/reset-seed`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return res.json();
  },

  // AI & Copilot
  async askCopilot(query, threadId = null, role = 'assistant') {
    const res = await fetch(`${API_BASE}/ai/ask`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ query, threadId, role }),
    });
    return res.json();
  },

  async generateDraft(threadId, tone = 'Professional', customInstructions = '') {
    const res = await fetch(`${API_BASE}/ai/draft`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ threadId, tone, customInstructions }),
    });
    return res.json();
  },

  async previewTriage(emailData) {
    const res = await fetch(`${API_BASE}/ai/preview-triage`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(emailData),
    });
    return res.json();
  },

  // Connections
  async getConnections() {
    const res = await fetch(`${API_BASE}/connections`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  async updateConnection(provider, connected) {
    const res = await fetch(`${API_BASE}/connections/${provider}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ connected }),
    });
    return res.json();
  },

  async syncConnections(provider = null) {
    const res = await fetch(`${API_BASE}/connections/sync`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ provider }),
    });
    return res.json();
  },
};

export default api;
