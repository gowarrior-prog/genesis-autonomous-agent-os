"use client";

import dynamic from 'next/dynamic';
import { useMemorySync } from '../hooks/useMemorySync';
import SandboxGrid from '../components/SandboxGrid';
import AgentArena from '../components/AgentArena';
import MemoryForm from '../components/MemoryForm';
import GenesisWizardV1 from '../components/GenesisWizardV1';
import GenesisWizard from '../components/GenesisWizard';
import EvolutionPanel from '../components/EvolutionPanel';
import VoiceVisionController from '../components/VoiceVisionController';

const MemoryVisualizer = dynamic(
  () => import('../components/MemoryVisualizer'),
  { ssr: false }
);

export default function Home() {
  const { isConnected } = useMemorySync();

  return (
    <main className="w-screen h-screen overflow-hidden bg-slate-950 p-4 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-4 relative font-mono text-xs">
      
      {/* Absolute Master System Core Network Pulse Indicator Dot */}
      <div className="absolute top-2 right-6 z-50 flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-full backdrop-blur-md text-[10px] tracking-widest font-mono">
        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-rose-500 animate-pulse'}`} />
        <span className={isConnected ? 'text-emerald-400' : 'text-slate-500'}>
          {isConnected ? 'KERNEL MESH: ACTIVE' : 'KERNEL MESH: DISCONNECTED'}
        </span>
      </div>

      {/* COLUMN 1: 3D Memory Visualizer, Neural Form, Genesis v1, Genesis v2, aur Multi-Modal controls */}
      <div className="flex flex-col gap-3 h-full overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800/60">
        <div className="h-[28%] relative border border-slate-800 rounded-xl overflow-hidden shadow-2xl bg-slate-950/20 shrink-0">
          <MemoryVisualizer />
        </div>
        <div className="space-y-3 pb-6 flex-1">
          <MemoryForm />
          <GenesisWizardV1 />
          <GenesisWizard />
          <VoiceVisionController />
        </div>
      </div>

      {/* COLUMN 2: Meta-Evolution Analytics Panel aur RE-INSTALLED Quantum Console Sandbox Grid */}
      {/* 🎯 FIXED: Re-injected SandboxGrid seamlessly back into the layout array stack! */}
      <div className="h-full flex flex-col gap-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800/60">
        <EvolutionPanel />
        <div className="flex-1 min-h-[350px]">
          <SandboxGrid />
        </div>
      </div>

      {/* COLUMN 3: AI Agent Courtroom Arena Dialogue Panel */}
      <div className="h-full flex flex-col overflow-hidden shadow-2xl">
        <AgentArena />
      </div>

    </main>
  );
}
