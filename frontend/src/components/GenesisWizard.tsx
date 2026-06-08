"use client";

import React, { useState } from 'react';
import { Cpu, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';

export default function GenesisWizard() {
  const [projectName, setProjectName] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [artifacts, setArtifacts] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleLaunchGenesisV2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    setIsGenerating(true);
    setStatusMessage('🧠 Genesis Engine v2: Architectural models analyzing DevOps constraints...');
    setArtifacts([]);

    try {
      const response = await fetch('http://localhost:8000/api/genesis/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_name: projectName,
          framework: "FastAPI Production Mesh"
        })
      });

      const data = await response.json();
      if (response.ok && data.status === "success") {
        setStatusMessage(`✓ DevOps Blueprint Deployed! Path: ./sandbox_workspace/${data.project_deployed}`);
        setArtifacts(data.artifacts_generated);
        setProjectName('');
      } else {
        setStatusMessage('[-] Scaffolding alert: Genesis pipelines interrupted.');
      }
    } catch (err) {
      setStatusMessage('[-] Exception: Master genesis connection core dropped.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 p-4 rounded-xl font-mono text-xs text-slate-300 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-3 border-b border-slate-800 pb-2">
        <Cpu className="w-4 h-4 text-purple-400" />
        <span className="font-bold uppercase tracking-wider text-slate-200">Project Genesis Engine v2</span>
      </div>

      <form onSubmit={handleLaunchGenesisV2} className="space-y-3">
        <div>
          <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Production DevOps Identity</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="e.g. cloud-native-telemetry-cluster"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 placeholder-slate-700 focus:outline-none focus:border-purple-500/40"
          />
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-2.5 px-3 rounded-lg tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'ORCHESTRATING...' : 'EXECUTE PRODUCTION DEVOPS MODE'}
        </button>
      </form>

      {statusMessage && (
        <div className={`mt-3 p-2.5 rounded border text-[10px] font-medium ${
          statusMessage.startsWith('✓') ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400' : 'bg-slate-950/60 border-slate-900 text-purple-400'
        }`}>
          {statusMessage}
        </div>
      )}

      {artifacts.length > 0 && (
        <div className="mt-3 bg-slate-950/80 p-3 rounded-lg border border-slate-900 animate-fade-in space-y-2">
          <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1"><Terminal className="w-3 h-3 text-cyan-400" /> Generated DevOps Assets:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
            {artifacts.map((artifact, aIdx) => (
              <div key={aIdx} className="flex items-center gap-1.5 text-slate-300 text-[10px]">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">{artifact}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
