import React from 'react';
import {
  Sparkles,
  RefreshCw,
  Mail,
  SlidersHorizontal,
  Bot,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export const Header = ({
  role,
  setRole,
  connections,
  onOpenOnboarding,
  onOpenSimulation,
  onToggleCopilot,
  isCopilotOpen,
  onResetSeed,
  clientActionCount = 0,
}) => {
  const isGmailConnected = connections?.gmail?.connected;
  const isOutlookConnected = connections?.outlook?.connected;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-6 py-2.5 transition-all">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Live Account Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-brand-500/20">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 tracking-tight text-base">MailPulse</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                  AI EA 2.5
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Executive Email Command & Client Filter</p>
            </div>
          </div>

          <div className="h-5 w-px bg-slate-200 hidden sm:block mx-1" />

          {/* Connected Accounts Pills */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Gmail */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition ${
                isGmailConnected
                  ? 'bg-slate-50 text-slate-700 border-slate-200/90'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
              title="Google Workspace (Gmail) Connected Account"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isGmailConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'
                }`}
              />
              <span className="font-semibold text-slate-900">Gmail</span>
              <span className="text-slate-500 font-mono text-[11px]">alex@founder.vc</span>
            </div>

            {/* Outlook */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition ${
                isOutlookConnected
                  ? 'bg-slate-50 text-slate-700 border-slate-200/90'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
              title="Microsoft 365 (Outlook) Connected Account"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isOutlookConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'
                }`}
              />
              <span className="font-semibold text-slate-900">Outlook</span>
              <span className="text-slate-500 font-mono text-[11px]">alex@enterprise.io</span>
            </div>
          </div>
        </div>

        {/* Center: Role Switcher */}
        <div className="flex items-center justify-center">
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/80 shadow-inner">
            <button
              onClick={() => setRole('assistant')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                role === 'assistant'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="text-sm">👩💼</span>
              <span>Assistant Dashboard</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-brand-50 text-brand-700 font-mono">
                Full Triage
              </span>
            </button>

            <button
              onClick={() => setRole('client')}
              className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                role === 'client'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="text-sm">👔</span>
              <span>Minimalistic Client View</span>
              {clientActionCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                  {clientActionCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 justify-end">
          {/* Simulate Incoming Email button */}
          <button
            onClick={onOpenSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-500/20 active:scale-95 transition"
            title="Simulate incoming emails with live Gemini 2.5 Flash classification"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+ Simulate Incoming Email</span>
            <span className="sm:hidden">+ Simulate</span>
          </button>

          {/* Manage Connections / Onboarding */}
          <button
            onClick={onOpenOnboarding}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-subtle transition"
            title="Manage Gmail & Outlook Accounts"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden xl:inline">Accounts</span>
          </button>

          {/* Reset Seed Button */}
          <button
            onClick={onResetSeed}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition"
            title="Reset to 15 Pristine Seed Threads"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Ask AI Copilot Drawer Button */}
          <button
            onClick={onToggleCopilot}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm ${
              isCopilotOpen
                ? 'bg-slate-900 text-white'
                : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-indigo-600" />
            <span>Ask AI</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
