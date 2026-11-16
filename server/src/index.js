import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import threadRoutes from './routes/threadRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import connectionRoutes from './routes/connectionRoutes.js';
import memoryStore from './store/memoryStore.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Optional MongoDB Connection with automatic in-memory fallback
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB database successfully.');
    })
    .catch((err) => {
      console.warn(
        '⚠️ MongoDB connection failed, using high-fidelity in-memory store fallback:',
        err.message
      );
    });
} else {
  console.log('ℹ️ Running with automatic in-memory store & 15 pre-seeded executive threads.');
}

// Routes
app.use('/api/threads', threadRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/connections', connectionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MailPulse API',
    model: 'gemini-2.5-flash',
    threadsCount: memoryStore.getAll().length,
    geminiKeyConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend static files from client/dist if built
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('MailPulse API Server is running. Frontend is available via Vite dev server or npm run build.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 MailPulse Server running at http://localhost:${PORT}`);
});

