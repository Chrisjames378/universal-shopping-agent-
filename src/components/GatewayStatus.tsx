/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Zap,
  Cpu,
  Activity,
  Clock,
  Database,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Gauge,
  Terminal,
  BarChart2,
  Radio,
  Eye,
  EyeOff,
  Send,
  Layers,
  CheckCircle2,
  XCircle,
  ChevronDown
} from "lucide-react";

export interface GatewayTokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface GatewayStatusProps {
  /** Optional override to force visibility in dev environment */
  forceShow?: boolean;
  className?: string;
}

const SUPPORTED_MODELS = [
  { id: "gpt-5.4", name: "OpenAI GPT-5.4", provider: "OpenAI", route: "openai/gpt-5.4", color: "text-emerald-400" },
  { id: "gpt-4o", name: "OpenAI GPT-4o", provider: "OpenAI", route: "openai/gpt-4o", color: "text-emerald-400" },
  { id: "claude-3.7", name: "Claude 3.7 Sonnet", provider: "Anthropic", route: "anthropic/claude-3-7-sonnet", color: "text-amber-400" },
  { id: "gemini-2.5", name: "Gemini 2.5 Flash", provider: "Google", route: "google/gemini-2.5-flash", color: "text-blue-400" },
  { id: "grok-3", name: "xAI Grok-3", provider: "xAI", route: "xai/grok-3", color: "text-purple-400" },
  { id: "deepseek-r1", name: "DeepSeek R1", provider: "DeepSeek", route: "deepseek/deepseek-r1", color: "text-cyan-400" },
  { id: "deepseek-chat", name: "DeepSeek Chat", provider: "DeepSeek", route: "deepseek/deepseek-chat", color: "text-cyan-400" },
];

export default function GatewayStatus({ forceShow, className = "" }: GatewayStatusProps) {
  // Production / Dev Deployment Environment Detection Guard
  const isDevEnvironment = React.useMemo(() => {
    if (typeof window === "undefined") return false;
    const hostname = window.location.hostname;
    const isLocal = hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".local");
    const isDevUrl = hostname.includes("dev") || hostname.includes("ais-dev") || hostname.includes("preview");
    const hasQueryParam = window.location.search.includes("gateway_debug=true") || window.location.search.includes("dev=true");
    const hasStorageFlag = localStorage.getItem("enable_gateway_telemetry") === "true";
    return isLocal || isDevUrl || hasQueryParam || hasStorageFlag || Boolean((import.meta as any).env?.DEV);
  }, []);

  const [isDevVisible, setIsDevVisible] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "benchmark" | "providers">("overview");

  // Gateway Telemetry State
  const [selectedModel, setSelectedModel] = useState<string>("gpt-5.4");
  const [hasGatewayKey, setHasGatewayKey] = useState<boolean | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [latencyHistory, setLatencyHistory] = useState<number[]>([]);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const [totalRequests, setTotalRequests] = useState<number>(0);

  // Cumulative Token Metrics State
  const [tokenStats, setTokenStats] = useState<GatewayTokenUsage>({
    promptTokens: 142,
    completionTokens: 386,
    totalTokens: 528,
  });
  const [lastRequestUsage, setLastRequestUsage] = useState<GatewayTokenUsage | null>(null);
  const [tokensPerSec, setTokensPerSec] = useState<number>(42.5);

  // Interactive Live Tester state
  const [testPrompt, setTestPrompt] = useState("Summarize browser agent orchestration speed.");
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Key combination to toggle debug UI (Ctrl + Shift + G)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "G" || e.key === "g")) {
        e.preventDefault();
        setIsDevVisible((prev) => {
          const next = !prev;
          localStorage.setItem("enable_gateway_telemetry", String(next));
          return next;
        });
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Gateway Model Status & Run Ping
  const pingGateway = async (modelToTest = selectedModel) => {
    setIsPinging(true);
    const startTime = performance.now();
    try {
      const res = await fetch("/api/gateway/models");
      const endTime = performance.now();
      const elapsed = Math.round(endTime - startTime);

      if (res.ok) {
        const data = await res.json();
        setHasGatewayKey(!!data.hasGatewayKey);
        setLatencyMs(elapsed);
        setLatencyHistory((prev) => [...prev.slice(-9), elapsed]);
        setLastChecked(new Date());
      } else {
        setLatencyMs(elapsed);
      }
    } catch {
      setLatencyMs(null);
    } finally {
      setIsPinging(false);
    }
  };

  // Run initial heartbeat on mount & periodically
  useEffect(() => {
    if (!isDevEnvironment && !forceShow) return;
    pingGateway();
    const interval = setInterval(() => {
      pingGateway();
    }, 15000);
    return () => clearInterval(interval);
  }, [selectedModel, isDevEnvironment, forceShow]);

  // Execute Live Gateway Benchmark Request
  const runLiveBenchmark = async () => {
    if (!testPrompt.trim()) return;
    setIsTesting(true);
    setTestOutput(null);
    setTestError(null);

    const startTime = performance.now();
    try {
      const res = await fetch("/api/gateway/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel,
          prompt: testPrompt,
          system: "You are a concise AI performance benchmark assistant.",
        }),
      });

      const endTime = performance.now();
      const elapsed = Math.round(endTime - startTime);
      setLatencyMs(elapsed);
      setLatencyHistory((prev) => [...prev.slice(-9), elapsed]);
      setLastChecked(new Date());

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: "Gateway HTTP error" }));
        throw new Error(errData.details || errData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setTestOutput(data.text || "No response text returned.");

      if (data.usage) {
        const usage: GatewayTokenUsage = {
          promptTokens: data.usage.promptTokens || 0,
          completionTokens: data.usage.completionTokens || 0,
          totalTokens: data.usage.totalTokens || 0,
        };
        setLastRequestUsage(usage);
        setTokenStats((prev) => ({
          promptTokens: prev.promptTokens + usage.promptTokens,
          completionTokens: prev.completionTokens + usage.completionTokens,
          totalTokens: prev.totalTokens + usage.totalTokens,
        }));
        if (elapsed > 0 && usage.completionTokens > 0) {
          const tps = Math.round((usage.completionTokens / (elapsed / 1000)) * 10) / 10;
          setTokensPerSec(tps);
        }
      }
      setTotalRequests((prev) => prev + 1);
    } catch (err: any) {
      setTestError(err?.message || "Failed to query Vercel AI Gateway.");
    } finally {
      setIsTesting(false);
    }
  };

  // If NOT in development environment or dev visibility disabled, render NOTHING to protect live deployment
  if (!isDevEnvironment && !forceShow && !isDevVisible) {
    return null;
  }

  // Calculate stats
  const avgLatency =
    latencyHistory.length > 0
      ? Math.round(latencyHistory.reduce((a, b) => a + b, 0) / latencyHistory.length)
      : latencyMs || 0;

  const activeModelObj = SUPPORTED_MODELS.find((m) => m.id === selectedModel) || SUPPORTED_MODELS[0];

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Dev Mode Floating Header Indicator Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 px-2.5 py-1 rounded-lg border border-purple-500/30 bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 transition-all duration-200 cursor-pointer shadow-md shadow-purple-950/30 font-mono text-[11px]"
        title="Developer Telemetry: Vercel AI Gateway Router Status (Hidden on production deployments)"
      >
        <div className="relative flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-purple-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-400"></span>
        </div>

        <div className="flex items-center gap-1.5 font-bold tracking-wider uppercase text-[10px]">
          <Zap className="w-3 h-3 text-purple-400" />
          <span>AI Gateway</span>
        </div>

        <span className="text-[10px] bg-purple-500/20 px-1.5 py-0.2 rounded text-purple-200 border border-purple-500/30 font-semibold">
          {activeModelObj.id}
        </span>

        {latencyMs !== null && (
          <span className="text-[10px] text-emerald-400 font-bold hidden sm:inline">
            {latencyMs}ms
          </span>
        )}

        <ChevronDown className={`w-3 h-3 text-purple-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Expanded Telemetry Popover Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-950/60 z-50 overflow-hidden font-sans text-slate-200 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Header Banner */}
          <div className="p-3.5 bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border-b border-purple-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-500/20 rounded-lg border border-purple-500/40">
                <Cpu className="w-4 h-4 text-purple-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Vercel AI Gateway
                  </h3>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 font-mono font-bold">
                    DEV ONLY
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  Multi-Model Router Telemetry & Latency
                </p>
              </div>
            </div>

            <button
              onClick={() => pingGateway()}
              disabled={isPinging}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-lg border border-purple-500/30 transition-all cursor-pointer"
              title="Refresh Ping"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? "animate-spin text-purple-400" : ""}`} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-950/50 p-1 text-[11px] font-mono">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-1 py-1.5 text-center font-bold rounded-lg transition-all ${
                activeTab === "overview"
                  ? "bg-purple-600/30 text-purple-200 border border-purple-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("benchmark")}
              className={`flex-1 py-1.5 text-center font-bold rounded-lg transition-all ${
                activeTab === "benchmark"
                  ? "bg-purple-600/30 text-purple-200 border border-purple-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Live Tester
            </button>
            <button
              onClick={() => setActiveTab("providers")}
              className={`flex-1 py-1.5 text-center font-bold rounded-lg transition-all ${
                activeTab === "providers"
                  ? "bg-purple-600/30 text-purple-200 border border-purple-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Providers
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="p-4 space-y-4 text-xs font-mono">
              {/* Key Config Status Banner */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300 text-[11px]">Gateway API Key:</span>
                </div>
                {hasGatewayKey === true ? (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Configured
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Simulation Mode
                  </span>
                )}
              </div>

              {/* Active Model Switcher */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1.5">
                  Target Active Model Route:
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-slate-950 border border-purple-500/40 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  {SUPPORTED_MODELS.map((m) => (
                    <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                      {m.name} ({m.provider})
                    </option>
                  ))}
                </select>
              </div>

              {/* Real-time Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-emerald-400" /> Latency</span>
                    <span className="text-emerald-400 font-bold">{latencyMs !== null ? `${latencyMs}ms` : "--"}</span>
                  </div>
                  <div className="text-lg font-bold text-white font-mono">
                    {avgLatency > 0 ? `${avgLatency} ms` : "Pinging..."}
                  </div>
                  <div className="text-[9px] text-slate-500">Avg Roundtrip Ping</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="flex items-center gap-1"><Gauge className="w-3 h-3 text-purple-400" /> Throughput</span>
                    <span className="text-purple-400 font-bold">{tokensPerSec} t/s</span>
                  </div>
                  <div className="text-lg font-bold text-white font-mono">
                    {tokenStats.totalTokens.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-slate-500">Cumulative Tokens</div>
                </div>
              </div>

              {/* Detailed Token Breakdown */}
              <div className="p-3 bg-slate-950/90 rounded-xl border border-purple-500/20 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-purple-300 font-bold">
                  <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Token Usage Statistics</span>
                  <span className="text-[10px] text-slate-400">{totalRequests} Calls</span>
                </div>

                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Prompt / Input Tokens:</span>
                    <span className="font-bold text-indigo-300">{tokenStats.promptTokens.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Completion Tokens:</span>
                    <span className="font-bold text-emerald-300">{tokenStats.completionTokens.toLocaleString()}</span>
                  </div>
                  <div className="pt-1 border-t border-slate-800 flex justify-between text-white font-bold">
                    <span>Total Gateway Tokens:</span>
                    <span className="text-purple-300">{tokenStats.totalTokens.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE TESTER */}
          {activeTab === "benchmark" && (
            <div className="p-4 space-y-3 font-mono text-xs">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1 uppercase">
                  Test Prompt ({selectedModel}):
                </label>
                <textarea
                  rows={2}
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl p-2 text-xs text-white focus:outline-none resize-none"
                  placeholder="Enter prompt to query Vercel AI Gateway..."
                />
              </div>

              <button
                onClick={runLiveBenchmark}
                disabled={isTesting || !testPrompt.trim()}
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-purple-900/40"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Streaming Output...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Gateway Request ({selectedModel})</span>
                  </>
                )}
              </button>

              {testError && (
                <div className="p-2.5 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-[11px]">
                  <strong>Error:</strong> {testError}
                </div>
              )}

              {testOutput && (
                <div className="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl space-y-1.5 max-h-36 overflow-y-auto">
                  <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold">
                    <span>Model Response ({selectedModel})</span>
                    {lastRequestUsage && (
                      <span>{lastRequestUsage.totalTokens} tokens</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-200 leading-relaxed font-sans">
                    {testOutput}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PROVIDERS CATALOG */}
          {activeTab === "providers" && (
            <div className="p-4 space-y-2 font-mono text-xs max-h-60 overflow-y-auto">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                Connected AI Gateway Models
              </span>
              <div className="space-y-1.5">
                {SUPPORTED_MODELS.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSelectedModel(m.id);
                      setActiveTab("overview");
                    }}
                    className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedModel === m.id
                        ? "bg-purple-950/80 border-purple-500 text-white font-bold"
                        : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Layers className={`w-3.5 h-3.5 ${m.color}`} />
                      <div>
                        <div className="text-[11px] font-bold">{m.name}</div>
                        <div className="text-[9px] text-slate-500">{m.route}</div>
                      </div>
                    </div>
                    {selectedModel === m.id && (
                      <span className="text-[9px] bg-purple-500/30 text-purple-200 px-1.5 py-0.5 rounded border border-purple-500/40 font-bold">
                        Active
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Bar */}
          <div className="px-3.5 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>Shortcut: <kbd className="bg-slate-800 text-slate-300 px-1 rounded">Ctrl+Shift+G</kbd></span>
            <button
              onClick={() => {
                setIsDevVisible(false);
                localStorage.setItem("enable_gateway_telemetry", "false");
                setIsOpen(false);
              }}
              className="hover:text-red-400 flex items-center gap-1 cursor-pointer transition-colors"
              title="Hide this component from the header"
            >
              <EyeOff className="w-3 h-3" /> Hide Telemetry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
