import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import AssistantDashboard from './components/AssistantDashboard';
import ClientDashboard from './components/ClientDashboard';
import OnboardingModal from './components/OnboardingModal';
import SimulationModal from './components/SimulationModal';
import AiCopilotDrawer from './components/AiCopilotDrawer';
import { ToastProvider, useToast } from './components/Toast';
import api from './services/api';
import { Bot, Sparkles, RefreshCw } from 'lucide-react';

function AppContent() {
  const { addToast } = useToast();

  const [role, setRole] = useState('assistant'); // 'assistant' | 'client'
  const [threads, setThreads] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [connections, setConnections] = useState(null);
  const [selectedThread, setSelectedThread] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Initial Data Fetch
  const loadData = useCallback(async (preserveSelectedId = null) => {
    try {
      const [threadsRes, metricsRes, connRes] = await Promise.all([
        api.getThreads(),
        api.getMetrics(),
        api.getConnections(),
      ]);

      if (threadsRes.success) {
        setThreads(threadsRes.data);
        if (preserveSelectedId) {
          const matched = threadsRes.data.find((t) => t.id === preserveSelectedId);
          if (matched) setSelectedThread(matched);
        } else if (!selectedThread && threadsRes.data.length > 0) {
          setSelectedThread(threadsRes.data[0]);
        }
      }

      if (metricsRes.success) {
        setMetrics(metricsRes.data);
      }

      if (connRes.success) {
        setConnections(connRes.data);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedThread]);

  useEffect(() => {
    loadData();
  }, []);

  // Update a thread locally and sync metrics
  const handleThreadUpdated = async (updatedThread) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === updatedThread.id ? updatedThread : t))
    );
    if (selectedThread?.id === updatedThread.id) {
      setSelectedThread(updatedThread);
    }
    // Refresh metrics in background
    try {
      const metricsRes = await api.getMetrics();
      if (metricsRes.success) setMetrics(metricsRes.data);
    } catch (e) {
      // ignore
    }
  };

  // Add newly created/triaged thread from simulator
  const handleThreadCreated = (newThread) => {
    setThreads((prev) => [newThread, ...prev]);
    setSelectedThread(newThread);
    loadData(newThread.id);
  };

  // Reset to 15 pristine seed threads
  const handleResetSeed = async () => {
    try {
      const res = await api.resetSeedData();
      if (res.success) {
        setThreads(res.data);
        setSelectedThread(res.data[0] || null);
        addToast('✨ Inbox successfully reset to 15 pre-seeded executive threads', 'success');
        const metricsRes = await api.getMetrics();
        if (metricsRes.success) setMetrics(metricsRes.data);
      }
    } catch (err) {
      addToast('Failed to reset seed data', 'error');
    }
  };

  const clientActionCount = threads.filter(
    (t) => t.aiMetadata?.responsibility === 'Client to Reply' && t.status === 'Open'
  ).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center animate-pulse mb-4 shadow-elevated">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-base font-bold text-white tracking-tight">MailPulse Command Center</h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">Initializing executive inbox triage pipeline...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      {/* Top Persistent Header & Role Switcher */}
      <Header
        role={role}
        setRole={setRole}
        connections={connections}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenSimulation={() => setIsSimulationOpen(true)}
        onToggleCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
        isCopilotOpen={isCopilotOpen}
        onResetSeed={handleResetSeed}
        clientActionCount={clientActionCount}
      />

      {/* Main Role-Specific View */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {role === 'assistant' ? (
          <AssistantDashboard
            threads={threads}
            metrics={metrics}
            selectedThread={selectedThread}
            onSelectThread={(t) => setSelectedThread(t)}
            onThreadUpdated={handleThreadUpdated}
            onResetSeed={handleResetSeed}
          />
        ) : (
          <ClientDashboard
            threads={threads}
            onThreadUpdated={handleThreadUpdated}
          />
        )}
      </main>

      {/* Floating Copilot Button (Quick Access) */}
      {!isCopilotOpen && (
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all group"
          title="Ask AI Copilot about inboxes"
        >
          <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold tracking-tight pr-1">Ask Copilot</span>
        </button>
      )}

      {/* Modals & Drawers */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        connections={connections}
        onConnectionsUpdated={loadData}
      />

      <SimulationModal
        isOpen={isSimulationOpen}
        onClose={() => setIsSimulationOpen(false)}
        onThreadCreated={handleThreadCreated}
      />

      <AiCopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        selectedThread={selectedThread}
        role={role}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
