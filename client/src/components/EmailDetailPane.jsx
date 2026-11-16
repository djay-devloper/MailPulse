import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  RefreshCw,
  Archive,
  Star,
  Mail,
  User,
  ShieldAlert,
  ArrowRight,
  MessageSquarePlus,
  Sliders,
  Check,
  ChevronDown,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from './Toast';
import { getResponsibilityBadge, getSegmentBadge } from './EmailListItem';

export const EmailDetailPane = ({
  thread,
  onThreadUpdated,
  onSimulateReplyInThread,
}) => {
  const { addToast } = useToast();

  const [draftText, setDraftText] = useState('');
  const [selectedTone, setSelectedTone] = useState('Professional');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [overrideValue, setOverrideValue] = useState(
    thread?.aiMetadata?.responsibility || 'Assistant to Reply'
  );
  const [isSimulateReplyOpen, setIsSimulateReplyOpen] = useState(false);
  const [simulatedReplyBody, setSimulatedReplyBody] = useState('');
  const [isSimulatingIncoming, setIsSimulatingIncoming] = useState(false);

  useEffect(() => {
    if (thread) {
      setDraftText(thread.aiMetadata?.suggestedDraft || '');
      setOverrideValue(thread.aiMetadata?.responsibility || 'Assistant to Reply');
    }
  }, [thread?.id, thread?.aiMetadata?.suggestedDraft, thread?.aiMetadata?.responsibility]);

  if (!thread) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-slate-50/50">
        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-subtle mb-3 text-slate-400">
          <Mail className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-700">No conversation selected</h3>
        <p className="text-xs text-slate-500 max-w-xs mt-1">
          Select an email thread from the inbox to inspect the multi-message history, AI intelligence metadata, and reply composer.
        </p>
      </div>
    );
  }

  const badge = getResponsibilityBadge(thread.aiMetadata?.responsibility);
  const segmentClass = getSegmentBadge(thread.aiMetadata?.segment);

  // Quick Action Handlers
  const handleToggleRead = async () => {
    const updated = await api.updateThread(thread.id, { isRead: !thread.isRead });
    if (updated.success) {
      addToast(thread.isRead ? 'Marked as unread' : 'Marked as read', 'info');
      onThreadUpdated(updated.data);
    }
  };

  const handleToggleImportant = async () => {
    const updated = await api.updateThread(thread.id, { isImportant: !thread.isImportant });
    if (updated.success) {
      addToast(thread.isImportant ? 'Removed star' : 'Marked as Important', 'info');
      onThreadUpdated(updated.data);
    }
  };

  const handleToggleArchive = async () => {
    const updated = await api.updateThread(thread.id, { isArchived: !thread.isArchived });
    if (updated.success) {
      addToast(thread.isArchived ? 'Restored to inbox' : 'Archived conversation', 'info');
      onThreadUpdated(updated.data);
    }
  };

  const handleToggleCompleted = async () => {
    const nextStatus = thread.status === 'Completed' ? 'Open' : 'Completed';
    const updated = await api.updateThread(thread.id, { status: nextStatus });
    if (updated.success) {
      addToast(
        nextStatus === 'Completed'
          ? 'Conversation marked as Handled & Completed'
          : 'Re-opened conversation',
        'success'
      );
      onThreadUpdated(updated.data);
    }
  };

  // Manual Override Handler
  const handleOverrideChange = async (newVal) => {
    setOverrideValue(newVal);
    try {
      const res = await api.overrideResponsibility(thread.id, newVal);
      if (res.success) {
        addToast(`Responsibility manually overridden to "${newVal}"`, 'info');
        onThreadUpdated(res.data);
      }
    } catch (err) {
      addToast('Failed to update responsibility', 'error');
    }
  };

  // Add to Calendar Feedback
  const handleAddToCalendar = (dateObj) => {
    addToast(
      `📅 Added "${dateObj.title}" (${dateObj.dateTimeText}) to Alex's Executive Calendar!`,
      'success'
    );
  };

  // AI Draft Tone Regeneration
  const handleRegenerateDraft = async (tone) => {
    setSelectedTone(tone);
    setIsRegenerating(true);
    try {
      const res = await api.generateDraft(thread.id, tone);
      if (res.success) {
        setDraftText(res.draft);
        addToast(`Draft refreshed with ${tone} tone using Gemini`, 'success');
      }
    } catch (err) {
      addToast('Failed to regenerate draft', 'error');
    } finally {
      setIsRegenerating(false);
    }
  };

  // Approve & Send Reply
  const handleApproveReply = async () => {
    if (!draftText.trim()) {
      addToast('Draft reply cannot be empty', 'amber');
      return;
    }
    setIsApproving(true);
    try {
      const res = await api.approveReply(thread.id, draftText);
      if (res.success) {
        addToast('✅ Reply approved and sent! Thread marked as Completed.', 'success');
        onThreadUpdated(res.data);
      }
    } catch (err) {
      addToast('Failed to approve reply', 'error');
    } finally {
      setIsApproving(false);
    }
  };

  // Simulate Incoming Reply in Thread
  const handleSimulateIncoming = async () => {
    if (!simulatedReplyBody.trim()) {
      addToast('Please enter message text for the simulated reply', 'amber');
      return;
    }
    setIsSimulatingIncoming(true);
    try {
      const res = await api.simulateIncomingReply(thread.id, {
        senderName: thread.senderName,
        senderEmail: thread.senderEmail,
        body: simulatedReplyBody.trim(),
      });
      if (res.success) {
        addToast(
          `New incoming reply received! AI re-evaluated responsibility to: ${res.data.aiMetadata.responsibility}`,
          'success'
        );
        onThreadUpdated(res.data);
        setIsSimulateReplyOpen(false);
        setSimulatedReplyBody('');
      }
    } catch (err) {
      addToast('Failed to simulate reply', 'error');
    } finally {
      setIsSimulatingIncoming(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Top Action & Subject Bar */}
      <div className="p-4 border-b border-slate-200/90 flex flex-wrap items-center justify-between gap-3 bg-white sticky top-0 z-10">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                thread.provider === 'Gmail'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}
            >
              {thread.provider}
            </span>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${segmentClass}`}>
              {thread.aiMetadata?.segment}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Account: {thread.accountEmail || 'alex@founder.vc'}
            </span>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-snug">
            {thread.subject}
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleToggleImportant}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
            title={thread.isImportant ? 'Unstar' : 'Mark Important'}
          >
            <Star
              className={`w-4 h-4 ${
                thread.isImportant ? 'fill-amber-400 text-amber-400' : ''
              }`}
            />
          </button>
          <button
            onClick={handleToggleRead}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
            title={thread.isRead ? 'Mark as Unread' : 'Mark as Read'}
          >
            <Mail className="w-4 h-4" />
          </button>
          <button
            onClick={handleToggleArchive}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
            title={thread.isArchived ? 'Restore to Inbox' : 'Archive'}
          >
            <Archive className="w-4 h-4" />
          </button>
          <button
            onClick={handleToggleCompleted}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
              thread.status === 'Completed'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{thread.status === 'Completed' ? 'Completed' : 'Mark Handled'}</span>
          </button>
        </div>
      </div>

      {/* Main Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
        {/* AI Intelligence Card */}
        <div className="rounded-2xl border border-brand-200/90 bg-gradient-to-br from-brand-50/40 via-white to-indigo-50/30 p-4 shadow-subtle space-y-3.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    AI Intelligence Triage
                  </h4>
                  <span className="text-[10px] bg-brand-100 text-brand-800 font-mono px-1.5 rounded">
                    gemini-2.5-flash
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  Confidence: {((thread.aiMetadata?.confidence || 0.9) * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Manual Responsibility Override Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-600">Override:</span>
              <select
                value={overrideValue}
                onChange={(e) => handleOverrideChange(e.target.value)}
                className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-300 bg-white text-slate-800 shadow-subtle cursor-pointer focus:border-brand-500"
              >
                <option value="Assistant to Reply">👩💼 Assistant to Reply</option>
                <option value="Client to Reply">👔 Client to Reply</option>
                <option value="No Reply Needed">💤 No Reply Needed</option>
                <option value="Needs Review">⚠️ Needs Review</option>
              </select>
            </div>
          </div>

          {/* AI Summary */}
          <div className="p-3 rounded-xl bg-white/90 border border-slate-200/80 shadow-subtle">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Executive Conversation Summary
            </span>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {thread.aiMetadata?.summary}
            </p>
          </div>

          {/* Why Client Needed Callout */}
          {thread.aiMetadata?.responsibility === 'Client to Reply' && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 shadow-subtle">
              <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900 mb-1">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Why Personal Client Authority is Needed:</span>
              </div>
              <p className="text-xs text-amber-900/90 leading-relaxed pl-5">
                {thread.aiMetadata?.whyClientNeeded ||
                  'Requires executive founder authorization for contract execution, board affairs, or critical compensation decisions.'}
              </p>
            </div>
          )}

          {/* Handoff Note if delegated */}
          {thread.aiMetadata?.handoffNote && (
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-950 text-xs">
              <strong className="text-purple-900">Client Delegation Note: </strong>
              <span>{thread.aiMetadata.handoffNote}</span>
            </div>
          )}

          {/* Extracted Dates & Deadlines */}
          {thread.aiMetadata?.extractedDates?.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Extracted Calendar Events & Deadlines:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {thread.aiMetadata.extractedDates.map((d, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white text-xs shadow-subtle"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          d.type === 'Meeting'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : 'bg-rose-50 text-rose-600 border border-rose-200'
                        }`}
                      >
                        {d.type === 'Meeting' ? (
                          <Calendar className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{d.title}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{d.dateTimeText}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddToCalendar(d)}
                      className="ml-2 px-2 py-1 text-[11px] font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 shrink-0 transition"
                    >
                      + Calendar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Multi-Message Thread History */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Thread History ({thread.messages?.length || 1} Messages)
            </h3>

            {/* Simulate Incoming Reply button in thread */}
            <button
              onClick={() => setIsSimulateReplyOpen(!isSimulateReplyOpen)}
              className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800 transition"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>+ Simulate Incoming Message</span>
            </button>
          </div>

          {/* Inline Simulation Drawer */}
          {isSimulateReplyOpen && (
            <div className="p-3.5 rounded-xl border border-brand-300 bg-brand-50/50 space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-900">
                  Simulate New Incoming Reply from {thread.senderName}:
                </span>
                <button
                  onClick={() => setIsSimulateReplyOpen(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <textarea
                rows={2}
                value={simulatedReplyBody}
                onChange={(e) => setSimulatedReplyBody(e.target.value)}
                placeholder={`e.g. "We need your signature before 5 PM today or the term sheet expires."`}
                className="w-full text-xs p-2 rounded-lg border border-brand-200 bg-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleSimulateIncoming}
                  disabled={isSimulatingIncoming}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 transition"
                >
                  {isSimulatingIncoming ? 'Re-evaluating with AI...' : 'Inject & Re-evaluate Triage'}
                </button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-3">
            {thread.messages?.map((msg, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition shadow-subtle ${
                  msg.isOutgoing
                    ? 'bg-slate-50 border-slate-200/80 ml-4 sm:ml-8'
                    : 'bg-white border-slate-200 mr-2'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        msg.isOutgoing
                          ? 'bg-slate-800 text-white'
                          : 'bg-brand-100 text-brand-800'
                      }`}
                    >
                      {msg.senderName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">
                          {msg.senderName}
                        </span>
                        {msg.isOutgoing && (
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-1 rounded font-mono">
                            Outgoing
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">
                        {msg.senderEmail}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {msg.timestamp}
                  </span>
                </div>
                <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap pl-9">
                  {msg.body}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Reply Composer */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-subtle space-y-3.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  AI Reply Composer
                </h4>
                <p className="text-[11px] text-slate-500">
                  Pre-drafted by Gemini 2.5 Flash • Requires explicit approval before sending
                </p>
              </div>
            </div>

            {/* Tone Adjustments */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {['Professional', 'Concise', 'Warm'].map((tone) => (
                <button
                  key={tone}
                  onClick={() => handleRegenerateDraft(tone)}
                  disabled={isRegenerating}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    selectedTone === tone
                      ? 'bg-white text-slate-900 shadow-subtle font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          {/* Draft Textarea */}
          <div className="relative">
            <textarea
              rows={6}
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              placeholder="AI-generated draft reply will appear here..."
              className="w-full text-xs font-sans p-3.5 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white text-slate-800 leading-relaxed"
            />
            {isRegenerating && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center rounded-xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-200">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Refining draft tone with Gemini...</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
            <span className="text-[11px] text-slate-400">
              Sending from <span className="font-mono text-slate-600">{thread.accountEmail || 'alex@founder.vc'}</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRegenerateDraft(selectedTone)}
                disabled={isRegenerating}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 transition"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Regenerate</span>
              </button>

              <button
                onClick={handleApproveReply}
                disabled={isApproving || !draftText.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-500/25 active:scale-95 disabled:opacity-50 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isApproving ? 'Sending...' : 'Approve & Send Reply'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailDetailPane;
