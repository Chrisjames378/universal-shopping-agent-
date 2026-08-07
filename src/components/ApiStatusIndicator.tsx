/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Server, 
  ShieldAlert, 
  ChevronDown,
  Clock,
  Cpu
} from "lucide-react";
import { useApiHeartbeat, ApiHeartbeatState } from "../lib/useApiHeartbeat";

export default function ApiStatusIndicator() {
  const heartbeat = useApiHeartbeat(10000); // Heartbeat ping every 10 seconds
  const { status, latencyMs, lastChecked, mode, consecutiveFailures, isPinging, endpoints, pingNow } = heartbeat;
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format time since last ping
  const getTimeAgo = () => {
    if (!lastChecked) return "Never";
    const diffSec = Math.floor((new Date().getTime() - lastChecked.getTime()) / 1000);
    if (diffSec < 5) return "Just now";
    if (diffSec < 60) return `${diffSec}s ago`;
    return `${Math.floor(diffSec / 60)}m ago`;
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Primary Navigation Status Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-2 px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-all duration-200 cursor-pointer ${
          status === "online"
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50"
            : status === "degraded"
            ? "bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/50"
            : "bg-red-500/15 border-red-500/40 text-red-300 hover:bg-red-500/25 hover:border-red-500/60 shadow-lg shadow-red-950/40"
        }`}
        title="Click to view detailed microservice diagnostic metrics"
      >
        <span className="relative flex h-2 w-2">
          {status === "online" && (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </>
          )}
          {status === "degraded" && (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </>
          )}
          {status === "offline" && (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-90"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </>
          )}
        </span>

        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
          {status === "online" && (
            <>
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span>API Online</span>
              {latencyMs !== null && (
                <span className="text-[9px] font-normal text-emerald-500/90 font-mono">
                  ({latencyMs}ms)
                </span>
              )}
            </>
          )}

          {status === "degraded" && (
            <>
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>API Simulation</span>
            </>
          )}

          {status === "offline" && (
            <>
              <WifiOff className="w-3 h-3 text-red-400 animate-bounce" />
              <span>API Unreachable</span>
            </>
          )}
        </div>

        <ChevronDown className={`w-3 h-3 opacity-60 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Persistent Warning Banner under pill if Unreachable */}
      {status === "offline" && !isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap bg-red-950/90 text-red-200 border border-red-500/40 text-[9px] font-mono px-2 py-0.5 rounded shadow-xl backdrop-blur pointer-events-none z-50 flex items-center gap-1">
          <ShieldAlert className="w-2.5 h-2.5 text-red-400 shrink-0" />
          <span>Backend offline — Client Fallback active</span>
        </div>
      )}

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-950/95 border border-slate-800 shadow-2xl backdrop-blur-xl p-4 z-50 animate-fadeIn text-xs space-y-3 font-sans">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-white font-display text-xs uppercase tracking-wider">
                Microservice Heartbeat
              </span>
            </div>
            <button
              onClick={() => pingNow()}
              disabled={isPinging}
              className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-800 disabled:opacity-50"
              title="Ping server now"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? "animate-spin text-indigo-400" : ""}`} />
            </button>
          </div>

          {/* Status Alert Banner */}
          {status === "offline" ? (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 space-y-1">
              <div className="flex items-center gap-2 font-bold text-red-400 text-xs font-display uppercase tracking-wide">
                <WifiOff className="w-4 h-4 text-red-400 shrink-0" />
                Backend Unreachable
              </div>
              <p className="text-[11px] leading-relaxed text-red-300/90">
                The orchestration microservice endpoint (<code className="bg-red-950/60 px-1 py-0.5 rounded font-mono text-[10px]">/api/*</code>) is unreachable. The application has automatically engaged client-side intent execution so you can continue using the platform seamlessly.
              </p>
            </div>
          ) : status === "degraded" ? (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1">
              <div className="flex items-center gap-2 font-bold text-amber-400 text-xs font-display uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                Simulation Fallback Active
              </div>
              <p className="text-[11px] leading-relaxed text-amber-300/90">
                Server is responding correctly, but running in local simulation mode (Gemini API key not detected or using simulation fallback).
              </p>
            </div>
          ) : (
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-xs text-emerald-200">Orchestrator Healthy & Live</span>
              </div>
              {latencyMs !== null && (
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                  {latencyMs}ms
                </span>
              )}
            </div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
            <div className="p-2 rounded bg-slate-900/60 border border-slate-850 space-y-0.5">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Cpu className="w-3 h-3 text-slate-400" />
                Engine Mode
              </div>
              <div className="font-bold text-slate-200 truncate">
                {mode === "live_gemini" && <span className="text-emerald-400">Live Gemini AI</span>}
                {mode === "fallback_simulation" && <span className="text-amber-400">Server Simulation</span>}
                {mode === "client_decoupled" && <span className="text-indigo-400">Client Engine</span>}
              </div>
            </div>

            <div className="p-2 rounded bg-slate-900/60 border border-slate-850 space-y-0.5">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                Last Checked
              </div>
              <div className="font-bold text-slate-200">
                {getTimeAgo()}
              </div>
            </div>
          </div>

          {/* Endpoints Audit Table */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Endpoint Diagnostics
            </div>
            <div className="space-y-1 font-mono text-[11px]">
              {endpoints.length === 0 ? (
                <div className="p-2 rounded bg-slate-900/40 text-slate-500 text-center text-[10px]">
                  Initiating background health ping...
                </div>
              ) : (
                endpoints.map((ep, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-850">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${ep.ok ? "bg-emerald-400" : "bg-red-400"}`} />
                      <span className="text-slate-200 font-semibold">{ep.endpoint}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px]">
                      {ep.ok ? (
                        <span className="text-emerald-400 font-bold">{ep.status} OK ({ep.latencyMs}ms)</span>
                      ) : (
                        <span className="text-red-400 font-bold">{ep.error || "Failed"}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-2 border-t border-slate-900 space-y-2">
            <div className="p-2 bg-indigo-950/40 border border-indigo-500/20 rounded text-[10px] space-y-1 font-mono">
              <div className="flex items-center justify-between text-indigo-300 font-bold">
                <span>🌐 Vercel Custom Domain DNS (uniagent.website)</span>
              </div>
              <p className="text-slate-400 leading-tight font-sans text-[10px]">
                Remove old A records (<code className="text-red-400">15.197.225.128</code>, <code className="text-red-400">3.33.251.168</code>) & point <code className="text-emerald-400">@</code> to <code className="text-emerald-300 font-bold">216.198.79.1</code> on your domain registrar.
              </p>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
              <a 
                href="#diagnostics" 
                onClick={() => setIsOpen(false)}
                className="text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center gap-1"
              >
                Launch Diagnostic Tool
              </a>
              <button
                onClick={() => pingNow()}
                className="text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
              >
                Force Ping
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
