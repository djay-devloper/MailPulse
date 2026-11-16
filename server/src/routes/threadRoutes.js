import express from 'express';
import memoryStore from '../store/memoryStore.js';
import { triageEmailWithGemini, generateDraftReply } from '../services/geminiService.js';

const router = express.Router();

// GET /api/threads - List threads with filters
router.get('/', (req, res) => {
  try {
    const {
      search,
      provider,
      segment,
      responsibility,
      status,
      isImportant,
      isRead,
      isArchived,
    } = req.query;

    const threads = memoryStore.getAll({
      search,
      provider,
      segment,
      responsibility,
      status,
      isImportant,
      isRead,
      isArchived,
    });

    res.json({ success: true, count: threads.length, data: threads });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/threads/metrics - KPI overview stats & upcoming meetings
router.get('/metrics', (req, res) => {
  try {
    const metrics = memoryStore.getMetrics();
    res.json({ success: true, data: metrics });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/threads/:id - Single thread
router.get('/:id', (req, res) => {
  try {
    const thread = memoryStore.getById(req.params.id);
    if (!thread) {
      return res.status(404).json({ success: false, error: 'Thread not found' });
    }
    res.json({ success: true, data: thread });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/threads/:id - Update generic fields (read, important, archived, status)
router.patch('/:id', (req, res) => {
  try {
    const updated = memoryStore.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Thread not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/threads/:id/override - Manual Responsibility Override Dropdown
router.patch('/:id/override', (req, res) => {
  try {
    const { responsibility, reason } = req.body;
    const thread = memoryStore.getById(req.params.id);
    if (!thread) {
      return res.status(404).json({ success: false, error: 'Thread not found' });
    }

    const aiMetadata = {
      ...thread.aiMetadata,
      responsibility,
      manuallyOverridden: true,
      whyClientNeeded:
        responsibility === 'Client to Reply'
          ? reason || 'Manually routed to Client by Executive Assistant for review.'
          : '',
    };

    const updated = memoryStore.update(req.params.id, { aiMetadata });
    res.json({
      success: true,
      message: `Responsibility overridden to "${responsibility}"`,
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/threads/:id/delegate - Client 1-Click Action: Hand Over to Assistant
router.post('/:id/delegate', (req, res) => {
  try {
    const { handoffNote } = req.body;
    const thread = memoryStore.getById(req.params.id);
    if (!thread) {
      return res.status(404).json({ success: false, error: 'Thread not found' });
    }

    const aiMetadata = {
      ...thread.aiMetadata,
      responsibility: 'Assistant to Reply',
      manuallyOverridden: true,
      handoffNote: handoffNote || 'Client delegated this conversation to Assistant.',
    };

    const updated = memoryStore.update(req.params.id, {
      aiMetadata,
      isRead: true,
    });

    res.json({
      success: true,
      message: 'Successfully handed over to Assistant Dashboard',
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/threads/:id/approve-reply - Approve & Send AI Draft
router.post('/:id/approve-reply', (req, res) => {
  try {
    const { draftBody, senderName = 'Alex Vance' } = req.body;
    const thread = memoryStore.getById(req.params.id);
    if (!thread) {
      return res.status(404).json({ success: false, error: 'Thread not found' });
    }

    const replyMessage = {
      senderName,
      senderEmail: thread.accountEmail || 'alex@founder.vc',
      body: draftBody || thread.aiMetadata?.suggestedDraft || 'Reply confirmed.',
      timestamp: 'Just now',
      isOutgoing: true,
    };

    const updatedMessages = [...(thread.messages || []), replyMessage];
    const updated = memoryStore.update(req.params.id, {
      messages: updatedMessages,
      status: 'Completed',
      isRead: true,
    });

    res.json({
      success: true,
      message: 'Reply approved, sent, and thread marked as Completed',
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/threads/:id/simulate-reply - Simulate New Incoming Reply in Thread
// triggers AI re-evaluation of responsibility based on new message
router.post('/:id/simulate-reply', async (req, res) => {
  try {
    const { senderName, senderEmail, body } = req.body;
    const thread = memoryStore.getById(req.params.id);
    if (!thread) {
      return res.status(404).json({ success: false, error: 'Thread not found' });
    }

    const newMessage = {
      senderName: senderName || thread.senderName,
      senderEmail: senderEmail || thread.senderEmail,
      body: body || 'Can you confirm if you have signed the revised agreement yet?',
      timestamp: 'Just now',
      isOutgoing: false,
    };

    const updatedMessages = [...thread.messages, newMessage];

    // Re-evaluate responsibility with AI
    const customApiKey = req.headers['x-gemini-key'];
    const aiResult = await triageEmailWithGemini(
      {
        subject: thread.subject,
        senderName: newMessage.senderName,
        senderEmail: newMessage.senderEmail,
        body: newMessage.body,
        threadHistory: updatedMessages,
      },
      customApiKey
    );

    const updated = memoryStore.update(req.params.id, {
      messages: updatedMessages,
      isRead: false,
      status: 'Open',
      timestamps: 'Just now',
      aiMetadata: {
        ...aiResult,
        manuallyOverridden: false,
      },
    });

    res.json({
      success: true,
      message: 'New message received and AI re-evaluated responsibility',
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/threads/simulate-new - Live AI Triage Simulator
router.post('/simulate-new', async (req, res) => {
  try {
    const { provider = 'Gmail', senderName, senderEmail, subject, body } = req.body;
    const customApiKey = req.headers['x-gemini-key'];

    const aiResult = await triageEmailWithGemini(
      { senderName, senderEmail, subject, body },
      customApiKey
    );

    const newThread = memoryStore.create({
      provider: provider === 'Outlook' ? 'Outlook' : 'Gmail',
      accountEmail: provider === 'Outlook' ? 'alex@enterprise.io' : 'alex@founder.vc',
      senderName,
      senderEmail,
      subject,
      timestamps: 'Just now',
      isRead: false,
      isImportant: aiResult.segment === 'Important' || aiResult.responsibility === 'Client to Reply',
      isArchived: false,
      status: 'Open',
      messages: [
        {
          senderName,
          senderEmail,
          body,
          timestamp: 'Just now',
          isOutgoing: false,
        },
      ],
      aiMetadata: aiResult,
    });

    res.status(201).json({
      success: true,
      message: 'Email triaged and inserted into inbox successfully',
      data: newThread,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/threads/reset-seed - Reset to pristine 15 seed threads
router.post('/reset-seed', (req, res) => {
  try {
    const threads = memoryStore.resetSeed();
    res.json({
      success: true,
      message: 'Inbox successfully reset to 15 pre-seeded executive threads',
      count: threads.length,
      data: threads,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
