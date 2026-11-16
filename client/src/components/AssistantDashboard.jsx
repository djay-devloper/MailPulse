import React, { useState, useMemo } from 'react';
import {
  Inbox,
  UserCheck,
  User,
  Coffee,
  AlertTriangle,
  Flame,
  Clock,
  Calendar,
  Star,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Filter,
  CheckSquare,
  ArrowUpDown,
  CalendarDays,
  ArrowLeft,
} from 'lucide-react';
import EmailListItem from './EmailListItem';
import EmailDetailPane from './EmailDetailPane';

export const AssistantDashboard = ({
  threads,
  metrics,
  selectedThread,
  onSelectThread,
  onThreadUpdated,
  onResetSeed,
}) => {
  const [activeSegment, setActiveSegment] = useState('All');
  const [activeResponsibility, setActiveResponsibility] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [providerFilter, setProviderFilter] = useState('All');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [importantOnly, setImportantOnly] = useState(false);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  // Filtered threads logic
  const filteredThreads = useMemo(() => {
    return threads.filter((t) => {
      // Archived / Status
      if (activeSegment === 'Completed') {
        if (t.status !== 'Completed' && !t.isArchived) return false;
      } else {
        if (t.status === 'Completed' || t.isArchived) return false;
      }

      // Responsibility sidebar filter
      if (activeResponsibility !== 'All') {
        if (t.aiMetadata?.responsibility !== activeResponsibility) return false;
      }

      // Segment sidebar filter
      if (activeSegment !== 'All' && activeSegment !== 'Completed') {
        if (t.aiMetadata?.segment !== activeSegment) return false;
      }

      // Provider filter
      if (providerFilter !== 'All' && t.provider !== providerFilter) return false;

      // Unread only toggle
      if (unreadOnly && t.isRead) return false;

      // Important only toggle
      if (importantOnly && !t.isImportant) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesSubject = t.subject.toLowerCase().includes(q);
        const matchesSender =
          t.senderName.toLowerCase().includes(q) || t.senderEmail.toLowerCase().includes(q);
        const matchesSummary = t.aiMetadata?.summary?.toLowerCase().includes(q);
        const matchesBody = t.messages?.some((m) => m.body.toLowerCase().includes(q));
        if (!matchesSubject && !matchesSender && !matchesSummary && !matchesBody) return false;
      }

      return true;
    });
  }, [
    threads,
    activeSegment,
    activeResponsibility,
    providerFilter,
    unreadOnly,
    importantOnly,
    searchQuery,
  ]);

  const handleSelectThreadMobile = (thread) => {
    onSelectThread(thread);
    setMobileDetailOpen(true);
  };

  const upcomingEvents = metrics?.upcomingEvents?.slice(0, 4) || [];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
      {/* 1. Overview KPI Bar & Upcoming Meetings Widget */}
      <div className="bg-white border-b border-slate-200/90 px-4 lg:px-6 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-3">
          {/* Total Emails */}
          <button
            onClick={() => {
              setActiveSegment('All');
              setActiveResponsibility('All');
            }}
            className={`p-2.5 rounded-xl border text-left transition ${
              activeSegment === 'All' && activeResponsibility === 'All'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium opacity-80">Total Inbox</span>
              <Inbox className="w-3.5 h-3.5 opacity-70" />
            </div>
            <div className="text-xl font-bold mt-1">{metrics?.total || threads.length}</div>
          </button>

          {/* Assigned to Assistant (Blue) */}
          <button
            onClick={() => {
              setActiveResponsibility('Assistant to Reply');
              setActiveSegment('All');
            }}
            className={`p-2.5 rounded-xl border text-left transition ${
              activeResponsibility === 'Assistant to Reply'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-blue-50/60 border-blue-200 text-blue-900 hover:bg-blue-100/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold">Assistant to Reply</span>
              <span className="text-xs">👩💼</span>
            </div>
            <div className="text-xl font-bold mt-1">
              {metrics?.assistantToReply ||
                threads.filter((t) => t.aiMetadata?.responsibility === 'Assistant to Reply' && t.status === 'Open').length}
            </div>
          </button>

          {/* Client Attention Needed (Amber) */}
          <button
            onClick={() => {
              setActiveResponsibility('Client to Reply');
              setActiveSegment('All');
            }}
            className={`p-2.5 rounded-xl border text-left transition ${
              activeResponsibility === 'Client to Reply'
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : 'bg-amber-50/70 border-amber-300 text-amber-950 hover:bg-amber-100/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold">Client Attention</span>
              <span className="text-xs">👔</span>
            </div>
            <div className="text-xl font-bold mt-1">
              {metrics?.clientToReply ||
                threads.filter((t) => t.aiMetadata?.responsibility === 'Client to Reply' && t.status === 'Open').length}
            </div>
          </button>

          {/* Action Required */}
          <button
            onClick={() => {
              setActiveSegment('Action Required');
              setActiveResponsibility('All');
            }}
            className={`p-2.5 rounded-xl border text-left transition ${
              activeSegment === 'Action Required'
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-rose-50/60 border-rose-200 text-rose-950 hover:bg-rose-100/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold">Action Required</span>
              <Flame className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <div className="text-xl font-bold mt-1">
              {metrics?.actionRequired ||
                threads.filter((t) => t.aiMetadata?.segment === 'Action Required' && t.status === 'Open').length}
            </div>
          </button>

          {/* Waiting for Response */}
          <button
            onClick={() => {
              setActiveSegment('Waiting for Response');
              setActiveResponsibility('All');
            }}
            className={`p-2.5 rounded-xl border text-left transition ${
              activeSegment === 'Waiting for Response'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-indigo-50/60 border-indigo-200 text-indigo-950 hover:bg-indigo-100/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold">Waiting Response</span>
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <div className="text-xl font-bold mt-1">
              {metrics?.waitingForResponse ||
                threads.filter((t) => t.aiMetadata?.segment === 'Waiting for Response' && t.status === 'Open').length}
            </div>
          </button>

          {/* Needs Review */}
          <button
            onClick={() => {
              setActiveResponsibility('Needs Review');
              setActiveSegment('All');
            }}
            className={`p-2.5 rounded-xl border text-left transition ${
              activeResponsibility === 'Needs Review'
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-purple-50/60 border-purple-200 text-purple-950 hover:bg-purple-100/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold">Needs Review</span>
              <AlertTriangle className="w-3.5 h-3.5 text-purple-500" />
            </div>
            <div className="text-xl font-bold mt-1">
              {metrics?.needsReview ||
                threads.filter((t) => t.aiMetadata?.responsibility === 'Needs Review' && t.status === 'Open').length}
            </div>
          </button>

          {/* Handled / Completed */}
          <button
            onClick={() => {
              setActiveSegment('Completed');
              setActiveResponsibility('All');
            }}
            className={`p-2.5 rounded-xl border text-left transition ${
              activeSegment === 'Completed'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-emerald-50/60 border-emerald-200 text-emerald-950 hover:bg-emerald-100/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold">Handled</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-xl font-bold mt-1">
              {metrics?.completed ||
                threads.filter((t) => t.status === 'Completed' || t.isArchived).length}
            </div>
          </button>
        </div>

        {/* Upcoming Meetings & Deadlines Strip */}
        {upcomingEvents.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 shrink-0 flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5 text-brand-600" />
              <span>Upcoming Dates:</span>
            </span>
            <div className="flex items-center gap-2">
              {upcomingEvents.map((evt, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    const match = threads.find((t) => t.id === evt.threadId);
                    if (match) onSelectThread(match);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-brand-400 cursor-pointer text-slate-700 shrink-0 transition"
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      evt.type === 'Deadline' ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                  />
                  <span className="font-semibold text-slate-800">{evt.title}</span>
                  <span className="text-slate-400 font-mono text-[10px]">({evt.dateTimeText})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Work Area: 3-Pane Desktop Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Pane 1: Left Sidebar Segments (Hidden on small mobile, visible on lg) */}
        <aside className="w-56 shrink-0 border-r border-slate-200/90 bg-white p-3 hidden md:flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            {/* Classification Sections */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                Reply Responsibility
              </span>
              <div className="space-y-0.5">
                {[
                  {
                    id: 'All',
                    label: 'All Inboxes',
                    icon: Inbox,
                    count: threads.filter((t) => t.status === 'Open').length,
                  },
                  {
                    id: 'Assistant to Reply',
                    label: 'Assistant to Reply',
                    icon: UserCheck,
                    badgeColor: 'bg-blue-100 text-blue-800',
                    count: threads.filter(
                      (t) => t.aiMetadata?.responsibility === 'Assistant to Reply' && t.status === 'Open'
                    ).length,
                  },
                  {
                    id: 'Client to Reply',
                    label: 'Client to Reply',
                    icon: User,
                    badgeColor: 'bg-amber-100 text-amber-800',
                    count: threads.filter(
                      (t) => t.aiMetadata?.responsibility === 'Client to Reply' && t.status === 'Open'
                    ).length,
                  },
                  {
                    id: 'No Reply Needed',
                    label: 'No Reply Needed',
                    icon: Coffee,
                    badgeColor: 'bg-slate-100 text-slate-700',
                    count: threads.filter(
                      (t) => t.aiMetadata?.responsibility === 'No Reply Needed' && t.status === 'Open'
                    ).length,
                  },
                  {
                    id: 'Needs Review',
                    label: 'Needs Review (Flagged)',
                    icon: AlertTriangle,
                    badgeColor: 'bg-purple-100 text-purple-800',
                    count: threads.filter(
                      (t) => t.aiMetadata?.responsibility === 'Needs Review' && t.status === 'Open'
                    ).length,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    activeResponsibility === item.id && activeSegment !== 'Completed';
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveResponsibility(item.id);
                        if (activeSegment === 'Completed') setActiveSegment('All');
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                        isActive
                          ? 'bg-brand-50 text-brand-700 font-semibold'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                          item.badgeColor || 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Smart Category Segments */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                Triage Segments
              </span>
              <div className="space-y-0.5">
                {[
                  { id: 'Action Required', label: 'Action Required', icon: Flame },
                  { id: 'Waiting for Response', label: 'Waiting for Response', icon: Clock },
                  { id: 'Meetings and Appointments', label: 'Meetings & Dates', icon: Calendar },
                  { id: 'Important', label: 'Important', icon: Star },
                  { id: 'General', label: 'General', icon: Inbox },
                  { id: 'Completed', label: 'Completed / Handled', icon: CheckCircle2 },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSegment === item.id;
                  const count =
                    item.id === 'Completed'
                      ? threads.filter((t) => t.status === 'Completed' || t.isArchived).length
                      : threads.filter(
                          (t) => t.aiMetadata?.segment === item.id && t.status === 'Open'
                        ).length;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSegment(item.id);
                        if (item.id === 'Completed') setActiveResponsibility('All');
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                        isActive
                          ? 'bg-brand-50 text-brand-700 font-semibold'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.2 rounded bg-slate-50">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reset Seed Button in sidebar footer */}
          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={onResetSeed}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition"
              title="Reset all threads back to the 15 original seed conversations"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset 15 Seed Threads</span>
            </button>
          </div>
        </aside>

        {/* Pane 2: Middle Email List */}
        <div
          className={`w-full lg:w-[420px] xl:w-[460px] shrink-0 border-r border-slate-200/90 flex flex-col bg-white ${
            mobileDetailOpen ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Search & Filter Header */}
          <div className="p-3 border-b border-slate-200/90 space-y-2.5 bg-slate-50/50">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sender, subject, keywords..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:border-brand-500"
              />
            </div>

            {/* Provider Filter Pills & Toggles */}
            <div className="flex items-center justify-between gap-1 text-xs">
              {/* Provider Pills */}
              <div className="inline-flex p-0.5 bg-slate-200/70 rounded-lg text-[11px] font-semibold">
                {['All', 'Gmail', 'Outlook'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setProviderFilter(p)}
                    className={`px-2 py-0.5 rounded-md transition ${
                      providerFilter === p
                        ? 'bg-white text-slate-900 shadow-subtle'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Unread & Starred toggles */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setUnreadOnly(!unreadOnly)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium border transition ${
                    unreadOnly
                      ? 'bg-brand-50 text-brand-700 border-brand-300 font-semibold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Unread
                </button>
                <button
                  onClick={() => setImportantOnly(!importantOnly)}
                  className={`p-1 rounded-md border transition ${
                    importantOnly
                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                      : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
                  }`}
                  title="Starred Only"
                >
                  <Star className={`w-3.5 h-3.5 ${importantOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* List Count Header */}
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Showing {filteredThreads.length} conversation{filteredThreads.length !== 1 ? 's' : ''}</span>
            <span>
              {activeResponsibility !== 'All' ? activeResponsibility : activeSegment}
            </span>
          </div>

          {/* Email Cards List */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
            {filteredThreads.length === 0 ? (
              <div className="text-center py-12 px-4 text-slate-400">
                <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold text-slate-600">No emails match filters</p>
                <p className="text-[11px] text-slate-400 mt-1">Try resetting search or filters</p>
              </div>
            ) : (
              filteredThreads.map((thread) => (
                <EmailListItem
                  key={thread.id}
                  thread={thread}
                  isSelected={selectedThread?.id === thread.id}
                  onSelect={() => handleSelectThreadMobile(thread)}
                  onToggleStar={async (t) => {
                    const res = await onThreadUpdated({
                      ...t,
                      isImportant: !t.isImportant,
                    });
                  }}
                />
              ))
            )}
          </div>
        </div>

        {/* Pane 3: Right Split-Pane Email Detail */}
        <div
          className={`flex-1 flex flex-col min-w-0 bg-white ${
            mobileDetailOpen ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Mobile Back Button */}
          {mobileDetailOpen && (
            <div className="lg:hidden p-2 border-b border-slate-200 bg-slate-50 flex items-center">
              <button
                onClick={() => setMobileDetailOpen(false)}
                className="flex items-center gap-1 text-xs font-semibold text-slate-700 px-2 py-1 rounded bg-white border border-slate-200"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Inbox List</span>
              </button>
            </div>
          )}

          <EmailDetailPane
            thread={selectedThread}
            onThreadUpdated={onThreadUpdated}
          />
        </div>
      </div>
    </div>
  );
};

export default AssistantDashboard;
