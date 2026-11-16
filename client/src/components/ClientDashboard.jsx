import React, { useState } from 'react';
import {
  ShieldAlert,
  Send,
  UserCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Calendar,
  Sparkles,
  MessageSquare,
  AlertCircle,
  FileCheck,
  Zap,
  ArrowRight,
  User,
  Coffee,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from './Toast';

export const ClientDashboard = ({
  threads,
  onThreadUpdated,
}) => {
  const { addToast } = useToast();

  // ONLY threads classified as 'Client to Reply' and Open
  const clientThreads = threads.filter(
    (t) => t.aiMetadata?.responsibility === 'Client to Reply' && t.status === 'Open'
  );

  // Recently Handled by Assistant (for peace of mind)
  const assistantHandledThreads = threads.filter(
    (t) =>
      (t.aiMetadata?.responsibility === 'Assistant to Reply' ||
        t.status === 'Completed' ||
        t.aiMetadata?.responsibility === 'No Reply Needed') &&
      t.status === 'Completed'
  );

  const [expandedThreadIds, setExpandedThreadIds] = useState(new Set());
  const [delegatingThreadId, setDelegatingThreadId] = useState(null);
  const [delegationNote, setDelegationNote] = useState('');
  const [quickReplyThreadId, setQuickReplyThreadId] = useState(null);
  const [quickReplyDraft, setQuickReplyDraft] = useState('');
  const [isHandledOpen, setIsHandledOpen] = useState(false);
  const [submittingAction, setSubmittingAction] = useState(false);

  const toggleThreadExpand = (id) => {
    setExpandedThreadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // 1-Click Action: Hand Over to Assistant (Delegate)
  const handleStartDelegate = (thread) => {
    setDelegatingThreadId(thread.id);
    setDelegationNote('');
  };

  const handleConfirmDelegate = async (threadId) => {
    setSubmittingAction(true);
    try {
      const res = await api.delegateThread(threadId, delegationNote.trim());
      if (res.success) {
        addToast(
          '👩💼 Handed over to Assistant Dashboard. Re-routed to Elena with your note.',
          'success'
        );
        onThreadUpdated(res.data);
        setDelegatingThreadId(null);
      }
    } catch (err) {
      addToast('Failed to delegate thread', 'error');
    } finally {
      setSubmittingAction(false);
    }
  };

  // 1-Click Action: Mark as Handled
  const handleMarkHandled = async (threadId) => {
    try {
      const res = await api.updateThread(threadId, { status: 'Completed', isRead: true });
      if (res.success) {
        addToast('✅ Conversation marked as Handled & removed from your queue', 'success');
        onThreadUpdated(res.data);
      }
    } catch (err) {
      addToast('Failed to mark thread handled', 'error');
    }
  };

  // 1-Click Action: Quick Reply
  const handleStartQuickReply = (thread) => {
    setQuickReplyThreadId(thread.id);
    setQuickReplyDraft(thread.aiMetadata?.suggestedDraft || '');
  };

  const handleSendQuickReply = async (threadId) => {
    if (!quickReplyDraft.trim()) {
      addToast('Reply cannot be empty', 'amber');
      return;
    }
    setSubmittingAction(true);
    try {
      const res = await api.approveReply(threadId, quickReplyDraft.trim(), 'Alex Vance (Client)');
      if (res.success) {
        addToast('🚀 Quick Reply sent and conversation closed!', 'success');
        onThreadUpdated(res.data);
        setQuickReplyThreadId(null);
      }
    } catch (err) {
      addToast('Failed to send reply', 'error');
    } finally {
      setSubmittingAction(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-900 text-slate-100 min-h-0">
      {/* Executive Clean Header */}
      <div className="border-b border-slate-800 bg-slate-950/70 px-4 sm:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">👔</span>
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Client Executive Command
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Alex Vance
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Zero-clutter inbox filter showing <span className="text-white font-semibold">ONLY</span> emails requiring your personal founder signature, board decision, or direct relationship input.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
                <span className="text-slate-400">Action Queue: </span>
                <span className="font-bold text-amber-400 font-mono">
                  {clientThreads.length} Item{clientThreads.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Subtle Peace-of-Mind Bar: Handled by Assistant */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 overflow-hidden">
          <button
            onClick={() => setIsHandledOpen(!isHandledOpen)}
            className="w-full flex items-center justify-between p-3.5 text-xs text-slate-400 hover:text-slate-200 transition"
          >
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>
                <strong className="text-emerald-400 font-semibold">Elena (Executive Assistant)</strong> handled{' '}
                <span className="text-slate-200 font-bold">12 emails</span> in background today (scheduling, vendor quotes, logistics)
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <span>{isHandledOpen ? 'Hide' : 'View handled summary'}</span>
              {isHandledOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </button>

          {isHandledOpen && (
            <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 space-y-2 text-xs">
              <p className="text-slate-400 text-[11px]">
                Elena is automatically triaging, drafting responses, and scheduling meetings on your behalf. These items do not require your attention:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  <span className="text-emerald-400 font-bold block mb-0.5">✓ Scheduled Tim Ferriss Podcast</span>
                  <span className="text-slate-500 text-[11px]">Confirmed next Tuesday 10 AM PST. Studio link added.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  <span className="text-emerald-400 font-bold block mb-0.5">✓ Bloomberg Interview Coordination</span>
                  <span className="text-slate-500 text-[11px]">Coordinating 20-min window for reporter Clara Oswald.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  <span className="text-emerald-400 font-bold block mb-0.5">✓ Ritz-Carlton Offsite Menu & AV</span>
                  <span className="text-slate-500 text-[11px]">Signed offsite catering rider for Dec 14 retreat.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  <span className="text-emerald-400 font-bold block mb-0.5">✓ Reconciled Stripe & AWS Billing</span>
                  <span className="text-slate-500 text-[11px]">Auto-cataloged and sent to QuickBooks accounting.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Client Active Attention List */}
        {clientThreads.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-950/50 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 flex items-center justify-center mx-auto shadow-subtle">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Your Executive Queue is Clear</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              There are currently zero emails requiring your personal signature or intervention. Elena (EA) has full coverage on all remaining inboxes.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>{clientThreads.length} Pending Decision{clientThreads.length !== 1 ? 's' : ''}</span>
              <span className="text-amber-400 font-medium">Sorted by Decision Urgency</span>
            </div>

            {clientThreads.map((thread) => {
              const isExpanded = expandedThreadIds.has(thread.id);
              const isDelegating = delegatingThreadId === thread.id;
              const isQuickReplying = quickReplyThreadId === thread.id;

              return (
                <div
                  key={thread.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/80 hover:border-slate-700/80 transition-all overflow-hidden shadow-elevated"
                >
                  {/* Card Header */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              thread.provider === 'Gmail'
                                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                : 'bg-blue-950 text-blue-300 border border-blue-800'
                            }`}
                          >
                            {thread.provider}
                          </span>
                          <span className="text-xs font-semibold text-slate-300">
                            {thread.senderName}
                          </span>
                          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                            &lt;{thread.senderEmail}&gt;
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white tracking-tight">
                          {thread.subject}
                        </h3>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono text-slate-400 block">
                          {thread.timestamps}
                        </span>
                        {thread.aiMetadata?.extractedDates?.[0] && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-800/80 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{thread.aiMetadata.extractedDates[0].dateTimeText}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* AI Executive Summary */}
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {thread.aiMetadata?.summary}
                    </p>

                    {/* Prominent Callout: Why Your Personal Response is Needed */}
                    <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-100 flex items-start gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <span className="font-bold text-amber-300 block mb-0.5">
                          Why Your Personal Authority is Needed:
                        </span>
                        <p className="text-amber-100/90 leading-relaxed font-medium">
                          {thread.aiMetadata?.whyClientNeeded ||
                            'Requires founder discretion for legal execution, compensation, or critical account retention.'}
                        </p>
                      </div>
                    </div>

                    {/* Expand Thread Toggle */}
                    <div className="pt-1">
                      <button
                        onClick={() => toggleThreadExpand(thread.id)}
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
                      >
                        <span>{isExpanded ? 'Hide conversation history' : `View original thread (${thread.messages?.length || 1} messages)`}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Expanded Thread History */}
                    {isExpanded && (
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 mt-2 animate-in fade-in duration-150">
                        {thread.messages?.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg border text-xs ${
                              msg.isOutgoing
                                ? 'bg-slate-800 border-slate-700 ml-4'
                                : 'bg-slate-950 border-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-bold text-white">
                                {msg.senderName} {msg.isOutgoing ? '(You)' : ''}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {msg.timestamp}
                              </span>
                            </div>
                            <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                              {msg.body}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 1-Click Action Buttons Bar */}
                    <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* 1. Hand Over to Assistant (Delegate) */}
                        <button
                          onClick={() => handleStartDelegate(thread)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                          <span>Hand Over to Assistant (Delegate)</span>
                        </button>

                        {/* 2. Mark as Handled */}
                        <button
                          onClick={() => handleMarkHandled(thread.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Mark as Handled</span>
                        </button>
                      </div>

                      {/* 3. Approve & Send Quick Reply */}
                      <button
                        onClick={() => handleStartQuickReply(thread)}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Review & Send Quick Reply</span>
                      </button>
                    </div>

                    {/* Delegate Note Drawer */}
                    {isDelegating && (
                      <div className="p-4 rounded-xl bg-slate-900 border border-blue-500/40 space-y-3 mt-3 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-300">
                            Delegate to Elena (Assistant) with quick guidance:
                          </span>
                          <button
                            onClick={() => setDelegatingThreadId(null)}
                            className="text-slate-400 hover:text-white text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                        <input
                          type="text"
                          value={delegationNote}
                          onChange={(e) => setDelegationNote(e.target.value)}
                          placeholder={`e.g. "Tell them next Tuesday at 3 PM works, and ask for the final PDF"`}
                          className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleConfirmDelegate(thread.id)}
                            disabled={submittingAction}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition disabled:opacity-50"
                          >
                            {submittingAction ? 'Delegating...' : 'Confirm Handoff to Assistant'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Quick Reply Drawer */}
                    {isQuickReplying && (
                      <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/40 space-y-3 mt-3 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span className="text-xs font-bold text-amber-300">
                              AI-Prepared Response for Alex Vance:
                            </span>
                          </div>
                          <button
                            onClick={() => setQuickReplyThreadId(null)}
                            className="text-slate-400 hover:text-white text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                        <textarea
                          rows={5}
                          value={quickReplyDraft}
                          onChange={(e) => setQuickReplyDraft(e.target.value)}
                          className="w-full text-xs font-sans p-3 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 leading-relaxed focus:border-amber-400"
                        />
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-slate-400">
                            Sends from <span className="font-mono text-slate-300">{thread.accountEmail || 'alex@founder.vc'}</span>
                          </span>
                          <button
                            onClick={() => handleSendQuickReply(thread.id)}
                            disabled={submittingAction}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition disabled:opacity-50"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{submittingAction ? 'Sending...' : 'Approve & Send Now'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
