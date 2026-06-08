"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Scale, Send, Copy, Download, Check, Play, Terminal, X } from 'lucide-react';

interface DebateMessage {
  agent: string;
  role: 'Supervisor' | 'Specialist' | 'Judge';
  text: any; // Dynamic tokens parameter to prevent string length calculation parse drops
  avatarColor: string;
  isFinalCode?: boolean;
}

// 🧠 TYPEWRITER ENGINE WITH INTEGRATED ARRAYS TYPECASTING PROTECTION
const TypewriterText = ({ text, delay = 4 }: { text: any; delay?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    // Force transform complex JSON structures or array tokens into readable text strings safely
    let cleanText = "";
    if (typeof text === 'string') {
      cleanText = text;
    } else if (Array.isArray(text)) {
      cleanText = text.join('\n');
    } else {
      cleanText = JSON.stringify(text, null, 2);
    }

    let index = 0;
    setDisplayedText('');
    
    const interval = setInterval(() => {
      if (index < cleanText.length) {
        setDisplayedText((prev) => prev + cleanText[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, delay);
    
    return () => clearInterval(interval);
  }, [text, delay]);

  return <pre className="whitespace-pre-wrap leading-relaxed font-mono text-[11px] break-all">{displayedText || '...'}</pre>;
};
export default function AgentArena() {
  const [taskQuery, setTaskQuery] = useState('');
  const [consensusScore, setConsensusScore] = useState(0);
  const [agreementSigned, setAgreementSigned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [debateLogs, setDebateLogs] = useState<DebateMessage[]>([]);
  const [copied, setCopied] = useState(false);
  
  // Live Virtual Sandbox Execution Interface Panel States
  const [showPreview, setShowPreview] = useState(false);
  const [previewOutput, setPreviewOutput] = useState<string[]>([]);
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [activeCodeSnippet, setActiveCodeSnippet] = useState('');

  const socketRef = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Synchronize dynamic duplex socket communication streaming routes with the micro-kernel
  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8000/ws/kernel");

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === "courtroom_log") {
        setDebateLogs((prev) => [...prev, {
          agent: data.agent,
          role: data.role,
          text: data.text,
          avatarColor: data.color,
          isFinalCode: data.is_final_code
        }]);

        if (data.consensus_score) setConsensusScore(data.consensus_score);
        if (data.agreement_signed) {
          setAgreementSigned(data.agreement_signed);
          setIsProcessing(false);
        }
      }
    };

    return () => socketRef.current?.close();
  }, []);

  const handleInvokeSwarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskQuery.trim() || !socketRef.current) return;

    setIsProcessing(true);
    setDebateLogs([]);
    setConsensusScore(15);
    setAgreementSigned(false);
    setShowPreview(false);

    socketRef.current.send(JSON.stringify({
      action: "invoke_courtroom",
      query: taskQuery
    }));

    setTaskQuery('');
  };

  const handleCopyCode = (codeText: any) => {
    const rawString = typeof codeText === 'string' ? codeText : JSON.stringify(codeText, null, 2);
    navigator.clipboard.writeText(rawString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = (codeText: any, agentName: string) => {
    const rawString = typeof codeText === 'string' ? codeText : JSON.stringify(codeText, null, 2);
    const element = document.createElement("a");
    const file = new Blob([rawString], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${agentName.toLowerCase()}_resolution_output.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // 🎯 VIRTUAL COMPILER SUBROUTINE: Isolates code snippets and generates terminal runtime logs simulation
   // 🎯 FIXED: Connected to backend engine to return genuine code execution outputs!
  const handleTriggerPreview = async (rawText: any) => {
    const textString = typeof rawText === 'string' ? rawText : JSON.stringify(rawText, null, 2);
    
    setShowPreview(true);
    setIsRunningCode(true);
    setPreviewOutput([
      "⚡ Initializing Secure Isolation Container Sandbox...",
      "📡 Transferring python source arrays to micro-kernel executor engine...",
      "⏳ Compiling code logic state structures..."
    ]);

    try {
      // Direct POST payload transaction request to our new sandbox engine endpoint
      const response = await fetch('http://localhost:8000/api/sandbox/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code_string: textString })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Splitting lines array sequence mapping to print output step by step
        const consoleLines = data.console_output.split('\n');
        setPreviewOutput([
          "✔ Sandbox Pipeline Handshake: Secure Verified Connection Established.",
          "\n--- [GENUINE PYTHON INTERPRETER LIVE OUTPUT CONSOLE] ---",
          ...consoleLines
        ]);
      } else {
        setPreviewOutput(["[-] Sandbox Error: Execution request rejected by micro-kernel core router."]);
      }
    } catch (err) {
      setPreviewOutput(["[-] Connection Exception: Dynamic compilation engine unreachable or offline."]);
    } finally {
      setIsRunningCode(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [debateLogs]);
  return (
    <div className="w-full h-full bg-slate-950/40 border border-purple-500/20 rounded-xl flex flex-col overflow-hidden font-mono shadow-[0_0_30px_rgba(168,85,247,0.05)] backdrop-blur-xl relative">
      
      {/* Header Bar */}
      <div className="bg-slate-900/90 border-b border-purple-500/10 px-4 py-3 flex items-center justify-between backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <Scale className={`w-4 h-4 text-purple-400 ${isProcessing ? 'animate-spin' : ''}`} />
          <span className="font-bold tracking-widest text-slate-200 text-xs uppercase">Agent Courtroom Arena</span>
        </div>
        <div className={`px-2 py-0.5 border rounded text-[9px] uppercase font-bold tracking-wider ${
          agreementSigned ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'bg-slate-950 text-slate-500 border-slate-800'
        }`}>
          {agreementSigned ? '🤝 Agreement Signed' : '⚖️ Idle Waiting'}
        </div>
      </div>

      {/* Consensus Tracker */}
      <div className="bg-slate-900/30 px-4 py-2 border-b border-purple-500/10 flex items-center justify-between shrink-0">
        <div className="flex-1">
          <div className="flex justify-between items-center text-slate-500 text-[9px] uppercase tracking-wider font-bold mb-1">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-purple-400"/> Consensus Score</span>
            <span className="text-purple-400 font-bold">{consensusScore}%</span>
          </div>
          <div className="w-full bg-slate-900/80 h-1 rounded-full p-[1px] border border-slate-800">
            <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-emerald-400 transition-all duration-500" style={{ width: `${consensusScore}%` }} />
          </div>
        </div>
      </div>

      {/* Debate Messages Stream Display Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/90 min-h-0">
        {debateLogs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-600 text-[10px] uppercase tracking-widest text-center p-4">
            {isProcessing ? '⚡ Streaming real-time agent transcripts via WebSockets...' : '🔒 Courtroom empty. Inject prompt query below to invoke agents collective.'}
          </div>
        ) : (
          debateLogs.map((log, idx) => (
            <div key={idx} className="flex flex-col gap-2 border border-slate-900/50 p-3 rounded-xl bg-slate-900/20 relative group transition-all hover:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[8px] uppercase tracking-wider font-bold px-2 py-0.5 border rounded-md ${log.avatarColor}`}>
                    {log.role}
                  </span>
                  <span className="text-slate-200 font-bold text-xs">{log.agent}</span>
                </div>
                
                {/* 🎯 ACTION TOOLS OVERLAYS WITH LIVE RUN PREVIEW TRIGGER BUTTON CONTROL */}
                {log.isFinalCode && (
                  <div className="flex items-center gap-2 bg-slate-950/90 border border-slate-800 rounded-lg p-1 shrink-0 shadow-lg">
                    <button
                      onClick={() => handleTriggerPreview(log.text)}
                      className="hover:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-400 text-[9px] font-bold tracking-widest flex items-center gap-1 transition-all"
                      title="Run Live Script Preview Code"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" /> RUN PREVIEW
                    </button>
                    <button
                      onClick={() => handleCopyCode(log.text)}
                      className="hover:bg-slate-900 p-1 rounded text-slate-400 hover:text-cyan-400 transition-colors"
                      title="Copy Content"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => handleDownloadCode(log.text, log.agent)}
                      className="hover:bg-slate-900 p-1 rounded text-slate-400 hover:text-purple-400 transition-colors"
                      title="Download File"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Text Area Scope */}
              <div className={`pl-2 border-l border-slate-800 leading-relaxed text-xs ${log.isFinalCode ? 'text-slate-100 bg-slate-950/40 p-2.5 rounded-lg border border-slate-900/60 font-mono overflow-x-auto text-[11px]' : 'text-slate-400'}`}>
                {log.isFinalCode ? (
                  <TypewriterText text={log.text} delay={4} />
                ) : (
                  <p>{typeof log.text === 'string' ? log.text : JSON.stringify(log.text)}</p>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* 🚀 VIRTUAL HOLOGRAPHIC SANDBOX PREVIEW OVERLAY CONSOLE PANEL WINDOW */}
      {showPreview && (
        <div className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col p-4 animate-fade-in font-mono border border-emerald-500/30 rounded-xl m-2 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3 shrink-0">
            <div className="flex items-center gap-2">
              <Terminal className={`w-4 h-4 text-emerald-400 ${isRunningCode ? 'animate-pulse' : ''}`} />
              <span className="text-slate-200 text-xs font-bold uppercase tracking-widest">Virtual Execution Sandbox Panel</span>
            </div>
            <button 
              onClick={() => setShowPreview(false)}
              className="p-1 hover:bg-slate-900 rounded text-slate-500 hover:text-rose-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Virtual Terminal Screen Logs Trace */}
          <div className="flex-1 bg-slate-950 border border-slate-900 rounded-lg p-3 text-[11px] text-slate-300 overflow-y-auto space-y-1.5 selection:bg-emerald-500/10">
            {previewOutput.map((line, lIdx) => (
              <p 
                key={lIdx} 
                className={
                  line.startsWith('✔') || line.startsWith('✨') ? 'text-emerald-400 font-bold' :
                  line.startsWith('INFO:') ? 'text-sky-400' :
                  line.startsWith('⚠️') ? 'text-amber-400' :
                  line.startsWith('[-] ') || line.startsWith('[❌') ? 'text-rose-400' : 'text-slate-400'
                }
              >
                {line}
              </p>
            ))}
          </div>
          <div className="mt-2 text-right text-[9px] text-slate-600 uppercase tracking-widest">
            {isRunningCode ? '⚡ COMPILING PIPELINES...' : '⏹ INFERENCE COMPLETED'}
          </div>
        </div>
      )}

      {/* Input Query Dispatcher Bar */}
      <form onSubmit={handleInvokeSwarm} className="p-3 bg-slate-900 border-t border-purple-500/10 flex gap-2 shrink-0 sticky bottom-0 z-30">
        <input
          type="text"
          value={taskQuery}
          onChange={(e) => setTaskQuery(e.target.value)}
          placeholder="Enter agent deployment task query..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs placeholder-slate-700 focus:outline-none focus:border-purple-500/40"
        />
        <button
          type="submit"
          disabled={isProcessing}
          className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-lg flex items-center justify-center transition-colors text-xs shrink-0"
        >
          {isProcessing ? '...' : 'SEND'}
        </button>
      </form>
    </div>
  );
}
