import React from 'react';
import {
  Star,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Mail,
  UserCheck,
  ChevronRight,
} from 'lucide-react';

export const getResponsibilityBadge = (responsibility) => {
  switch (responsibility) {
    case 'Assistant to Reply':
      return {
        label: 'Assistant to Reply',
        bgColor: 'bg-blue-50 text-blue-700 border-blue-200/90 hover:bg-blue-100',
        dotColor: 'bg-blue-500',
        icon: '👩💼',
      };
    case 'Client to Reply':
      return {
        label: 'Client to Reply',
        bgColor: 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100',
        dotColor: 'bg-amber-500',
        icon: '👔',
      };
    case 'No Reply Needed':
      return {
        label: 'No Reply Needed',
        bgColor: 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/70',
        dotColor: 'bg-slate-400',
        icon: '💤',
      };
    case 'Needs Review':
      return {
        label: 'Needs Review',
        bgColor: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
        dotColor: 'bg-purple-500',
        icon: '⚠️',
      };
    default:
      return {
        label: responsibility || 'General',
        bgColor: 'bg-slate-100 text-slate-700 border-slate-200',
        dotColor: 'bg-slate-400',
        icon: '📧',
      };
  }
};

export const getSegmentBadge = (segment) => {
  switch (segment) {
    case 'Action Required':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'Waiting for Response':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Meetings and Appointments':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Important':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'General':
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200';
  }
};

export const EmailListItem = ({ thread, isSelected, onSelect, onToggleStar }) => {
  const badge = getResponsibilityBadge(thread.aiMetadata?.responsibility);
  const segmentClass = getSegmentBadge(thread.aiMetadata?.segment);

  return (
    <div
      onClick={() => onSelect(thread)}
      className={`group relative p-3.5 rounded-xl cursor-pointer transition-all border text-left ${
        isSelected
          ? 'bg-brand-50/50 border-brand-500 shadow-sm ring-1 ring-brand-500/20'
          : thread.isRead
          ? 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/70'
          : 'bg-white border-slate-200 shadow-subtle hover:border-brand-300 ring-1 ring-slate-100'
      }`}
    >
      {/* Top Row: Sender, Provider, Star, Timestamp */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          {/* Unread indicator */}
          {!thread.isRead && (
            <span
              className="w-2 h-2 rounded-full bg-brand-600 shrink-0"
              title="Unread"
            />
          )}

          {/* Provider Badge */}
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight shrink-0 ${
              thread.provider === 'Gmail'
                ? 'bg-rose-50 text-rose-600 border border-rose-200/80'
                : 'bg-blue-50 text-blue-700 border border-blue-200/80'
            }`}
          >
            {thread.provider}
          </span>

          {/* Sender Name */}
          <span
            className={`text-xs truncate ${
              !thread.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'
            }`}
          >
            {thread.senderName}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Star toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(thread);
            }}
            className="text-slate-300 hover:text-amber-400 p-0.5 transition"
          >
            <Star
              className={`w-3.5 h-3.5 ${
                thread.isImportant ? 'fill-amber-400 text-amber-400' : ''
              }`}
            />
          </button>

          <span className="text-[11px] font-mono text-slate-400">
            {thread.timestamps}
          </span>
        </div>
      </div>

      {/* Subject */}
      <h4
        className={`text-xs line-clamp-1 mb-1.5 ${
          !thread.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-800'
        }`}
      >
        {thread.subject}
      </h4>

      {/* 1-Line AI Summary */}
      <p className="text-[11px] text-slate-500 line-clamp-1 mb-2 font-normal leading-relaxed">
        {thread.aiMetadata?.summary || 'No summary available.'}
      </p>

      {/* Bottom Row: Responsibility Badge, Segment Tag & Dates indicator */}
      <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-100/80">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Prominent Reply Responsibility Badge */}
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border transition ${badge.bgColor}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`} />
            <span>{badge.label}</span>
          </span>

          {/* Segment Tag */}
          <span
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${segmentClass}`}
          >
            {thread.aiMetadata?.segment}
          </span>
        </div>

        {/* Indicators: Dates, Completed, Delegated */}
        <div className="flex items-center gap-1 text-slate-400">
          {thread.aiMetadata?.extractedDates?.length > 0 && (
            <span
              title={`${thread.aiMetadata.extractedDates.length} date/meeting extracted`}
              className="flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200"
            >
              <Calendar className="w-2.5 h-2.5" />
              <span>{thread.aiMetadata.extractedDates.length}</span>
            </span>
          )}

          {thread.status === 'Completed' && (
            <span
              title="Handled / Completed"
              className="flex items-center gap-0.5 text-[10px] text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            </span>
          )}

          {thread.aiMetadata?.manuallyOverridden && (
            <span
              title="Classification manually overridden by assistant or client"
              className="text-[9px] uppercase font-bold text-purple-700 bg-purple-50 px-1 py-0.2 rounded border border-purple-200"
            >
              Overridden
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailListItem;
