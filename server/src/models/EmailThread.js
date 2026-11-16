import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderName: { type: String, required: true },
  senderEmail: { type: String, required: true },
  body: { type: String, required: true },
  timestamp: { type: String, required: true },
  isOutgoing: { type: Boolean, default: false },
});

const extractedDateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  dateTimeText: { type: String, required: true },
  type: { type: String, enum: ['Meeting', 'Deadline'], default: 'Meeting' },
});

const emailThreadSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    provider: { type: String, enum: ['Gmail', 'Outlook'], required: true },
    accountEmail: { type: String, default: 'alex@founder.vc' },
    senderName: { type: String, required: true },
    senderEmail: { type: String, required: true },
    subject: { type: String, required: true },
    timestamps: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    isImportant: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    status: { type: String, enum: ['Open', 'Completed'], default: 'Open' },
    messages: [messageSchema],
    aiMetadata: {
      responsibility: {
        type: String,
        enum: ['Assistant to Reply', 'Client to Reply', 'No Reply Needed', 'Needs Review'],
        required: true,
      },
      confidence: { type: Number, min: 0, max: 1, default: 0.9 },
      segment: {
        type: String,
        enum: [
          'Action Required',
          'Waiting for Response',
          'Meetings and Appointments',
          'Important',
          'General',
        ],
        default: 'General',
      },
      summary: { type: String, default: '' },
      whyClientNeeded: { type: String, default: '' },
      extractedDates: [extractedDateSchema],
      suggestedDraft: { type: String, default: '' },
      manuallyOverridden: { type: Boolean, default: false },
      handoffNote: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export const EmailThread =
  mongoose.models.EmailThread || mongoose.model('EmailThread', emailThreadSchema);
export default EmailThread;
