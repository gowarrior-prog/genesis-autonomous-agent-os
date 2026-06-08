"use client";

import React, { useState } from 'react';
import { Code2, Zap } from 'lucide-react';

export default function GenesisWizardV1() {
  const [projectName, setProjectName] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleLaunchGenesisV1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    setIsGenerating(true);
    setStatusMessage('🧠 Genesis v1: Building boilerplate microservice scaffold code blocks...');

    try {
      const response = await fetch('http://localhost:8000/api/genesis/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_name: projectName,
          framework: "FastAPI Boilerplate Stack"
        })
      });

      if (response.ok) {
        setStatusMessage(`✓ Microservice Code Spawned! Path: ./sandbox_workspace/${projectName}`);
        setProjectName('');
      } else {
        setStatusMessage('[-] Scaffolding warning: Pipeline connection rejected.');
      }
    } catch (err) {
      setStatusMessage('[-] Exception: Master genesis server unreachable.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 p-4 rounded-xl font-mono text-xs text-slate-300 backdrop-blur-md shadow-[0_0_15px_rgba(56,189,248,0.05)]">
      <div className="flex items-center gap-2 mb-3 border-b border-slate-800 pb-2">
        <Code2 className="w-4 h-4 text-sky-400" />
        <span className="font-bold uppercase tracking-wider text-slate-200">Project Genesis Engine v1</span>
      </div>

      <form onSubmit={handleLaunchGenesisV1} className="space-y-3">
        <div>
          <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Microservice Blueprint Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="e.g. baseline-fastapi-service"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 placeholder-slate-700 focus:outline-none focus:border-sky-500/40"
          />
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full bg-sky-600 hover:bg-sky-500 text-slate-950 font-bold py-2.5 px-3 rounded-lg tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(14,165,233,0.15)]"
        >
          <Zap className={`w-3.5 h-3.5 ${isGenerating ? 'animate-pulse' : ''}`} />
          {isGenerating ? 'SCAFFOLDING...' : 'LAUNCH GENESIS V1 CODE'}
        </button>
      </form>

      {statusMessage && (
        <div className={`mt-3 p-2 rounded border text-[10px] font-medium ${
          statusMessage.startsWith('✓') ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400' : 'bg-slate-950/60 border-slate-900 text-purple-400'
        }`}>
          {statusMessage}
        </div>
      )}
    </div>
  );
}
