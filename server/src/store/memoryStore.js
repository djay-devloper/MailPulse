import { SEED_THREADS } from '../data/seedData.js';

class MemoryStore {
  constructor() {
    this.threads = JSON.parse(JSON.stringify(SEED_THREADS));
    this.connectedAccounts = {
      gmail: {
        id: 'gmail-1',
        provider: 'Gmail',
        email: 'alex@founder.vc',
        connected: true,
        lastSynced: new Date().toISOString(),
        threadCount: 7,
      },
      outlook: {
        id: 'outlook-1',
        provider: 'Outlook',
        email: 'alex@enterprise.io',
        connected: true,
        lastSynced: new Date().toISOString(),
        threadCount: 8,
      },
    };
  }

  resetSeed() {
    this.threads = JSON.parse(JSON.stringify(SEED_THREADS));
    return this.threads;
  }

  getAll(filters = {}) {
    let result = [...this.threads];

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.subject.toLowerCase().includes(q) ||
          t.senderName.toLowerCase().includes(q) ||
          t.senderEmail.toLowerCase().includes(q) ||
          (t.aiMetadata && t.aiMetadata.summary.toLowerCase().includes(q)) ||
          t.messages.some((m) => m.body.toLowerCase().includes(q))
      );
    }

    if (filters.provider && filters.provider !== 'All') {
      result = result.filter((t) => t.provider === filters.provider);
    }

    if (filters.responsibility && filters.responsibility !== 'All') {
      result = result.filter(
        (t) => t.aiMetadata && t.aiMetadata.responsibility === filters.responsibility
      );
    }

    if (filters.segment && filters.segment !== 'All') {
      result = result.filter(
        (t) => t.aiMetadata && t.aiMetadata.segment === filters.segment
      );
    }

    if (filters.status && filters.status !== 'All') {
      result = result.filter((t) => t.status === filters.status);
    }

    if (filters.isImportant !== undefined) {
      result = result.filter((t) => t.isImportant === (filters.isImportant === 'true' || filters.isImportant === true));
    }

    if (filters.isRead !== undefined) {
      result = result.filter((t) => t.isRead === (filters.isRead === 'true' || filters.isRead === true));
    }

    if (filters.isArchived !== undefined) {
      result = result.filter((t) => t.isArchived === (filters.isArchived === 'true' || filters.isArchived === true));
    }

    // Default sort: unread first, then by priority / order
    return result;
  }

  getById(id) {
    return this.threads.find((t) => t.id === id || t._id === id);
  }

  update(id, updates) {
    const index = this.threads.findIndex((t) => t.id === id || t._id === id);
    if (index === -1) return null;

    const current = this.threads[index];

    // Deep merge aiMetadata if provided
    let updatedAiMetadata = current.aiMetadata;
    if (updates.aiMetadata) {
      updatedAiMetadata = {
        ...current.aiMetadata,
        ...updates.aiMetadata,
      };
    }

    const updated = {
      ...current,
      ...updates,
      aiMetadata: updatedAiMetadata,
      updatedAt: new Date().toISOString(),
    };

    this.threads[index] = updated;
    return updated;
  }

  create(threadData) {
    const newThread = {
      id: threadData.id || `thread-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamps: threadData.timestamps || 'Just now',
      isRead: threadData.isRead || false,
      isImportant: threadData.isImportant || false,
      isArchived: threadData.isArchived || false,
      status: threadData.status || 'Open',
      messages: threadData.messages || [],
      ...threadData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.threads.unshift(newThread);
    return newThread;
  }

  delete(id) {
    const index = this.threads.findIndex((t) => t.id === id || t._id === id);
    if (index === -1) return false;
    this.threads.splice(index, 1);
    return true;
  }

  getMetrics() {
    const total = this.threads.length;
    const unread = this.threads.filter((t) => !t.isRead && !t.isArchived).length;
    const important = this.threads.filter((t) => t.isImportant && !t.isArchived).length;
    const actionRequired = this.threads.filter(
      (t) => t.aiMetadata?.segment === 'Action Required' && t.status === 'Open'
    ).length;
    const waitingForResponse = this.threads.filter(
      (t) =>
        (t.aiMetadata?.segment === 'Waiting for Response' ||
          t.aiMetadata?.responsibility === 'Waiting for Response') &&
        t.status === 'Open'
    ).length;
    const assistantToReply = this.threads.filter(
      (t) => t.aiMetadata?.responsibility === 'Assistant to Reply' && t.status === 'Open'
    ).length;
    const clientToReply = this.threads.filter(
      (t) => t.aiMetadata?.responsibility === 'Client to Reply' && t.status === 'Open'
    ).length;
    const needsReview = this.threads.filter(
      (t) => t.aiMetadata?.responsibility === 'Needs Review' && t.status === 'Open'
    ).length;
    const completed = this.threads.filter((t) => t.status === 'Completed' || t.isArchived).length;

    // Extract all upcoming meetings & deadlines across all threads
    const upcomingEvents = [];
    for (const t of this.threads) {
      if (t.status === 'Open' && t.aiMetadata?.extractedDates) {
        for (const d of t.aiMetadata.extractedDates) {
          upcomingEvents.push({
            threadId: t.id,
            subject: t.subject,
            senderName: t.senderName,
            title: d.title,
            dateTimeText: d.dateTimeText,
            type: d.type || 'Meeting',
          });
        }
      }
    }

    return {
      total,
      unread,
      important,
      actionRequired,
      waitingForResponse,
      assistantToReply,
      clientToReply,
      needsReview,
      completed,
      upcomingEvents,
    };
  }

  getConnections() {
    return this.connectedAccounts;
  }

  updateConnection(providerKey, updates) {
    if (this.connectedAccounts[providerKey]) {
      this.connectedAccounts[providerKey] = {
        ...this.connectedAccounts[providerKey],
        ...updates,
      };
      return this.connectedAccounts[providerKey];
    }
    return null;
  }
}

export const memoryStore = new MemoryStore();
export default memoryStore;
