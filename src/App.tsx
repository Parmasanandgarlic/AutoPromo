import React, { useState, useEffect } from 'react';
import { Activity, Users, MessageSquare, Settings, Play, Square, Database, Key, Hash, Phone, Minus, Maximize2, X, Twitter, HelpCircle, TreePine, TreeDeciduous, Trees, Palmtree, Leaf, Sprout, Flower, Flower2, Squirrel, Rabbit, Bird, Cat, Dog, Fish, Snail, PawPrint, Bug, Clover, Sun, Cloud, Moon, Star, Zap, Flame, Droplets, Wind, Shell } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

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
    // In this environment, we can't directly trigger a build and download of an .exe
    // but we can explain how to export it or provide a link to the export feature.
    addToast('To use this as a Windows app, click "Install App" below or use the "Export to ZIP" option in the AI Studio settings menu.', 'success');
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
    }
  };

  const handleVerifySession = async (e: React.FormEvent) => {
    e.preventDefault();
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
    }
  };

  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
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
    }
  };

  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault();
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
    }
  };

  const handleStartScraper = async () => {
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
    }
  };

  const handleStartListener = async () => {
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
    }
  };

  const handleStopListener = async () => {
    try {
      const res = await fetch('/api/actions/stop-listener', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to stop listener');
      addToast('Listener stopped', 'success');
    } catch (err: any) {
      addToast(err.message, 'error');
    }
  };

  const handleStartOperator = async () => {
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
    }
  };

  const handleStopOperator = async () => {
    try {
      const res = await fetch('/api/actions/stop-operator', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to stop operator');
      addToast('Operator stopped', 'success');
    } catch (err: any) {
      addToast(err.message, 'error');
    }
  };

  const handleRunEngagement = async () => {
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
    }
  };

  const handleTwitterAction = async () => {
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
        <div className="no-drag shrink-0">
          <span className="font-['Indie_Flower'] text-sm text-[#95d5b2] opacity-60">I made this =)</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
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
            <div className="space-y-6 max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-[#d8f3dc]">System Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-6 shadow-lg shadow-black/80">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#95d5b2] font-medium">Active Sessions</h3>
                    <Key className="text-[#52b788]" size={20} />
                  </div>
                  <p className="text-4xl font-bold text-[#d8f3dc]">{sessions.filter(s => s.status === 'active').length}</p>
                </div>
                <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-6 shadow-lg shadow-black/80">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#95d5b2] font-medium">Scraped Leads</h3>
                    <Users className="text-[#74c69d]" size={20} />
                  </div>
                  <p className="text-4xl font-bold text-[#d8f3dc]">{users.length}</p>
                </div>
                <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-6 shadow-lg shadow-black/80">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#95d5b2] font-medium">Messages Sent</h3>
                    <MessageSquare className="text-[#b7e4c7]" size={20} />
                  </div>
                  <p className="text-4xl font-bold text-[#d8f3dc]">{users.filter(u => u.contacted).length}</p>
                </div>
              </div>

              {/* Quick Start Guide */}
              <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-6 shadow-lg shadow-black/80">
                <h3 className="text-lg font-bold text-[#d8f3dc] mb-4 flex items-center">
                  <Play size={18} className="mr-2 text-[#52b788]" /> Quick Start Guide
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-black border-4 border-[#95d5b2] p-4 rounded-lg relative">
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#52b788] text-black rounded-full flex items-center justify-center font-bold border-4 border-[#95d5b2]">1</div>
                    <h4 className="font-medium text-[#d8f3dc] mb-2 mt-2">Connect Session</h4>
                    <p className="text-xs text-[#95d5b2] mb-3">Add your Telegram API credentials and authenticate your account.</p>
                    <button onClick={() => setActiveTab('sessions')} className="text-xs text-[#52b788] hover:text-[#74c69d] font-medium flex items-center">Go to Sessions &rarr;</button>
                  </div>
                  <div className="bg-black border-4 border-[#95d5b2] p-4 rounded-lg relative">
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#52b788] text-black rounded-full flex items-center justify-center font-bold border-4 border-[#95d5b2]">2</div>
                    <h4 className="font-medium text-[#d8f3dc] mb-2 mt-2">Add Targets</h4>
                    <p className="text-xs text-[#95d5b2] mb-3">Define the groups to scrape and keywords to listen for.</p>
                    <button onClick={() => setActiveTab('targets')} className="text-xs text-[#52b788] hover:text-[#74c69d] font-medium flex items-center">Go to Targets &rarr;</button>
                  </div>
                  <div className="bg-black border-4 border-[#95d5b2] p-4 rounded-lg relative">
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#52b788] text-black rounded-full flex items-center justify-center font-bold border-4 border-[#95d5b2]">3</div>
                    <h4 className="font-medium text-[#d8f3dc] mb-2 mt-2">Scrape & Listen</h4>
                    <p className="text-xs text-[#95d5b2] mb-3">Run the scraper to build your leads list from target groups.</p>
                    <button onClick={() => setActiveTab('operator')} className="text-xs text-[#52b788] hover:text-[#74c69d] font-medium flex items-center">Go to Operator &rarr;</button>
                  </div>
                  <div className="bg-black border-4 border-[#95d5b2] p-4 rounded-lg relative">
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#52b788] text-black rounded-full flex items-center justify-center font-bold border-4 border-[#95d5b2]">4</div>
                    <h4 className="font-medium text-[#d8f3dc] mb-2 mt-2">Auto-DM</h4>
                    <p className="text-xs text-[#95d5b2] mb-3">Start the operator to send personalized Spintax messages.</p>
                    <button onClick={() => setActiveTab('operator')} className="text-xs text-[#52b788] hover:text-[#74c69d] font-medium flex items-center">Go to Operator &rarr;</button>
                  </div>
                </div>
              </div>

              <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl overflow-hidden flex flex-col h-[500px] shadow-lg shadow-black/80">
                <div className="p-4 border-b-4 border-[#95d5b2] flex justify-between items-center bg-[#06140f]">
                  <h3 className="font-medium text-[#d8f3dc] flex items-center"><Activity size={16} className="mr-2 text-[#52b788]"/> Live Logs</h3>
                </div>
                <div className="p-4 overflow-y-auto flex-1 font-mono text-sm space-y-2">
                  {logs.map((log, i) => (
                    <div key={i} className="flex space-x-3">
                      <span className="text-[#40916c] shrink-0">[{new Date(log.created_at).toLocaleTimeString()}]</span>
                      <span className={`shrink-0 ${log.type === 'error' ? 'text-rose-400/90' : log.type === 'signal' ? 'text-[#b7e4c7]' : log.type === 'operator' ? 'text-[#74c69d]' : 'text-[#52b788]'}`}>[{log.type.toUpperCase()}]</span>
                      <span className="text-[#95d5b2]">{log.message}</span>
                    </div>
                  ))}
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
                          <button onClick={() => fetch(`/api/sessions/${session.id}`, { method: 'DELETE' }).then(fetchData)} className="text-rose-400/90 hover:text-rose-300 font-medium">Delete</button>
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
                  <button onClick={handleStartScraper} className="bg-[#74c69d] hover:bg-[#52b788] text-black px-6 py-2 rounded-lg font-bold transition-all border-4 border-[#95d5b2] shadow-[2px_2px_0px_0px_#95d5b2] active:translate-y-[2px] active:shadow-none flex items-center">
                    <Database size={18} className="mr-2" /> Scrape Now
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
                  <button onClick={handleStartListener} className="bg-[#52b788] hover:bg-[#40916c] text-black px-6 py-2 rounded-lg font-bold transition-all border-4 border-[#95d5b2] shadow-[2px_2px_0px_0px_#95d5b2] active:translate-y-[2px] active:shadow-none flex items-center">
                    <Play size={18} className="mr-2" /> Start Listener
                  </button>
                  <button onClick={handleStopListener} className="bg-rose-400 hover:bg-rose-500 text-black px-6 py-2 rounded-lg font-bold transition-all border-4 border-[#95d5b2] shadow-[2px_2px_0px_0px_#95d5b2] active:translate-y-[2px] active:shadow-none flex items-center">
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
                    className="w-full bg-[#52b788] hover:bg-[#74c69d] text-black font-bold py-2 px-4 rounded-lg transition-all border-4 border-[#95d5b2] shadow-[2px_2px_0px_0px_#95d5b2] active:translate-y-[2px] active:shadow-none"
                  >
                    Execute Action
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
                    className="w-full bg-[#52b788] hover:bg-[#40916c] text-black font-bold py-3 px-4 rounded-lg transition-all border-4 border-[#95d5b2] shadow-[4px_4px_0px_0px_#95d5b2] active:translate-y-[2px] active:shadow-none mt-4"
                  >
                    Execute Twitter Action
                  </button>
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
                <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-8 shadow-lg shadow-black/80">
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
                <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-8 shadow-lg shadow-black/80">
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
                <div className="bg-[#06140f] border-4 border-[#95d5b2] rounded-xl p-8 shadow-lg shadow-black/80">
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
                    <button onClick={handleStartOperator} className="bg-[#52b788] hover:bg-[#40916c] text-black px-6 py-2 rounded-lg font-bold transition-all border-4 border-[#95d5b2] shadow-[2px_2px_0px_0px_#95d5b2] active:translate-y-[2px] active:shadow-none flex items-center">
                      <Play size={18} className="mr-2" /> Start Operator
                    </button>
                    <button onClick={handleStopOperator} className="bg-rose-400 hover:bg-rose-500 text-black px-6 py-2 rounded-lg font-bold transition-all border-4 border-[#95d5b2] shadow-[2px_2px_0px_0px_#95d5b2] active:translate-y-[2px] active:shadow-none flex items-center">
                      <Square size={18} className="mr-2" /> Stop Operator
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

