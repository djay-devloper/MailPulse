import express from 'express';
import memoryStore from '../store/memoryStore.js';
import {
  askInboxCopilot,
  generateDraftReply,
  triageEmailWithGemini,
} from '../services/geminiService.js';

const router = express.Router();

// POST /api/ai/ask - Inbox Copilot Chat
router.post('/ask', async (req, res) => {
  try {
    const { query, threadId, role = 'assistant' } = req.body;
    const customApiKey = req.headers['x-gemini-key'];

    const allThreads = memoryStore.getAll();
    const currentThread = threadId ? memoryStore.getById(threadId) : null;

    const answer = await askInboxCopilot({
      query,
      currentThread,
      allThreads,
      role,
      customApiKey,
    });

    res.json({ success: true, answer });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/ai/draft - Generate or refine reply draft with tone
router.post('/draft', async (req, res) => {
  try {
    const { threadId, tone = 'Professional', customInstructions = '' } = req.body;
    const customApiKey = req.headers['x-gemini-key'];

    const thread = memoryStore.getById(threadId);
    if (!thread) {
      return res.status(404).json({ success: false, error: 'Thread not found' });
    }

    const draft = await generateDraftReply({
      thread,
      tone,
      customInstructions,
      customApiKey,
    });

    res.json({ success: true, draft });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/ai/preview-triage - Real-time triage prediction without saving
router.post('/preview-triage', async (req, res) => {
  try {
    const { senderName, senderEmail, subject, body } = req.body;
    const customApiKey = req.headers['x-gemini-key'];

    const aiResult = await triageEmailWithGemini(
      { senderName, senderEmail, subject, body },
      customApiKey
    );

    res.json({ success: true, result: aiResult });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
