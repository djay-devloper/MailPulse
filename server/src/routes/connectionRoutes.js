import express from 'express';
import memoryStore from '../store/memoryStore.js';

const router = express.Router();

// GET /api/connections - List connected accounts
router.get('/', (req, res) => {
  try {
    const connections = memoryStore.getConnections();
    res.json({ success: true, data: connections });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/connections/:provider - Update connection status
router.patch('/:provider', (req, res) => {
  try {
    const { provider } = req.params;
    const { connected } = req.body;
    const updated = memoryStore.updateConnection(provider.toLowerCase(), {
      connected: !!connected,
      lastSynced: new Date().toISOString(),
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Provider not found' });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/connections/sync - Trigger simulated sync
router.post('/sync', (req, res) => {
  try {
    const { provider } = req.body;
    const now = new Date().toISOString();

    if (provider) {
      memoryStore.updateConnection(provider.toLowerCase(), {
        connected: true,
        lastSynced: now,
      });
    } else {
      memoryStore.updateConnection('gmail', { connected: true, lastSynced: now });
      memoryStore.updateConnection('outlook', { connected: true, lastSynced: now });
    }

    const metrics = memoryStore.getMetrics();
    res.json({
      success: true,
      message: 'Email accounts synchronized and AI triage re-indexed',
      data: {
        connections: memoryStore.getConnections(),
        metrics,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
