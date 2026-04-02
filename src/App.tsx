import React, { useState, useEffect } from 'react';
import { Activity, Users, MessageSquare, Settings, Play, Square, Database, Key, Hash, Phone, Minus, Maximize2, X, Twitter, HelpCircle, TreePine, TreeDeciduous, Trees, Palmtree, Leaf, Sprout, Flower, Flower2, Squirrel, Rabbit, Bird, Cat, Dog, Fish, Snail, PawPrint, Bug, Clover, Sun, Cloud, Moon, Star, Zap, Flame, Droplets, Wind, Shell, RefreshCw, Target, Plus, Search, Shield, Globe, Cpu, Lock } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeActions, setActiveActions] = useState({
    scraper: false,
    listener: false,
    operator: false,
    engagement: false,
    twitter: false
  });
  const [modal, setModal] = useState<{ isOpen: boolean, title: string, message: string, onConfirm: () => void } | null>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      addToast('App is already installed or your browser does not support installation.', 'success');
    }
  };

  const handleDownloadWindows = () => {
    addToast('To run on Windows: 1. Export to ZIP (AI Studio menu) 2. Extract 3. Run "build_installer.bat" inside.', 'success');
  };
  const [logs, setLogs] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [toasts, setToasts] = useState<{id: number, message: string, type: 'success' | 'error'}[]>([]);

  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  // Forms
  const [newSession, setNewSession] = useState({ name: '', apiId: '', apiHash: '', phoneNumber: '' });
  const [authCode, setAuthCode] = useState({ sessionId: null, code: '', password: '' });
  const [newKeyword, setNewKeyword] = useState('');
  const [newGroup, setNewGroup] = useState({ groupId: '', name: '' });
  const [operatorConfig, setOperatorConfig] = useState({ sessionId: '', template: '{Hey|Hi|Hello}, saw you in the airdrop group. {Are you farming|Have you checked out} farmdash.one?', maxPerDay: 15 });
  const [scrapeConfig, setScrapeConfig] = useState({ sessionId: '', groupId: '' });
  const [listenerConfig, setListenerConfig] = useState({ sessionId: '' });
  const [engagementConfig, setEngagementConfig] = useState({ sessionId: '', target: '', action: 'react', emoji: '👍' });
  const [twitterConfig, setTwitterConfig] = useState({ account: 'Account 1', target: '', action: 'like', content: '' });
  const [advancedConfig, setAdvancedConfig] = useState({
    multiAccount: false,
    maxAccounts: 5,
    proxyEnabled: false,
    proxyHost: '',
    proxyPort: '',
    proxyUser: '',
    proxyPass: '',
    proxyType: 'socks5',
    antiDetection: true,
    randomDelays: true,
    minDelay: 30,
    maxDelay: 120,
    maxScrapePerGroup: 500,
    blacklistEnabled: true,
    warmupEnabled: false,
    scheduleEnabled: false,
    startTime: '09:00',
    endTime: '18:00'
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [logsRes, sessionsRes, keywordsRes, groupsRes, usersRes] = await Promise.all([
        fetch('/api/logs').then(r => r.json()),
        fetch('/api/sessions').then(r => r.json()),
        fetch('/api/keywords').then(r => r.json()),
        fetch('/api/groups').then(r => r.json()),
        fetch('/api/users').then(r => r.json())
      ]);
      setLogs(Array.isArray(logsRes) ? logsRes : []);
      setSessions(Array.isArray(sessionsRes) ? sessionsRes : []);
      setKeywords(Array.isArray(keywordsRes) ? keywordsRes : []);
      setGroups(Array.isArray(groupsRes) ? groupsRes : []);
      setUsers(Array.isArray(usersRes) ? usersRes : []);
    } catch (e) {
      console.error("Failed to fetch data", e);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newSession, apiId: Number(newSession.apiId) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create session');
      if (data.id) {
        setAuthCode({ ...authCode, sessionId: data.id });
        setNewSession({ name: '', apiId: '', apiHash: '', phoneNumber: '' });
        addToast('Session created, awaiting auth code.', 'success');
      }
      fetchData();
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySession = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`/api/sessions/${authCode.sessionId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneCode: authCode.code, password: authCode.password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to verify session');
      setAuthCode({ sessionId: null, code: '', password: '' });
      addToast('Session authenticated successfully!', 'success');
      fetchData();
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = (id: number) => {
    setModal({
      isOpen: true,
      title: 'Delete Session',
      message: 'Are you sure you want to delete this session? This action cannot be undone.',
      onConfirm: async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error('Failed to delete session');
          addToast('Session deleted', 'success');
          fetchData();
        } catch (err: any) {
          addToast(err.message, 'error');
        } finally {
          setIsLoading(false);
          setModal(null);
        }
      }
    });
  };

  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: newKeyword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add keyword');
      setNewKeyword('');
      addToast('Keyword added', 'success');
      fetchData();
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGroup)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add group');
      setNewGroup({ groupId: '', name: '' });
      addToast('Group added', 'success');
      fetchData();
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartScraper = async () => {
    if (!scrapeConfig.sessionId || !scrapeConfig.groupId) {
      addToast('Please select a session and a group', 'error');
      return;
    }
    setActiveActions(prev => ({ ...prev, scraper: true }));
    try {
      const res = await fetch('/api/actions/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: Number(scrapeConfig.sessionId), groupId: scrapeConfig.groupId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start scraper');
      addToast('Scraper started successfully', 'success');
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setActiveActions(prev => ({ ...prev, scraper: false }));
    }
  };

  const handleStartListener = async () => {
    if (!listenerConfig.sessionId) {
      addToast('Please select a session', 'error');
      return;
    }
    setActiveActions(prev => ({ ...prev, listener: true }));
    try {
      const res = await fetch('/api/actions/start-listener', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: Number(listenerConfig.sessionId) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start listener');
      addToast('Listener started successfully', 'success');
    } catch (err: any) {
      addToast(err.message, 'error');
      setActiveActions(prev => ({ ...prev, listener: false }));
    }
  };

  const handleStopListener = async () => {
    try {
      const res = await fetch('/api/actions/stop-listener', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to stop listener');
      addToast('Listener stopped', 'success');
      setActiveActions(prev => ({ ...prev, listener: false }));
    } catch (err: any) {
      addToast(err.message, 'error');
    }
  };

  const handleStartOperator = async () => {
    if (!operatorConfig.sessionId || !operatorConfig.template) {
      addToast('Please select a session and enter a template', 'error');
      return;
    }
    setActiveActions(prev => ({ ...prev, operator: true }));
    try {
      const res = await fetch('/api/actions/start-operator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId: Number(operatorConfig.sessionId), 
          template: operatorConfig.template, 
          maxPerDay: Number(operatorConfig.maxPerDay) 
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start operator');
      addToast('Operator started successfully', 'success');
    } catch (err: any) {
      addToast(err.message, 'error');
      setActiveActions(prev => ({ ...prev, operator: false }));
    }
  };

  const handleStopOperator = async () => {
    try {
      const res = await fetch('/api/actions/stop-operator', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to stop operator');
      addToast('Operator stopped', 'success');
      setActiveActions(prev => ({ ...prev, operator: false }));
    } catch (err: any) {
      addToast(err.message, 'error');
    }
  };

  const handleRunEngagement = async () => {
    if (!engagementConfig.sessionId || !engagementConfig.target) {
      addToast('Please select a session and a target', 'error');
      return;
    }
    setActiveActions(prev => ({ ...prev, engagement: true }));
    try {
      const res = await fetch('/api/actions/engage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId: Number(engagementConfig.sessionId), 
          target: engagementConfig.target,
          action: engagementConfig.action,
          emoji: engagementConfig.emoji
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to run engagement');
      addToast(`Successfully executed ${engagementConfig.action} on ${engagementConfig.target}`, 'success');
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setActiveActions(prev => ({ ...prev, engagement: false }));
    }
  };

  const handleTwitterAction = async () => {
    if (!twitterConfig.target) {
      addToast('Please enter a target', 'error');
      return;
    }
    setActiveActions(prev => ({ ...prev, twitter: true }));
    try {
      const res = await fetch('/api/twitter/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(twitterConfig)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to execute Twitter action');
      addToast(data.message || `Successfully executed ${twitterConfig.action}`, 'success');
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setActiveActions(prev => ({ ...prev, twitter: false }));
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-black text-[#d8f3dc] font-mono flex flex-col selection:bg-[#52b788] selection:text-black crt">
      {/* Desktop Title Bar */}
      <div className="h-10 bg-[#06140f] border-b-4 border-[#95d5b2] flex items-center px-4 drag-region shrink-0 justify-between">
        <div className="flex space-x-2 no-drag">
          <button className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 flex items-center justify-center group">
            <X size={8} className="text-black opacity-0 group-hover:opacity-100" />
          </button>
          <button className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 flex items-center justify-center group">
            <Minus size={8} className="text-black opacity-0 group-hover:opacity-100" />
          </button>
          <button className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 flex items-center justify-center group">
            <Maximize2 size={8} className="text-black opacity-0 group-hover:opacity-100" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center space-x-3 px-8 overflow-hidden text-[#95d5b2] opacity-80">
          <span className="font-['Indie_Flower'] text-xs text-[#52b788] opacity-80 mr-4 whitespace-nowrap">I made this =)</span>
          <TreePine size={14} />
          <Bug size={14} />
          <Flower size={14} />
          <Squirrel size={14} />
          <Leaf size={14} />
          <Clover size={14} />
          <TreeDeciduous size={14} />
          <Flower2 size={14} />
          <Rabbit size={14} />
          <Sprout size={14} />
          <Bird size={14} />
          <Trees size={14} />
          <Cat size={14} />
          <Palmtree size={14} />
          <Dog size={14} />
          <Fish size={14} />
          <Snail size={14} />
          <PawPrint size={14} />
          <Sun size={14} />
          <Cloud size={14} />
          <Moon size={14} />
          <Star size={14} />
          <Zap size={14} />
          <Flame size={14} />
          <Droplets size={14} />
          <Wind size={14} />
          <Shell size={14} />
          <Clover size={14} />
          <Flower size={14} />
          <Bug size={14} />
        </div>
        <div className="flex items-center space-x-2 no-drag">
          <button 
            onClick={fetchData}
            className="p-2 hover:bg-[#1b4332] rounded-lg transition-colors text-[#95d5b2] hover:text-[#d8f3dc]"
            title="Refresh Data"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button className="p-2 hover:bg-[#1b4332] rounded-lg transition-colors text-[#95d5b2] hover:text-[#d8f3dc]">
            <Settings size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Modal Overlay */}
        {modal && modal.isOpen && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-8 max-w-md w-full shadow-[8px_8px_0px_0px_#95d5b2]">
              <div className="flex items-center space-x-3 mb-4 text-[#d8f3dc]">
                <HelpCircle size={24} className="text-[#52b788]" />
                <h3 className="text-xl font-bold">{modal.title}</h3>
              </div>
              <p className="text-[#95d5b2] mb-8 leading-relaxed">{modal.message}</p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => setModal(null)}
                  className="flex-1 bg-black border-4 border-[#95d5b2] text-[#d8f3dc] font-bold py-2 rounded-lg hover:bg-[#1b4332]/30 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={modal.onConfirm}
                  className="flex-1 bg-rose-500 border-4 border-[#95d5b2] text-black font-bold py-2 rounded-lg hover:bg-rose-600 transition-colors shadow-[2px_2px_0px_0px_#95d5b2] active:translate-y-[1px] active:shadow-none"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Global Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-[90] flex items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-auto">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-[#52b788] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(82,183,136,0.3)]"></div>
              <span className="text-[#52b788] font-bold tracking-widest uppercase text-xs animate-pulse">Processing...</span>
            </div>
          </div>
        )}

        {/* Toast Notifications */}
        <div className="absolute top-12 right-4 z-50 flex flex-col gap-2 no-drag">
          {toasts.map(toast => (
            <div key={toast.id} className={`px-4 py-3 rounded-lg shadow-[4px_4px_0px_0px_#95d5b2] border-4 flex items-center gap-3 transition-all ${toast.type === 'error' ? 'bg-rose-950/80 border-[#95d5b2] text-rose-400' : 'bg-[#06140f] border-[#95d5b2] text-[#52b788]'}`}>
              <div className="text-sm font-medium">{toast.message}</div>
              <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="opacity-50 hover:opacity-100">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="w-64 bg-[#06140f] border-r-4 border-[#95d5b2] flex flex-col shrink-0">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-[#d8f3dc] tracking-tight">
              AutoPROMO
            </h1>
            <p className="text-xs text-[#74c69d] mt-1 font-medium">Automation Suite</p>
          </div>
          
          <nav className="flex-1 px-4 space-y-2">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-[#1b4332] text-[#d8f3dc]' : 'text-[#95d5b2] hover:bg-[#1b4332]/50 hover:text-[#d8f3dc]'}`}>
              <Activity size={18} />
              <span className="font-medium">Dashboard</span>
            </button>
            <button onClick={() => setActiveTab('sessions')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'sessions' ? 'bg-[#1b4332] text-[#d8f3dc]' : 'text-[#95d5b2] hover:bg-[#1b4332]/50 hover:text-[#d8f3dc]'}`}>
              <Key size={18} />
              <span className="font-medium">Sessions</span>
            </button>
            <button onClick={() => setActiveTab('targets')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'targets' ? 'bg-[#1b4332] text-[#d8f3dc]' : 'text-[#95d5b2] hover:bg-[#1b4332]/50 hover:text-[#d8f3dc]'}`}>
              <Hash size={18} />
              <span className="font-medium">Targets & Keywords</span>
            </button>
            <button onClick={() => setActiveTab('users')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-[#1b4332] text-[#d8f3dc]' : 'text-[#95d5b2] hover:bg-[#1b4332]/50 hover:text-[#d8f3dc]'}`}>
              <Users size={18} />
              <span className="font-medium">Scraped Users</span>
            </button>
            <button onClick={() => setActiveTab('operator')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'operator' ? 'bg-[#1b4332] text-[#d8f3dc]' : 'text-[#95d5b2] hover:bg-[#1b4332]/50 hover:text-[#d8f3dc]'}`}>
              <MessageSquare size={18} />
              <span className="font-medium">Operator (Auto-DM)</span>
            </button>
            <button onClick={() => setActiveTab('engagement')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'engagement' ? 'bg-[#1b4332] text-[#d8f3dc]' : 'text-[#95d5b2] hover:bg-[#1b4332]/50 hover:text-[#d8f3dc]'}`}>
              <Play size={18} />
              <span className="font-medium">TG Engagement</span>
            </button>
            <button onClick={() => setActiveTab('twitter')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'twitter' ? 'bg-[#1b4332] text-[#d8f3dc]' : 'text-[#95d5b2] hover:bg-[#1b4332]/50 hover:text-[#d8f3dc]'}`}>
              <Twitter size={18} />
              <span className="font-medium">Twitter (X) Auto</span>
            </button>
            <button onClick={() => setActiveTab('advanced')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'advanced' ? 'bg-[#1b4332] text-[#d8f3dc]' : 'text-[#95d5b2] hover:bg-[#1b4332]/50 hover:text-[#d8f3dc]'}`}>
              <Shield size={18} />
              <span className="font-medium">Advanced Mode</span>
            </button>
            <button onClick={() => setActiveTab('instructions')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'instructions' ? 'bg-[#1b4332] text-[#d8f3dc]' : 'text-[#95d5b2] hover:bg-[#1b4332]/50 hover:text-[#d8f3dc]'}`}>
              <HelpCircle size={18} />
              <span className="font-medium">Instructions</span>
            </button>
            <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-[#1b4332] text-[#d8f3dc]' : 'text-[#95d5b2] hover:bg-[#1b4332]/50 hover:text-[#d8f3dc]'}`}>
              <Settings size={18} />
              <span className="font-medium">App Settings</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-black p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-6 shadow-lg shadow-black/80 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Users size={80} />
                  </div>
                  <h3 className="text-[#95d5b2] text-sm font-bold uppercase tracking-widest mb-2">Active Sessions</h3>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-4xl font-bold text-[#d8f3dc]">{sessions.filter(s => s.status === 'active').length}</p>
                    <span className="text-xs text-[#52b788] font-mono">/ {sessions.length} TOTAL</span>
                  </div>
                  <div className="mt-4 h-1 bg-black rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#52b788] transition-all duration-1000" 
                      style={{ width: `${sessions.length ? (sessions.filter(s => s.status === 'active').length / sessions.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-6 shadow-lg shadow-black/80 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Target size={80} />
                  </div>
                  <h3 className="text-[#95d5b2] text-sm font-bold uppercase tracking-widest mb-2">Scraped Users</h3>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-4xl font-bold text-[#d8f3dc]">{users.length}</p>
                    <span className="text-xs text-[#52b788] font-mono">+{Math.floor(users.length * 0.1)} NEW</span>
                  </div>
                  <p className="text-[10px] text-[#74c69d] mt-4 font-mono uppercase">Ready for engagement</p>
                </div>

                <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-6 shadow-lg shadow-black/80 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <MessageSquare size={80} />
                  </div>
                  <h3 className="text-[#95d5b2] text-sm font-bold uppercase tracking-widest mb-2">Total Outreach</h3>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-4xl font-bold text-[#d8f3dc]">{users.filter(u => u.contacted).length}</p>
                    <span className="text-xs text-[#52b788] font-mono">
                      {users.length ? Math.round((users.filter(u => u.contacted).length / users.length) * 100) : 0}% RATE
                    </span>
                  </div>
                  <div className="mt-4 flex space-x-1">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i < (users.length && users.filter(u => u.contacted).length / users.length * 10) ? 'bg-[#52b788]' : 'bg-black'}`}></div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-6 shadow-lg shadow-black/80">
                  <h3 className="text-lg font-bold text-[#d8f3dc] mb-4 flex items-center">
                    <Activity size={18} className="mr-2 text-[#52b788]" /> Recent Activity
                  </h3>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {logs.length > 0 ? logs.slice(0, 10).map((log, i) => (
                      <div key={i} className="flex items-start space-x-3 text-xs border-l-2 border-[#1b4332] pl-3 py-1">
                        <span className="text-[#74c69d] font-mono shrink-0">[{new Date(log.created_at).toLocaleTimeString()}]</span>
                        <span className="text-[#95d5b2]">{log.message}</span>
                      </div>
                    )) : (
                      <p className="text-[#74c69d] text-sm italic">No recent activity logs found.</p>
                    )}
                  </div>
                </div>

                <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-6 shadow-lg shadow-black/80">
                  <h3 className="text-lg font-bold text-[#d8f3dc] mb-4 flex items-center">
                    <Zap size={18} className="mr-2 text-[#52b788]" /> Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setActiveTab('sessions')} className="p-4 bg-black border-2 border-[#1b4332] rounded-lg hover:border-[#52b788] transition-all group text-left">
                      <Plus size={20} className="text-[#52b788] mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[#d8f3dc] font-bold block text-sm">Add Session</span>
                      <span className="text-[#95d5b2] text-[10px] uppercase">Connect Telegram</span>
                    </button>
                    <button onClick={() => setActiveTab('targets')} className="p-4 bg-black border-2 border-[#1b4332] rounded-lg hover:border-[#52b788] transition-all group text-left">
                      <Search size={20} className="text-[#52b788] mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[#d8f3dc] font-bold block text-sm">Find Users</span>
                      <span className="text-[#95d5b2] text-[10px] uppercase">Scrape Groups</span>
                    </button>
                    <button onClick={() => setActiveTab('operator')} className="p-4 bg-black border-2 border-[#1b4332] rounded-lg hover:border-[#52b788] transition-all group text-left">
                      <Play size={20} className="text-[#52b788] mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[#d8f3dc] font-bold block text-sm">Run Operator</span>
                      <span className="text-[#95d5b2] text-[10px] uppercase">Auto-DM Campaign</span>
                    </button>
                    <button onClick={() => setActiveTab('twitter')} className="p-4 bg-black border-2 border-[#1b4332] rounded-lg hover:border-[#52b788] transition-all group text-left">
                      <Twitter size={20} className="text-[#52b788] mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[#d8f3dc] font-bold block text-sm">Twitter Auto</span>
                      <span className="text-[#95d5b2] text-[10px] uppercase">Social Engagement</span>
                    </button>
                  </div>
                  <div className="mt-6 pt-6 border-t-2 border-[#1b4332] flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-[#52b788] flex items-center justify-center text-black font-bold text-xs">MW</div>
                      <div>
                        <p className="text-[10px] text-[#d8f3dc] font-bold">Creator</p>
                        <p className="text-[8px] text-[#95d5b2] uppercase tracking-widest">chillwinston789</p>
                      </div>
                    </div>
                    <span className="font-['Indie_Flower'] text-sm text-[#52b788]">I made this =)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-[#d8f3dc]">Session Management</h2>
              
              <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-6 shadow-lg shadow-black/80">
                <h3 className="text-lg font-medium text-[#d8f3dc] mb-4">Add New Telegram Account</h3>
                {authCode.sessionId ? (
                  <form onSubmit={handleVerifySession} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-[#95d5b2] mb-1">Verification Code</label>
                      <input type="text" value={authCode.code} onChange={e => setAuthCode({...authCode, code: e.target.value})} className="w-full bg-black border-4 border-[#95d5b2] rounded-lg px-4 py-2 text-[#d8f3dc] focus:outline-none focus:border-[#52b788] transition-colors" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#95d5b2] mb-1">2FA Password (if any)</label>
                      <input type="password" value={authCode.password} onChange={e => setAuthCode({...authCode, password: e.target.value})} className="w-full bg-black border-4 border-[#95d5b2] rounded-lg px-4 py-2 text-[#d8f3dc] focus:outline-none focus:border-[#52b788] transition-colors" />
                    </div>
                    <button type="submit" className="bg-[#52b788] hover:bg-[#40916c] text-black px-6 py-2 rounded-lg font-bold transition-all border-4 border-[#95d5b2] shadow-[2px_2px_0px_0px_#95d5b2] active:translate-y-[2px] active:shadow-none">Verify & Connect</button>
                  </form>
                ) : (
                  <form onSubmit={handleCreateSession} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#95d5b2] mb-1">Session Name</label>
                      <input type="text" value={newSession.name} onChange={e => setNewSession({...newSession, name: e.target.value})} className="w-full bg-black border-4 border-[#95d5b2] rounded-lg px-4 py-2 text-[#d8f3dc] focus:outline-none focus:border-[#52b788] transition-colors" placeholder="e.g. Main Account" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#95d5b2] mb-1">Phone Number</label>
                      <input type="text" value={newSession.phoneNumber} onChange={e => setNewSession({...newSession, phoneNumber: e.target.value})} className="w-full bg-black border-4 border-[#95d5b2] rounded-lg px-4 py-2 text-[#d8f3dc] focus:outline-none focus:border-[#52b788] transition-colors" placeholder="+1234567890" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#95d5b2] mb-1">API ID</label>
                      <input type="text" value={newSession.apiId} onChange={e => setNewSession({...newSession, apiId: e.target.value})} className="w-full bg-black border-4 border-[#95d5b2] rounded-lg px-4 py-2 text-[#d8f3dc] focus:outline-none focus:border-[#52b788] transition-colors" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#95d5b2] mb-1">API Hash</label>
                      <input type="text" value={newSession.apiHash} onChange={e => setNewSession({...newSession, apiHash: e.target.value})} className="w-full bg-black border-4 border-[#95d5b2] rounded-lg px-4 py-2 text-[#d8f3dc] focus:outline-none focus:border-[#52b788] transition-colors" required />
                    </div>
                    <div className="md:col-span-2 mt-2">
                      <button type="submit" className="bg-[#52b788] hover:bg-[#40916c] text-black px-6 py-2 rounded-lg font-bold transition-all border-4 border-[#95d5b2] shadow-[2px_2px_0px_0px_#95d5b2] active:translate-y-[2px] active:shadow-none">Request Code</button>
                    </div>
                  </form>
                )}
              </div>

              <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl overflow-x-auto shadow-lg shadow-black/80">
                <table className="w-full text-left text-sm min-w-[600px]">
                  <thead className="bg-black text-[#74c69d]">
                    <tr>
                      <th className="px-6 py-4 font-medium">Name</th>
                      <th className="px-6 py-4 font-medium">Phone</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black">
                    {sessions.map(session => (
                      <tr key={session.id} className="hover:bg-[#1b4332]/30">
                        <td className="px-6 py-4 text-[#d8f3dc] font-medium">{session.name}</td>
                        <td className="px-6 py-4 text-[#95d5b2]">{session.phone_number}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${session.status === 'active' ? 'bg-[#52b788]/20 text-[#52b788]' : 'bg-amber-950/30 text-amber-400/90'}`}>
                            {session.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => handleDeleteSession(session.id)} 
                            className="text-rose-400/90 hover:text-rose-300 font-medium flex items-center space-x-1"
                          >
                            <X size={14} />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'targets' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-[#d8f3dc]">Targets & Keywords</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Keywords */}
                <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-6 shadow-lg shadow-black/80">
                  <h3 className="text-lg font-medium text-[#d8f3dc] mb-4">Listener Keywords</h3>
                  <form onSubmit={handleAddKeyword} className="flex space-x-2 mb-6">
                    <input type="text" value={newKeyword} onChange={e => setNewKeyword(e.target.value)} className="flex-1 bg-black border-4 border-[#95d5b2] rounded-lg px-4 py-2 text-[#d8f3dc] focus:outline-none focus:border-[#52b788] transition-colors" placeholder="e.g. airdrop" required />
                    <button type="submit" className="bg-[#52b788] hover:bg-[#40916c] text-black px-4 py-2 rounded-lg font-bold transition-all border-4 border-[#95d5b2] shadow-[2px_2px_0px_0px_#95d5b2] active:translate-y-[2px] active:shadow-none">Add</button>
                  </form>
                  <div className="flex flex-wrap gap-2">
                    {keywords.map(k => (
                      <span key={k.id} className="bg-[#1b4332] text-[#b7e4c7] px-3 py-1 rounded-full text-sm flex items-center font-medium">
                        {k.keyword}
                        <button onClick={() => fetch(`/api/keywords/${k.id}`, { method: 'DELETE' }).then(fetchData)} className="ml-2 text-[#74c69d] hover:text-rose-400/90">&times;</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Groups */}
                <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-6 shadow-lg shadow-black/80">
                  <h3 className="text-lg font-medium text-[#d8f3dc] mb-4">Target Groups</h3>
                  <form onSubmit={handleAddGroup} className="flex space-x-2 mb-6">
                    <input type="text" value={newGroup.groupId} onChange={e => setNewGroup({...newGroup, groupId: e.target.value})} className="flex-1 bg-black border-4 border-[#95d5b2] rounded-lg px-4 py-2 text-[#d8f3dc] focus:outline-none focus:border-[#52b788] transition-colors" placeholder="Group ID or Username" required />
                    <button type="submit" className="bg-[#52b788] hover:bg-[#40916c] text-black px-4 py-2 rounded-lg font-bold transition-all border-4 border-[#95d5b2] shadow-[2px_2px_0px_0px_#95d5b2] active:translate-y-[2px] active:shadow-none">Add</button>
                  </form>
                  <div className="space-y-2">
                    {groups.map(g => (
                      <div key={g.id} className="flex justify-between items-center bg-black p-3 rounded-lg border-4 border-[#95d5b2]">
                        <span className="text-[#b7e4c7] font-medium">{g.group_id}</span>
                        <button onClick={() => fetch(`/api/groups/${g.id}`, { method: 'DELETE' }).then(fetchData)} className="text-rose-400/90 hover:text-rose-300 text-sm font-medium">Remove</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scraper Control */}
              <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-6 shadow-lg shadow-black/80">
                <h3 className="text-lg font-medium text-[#d8f3dc] mb-4">Manual Scraper</h3>
                <div className="flex space-x-4">
                  <select value={scrapeConfig.sessionId} onChange={e => setScrapeConfig({...scrapeConfig, sessionId: e.target.value})} className="bg-black border-4 border-[#95d5b2] rounded-lg px-4 py-2 text-[#d8f3dc] focus:outline-none focus:border-[#52b788] transition-colors">
                    <option value="">Select Session</option>
                    {sessions.filter(s => s.status === 'active').map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <select value={scrapeConfig.groupId} onChange={e => setScrapeConfig({...scrapeConfig, groupId: e.target.value})} className="bg-black border-4 border-[#95d5b2] rounded-lg px-4 py-2 text-[#d8f3dc] focus:outline-none focus:border-[#52b788] transition-colors">
                    <option value="">Select Group</option>
                    {groups.map(g => (
                      <option key={g.id} value={g.group_id}>{g.group_id}</option>
                    ))}
                  </select>
                  <button 
                    onClick={handleStartScraper} 
                    disabled={activeActions.scraper}
                    className={`bg-[#74c69d] hover:bg-[#52b788] text-black px-6 py-2 rounded-lg font-bold transition-all border-4 border-[#95d5b2] shadow-[2px_2px_0px_0px_#95d5b2] active:translate-y-[2px] active:shadow-none flex items-center ${activeActions.scraper ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    <Database size={18} className={`mr-2 ${activeActions.scraper ? 'animate-bounce' : ''}`} /> 
                    {activeActions.scraper ? 'Scraping...' : 'Scrape Now'}
                  </button>
                </div>
              </div>

              {/* Listener Control */}
              <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-6 shadow-lg shadow-black/80">
                <h3 className="text-lg font-medium text-[#d8f3dc] mb-4">Keyword Listener</h3>
                <div className="flex space-x-4">
                  <select value={listenerConfig.sessionId} onChange={e => setListenerConfig({...listenerConfig, sessionId: e.target.value})} className="bg-black border-4 border-[#95d5b2] rounded-lg px-4 py-2 text-[#d8f3dc] focus:outline-none focus:border-[#52b788] transition-colors">
                    <option value="">Select Session</option>
                    {sessions.filter(s => s.status === 'active').map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <button 
                    onClick={handleStartListener} 
                    disabled={activeActions.listener}
                    className={`bg-[#52b788] hover:bg-[#40916c] text-black px-6 py-2 rounded-lg font-bold transition-all border-4 border-[#95d5b2] shadow-[2px_2px_0px_0px_#95d5b2] active:translate-y-[2px] active:shadow-none flex items-center ${activeActions.listener ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    <Play size={18} className={`mr-2 ${activeActions.listener ? 'animate-pulse' : ''}`} /> 
                    {activeActions.listener ? 'Listening...' : 'Start Listener'}
                  </button>
                  <button 
                    onClick={handleStopListener} 
                    className="bg-rose-400 hover:bg-rose-500 text-black px-6 py-2 rounded-lg font-bold transition-all border-4 border-[#95d5b2] shadow-[2px_2px_0px_0px_#95d5b2] active:translate-y-[2px] active:shadow-none flex items-center"
                  >
                    <Square size={18} className="mr-2" /> Stop Listener
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-[#d8f3dc]">Scraped Users</h2>
              <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl overflow-x-auto shadow-lg shadow-black/80">
                <table className="w-full text-left text-sm min-w-[600px]">
                  <thead className="bg-black text-[#74c69d]">
                    <tr>
                      <th className="px-6 py-4 font-medium">Username / ID</th>
                      <th className="px-6 py-4 font-medium">Source</th>
                      <th className="px-6 py-4 font-medium">Last Seen</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-[#1b4332]/30">
                        <td className="px-6 py-4 text-[#d8f3dc] font-medium">{user.username ? `@${user.username}` : user.user_id}</td>
                        <td className="px-6 py-4 text-[#95d5b2]">{user.source_group}</td>
                        <td className="px-6 py-4 text-[#95d5b2]">{new Date(user.last_seen).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.contacted ? 'bg-[#52b788]/20 text-[#52b788]' : 'bg-[#1b4332] text-[#95d5b2]'}`}>
                            {user.contacted ? 'Contacted' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'engagement' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-[#d8f3dc]">Telegram Mass Engagement</h2>
              
              <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-6 shadow-lg shadow-black/80">
                <h3 className="text-lg font-medium text-[#d8f3dc] mb-4">Run Engagement Action</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#95d5b2] mb-1">Select Session</label>
                    <select 
                      value={engagementConfig.sessionId} 
                      onChange={e => setEngagementConfig({...engagementConfig, sessionId: e.target.value})}
                      className="w-full bg-black border-4 border-[#95d5b2] rounded-lg px-4 py-2 text-[#d8f3dc] focus:outline-none focus:border-[#52b788] transition-colors"
                    >
                      <option value="">Select Session...</option>
                      {sessions.filter(s => s.status === 'active').map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.phone_number})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#95d5b2] mb-1">Target (Username or Group ID)</label>
                    <input 
                      type="text" 
                      value={engagementConfig.target} 
                      onChange={e => setEngagementConfig({...engagementConfig, target: e.target.value})}
                      className="w-full bg-black border-4 border-[#95d5b2] rounded-lg px-4 py-2 text-[#d8f3dc] focus:outline-none focus:border-[#52b788] transition-colors"
                      placeholder="@username or -100123456"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#95d5b2] mb-1">Action</label>
                    <select 
                      value={engagementConfig.action} 
                      onChange={e => setEngagementConfig({...engagementConfig, action: e.target.value})}
                      className="w-full bg-black border-4 border-[#95d5b2] rounded-lg px-4 py-2 text-[#d8f3dc] focus:outline-none focus:border-[#52b788] transition-colors"
                    >
                      <option value="react">Auto-React (Like)</option>
                      <option value="join">Auto-Join Group/Channel</option>
                      <option value="forward">Auto-Forward (Retweet)</option>
                    </select>
                  </div>
                  {engagementConfig.action === 'react' && (
                    <div>
                      <label className="block text-xs font-medium text-[#95d5b2] mb-1">Emoji</label>
                      <input 
                        type="text" 
                        value={engagementConfig.emoji} 
                        onChange={e => setEngagementConfig({...engagementConfig, emoji: e.target.value})}
                        className="w-full bg-black border-4 border-[#95d5b2] rounded-lg px-4 py-2 text-[#d8f3dc] focus:outline-none focus:border-[#52b788] transition-colors"
                        placeholder="👍"
                      />
                    </div>
                  )}
                  <button 
                    onClick={handleRunEngagement}
                    disabled={activeActions.engagement}
                    className={`w-full bg-[#52b788] hover:bg-[#74c69d] text-black font-bold py-3 px-4 rounded-lg transition-all border-4 border-[#95d5b2] shadow-[4px_4px_0px_0px_#95d5b2] active:translate-y-[2px] active:shadow-none flex items-center justify-center ${activeActions.engagement ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    {activeActions.engagement ? (
                      <>
                        <RefreshCw size={18} className="mr-2 animate-spin" />
                        Executing {engagementConfig.action}...
                      </>
                    ) : (
                      <>
                        <Zap size={18} className="mr-2" />
                        Execute Action
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'twitter' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-[#d8f3dc]">Twitter (X) Automation</h2>
              <p className="text-[#95d5b2] mb-6">AutoPROMO-style mass engagement tools for X.</p>
              
              <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-6 shadow-lg shadow-black/80">
                <h3 className="text-lg font-medium text-[#d8f3dc] mb-4">Run Twitter Action</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#95d5b2] mb-1">Select Account</label>
                    <select 
                      value={twitterConfig.account} 
                      onChange={e => setTwitterConfig({...twitterConfig, account: e.target.value})}
                      className="w-full bg-black border-4 border-[#95d5b2] rounded-lg px-4 py-2 text-[#d8f3dc] focus:outline-none focus:border-[#52b788] transition-colors"
                    >
                      <option value="Account 1">Account 1 (Main)</option>
                      <option value="Account 2">Account 2 (Alt)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#95d5b2] mb-1">Target (Tweet URL or @username)</label>
                    <input 
                      type="text" 
                      value={twitterConfig.target} 
                      onChange={e => setTwitterConfig({...twitterConfig, target: e.target.value})}
                      className="w-full bg-black border-4 border-[#95d5b2] rounded-lg px-4 py-2 text-[#d8f3dc] focus:outline-none focus:border-[#52b788] transition-colors"
                      placeholder="https://x.com/... or @username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#95d5b2] mb-1">Action</label>
                    <select 
                      value={twitterConfig.action} 
                      onChange={e => setTwitterConfig({...twitterConfig, action: e.target.value})}
                      className="w-full bg-black border-4 border-[#95d5b2] rounded-lg px-4 py-2 text-[#d8f3dc] focus:outline-none focus:border-[#52b788] transition-colors"
                    >
                      <option value="like">Auto-Like</option>
                      <option value="retweet">Auto-Retweet</option>
                      <option value="follow">Auto-Follow</option>
                      <option value="reply">Auto-Reply</option>
                    </select>
                  </div>
                  {twitterConfig.action === 'reply' && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-medium text-[#95d5b2]">Reply Content</label>
                        <span className={`text-[10px] font-bold ${twitterConfig.content.length > 280 ? 'text-rose-400' : 'text-[#95d5b2]'}`}>
                          {twitterConfig.content.length} / 280
                        </span>
                      </div>
                      <textarea 
                        value={twitterConfig.content} 
                        onChange={e => setTwitterConfig({...twitterConfig, content: e.target.value})}
                        className={`w-full bg-black border-4 rounded-lg px-4 py-2 text-[#d8f3dc] focus:outline-none h-24 transition-colors ${twitterConfig.content.length > 280 ? 'border-rose-400' : 'border-[#95d5b2] focus:border-[#52b788]'}`}
                        placeholder="Type your reply here..."
                      />
                    </div>
                  )}
                  <button 
                    onClick={handleTwitterAction}
                    disabled={activeActions.twitter}
                    className={`w-full bg-[#52b788] hover:bg-[#40916c] text-black font-bold py-3 px-4 rounded-lg transition-all border-4 border-[#95d5b2] shadow-[4px_4px_0px_0px_#95d5b2] active:translate-y-[2px] active:shadow-none mt-4 flex items-center justify-center ${activeActions.twitter ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    {activeActions.twitter ? (
                      <>
                        <RefreshCw size={18} className="mr-2 animate-spin" />
                        Executing Twitter {twitterConfig.action}...
                      </>
                    ) : (
                      <>
                        <Twitter size={18} className="mr-2" />
                        Execute Twitter Action
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Mode Tab */}
          {activeTab === 'advanced' && (
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-[#d8f3dc] flex items-center">
                    <Shield size={32} className="mr-4 text-[#52b788]" />
                    Advanced Mode
                  </h2>
                  <p className="text-[#95d5b2] mt-2">Industry-standard multi-account and proxy management.</p>
                </div>
                <div className="bg-[#1b4332] border-2 border-[#52b788] px-4 py-2 rounded-full flex items-center space-x-2">
                  <Lock size={14} className="text-[#52b788]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#d8f3dc]">Enterprise Ready</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Multi-Account Management */}
                <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-8 shadow-lg shadow-black/80">
                  <h3 className="text-xl font-bold text-[#d8f3dc] mb-6 flex items-center">
                    <Users size={20} className="mr-3 text-[#52b788]" />
                    Multi-Account Management
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-black border-2 border-[#1b4332] rounded-lg">
                      <div>
                        <p className="text-[#d8f3dc] font-bold">Enable Multi-Account Rotation</p>
                        <p className="text-[10px] text-[#95d5b2]">Switch between accounts to avoid rate limits</p>
                      </div>
                      <button 
                        onClick={() => setAdvancedConfig(prev => ({ ...prev, multiAccount: !prev.multiAccount }))}
                        className={`w-12 h-6 rounded-full transition-colors relative ${advancedConfig.multiAccount ? 'bg-[#52b788]' : 'bg-[#1b4332]'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all ${advancedConfig.multiAccount ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                    
                    <div>
                      <label className="block text-[#95d5b2] text-[10px] uppercase font-bold mb-2 tracking-widest">Max Concurrent Accounts</label>
                      <input 
                        type="number"
                        value={advancedConfig.maxAccounts}
                        onChange={(e) => setAdvancedConfig(prev => ({ ...prev, maxAccounts: Number(e.target.value) }))}
                        className="w-full bg-black border-2 border-[#1b4332] rounded-lg p-3 text-[#d8f3dc] focus:border-[#52b788] outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Residential Proxy Settings */}
                <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-8 shadow-lg shadow-black/80">
                  <h3 className="text-xl font-bold text-[#d8f3dc] mb-6 flex items-center">
                    <Globe size={20} className="mr-3 text-[#52b788]" />
                    Residential Proxy Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-black border-2 border-[#1b4332] rounded-lg mb-4">
                      <div>
                        <p className="text-[#d8f3dc] font-bold">Use Residential Proxies</p>
                        <p className="text-[10px] text-[#95d5b2]">Highly recommended for large scale operations</p>
                      </div>
                      <button 
                        onClick={() => setAdvancedConfig(prev => ({ ...prev, proxyEnabled: !prev.proxyEnabled }))}
                        className={`w-12 h-6 rounded-full transition-colors relative ${advancedConfig.proxyEnabled ? 'bg-[#52b788]' : 'bg-[#1b4332]'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all ${advancedConfig.proxyEnabled ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#95d5b2] text-[10px] uppercase font-bold mb-2 tracking-widest">Proxy Host</label>
                        <input 
                          type="text"
                          placeholder="p.proxyrack.com"
                          value={advancedConfig.proxyHost}
                          onChange={(e) => setAdvancedConfig(prev => ({ ...prev, proxyHost: e.target.value }))}
                          className="w-full bg-black border-2 border-[#1b4332] rounded-lg p-3 text-[#d8f3dc] focus:border-[#52b788] outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[#95d5b2] text-[10px] uppercase font-bold mb-2 tracking-widest">Proxy Type</label>
                        <select 
                          value={advancedConfig.proxyType}
                          onChange={(e) => setAdvancedConfig(prev => ({ ...prev, proxyType: e.target.value }))}
                          className="w-full bg-black border-2 border-[#1b4332] rounded-lg p-3 text-[#d8f3dc] focus:border-[#52b788] outline-none transition-colors"
                        >
                          <option value="socks5">SOCKS5</option>
                          <option value="http">HTTP</option>
                          <option value="https">HTTPS</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#95d5b2] text-[10px] uppercase font-bold mb-2 tracking-widest">Proxy Port</label>
                        <input 
                          type="text"
                          placeholder="10000"
                          value={advancedConfig.proxyPort}
                          onChange={(e) => setAdvancedConfig(prev => ({ ...prev, proxyPort: e.target.value }))}
                          className="w-full bg-black border-2 border-[#1b4332] rounded-lg p-3 text-[#d8f3dc] focus:border-[#52b788] outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[#95d5b2] text-[10px] uppercase font-bold mb-2 tracking-widest">Auth Required</label>
                        <div className="flex items-center space-x-2 h-[52px]">
                          <span className="text-[10px] text-[#95d5b2]">User/Pass Auth</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#95d5b2] text-[10px] uppercase font-bold mb-2 tracking-widest">Username</label>
                        <input 
                          type="text"
                          value={advancedConfig.proxyUser}
                          onChange={(e) => setAdvancedConfig(prev => ({ ...prev, proxyUser: e.target.value }))}
                          className="w-full bg-black border-2 border-[#1b4332] rounded-lg p-3 text-[#d8f3dc] focus:border-[#52b788] outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[#95d5b2] text-[10px] uppercase font-bold mb-2 tracking-widest">Password</label>
                        <input 
                          type="password"
                          value={advancedConfig.proxyPass}
                          onChange={(e) => setAdvancedConfig(prev => ({ ...prev, proxyPass: e.target.value }))}
                          className="w-full bg-black border-2 border-[#1b4332] rounded-lg p-3 text-[#d8f3dc] focus:border-[#52b788] outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Anti-Detection & Security */}
                <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-8 shadow-lg shadow-black/80">
                  <h3 className="text-xl font-bold text-[#d8f3dc] mb-6 flex items-center">
                    <Cpu size={20} className="mr-3 text-[#52b788]" />
                    Anti-Detection & Security
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-black border-2 border-[#1b4332] rounded-lg">
                      <div>
                        <p className="text-[#d8f3dc] font-bold">Browser Fingerprint Spoofing</p>
                        <p className="text-[10px] text-[#95d5b2]">Randomize user-agents and hardware IDs</p>
                      </div>
                      <button 
                        onClick={() => setAdvancedConfig(prev => ({ ...prev, antiDetection: !prev.antiDetection }))}
                        className={`w-12 h-6 rounded-full transition-colors relative ${advancedConfig.antiDetection ? 'bg-[#52b788]' : 'bg-[#1b4332]'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all ${advancedConfig.antiDetection ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-black border-2 border-[#1b4332] rounded-lg">
                      <div>
                        <p className="text-[#d8f3dc] font-bold">Global Blacklist Sync</p>
                        <p className="text-[10px] text-[#95d5b2]">Never message the same user twice across accounts</p>
                      </div>
                      <button 
                        onClick={() => setAdvancedConfig(prev => ({ ...prev, blacklistEnabled: !prev.blacklistEnabled }))}
                        className={`w-12 h-6 rounded-full transition-colors relative ${advancedConfig.blacklistEnabled ? 'bg-[#52b788]' : 'bg-[#1b4332]'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all ${advancedConfig.blacklistEnabled ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-black border-2 border-[#1b4332] rounded-lg">
                      <div>
                        <p className="text-[#d8f3dc] font-bold">Account Warmup Mode</p>
                        <p className="text-[10px] text-[#95d5b2]">Simulate activity before starting campaigns</p>
                      </div>
                      <button 
                        onClick={() => setAdvancedConfig(prev => ({ ...prev, warmupEnabled: !prev.warmupEnabled }))}
                        className={`w-12 h-6 rounded-full transition-colors relative ${advancedConfig.warmupEnabled ? 'bg-[#52b788]' : 'bg-[#1b4332]'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all ${advancedConfig.warmupEnabled ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-black border-2 border-[#1b4332] rounded-lg">
                      <div>
                        <p className="text-[#d8f3dc] font-bold">Randomized Human Delays</p>
                        <p className="text-[10px] text-[#95d5b2]">Simulate human typing and scrolling</p>
                      </div>
                      <button 
                        onClick={() => setAdvancedConfig(prev => ({ ...prev, randomDelays: !prev.randomDelays }))}
                        className={`w-12 h-6 rounded-full transition-colors relative ${advancedConfig.randomDelays ? 'bg-[#52b788]' : 'bg-[#1b4332]'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all ${advancedConfig.randomDelays ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#95d5b2] text-[10px] uppercase font-bold mb-2 tracking-widest">Min Delay (s)</label>
                        <input 
                          type="number"
                          value={advancedConfig.minDelay}
                          onChange={(e) => setAdvancedConfig(prev => ({ ...prev, minDelay: Number(e.target.value) }))}
                          className="w-full bg-black border-2 border-[#1b4332] rounded-lg p-3 text-[#d8f3dc] focus:border-[#52b788] outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[#95d5b2] text-[10px] uppercase font-bold mb-2 tracking-widest">Max Delay (s)</label>
                        <input 
                          type="number"
                          value={advancedConfig.maxDelay}
                          onChange={(e) => setAdvancedConfig(prev => ({ ...prev, maxDelay: Number(e.target.value) }))}
                          className="w-full bg-black border-2 border-[#1b4332] rounded-lg p-3 text-[#d8f3dc] focus:border-[#52b788] outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance & Scaling */}
                <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-8 shadow-lg shadow-black/80">
                  <h3 className="text-xl font-bold text-[#d8f3dc] mb-6 flex items-center">
                    <Activity size={20} className="mr-3 text-[#52b788]" />
                    Performance & Scaling
                  </h3>
                  <div className="space-y-6">
                    <div className="p-4 bg-black border-2 border-[#1b4332] rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-[#d8f3dc] font-bold">Operational Schedule</p>
                          <p className="text-[10px] text-[#95d5b2]">Only run during specific hours</p>
                        </div>
                        <button 
                          onClick={() => setAdvancedConfig(prev => ({ ...prev, scheduleEnabled: !prev.scheduleEnabled }))}
                          className={`w-12 h-6 rounded-full transition-colors relative ${advancedConfig.scheduleEnabled ? 'bg-[#52b788]' : 'bg-[#1b4332]'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all ${advancedConfig.scheduleEnabled ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>
                      {advancedConfig.scheduleEnabled && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[#95d5b2] text-[10px] uppercase font-bold mb-2 tracking-widest">Start Time</label>
                            <input 
                              type="time"
                              value={advancedConfig.startTime}
                              onChange={(e) => setAdvancedConfig(prev => ({ ...prev, startTime: e.target.value }))}
                              className="w-full bg-black border-2 border-[#1b4332] rounded-lg p-2 text-[#d8f3dc] focus:border-[#52b788] outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[#95d5b2] text-[10px] uppercase font-bold mb-2 tracking-widest">End Time</label>
                            <input 
                              type="time"
                              value={advancedConfig.endTime}
                              onChange={(e) => setAdvancedConfig(prev => ({ ...prev, endTime: e.target.value }))}
                              className="w-full bg-black border-2 border-[#1b4332] rounded-lg p-2 text-[#d8f3dc] focus:border-[#52b788] outline-none transition-colors"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#95d5b2] text-[10px] uppercase font-bold mb-2 tracking-widest">Max Scrape Per Group</label>
                      <input 
                        type="number"
                        value={advancedConfig.maxScrapePerGroup}
                        onChange={(e) => setAdvancedConfig(prev => ({ ...prev, maxScrapePerGroup: Number(e.target.value) }))}
                        className="w-full bg-black border-2 border-[#1b4332] rounded-lg p-3 text-[#d8f3dc] focus:border-[#52b788] outline-none transition-colors"
                      />
                      <p className="text-[10px] text-[#95d5b2] mt-2 italic">Higher values increase risk of session ban.</p>
                    </div>

                    <button 
                      onClick={() => addToast('Advanced settings saved successfully', 'success')}
                      className="w-full bg-[#52b788] hover:bg-[#74c69d] text-black font-bold py-4 px-4 rounded-lg transition-all border-4 border-[#95d5b2] shadow-[4px_4px_0px_0px_#95d5b2] active:translate-y-[2px] active:shadow-none flex items-center justify-center uppercase tracking-widest text-sm"
                    >
                      <Database size={18} className="mr-2" />
                      Save Advanced Configuration
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="space-y-8 max-w-4xl mx-auto pb-12">
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-[#1b4332] rounded-xl border-4 border-[#95d5b2] shadow-[4px_4px_0px_0px_#95d5b2]">
                  <HelpCircle size={32} className="text-[#52b788]" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#d8f3dc]">User Manual</h2>
                  <p className="text-[#95d5b2]">Master the AutoPROMO Automation Suite</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {/* Section 1: Sessions */}
                <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-8 shadow-lg shadow-black/80 relative">
                  <div className="absolute top-4 right-4">
                    {sessions.some(s => s.status === 'active') ? (
                      <span className="bg-[#52b788]/20 text-[#52b788] text-[10px] px-2 py-1 rounded border border-[#52b788] font-bold uppercase tracking-widest">Completed</span>
                    ) : (
                      <span className="bg-amber-950/30 text-amber-400 text-[10px] px-2 py-1 rounded border border-amber-400/50 font-bold uppercase tracking-widest">Pending</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-[#d8f3dc] mb-4 flex items-center">
                    <span className="w-8 h-8 bg-[#52b788] text-black rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                    Setting Up Sessions
                  </h3>
                  <div className="space-y-4 text-[#95d5b2] text-sm leading-relaxed">
                    <p>To start automating, you need to connect your Telegram accounts. Go to the <span className="text-[#d8f3dc] font-bold">Sessions</span> tab:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Get your <span className="text-[#d8f3dc]">API ID</span> and <span className="text-[#d8f3dc]">API Hash</span> from <a href="https://my.telegram.org" target="_blank" className="underline hover:text-[#52b788]">my.telegram.org</a>.</li>
                      <li>Enter your phone number in international format (e.g., <span className="font-mono">+1234567890</span>).</li>
                      <li>Wait for the Telegram login code and enter it in the app.</li>
                      <li>Once "Active", your account is ready for automation.</li>
                    </ul>
                  </div>
                </div>

                {/* Section 2: Targets */}
                <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-8 shadow-lg shadow-black/80 relative">
                  <div className="absolute top-4 right-4">
                    {groups.length > 0 && keywords.length > 0 ? (
                      <span className="bg-[#52b788]/20 text-[#52b788] text-[10px] px-2 py-1 rounded border border-[#52b788] font-bold uppercase tracking-widest">Completed</span>
                    ) : (
                      <span className="bg-amber-950/30 text-amber-400 text-[10px] px-2 py-1 rounded border border-amber-400/50 font-bold uppercase tracking-widest">Pending</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-[#d8f3dc] mb-4 flex items-center">
                    <span className="w-8 h-8 bg-[#52b788] text-black rounded-full flex items-center justify-center mr-3 text-sm">2</span>
                    Finding Your Audience
                  </h3>
                  <div className="space-y-4 text-[#95d5b2] text-sm leading-relaxed">
                    <p>Use the <span className="text-[#d8f3dc] font-bold">Targets & Keywords</span> tab to define where to find users:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><span className="text-[#d8f3dc] font-bold">Target Groups:</span> Add public group usernames (e.g., <span className="font-mono">@crypto_group</span>).</li>
                      <li><span className="text-[#d8f3dc] font-bold">Keywords:</span> Add words you want to listen for in real-time.</li>
                      <li><span className="text-[#d8f3dc] font-bold">Scraper:</span> Run the scraper on a target group to build a list of active users in the <span className="text-[#d8f3dc] font-bold">Scraped Users</span> tab.</li>
                    </ul>
                  </div>
                </div>

                {/* Section 3: Operator */}
                <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-8 shadow-lg shadow-black/80 relative">
                  <div className="absolute top-4 right-4">
                    {users.length > 0 ? (
                      <span className="bg-[#52b788]/20 text-[#52b788] text-[10px] px-2 py-1 rounded border border-[#52b788] font-bold uppercase tracking-widest">Ready</span>
                    ) : (
                      <span className="bg-amber-950/30 text-amber-400 text-[10px] px-2 py-1 rounded border border-amber-400/50 font-bold uppercase tracking-widest">Needs Leads</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-[#d8f3dc] mb-4 flex items-center">
                    <span className="w-8 h-8 bg-[#52b788] text-black rounded-full flex items-center justify-center mr-3 text-sm">3</span>
                    The Operator (Auto-DM)
                  </h3>
                  <div className="space-y-4 text-[#95d5b2] text-sm leading-relaxed">
                    <p>The <span className="text-[#d8f3dc] font-bold">Operator</span> is your main outreach tool:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><span className="text-[#d8f3dc] font-bold">Spintax:</span> Use <span className="font-mono">{"{Hi|Hello|Hey}"}</span> to randomize your messages. This is CRITICAL to avoid being flagged as spam.</li>
                      <li><span className="text-[#d8f3dc] font-bold">Daily Limits:</span> Keep your daily limits low (10-20 per account) to stay under Telegram's radar.</li>
                      <li>The Operator will automatically message users from your <span className="text-[#d8f3dc]">Scraped Users</span> list.</li>
                    </ul>
                  </div>
                </div>

                {/* Section 4: Twitter */}
                <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-8 shadow-lg shadow-black/80">
                  <h3 className="text-xl font-bold text-[#d8f3dc] mb-4 flex items-center">
                    <span className="w-8 h-8 bg-[#52b788] text-black rounded-full flex items-center justify-center mr-3 text-sm">4</span>
                    Twitter (X) Automation
                  </h3>
                  <div className="space-y-4 text-[#95d5b2] text-sm leading-relaxed">
                    <p>Automate your X presence in the <span className="text-[#d8f3dc] font-bold">Twitter Auto</span> tab:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Enter a target tweet URL or a username.</li>
                      <li>Select an action: <span className="text-[#d8f3dc]">Like, Retweet, Follow, or Reply</span>.</li>
                      <li>The app uses your connected X accounts to execute these actions automatically.</li>
                    </ul>
                  </div>
                </div>

                {/* Section 5: Safety */}
                <div className="bg-rose-950/30 border-4 border-rose-500/50 rounded-xl p-8">
                  <h3 className="text-xl font-bold text-rose-400 mb-4 flex items-center">
                    <X size={20} className="mr-3" />
                    Safety & Best Practices
                  </h3>
                  <div className="space-y-4 text-rose-200/70 text-sm leading-relaxed">
                    <p>Automation carries risks. Follow these rules to protect your accounts:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><span className="text-rose-400 font-bold">Warm-up:</span> Start with 2-5 messages per day on new accounts.</li>
                      <li><span className="text-rose-400 font-bold">Variety:</span> Never send the exact same message twice. Use heavy spintax.</li>
                      <li><span className="text-rose-400 font-bold">Proxies:</span> If running more than 3 accounts, use a proxy for each session.</li>
                      <li><span className="text-rose-400 font-bold">Respect Limits:</span> If an account gets "Limited", stop all automation for 48 hours.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-[#d8f3dc]">Application Settings</h2>
              <p className="text-[#95d5b2] mb-6">Manage your desktop app experience and installation.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-6 shadow-lg shadow-black/80">
                  <h3 className="text-lg font-bold text-[#d8f3dc] mb-4 flex items-center">
                    <Maximize2 size={18} className="mr-2 text-[#52b788]" /> Desktop App
                  </h3>
                  <p className="text-sm text-[#95d5b2] mb-6">
                    Install this application as a standalone desktop app on your Windows system for a more native experience.
                  </p>
                  <button 
                    onClick={handleInstallClick}
                    className="w-full bg-[#52b788] hover:bg-[#40916c] text-black font-bold py-3 px-4 rounded-lg transition-all border-4 border-[#95d5b2] shadow-[4px_4px_0px_0px_#95d5b2] active:translate-y-[2px] active:shadow-none"
                  >
                    Install Desktop App
                  </button>
                </div>

                <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-6 shadow-lg shadow-black/80">
                  <h3 className="text-lg font-bold text-[#d8f3dc] mb-4 flex items-center">
                    <X size={18} className="mr-2 text-rose-400" /> Windows Download
                  </h3>
                  <p className="text-sm text-[#95d5b2] mb-6">
                    Download the source code to run locally on your Windows machine or export it to a ZIP file.
                  </p>
                  <button 
                    onClick={handleDownloadWindows}
                    className="w-full bg-black hover:bg-[#1b4332]/30 text-[#d8f3dc] font-bold py-3 px-4 rounded-lg transition-all border-4 border-[#95d5b2] shadow-[4px_4px_0px_0px_#95d5b2] active:translate-y-[2px] active:shadow-none"
                  >
                    Download for Windows
                  </button>
                </div>
              </div>

              <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-6 shadow-lg shadow-black/80">
                <h3 className="text-lg font-bold text-[#d8f3dc] mb-4">App Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b-4 border-black pb-2">
                    <span className="text-[#95d5b2]">Version</span>
                    <span className="text-[#d8f3dc] font-mono">1.0.0-stable</span>
                  </div>
                  <div className="flex justify-between border-b-4 border-black pb-2">
                    <span className="text-[#95d5b2]">Build Date</span>
                    <span className="text-[#d8f3dc] font-mono">April 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#95d5b2]">Platform</span>
                    <span className="text-[#d8f3dc] font-mono">Windows / Web (PWA)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'operator' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-[#d8f3dc]">Operator (Auto-DM)</h2>
              
              <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-6 shadow-lg shadow-black/80">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#95d5b2] mb-2">Select Session</label>
                    <select value={operatorConfig.sessionId} onChange={e => setOperatorConfig({...operatorConfig, sessionId: e.target.value})} className="w-full md:w-1/2 bg-black border-4 border-[#95d5b2] rounded-lg px-4 py-2 text-[#d8f3dc] focus:outline-none focus:border-[#52b788] transition-colors">
                      <option value="">Select Session</option>
                      {sessions.filter(s => s.status === 'active').map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#95d5b2] mb-2">Message Template (Spintax Supported)</label>
                    <textarea 
                      value={operatorConfig.template} 
                      onChange={e => setOperatorConfig({...operatorConfig, template: e.target.value})} 
                      className="w-full h-32 bg-black border-4 border-[#95d5b2] rounded-lg px-4 py-3 text-[#d8f3dc] focus:outline-none focus:border-[#52b788] font-mono text-sm leading-relaxed transition-colors"
                      placeholder="{Hey|Hi}, saw you in {group}. {Check out|Look at} farmdash.one!"
                    />
                    <p className="text-xs text-[#74c69d] mt-2">Use {'{option1|option2}'} syntax to randomize messages and avoid spam filters.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#95d5b2] mb-2">Daily Limit (per account)</label>
                    <input 
                      type="number" 
                      value={operatorConfig.maxPerDay} 
                      onChange={e => setOperatorConfig({...operatorConfig, maxPerDay: Number(e.target.value)})} 
                      className="w-32 bg-black border-4 border-[#95d5b2] rounded-lg px-4 py-2 text-[#d8f3dc] focus:outline-none focus:border-[#52b788] transition-colors"
                    />
                  </div>

                  <div className="flex space-x-4 pt-6 border-t-4 border-[#95d5b2]">
                    <button 
                      onClick={handleStartOperator} 
                      disabled={activeActions.operator}
                      className={`bg-[#52b788] hover:bg-[#40916c] text-black px-6 py-2 rounded-lg font-bold transition-all border-4 border-[#95d5b2] shadow-[2px_2px_0px_0px_#95d5b2] active:translate-y-[2px] active:shadow-none flex items-center ${activeActions.operator ? 'opacity-50 cursor-wait' : ''}`}
                    >
                      <Play size={18} className={`mr-2 ${activeActions.operator ? 'animate-spin-slow' : ''}`} /> 
                      {activeActions.operator ? 'Operator Running...' : 'Start Operator'}
                    </button>
                    <button 
                      onClick={handleStopOperator} 
                      className="bg-rose-400 hover:bg-rose-500 text-black px-6 py-2 rounded-lg font-bold transition-all border-4 border-[#95d5b2] shadow-[2px_2px_0px_0px_#95d5b2] active:translate-y-[2px] active:shadow-none flex items-center"
                    >
                      <Square size={18} className="mr-2" /> Stop Operator
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* System Status Bar */}
      <div className="h-8 bg-[#06140f] border-t-4 border-[#95d5b2] flex items-center px-4 justify-between text-[10px] uppercase tracking-widest font-bold shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${sessions.some(s => s.status === 'active') ? 'bg-[#52b788] animate-pulse' : 'bg-rose-500'}`}></div>
            <span className="text-[#95d5b2]">System: {sessions.some(s => s.status === 'active') ? 'Online' : 'Standby'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${activeActions.listener ? 'bg-[#52b788] animate-pulse' : 'bg-[#1b4332]'}`}></div>
            <span className="text-[#95d5b2]">Listener: {activeActions.listener ? 'Active' : 'Idle'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${activeActions.operator ? 'bg-[#52b788] animate-pulse' : 'bg-[#1b4332]'}`}></div>
            <span className="text-[#95d5b2]">Operator: {activeActions.operator ? 'Active' : 'Idle'}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-[#52b788]">v1.0.0-stable</span>
          <span className="text-[#95d5b2]">{new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

