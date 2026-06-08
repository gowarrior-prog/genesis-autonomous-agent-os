"use client";

import React, { useState } from 'react';
import { Database, PlusCircle, Activity } from 'lucide-react';

export default function MemoryForm() {
  const [insightText, setInsightText] = useState('');
  const [nodeType, setNodeType] = useState<'vector' | 'graph' | 'episodic'>('vector');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!insightText.trim()) return;

    setIsSubmitting(true);
    setStatusMessage('Syncing data packets across neural mesh...');

    try {
      // Sending payload straight to the FastAPI commit endpoint configuration
      const response = await fetch('http://localhost:8000/api/memory/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: String(Math.floor(Math.random() * 900000) + 100000),
          text: insightText,
          type: nodeType,
          parent_id: "1"
        })
      });

      if (response.ok) {
        setStatusMessage('✓ Package atomically committed to database clusters.');
        setInsightText('');
      } else {
        setStatusMessage('[-] Target pipeline rejected processing execution parameters.');
      }
    } catch (error) {
      console.error(error);
      setStatusMessage('[-] Connection exception: Backend server offline or network blocked.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatusMessage(''), 4000);
    }
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setStatusMessage('🤖 Memory Agent: Compacting clusters...');
    try {
      const response = await fetch('http://localhost:8000/api/memory/compact', { method: 'POST' });
      const data = await response.json();
      if (response.ok && data.action === "COMPACTED") {
        setStatusMessage(`✨ System Healed! Processed ${data.nodes_processed} nodes.`);
      } else {
        setStatusMessage(`✅ System Optimal. No dynamic compression needed.`);
      }
    } catch (error) {
      setStatusMessage('[-] Optimization node communication broken.');
    } finally {
      setIsOptimizing(false);
      setTimeout(() => setStatusMessage(''), 4000);
    }
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 p-4 rounded-xl font-mono text-xs text-slate-300 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-3 border-b border-slate-800 pb-2">
        <Database className="w-4 h-4 text-emerald-400" />
        <span className="font-bold uppercase tracking-wider text-slate-200">Neural Sync Command Input</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Insight Context String</label>
          <input
            type="text"
            value={insightText}
            onChange={(e) => setInsightText(e.target.value)}
            placeholder="Inject system trace logs or memory prompts here..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/40"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(['vector', 'graph', 'episodic'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setNodeType(type)}
              className={`py-2 px-1 rounded-md border text-center uppercase text-[10px] font-bold tracking-wider transition-all duration-200 ${
                nodeType === type
                  ? type === 'vector' ? 'bg-sky-500/10 border-sky-400 text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.15)]'
                  : type === 'graph' ? 'bg-purple-500/10 border-purple-500 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.15)]'
                  : 'bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.15)]'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-500 hover:text-slate-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="submit"
            disabled={isSubmitting || isOptimizing}
            className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-2.5 px-3 rounded-lg tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            {isSubmitting ? 'Syncing...' : 'Commit Packet'}
          </button>

          <button
            type="button"
            onClick={handleOptimize}
            disabled={isSubmitting || isOptimizing}
            className="bg-slate-950 border border-purple-500/40 hover:border-purple-400 text-purple-400 hover:text-purple-300 font-bold py-2.5 px-3 rounded-lg tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(168,85,247,0.05)]"
          >
            <Activity className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
            {isOptimizing ? 'Healing...' : 'Self-Heal'}
          </button>
        </div>
      </form>

      {statusMessage && (
        <div className={`mt-3 p-2 rounded border text-[10px] font-medium animate-pulse ${
          statusMessage.startsWith('✓') || statusMessage.includes('✨') || statusMessage.includes('✅')
            ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400' 
            : 'bg-slate-950/80 border-slate-900 text-purple-400'
        }`}>
          {statusMessage}
        </div>
      )}
    </div>
  );
}
