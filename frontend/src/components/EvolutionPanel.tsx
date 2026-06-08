"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Network, Sparkles, CheckCircle2, RefreshCw, AlertTriangle } from 'lucide-react';

interface EvolutionProposal {
  task_reference: string;
  timestamp: string;
  proposed_mutations: {
    prompt_template: string;
    workflow_graph: string;
    memory_schema: string;
    new_agent_spawning: string;
  };
  risk_classification: 'LOW_RISK' | 'CRITICAL_RISK';
}

export default function EvolutionPanel() {
  const [proposal, setProposal] = useState<EvolutionProposal | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isApproving, setIsApproving] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      socketRef.current = new WebSocket("ws://localhost:8000/ws/kernel");

      socketRef.current.onopen = () => {
        setIsConnected(true);
        setStatusMessage('🔌 Connected to Evolution Kernel');
      };

      socketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === "evolution_agent_proposal") {
            setProposal(data.payload);
            setStatusMessage('📡 New evolutionary self-critique pattern detected from task loop!');
          }
        } catch (err) {
          console.error("WebSocket message parse error:", err);
        }
      };

      socketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
        setStatusMessage('❌ WebSocket connection failed');
      };

      socketRef.current.onclose = () => {
        setIsConnected(false);
        setStatusMessage('⚠️ Connection closed. Reconnecting...');
        
        // Auto-reconnect
        setTimeout(() => {
          if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
            connectWebSocket();
          }
        }, 3000);
      };
    };

    connectWebSocket();

    return () => {
      socketRef.current?.close();
    };
  }, []);

  const handleApproveEvolution = async () => {
    if (!proposal) return;

    setIsApproving(true);
    setStatusMessage('⚡ Running Sandbox Validations (PyTest) & Creating Git Safety Checkpoints...');

    try {
      const response = await fetch('http://localhost:8000/api/evolution/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suggestion_object: proposal })
      });

      const data = await response.json();

      if (response.ok && data.status === "EVOLUTION_LOCKED_IN") {
        setStatusMessage(`👑 SYSTEM MUTATION LOCKED-IN! Evolved to Version ${data.version || 'X.Y.Z'}.`);
        setProposal(null);
      } else {
        setStatusMessage('[-] Mutation aborted: Sandbox unit-test constraints validation failed.');
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('[-] Rollback Triggered: Handshake crash detected. Stash branch safely restored.');
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="w-full bg-slate-900/60 border border-purple-500/20 p-4 rounded-xl font-mono text-xs text-slate-300 backdrop-blur-md shadow-[0_0_20px_rgba(147,51,234,0.05)]">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Network className={`w-4 h-4 ${isConnected ? 'text-purple-400' : 'text-slate-500'}`} />
          <span className="font-bold uppercase tracking-wider text-slate-200">
            Autonomous Evolution Engine v2
          </span>
        </div>
        
        <div className={`flex items-center gap-1.5 text-[8px] font-bold px-2 py-0.5 border rounded uppercase ${isConnected ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' : 'bg-slate-950 text-slate-600 border-slate-900'}`}>
          {isConnected ? '⚡ LIVE' : '⏹ OFFLINE'}
        </div>
      </div>

      {!proposal ? (
        <div className="h-28 flex flex-col items-center justify-center text-slate-600 text-[10px] uppercase tracking-widest text-center p-2 border border-dashed border-slate-900 rounded-lg">
          <RefreshCw className="w-5 h-5 mb-3 opacity-40 animate-spin" style={{ animationDuration: '8s' }} />
          Waiting for major task execution to trigger meta-learning critique...
        </div>
      ) : (
        <div className="space-y-3 animate-fade-in">
          <div className="bg-slate-950 p-3 rounded border border-slate-800 text-[10px] space-y-1">
            <p className="text-slate-400">
              <span className="text-purple-400 font-bold">TASK:</span> {proposal.task_reference}
            </p>
            <p className="text-slate-400">
              <span className="text-purple-400 font-bold">RISK LEVEL:</span>{' '}
              <span className={`font-bold ${proposal.risk_classification === 'CRITICAL_RISK' ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`}>
                [{proposal.risk_classification}]
              </span>
            </p>
          </div>

          <div className="space-y-2">
            {[
              { label: "Prompt Architecture", value: proposal.proposed_mutations.prompt_template },
              { label: "Sub-Agent Topology", value: proposal.proposed_mutations.new_agent_spawning },
              { label: "Workflow Graph", value: proposal.proposed_mutations.workflow_graph },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-slate-950/50 p-3 border border-slate-800 rounded">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div className="text-[11px]">
                  <span className="text-slate-500 font-bold uppercase text-[9px] block tracking-widest mb-0.5">
                    {item.label}
                  </span>
                  <span className="text-slate-300 break-words">{item.value}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleApproveEvolution}
            disabled={isApproving}
            className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-600 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold py-3 px-4 rounded-lg uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(147,51,234,0.2)] flex items-center justify-center gap-2 disabled:cursor-not-allowed"
          >
            <Sparkles className={`w-4 h-4 ${isApproving ? 'animate-spin' : ''}`} />
            {isApproving ? 'MUTATING SYSTEM...' : 'APPROVE & APPLY MUTATIONS'}
          </button>
        </div>
      )}

      {statusMessage && (
        <div className={`mt-4 p-3 rounded border text-[10px] leading-relaxed font-medium ${
          statusMessage.includes('👑') || statusMessage.includes('LOCKED-IN')
            ? 'bg-emerald-950/60 border-emerald-700/50 text-emerald-300'
            : statusMessage.includes('[-]') || statusMessage.includes('❌')
            ? 'bg-rose-950/60 border-rose-700/50 text-rose-300'
            : 'bg-slate-950/70 border-slate-700 text-purple-400'
        }`}>
          {statusMessage}
        </div>
      )}
    </div>
  );
}