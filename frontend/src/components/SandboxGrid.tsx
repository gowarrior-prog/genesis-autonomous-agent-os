"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, Zap, Flame } from 'lucide-react';

type EnvMode = 'Dev' | 'Staging' | 'Chaos';

interface LogLine {
  timestamp: string;
  stream: 'stdout' | 'stderr' | 'system';
  message: string;
}

export default function SandboxGrid() {
  const [activeTab, setActiveTab] = useState<EnvMode>('Dev');
  const [cpuUsage, setCpuUsage] = useState(12);
  const [ramUsage, setRamUsage] = useState(41);
  const [isInjecting, setIsInjecting] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);
  
  const [logs, setLogs] = useState<LogLine[]>([
    { timestamp: '12:04:11', stream: 'system', message: '🔥 Firecracker MicroVM hypervisor initialized.' },
    { timestamp: '12:04:12', stream: 'stdout', message: '🚀 WebAssembly runtime engine injected into sandbox isolation container.' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const baseMultiplier = activeTab === 'Chaos' ? 4.5 : activeTab === 'Staging' ? 1.8 : 1.0;
      setCpuUsage(Math.floor(Math.min(99, 14 + Math.random() * 12 * baseMultiplier)));
      setRamUsage(Math.floor(Math.min(99, 38 + Math.random() * 6 * baseMultiplier)));

      if (Math.random() > 0.3) {
        const streamType = Math.random() > 0.88 ? 'stderr' : Math.random() > 0.75 ? 'system' : 'stdout';
        const msgs = {
          Dev: ['[Docker] Volume compiled successfully.', 'Hot-reload event synched in 42ms.', 'Sandbox instance snapshots frozen.'],
          Staging: ['Router mesh health check: 100% operational.', 'Proxy tunnel traffic routed via air-gapped VM.', 'Database backup cluster mounted.'],
          Chaos: ['⚠️ CRITICAL: Injecting packet loss on cluster node 4B.', 'Simulating microVM kernel panic overrides.', 'AI Hallucination engine counter-shield deployment.']
        };
        const selectedMsg = msgs[activeTab][Math.floor(Math.random() * msgs[activeTab].length)];
        
        setLogs(prev => [
          ...prev.slice(-40),
          { timestamp: new Date().toLocaleTimeString(), stream: streamType, message: selectedMsg }
        ]);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [activeTab]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Direct Live Integration with Backend Chaos Monkey API Endpoint
  const handleInjectChaos = async () => {
    setIsInjecting(true);
    const now = new Date().toLocaleTimeString();
    
    setLogs(prev => [...prev, { timestamp: now, stream: 'system', message: '☣️ Triggering external attack vector request payload...' }]);

    try {
      const response = await fetch('http://localhost:8000/api/chaos/inject', { method: 'POST' });
      const data = await response.json();

      if (response.ok) {
        setLogs(prev => [
          ...prev,
          { timestamp: new Date().toLocaleTimeString(), stream: 'stderr', message: `🔥 CHAOS SUCCESS: Injected malicious vector -> [${data.vector}]` }
        ]);
        setActiveTab('Chaos'); // Automatically switches active tab interface visualization to Chaos mode
      }
    } catch (error) {
      console.error(error);
      setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), stream: 'stderr', message: '[-] Connection Failure: Chaos subsystem node unreachable.' }]);
    } finally {
      setIsInjecting(false);
    }
  };

  return (
    <div className="w-full h-full bg-slate-950/40 border border-emerald-500/20 rounded-xl flex flex-col overflow-hidden font-mono shadow-[0_0_30px_rgba(16,185,129,0.05)] backdrop-blur-xl">
      
      {/* Top Chrome Bar */}
      <div className="bg-slate-900/90 border-b border-emerald-500/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-bold tracking-widest text-slate-200 text-xs uppercase">Quantum VM Cluster v2.0</span>
        </div>

        {/* Tactical Attack Execution Control Button */}
        <button
          onClick={handleInjectChaos}
          disabled={isInjecting}
          className="bg-slate-950 hover:bg-rose-950/40 border border-rose-500/40 hover:border-rose-400 text-rose-400 font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 shadow-[0_0_15px_rgba(244,63,94,0.05)]"
        >
          <Flame className={`w-3.5 h-3.5 ${isInjecting ? 'animate-bounce' : ''}`} />
          {isInjecting ? 'Injecting...' : 'Inject Chaos'}
        </button>
      </div>

      {/* Cyber Tab Controller */}
      <div className="p-3 bg-slate-950/20 border-b border-emerald-500/10 flex justify-end">
        <div className="flex bg-slate-950/80 p-1 border border-slate-800/80 rounded-lg">
          {(['Dev', 'Staging', 'Chaos'] as EnvMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setActiveTab(mode)}
              className={`px-4 py-1 text-[10px] font-semibold rounded-md transition-all duration-300 uppercase tracking-wider ${
                activeTab === mode
                  ? mode === 'Chaos'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Metrics Displays */}
      <div className="grid grid-cols-2 border-b border-emerald-500/10 bg-slate-900/30 px-4 py-3 gap-4">
        <div className="bg-slate-950/60 border border-slate-900 p-3 rounded-lg flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              <Zap className="w-3 h-3 text-amber-400" /> Engine Compute
            </span>
            <span className={`text-xs font-bold ${cpuUsage > 75 ? "text-rose-500 animate-pulse" : "text-amber-400"}`}>
              {cpuUsage}%
            </span>
          </div>
          <div className="w-full bg-slate-900/80 h-1.5 rounded-full overflow-hidden p-[1px] border border-slate-800">
            <div className={`h-full rounded-full transition-all duration-300 ${cpuUsage > 75 ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-gradient-to-r from-emerald-500 to-amber-400'}`} style={{ width: `${cpuUsage}%` }} />
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-900 p-3 rounded-lg flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              <Shield className="w-3 h-3 text-cyan-400" /> Isolated Allocation
            </span>
            <span className={`text-xs font-bold ${ramUsage > 75 ? "text-rose-500" : "text-cyan-400"}`}>
              {ramUsage}%
            </span>
          </div>
          <div className="w-full bg-slate-900/80 h-1.5 rounded-full overflow-hidden p-[1px] border border-slate-800">
            <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-300" style={{ width: `${ramUsage}%` }} />
          </div>
        </div>
      </div>

      {/* Terminal Real-Time Stream Engine */}
      <div ref={logContainerRef} className="flex-1 p-4 bg-slate-950/90 overflow-y-auto space-y-2 text-[11px] leading-relaxed">
        {logs.map((log, idx) => (
          <div key={idx} className="flex gap-3 hover:bg-slate-900/40 p-1 rounded transition-colors duration-150">
            <span className="text-slate-600 select-none shrink-0 font-light">{log.timestamp}</span>
            <span className={`shrink-0 font-bold tracking-wide text-[9px] uppercase px-1.5 py-0.5 rounded-sm ${
              log.stream === 'stderr' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : log.stream === 'system' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-emerald-500/5 text-emerald-400 border border-emerald-500/10'
            }`}>
              {log.stream}
            </span>
            <span className={log.stream === 'stderr' ? 'text-rose-400 font-medium' : log.stream === 'system' ? 'text-purple-300' : 'text-slate-300'}>
              {log.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
