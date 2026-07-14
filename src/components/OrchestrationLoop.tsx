/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronRight, Terminal, Eye, CheckCircle2, ShieldAlert } from "lucide-react";

interface Step {
  id: number;
  label: string;
  icon: string;
  sub: string;
  details: string;
  log: string;
}

const steps: Step[] = [
  {
    id: 1,
    label: "CDP Snapshot",
    icon: "📸",
    sub: "DOM Freeze",
    details: "Capture DOM state via CDP. Strip dynamic script nodes to prevent external trackers from reporting headfulness.",
    log: "CDP: Snapshot completed (6.2 MB DOM tree). Submitting base64 frame preview to semantic coordinates mapping..."
  },
  {
    id: 2,
    label: "LLM Perception",
    icon: "🧠",
    sub: "OCR & Vision",
    details: "Query multimodal parser. Run layout segmentation to map text fields & action targets without CSS selector dependencies.",
    log: "AI-Perception: Coordinate map generated. Primary targets found: 'Checkout CTA' [x:742, y:518] with 99.4% confidence."
  },
  {
    id: 3,
    label: "Heuristic Check",
    icon: "🛡️",
    sub: "Element Validation",
    details: "Validate bounding boxes. Confirm target node visibility, check for absolute overlapping overlays or sticky banners.",
    log: "Guard-Rail: Element is clickable. No overlapping banners detected within target interaction bubble."
  },
  {
    id: 4,
    label: "Path Execution",
    icon: "🖱️",
    sub: "Spline Movement",
    details: "Dispatch mouse events. Build human-like Bézier spline trajectories with log-normal dynamic velocity curves.",
    log: "Bézier-Control: Dispatching mouse movement path. Curve duration: 320ms. Speed variance: +/-8px/ms. Clicks triggered."
  },
  {
    id: 5,
    label: "Receipt Verification",
    icon: "✅",
    sub: "State Resolve",
    details: "Audit result state. Check URL modifications, page state, or order confirmation strings to verify workflow success.",
    log: "Assurance: Target state resolved. Order verification string detected in window history. Submitting success payload."
  }
];

export default function OrchestrationLoop() {
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "INITIALIZING: CDP & Playwright stealth protocol...",
    "SYSTEM: Fully residential proxy subnet attached. Port 3000 mapped.",
    "READY: Waiting for intent trigger or cycle execution..."
  ]);
  const logRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto scroll console logs
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  // Keep stepping if in Play mode
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        handleNextStep();
      }, 2500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeStep]);

  const addLog = (logStr: string) => {
    const timestamp = new Date().toLocaleTimeString().split(" ")[0];
    setTerminalHistory(prev => [...prev, `[${timestamp}] ${logStr}`]);
  };

  const handleNextStep = () => {
    setActiveStep(current => {
      const next = current >= steps.length - 1 ? 0 : current + 1;
      const stepItem = steps[next];
      addLog(stepItem.log);
      return next;
    });
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveStep(-1);
    setTerminalHistory([
      "SYSTEM LOG RESET: Target state cleared.",
      "STATUS: Ready for a new operational iteration..."
    ]);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-md overflow-hidden glow-indigo">
      {/* Simulation Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 bg-slate-950/60 p-4 gap-3">
        <div className="flex items-center gap-2">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
          </div>
          <div>
            <h4 className="font-bold text-white font-display text-sm tracking-wide">
              Orchestrator Execution Cycle
            </h4>
            <p className="text-xs text-slate-400 font-mono">Stealth Orchestration Protocol: Active</p>
          </div>
        </div>

        {/* Toolbar controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
              isPlaying
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20"
                : "bg-indigo-600 text-white hover:bg-indigo-500 border border-transparent shadow-lg shadow-indigo-600/20"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3 w-3" />
                Pause Emulation
              </>
            ) : (
              <>
                <Play className="h-3 w-3" />
                Auto-Emulate Cycle
              </>
            )}
          </button>

          <button
            onClick={handleNextStep}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
          >
            <ChevronRight className="h-3 w-3" />
            Step Next
          </button>

          <button
            onClick={handleReset}
            className="rounded-lg border border-slate-800 p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
            title="Reset simulation State"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Step Flow Nodes */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {steps.map((s, index) => {
            const isActive = activeStep === index;
            const isFinished = activeStep > index;

            return (
              <div
                key={s.id}
                onClick={() => {
                  setActiveStep(index);
                  addLog(s.log);
                }}
                className={`relative flex flex-col items-center justify-between rounded-xl p-4 text-center cursor-pointer border transition-all duration-300 ${
                  isActive
                    ? "bg-indigo-950/30 border-indigo-500 glow-indigo"
                    : isFinished
                    ? "bg-slate-900/60 border-indigo-950/50"
                    : "bg-slate-950/40 border-slate-900 hover:bg-slate-900/20 hover:border-slate-800"
                }`}
              >
                {/* Connector line on Desktop */}
                {index < 4 && (
                  <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 hidden md:block z-0">
                    <ChevronRight className={`h-4 w-4 ${isFinished ? "text-indigo-500/60" : "text-slate-800"}`} />
                  </div>
                )}

                <div className="flex flex-col items-center gap-1.5 relative z-10">
                  <span className="text-xl leading-none">{s.icon}</span>
                  <p className="font-bold text-xs text-white uppercase tracking-wider font-display">
                    {s.label}
                  </p>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{s.sub}</p>
                </div>

                <div className="mt-4 flex items-center justify-center relative z-10">
                  {isFinished ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
                  ) : isActive ? (
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </div>
                  ) : (
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-800" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Step Description banner */}
        {activeStep !== -1 && (
          <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-4 flex gap-3 items-start animate-fadeIn">
            <p className="text-2xl pt-0.5">{steps[activeStep].icon}</p>
            <div>
              <h5 className="text-sm font-bold text-indigo-300 flex items-center gap-1.5 uppercase tracking-wide font-display">
                Level {steps[activeStep].id}: {steps[activeStep].label}
                <span className="text-xs bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded font-mono lowercase">verified</span>
              </h5>
              <p className="text-xs text-slate-300 mt-1 font-sans leading-relaxed">
                {steps[activeStep].details}
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Terminal Logs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-indigo-400" />
              Runtime CLI Output: play-stealth-cdp
            </span>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">stealth tunnel encrypted</span>
            </div>
          </div>

          <div 
            ref={logRef}
            className="h-36 overflow-y-auto rounded-lg bg-slate-950 p-4 border border-slate-800/60 font-mono text-xs text-slate-300 space-y-1"
          >
            {terminalHistory.map((line, idx) => {
              let color = "text-slate-400";
              if (line.includes("AI-Perception")) color = "text-indigo-400";
              else if (line.includes("Guard-Rail") || line.includes("Assurance")) color = "text-emerald-400";
              else if (line.includes("CDP")) color = "text-amber-400 font-medium";
              else if (line.includes("Bézier-Control")) color = "text-cyan-400";
              else if (line.includes("SYSTEM") || line.includes("INITIALIZING")) color = "text-slate-500";

              return (
                <div key={idx} className={`${color} leading-relaxed`}>
                  <span className="text-slate-600 select-none mr-2">&gt;</span>
                  {line}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
