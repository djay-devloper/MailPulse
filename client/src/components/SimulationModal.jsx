import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  Zap,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  FileText,
  User,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from './Toast';

const PRESET_SCENARIOS = [
  {
    name: '💰 Series C Lead Term Sheet (Client)',
    provider: 'Gmail',
    senderName: 'David Sacks',
    senderEmail: 'dsacks@craftventures.com',
    subject: 'Craft Ventures Series C Lead Term Sheet - Sign-off required by 4 PM PST',
    body: 'Alex,\n\nWe are pleased to submit our lead term sheet for MailPulse\'s $45M Series C at a $320M pre-money valuation. We are taking 1 board seat and granting a 12% employee option pool refresh.\n\nOur investment committee requires your personal countersignature on the DocuSign link before 4:00 PM PST today so we can reserve the capital allocation.\n\nCongrats on the incredible traction!\nDavid',
  },
  {
    name: '🎙️ TechCrunch Founder Feature (Assistant)',
    provider: 'Outlook',
    senderName: 'Alex Wilhelm',
    senderEmail: 'alex.wilhelm@techcrunch.com',
    subject: 'TechCrunch Disrupt Mainstage Speaker & Podcast interview scheduling',
    body: 'Hi Alex and Team,\n\nTechCrunch Disrupt wants to invite Alex to speak on the AI Infrastructure mainstage in San Francisco this October, plus record a 30-min Equity podcast episode.\n\nCould your executive assistant reach out with Alex\'s availability for a 20-min pre-interview next Tuesday or Wednesday?\n\nBest,\nAlex Wilhelm, TechCrunch',
  },
  {
    name: '⚠️ Cloud Infrastructure Anomaly (Needs Review)',
    provider: 'Outlook',
    senderName: 'Datadog Alert Manager',
    senderEmail: 'alerts@datadog.com',
    subject: 'CRITICAL ALERT: Pinecone Vector Database latency spike (p99 > 1800ms)',
    body: 'Triggered monitor: [Production-US-West-2] Pinecone Vector DB query latency exceeding critical threshold.\n\nCurrent: 1,842ms (Threshold: 200ms)\nImpact: 14% of semantic search queries failing or timing out.\nAction: Requires immediate triage from engineering leadership to assess if index sharding is needed.',
  },
];

export const SimulationModal = ({ isOpen, onClose, onThreadCreated }) => {
  const { addToast } = useToast();
  const [provider, setProvider] = useState('Gmail');
  const [senderName, setSenderName] = useState('David Sacks');
  const [senderEmail, setSenderEmail] = useState('dsacks@craftventures.com');
  const [subject, setSubject] = useState(
    'Craft Ventures Series C Lead Term Sheet - Sign-off required by 4 PM PST'
  );
  const [body, setBody] = useState(
    'Alex,\n\nWe are pleased to submit our lead term sheet for MailPulse\'s $45M Series C at a $320M pre-money valuation. We are taking 1 board seat and granting a 12% employee option pool refresh.\n\nOur investment committee requires your personal countersignature on the DocuSign link before 4:00 PM PST today so we can reserve the capital allocation.\n\nCongrats on the incredible traction!\nDavid'
  );

  const [previewResult, setPreviewResult] = useState(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    setProvider(preset.provider);
    setSenderName(preset.senderName);
    setSenderEmail(preset.senderEmail);
    setSubject(preset.subject);
    setBody(preset.body);
    setPreviewResult(null);
  };

  const handlePreviewTriage = async () => {
    if (!subject.trim() || !body.trim()) {
      addToast('Please provide a subject and email body to test triage', 'amber');
      return;
    }
    setIsPreviewing(true);
    try {
      const res = await api.previewTriage({
        provider,
        senderName,
        senderEmail,
        subject,
        body,
      });
      if (res.success) {
        setPreviewResult(res.result);
        addToast('Live Gemini AI Triage preview computed!', 'success');
      }
    } catch (err) {
      addToast('Preview calculation failed', 'error');
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleInjectIntoInbox = async () => {
    if (!subject.trim() || !body.trim()) {
      addToast('Please provide a subject and body', 'amber');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await api.simulateNewThread({
        provider,
        senderName,
        senderEmail,
        subject,
        body,
      });
      if (res.success) {
        addToast(
          `Incoming email triaged as "${res.data.aiMetadata.responsibility}" and added to inbox!`,
          'success'
        );
        onThreadCreated(res.data);
        onClose();
      }
    } catch (err) {
      addToast('Failed to inject thread', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Live AI Triage Simulator</h2>
              <p className="text-xs text-slate-500">
                Simulate an incoming email and watch Gemini classify responsibility in real time
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select a Preset Scenario:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PRESET_SCENARIOS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(p)}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-brand-500 text-left transition text-xs font-medium text-slate-800 shadow-subtle"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
              >
                <option value="Gmail">Gmail (alex@founder.vc)</option>
                <option value="Outlook">Outlook (alex@enterprise.io)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Sender Name</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Sender Email</label>
              <input
                type="text"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Email Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Email Body Content</label>
            <textarea
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white leading-relaxed"
            />
          </div>

          {/* Preview Triage Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviewTriage}
              disabled={isPreviewing}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isPreviewing ? 'Analyzing...' : 'Preview AI Triage Classification'}</span>
            </button>
          </div>

          {/* Live Preview Box */}
          {previewResult && (
            <div className="p-4 rounded-xl border border-brand-200 bg-brand-50/40 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Classification:</span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      previewResult.responsibility === 'Client to Reply'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : previewResult.responsibility === 'Assistant to Reply'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : previewResult.responsibility === 'Needs Review'
                        ? 'bg-purple-100 text-purple-800 border border-purple-300'
                        : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {previewResult.responsibility}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    ({(previewResult.confidence * 100).toFixed(0)}% confidence)
                  </span>
                </div>
                <span className="text-xs font-semibold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                  {previewResult.segment}
                </span>
              </div>

              <div>
                <p className="text-xs text-slate-700">
                  <strong className="text-slate-900">Summary: </strong>
                  {previewResult.summary}
                </p>
                {previewResult.whyClientNeeded && (
                  <p className="text-xs text-amber-900 mt-1.5 p-2 rounded bg-amber-50 border border-amber-200">
                    <strong className="text-amber-950">Why Client Needed: </strong>
                    {previewResult.whyClientNeeded}
                  </p>
                )}
              </div>

              {previewResult.suggestedDraft && (
                <div>
                  <span className="text-[11px] font-bold text-slate-600 block mb-1">
                    AI Prepared Draft:
                  </span>
                  <pre className="text-[11px] bg-white p-2.5 rounded-lg border border-slate-200 text-slate-800 font-sans whitespace-pre-wrap">
                    {previewResult.suggestedDraft}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>
          <button
            onClick={handleInjectIntoInbox}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-500/20 disabled:opacity-50 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Injecting & Indexing...' : 'Inject into Inbox & Apply Triage'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimulationModal;
