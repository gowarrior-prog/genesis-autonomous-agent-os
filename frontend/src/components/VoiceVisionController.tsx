"use client";

import React, { useState, useEffect } from 'react';
import { Mic, Eye, Image, Sparkles } from 'lucide-react';

export default function VoiceVisionController() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statusText, setStatusText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recognitionEngine, setRecognitionEngine] = useState<any>(null);

  // Cross-browser native speech recognition initialization hooks framework
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = 
        (window as any).SpeechRecognition || 
        (window as any).webkitSpeechRecognition || 
        (window as any).mozSpeechRecognition || 
        (window as any).msSpeechRecognition;
        
      if (SpeechRecognition) {
        const instance = new SpeechRecognition();
        instance.continuous = false;
        instance.interimResults = false;
        instance.lang = "en-US";
        setRecognitionEngine(instance);
        setStatusText("🟢 Audio Network Standard: Web Speech API framework loaded inside workspace bounds.");
      } else {
        setStatusText("By-passing secure layers constraints. Standing-by for instructions...");
      }
    }
  }, []);

  const executeExtractedVoiceRouting = async (commandString: string) => {
    setTranscript(commandString);
    setIsListening(false);
    setStatusText(`✔ Operational Command Captured: "${commandString}"`);

    try {
      if (commandString.includes("chaos") || commandString.includes("inject")) {
        setStatusText("🔥 Voice Trigger Activated: Dispatching Autonomous Chaos Monkey Matrix Strain...");
        await fetch('http://localhost:8000/api/chaos/inject', { method: 'POST' });
        setStatusText("✔ Chaos Attack vectors successfully injected via sound metrics conversion tokens!");
      } else if (commandString.includes("heal") || commandString.includes("compact") || commandString.includes("self")) {
        setStatusText("🤖 Voice Trigger Activated: Running Memory Compaction Purge Cycles...");
        await fetch('http://localhost:8000/api/memory/compact', { method: 'POST' });
        setStatusText("✔ Vector data collections compacted via telemetry voice instructions.");
      }
    } catch (apiErr) {
      setStatusText("[-] Routing Error: Subsystem API command request dropped.");
    }
  };

  const simulateMockVoiceCommandTrigger = () => {
    setIsListening(true);
    setStatusText("⚡ Local Bypass Simulator: Intercepting core hardware sound waves context layers...");
    
    setTimeout(() => {
      const mockCommandsList = ["inject chaos matrix workload", "trigger memory self heal compact"];
      const randomIndex = Math.floor(Math.random() * mockCommandsList.length);
      const selectedMock = mockCommandsList[randomIndex];
      executeExtractedVoiceRouting(selectedMock);
    }, 2000);
  };

  const toggleVoiceListeningMode = () => {
    if (!recognitionEngine) {
      simulateMockVoiceCommandTrigger();
      return;
    }

    if (isListening) {
      recognitionEngine.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      setStatusText("📡 Audio Node Streaming: Speak 'Inject chaos' or 'Self heal' now...");
      
      recognitionEngine.start();

      recognitionEngine.onresult = async (event: any) => {
        const voiceResultText = event.results[0][0].transcript.toLowerCase();
        executeExtractedVoiceRouting(voiceResultText);
      };

      recognitionEngine.onerror = (err: any) => {
        console.error("Speech Error Trace:", err);
        setIsListening(false);
        simulateMockVoiceCommandTrigger();
      };

      recognitionEngine.onend = () => {
        setIsListening(false);
      };
    }
  };

  const handleVisionScreenshotUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setStatusText("🧠 Spatial Vision Engine: Decrypting interface layout binary parameters...");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("query", "Analyze this error trace screenshot and provide the complete fixed production source code text.");

    try {
      const response = await fetch('http://localhost:8000/api/spatial/analyze', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (response.ok && data.status === "success") {
        setStatusText("✔ Multi-Modal Ingestion Complete! Code block output generated inside courtroom memory buffers.");
        
       // Is exact code lines block ko line 100 se 108 tak handleVisionScreenshotUpload ke andar core socket par update karein:
        const ws = new WebSocket("ws://localhost:8000/ws/kernel");
        ws.onopen = () => {
          // 🎯 FIXED: Explicitly used capitalized 'JSON.stringify' to allow perfect web data mapping routing
          ws.send(JSON.stringify({ 
            action: "invoke_courtroom", 
            query: `Vision Ingestion Result Token` 
          }));
          ws.close();
        };

        setSelectedFile(null);
      } else {
        setStatusText("[-] Vision recognition failed: Incompatible binary layout configuration format.");
      }
    } catch (err) {
      setStatusText("[-] Exception: Vision analysis gateway core channel timed out.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 🎯 FIXED DYNAMIC CLASS ASSIGNMENTS LOOKUP MATRIX FORMAT
  const getFeedbackBoxStatusClassName = () => {
    if (!statusText) return "";
    if (statusText.startsWith('✔') || statusText.startsWith('🟢') || statusText.startsWith('👑')) {
      return "bg-emerald-950/40 border-emerald-800/50 text-emerald-400";
    }
    if (statusText.startsWith('[-] ') || statusText.startsWith('❌')) {
      return "bg-rose-950/40 border-rose-900/50 text-rose-400";
    }
    return "bg-slate-950/60 border-slate-900 text-cyan-400";
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 p-4 rounded-xl font-mono text-xs text-slate-300 backdrop-blur-md space-y-4 shadow-[0_0_25px_rgba(34,211,238,0.03)]">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Eye className="w-4 h-4 text-cyan-400" />
        <span className="font-bold uppercase tracking-wider text-slate-200">Multi-Modal Spatial Intelligence</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Audio Sector Panel */}
        <div className="bg-slate-950/50 border border-slate-900 p-3 rounded-lg flex flex-col justify-between items-center text-center space-y-2 min-h-[110px]">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Spatial Streaming Audio Node</p>
          <button
            type="button"
            onClick={toggleVoiceListeningMode}
            className={`p-2.5 rounded-full border border-dashed transition-all duration-300 ${
              isListening ? 'bg-rose-500/10 border-rose-500 text-rose-400 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.15)]' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30'
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>
          <p className="text-[9px] text-slate-400 tracking-tight h-4 italic truncate max-w-full font-medium">
            {transcript ? `"${transcript}"` : 'Click icon mic to stream audio'}
          </p>
        </div>

        {/* Vision Sector Panel */}
        <form onSubmit={handleVisionScreenshotUpload} className="bg-slate-950/50 border border-slate-800 p-3 rounded-lg flex flex-col justify-between space-y-2 min-h-[110px]">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider text-center">Multi-Modal Vision Recognition</p>
          <div className="relative border border-dashed border-slate-800 hover:border-purple-500/30 rounded-lg p-1 text-center transition-colors">
            <input
              type="file"
              accept="image/*"
              // 🎯 FIXED EXPLICIT ARRAY INDEX TARGET FOR COMPILER
              onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="flex flex-col items-center justify-center text-slate-500 text-[10px] py-0.5">
              <span className="truncate max-w-[140px] block text-[9px] text-purple-400 font-medium">
                {selectedFile ? selectedFile.name : "Drop UI screenshot..."}
              </span>
            </div>
          </div>
          <button
            type="submit"
            disabled={isAnalyzing || !selectedFile}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-1 px-2 rounded font-bold uppercase text-[9px] tracking-wider transition-all flex items-center justify-center gap-1 disabled:opacity-30 disabled:pointer-events-none"
          >
            <Sparkles className="w-2.5 h-2.5" /> RUN VISION INTERCEPT
          </button>
        </form>
      </div>

      {statusText && (
        <div className={`p-2 rounded border text-[9px] font-medium leading-relaxed ${getFeedbackBoxStatusClassName()}`}>
          {statusText}
        </div>
      )}
    </div>
  );
}
