/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Terminal, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Globe, 
  Server, 
  ShieldAlert, 
  Copy, 
  Check, 
  Key, 
  ExternalLink,
  ChevronRight,
  Code,
  Zap,
  HelpCircle
} from "lucide-react";

interface DiagnosticResult {
  endpoint: string;
  method: string;
  timestamp: string;
  status: number | null;
  statusText: string;
  contentType: string | null;
  isJson: boolean;
  latencyMs: number;
  responsePreview: string;
  ok: boolean;
  diagnosis: string;
  actionRequired: string;
}

export default function DiagnosticUtility() {
  const [targetDomain, setTargetDomain] = useState<string>("");
  const [customPath, setCustomPath] = useState<string>("/api/health");
  const [customMethod, setCustomMethod] = useState<"GET" | "POST">("GET");
  const [postBody, setPostBody] = useState<string>('{"prompt": "Test diagnostic action"}');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [activeTab, setActiveTab] = useState<"suite" | "custom" | "vercel_guide">("suite");
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  // Quick preset test suites
  const testEndpoints = [
    { label: "Gemini AI Health Check", path: "/api/health", method: "GET" as const },
    { label: "Alternative Root Health", path: "/health", method: "GET" as const },
    { label: "Orchestration Engine", path: "/api/orchestrate", method: "POST" as const, body: '{"prompt": "Diagnostic Ping"}' },
    { label: "Architect Chat Endpoint", path: "/api/chat", method: "POST" as const, body: '{"message": "Ping"}' },
    { label: "PayPal Subscription State", path: "/api/paypal/state", method: "GET" as const },
  ];

  const runSingleTest = async (
    path: string, 
    method: "GET" | "POST" = "GET", 
    bodyData?: string
  ): Promise<DiagnosticResult> => {
    const startTime = performance.now();
    const timestamp = new Date().toLocaleTimeString();
    
    // Construct target URL
    let fullUrl = path;
    if (targetDomain.trim()) {
      const cleanDomain = targetDomain.trim().replace(/\/$/, "");
      const formattedDomain = cleanDomain.startsWith("http") ? cleanDomain : `https://${cleanDomain}`;
      fullUrl = `${formattedDomain}${path.startsWith("/") ? "" : "/"}${path}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const fetchOptions: RequestInit = {
        method,
        headers: {
          "Cache-Control": "no-cache",
          "Accept": "application/json, text/plain, */*",
          ...(method === "POST" ? { "Content-Type": "application/json" } : {})
        },
        signal: controller.signal,
        ...(method === "POST" && bodyData ? { body: bodyData } : {})
      };

      const res = await fetch(fullUrl, fetchOptions);
      clearTimeout(timeoutId);

      const latencyMs = Math.round(performance.now() - startTime);
      const contentType = res.headers.get("content-type") || "unknown";
      const isJson = contentType.includes("application/json");

      let rawText = "";
      try {
        rawText = await res.text();
      } catch (e) {
        rawText = "Unable to read response body stream";
      }

      let responsePreview = rawText;
      let parsedJson: any = null;
      if (isJson) {
        try {
          parsedJson = JSON.parse(rawText);
          responsePreview = JSON.stringify(parsedJson, null, 2);
        } catch (_) {
          // Keep rawText
        }
      } else if (rawText.length > 300) {
        responsePreview = rawText.slice(0, 300) + "... [truncated HTML/text]";
      }

      // Diagnose status code
      let diagnosis = "";
      let actionRequired = "";
      const isOk = res.ok && isJson;

      if (res.status === 200) {
        if (isJson) {
          diagnosis = "HTTP 200 OK — Endpoint operational and returning valid JSON payload.";
          actionRequired = "No action needed. Serverless API route is online.";
        } else {
          diagnosis = "HTTP 200 OK (Non-JSON) — Server returned HTML or raw text instead of JSON.";
          actionRequired = "Vercel rewrites or static asset server might be serving index.html instead of executing the API function. Check vercel.json rewrites.";
        }
      } else if (res.status === 404) {
        diagnosis = "HTTP 404 Not Found — API route is not mounted or rewrite rule failed.";
        actionRequired = "Ensure vercel.json includes `source: '/api/(.*)' -> destination: '/api/index.ts'` and redeploy on Vercel.";
      } else if (res.status === 500) {
        diagnosis = "HTTP 500 Internal Server Error — Function crashed during execution.";
        actionRequired = "Check Vercel function runtime logs. Commonly caused by missing GEMINI_API_KEY environment variable.";
      } else if (res.status === 502 || res.status === 504) {
        diagnosis = `HTTP ${res.status} Bad Gateway / Timeout — Serverless function timed out or process exited abruptly.`;
        actionRequired = "Inspect Vercel build output or server.ts startup exceptions.";
      } else {
        diagnosis = `HTTP ${res.status} ${res.statusText || "Response Error"}.`;
        actionRequired = "Review HTTP status codes and endpoint routing.";
      }

      return {
        endpoint: fullUrl,
        method,
        timestamp,
        status: res.status,
        statusText: res.statusText || (res.ok ? "OK" : "Error"),
        contentType,
        isJson,
        latencyMs,
        responsePreview,
        ok: isOk,
        diagnosis,
        actionRequired
      };
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - startTime);
      const isAbort = err.name === "AbortError";
      
      return {
        endpoint: fullUrl,
        method,
        timestamp,
        status: 0,
        statusText: isAbort ? "Timeout (8000ms)" : "Network/CORS Error",
        contentType: null,
        isJson: false,
        latencyMs,
        responsePreview: err.message || "Failed to fetch. Possible CORS block or network disconnect.",
        ok: false,
        diagnosis: isAbort 
          ? "Request Timed Out (8s limit) — Server failed to respond in time."
          : "Network Error / CORS Blocked — Browser blocked the request or domain DNS is unresolvable.",
        actionRequired: "Verify DNS records for www.uniagent.website (A record -> 216.198.79.1) and ensure CORS headers permit cross-origin requests."
      };
    }
  };

  const runAllDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);
    const compiled: DiagnosticResult[] = [];

    for (const test of testEndpoints) {
      const res = await runSingleTest(test.path, test.method, test.body);
      compiled.push(res);
      setResults([...compiled]);
      // Small pause between pings
      await new Promise(r => setTimeout(r, 200));
    }

    setIsRunning(false);
  };

  const handleCustomTest = async () => {
    if (!customPath) return;
    setIsRunning(true);
    const res = await runSingleTest(customPath, customMethod, customMethod === "POST" ? postBody : undefined);
    setResults([res, ...results]);
    setIsRunning(false);
  };

  const handleCopyVercelKey = () => {
    navigator.clipboard.writeText("GEMINI_API_KEY");
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div id="diagnostics" className="bg-[#0b0f1d] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-white font-display tracking-tight">
                Real-Time API Diagnostic & Connectivity Suite
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Live HTTP Probe
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Probe endpoints on <code className="text-indigo-300">uniagent.website</code> or local origin with granular HTTP error code breakdown.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 font-mono text-xs">
          <button
            onClick={() => setActiveTab("suite")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "suite" 
                ? "bg-indigo-600 text-white shadow-md" 
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> Full Diagnostic Suite
          </button>
          <button
            onClick={() => setActiveTab("custom")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "custom" 
                ? "bg-indigo-600 text-white shadow-md" 
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Code className="w-3.5 h-3.5" /> Custom Endpoint Probe
          </button>
          <button
            onClick={() => setActiveTab("vercel_guide")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "vercel_guide" 
                ? "bg-indigo-600 text-white shadow-md" 
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Key className="w-3.5 h-3.5 text-amber-400" /> Vercel Env Var Setup Guide
          </button>
        </div>
      </div>

      {/* Target Domain Input Bar */}
      <div className="bg-slate-900/60 border border-slate-800/90 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 flex-1">
          <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-slate-400 shrink-0 font-bold">Target Host:</span>
          <input
            type="text"
            value={targetDomain}
            onChange={(e) => setTargetDomain(e.target.value)}
            placeholder="Leave empty for current origin or enter e.g. https://www.uniagent.website"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono text-xs"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-slate-500 font-mono">
            {targetDomain ? `Targeting: ${targetDomain}` : "Targeting: Current Window Location"}
          </span>
          {targetDomain && (
            <button
              onClick={() => setTargetDomain("")}
              className="text-slate-500 hover:text-slate-300 text-[10px] underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Tab Content: Full Diagnostic Suite */}
      {activeTab === "suite" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200 font-display">Microservice Health Matrix</h3>
              <p className="text-xs text-slate-400">
                Pings critical system endpoints in real-time to inspect HTTP response signatures, JSON validation, and latencies.
              </p>
            </div>
            <button
              onClick={runAllDiagnostics}
              disabled={isRunning}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold font-mono flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? "animate-spin" : ""}`} />
              {isRunning ? "Testing Endpoints..." : "Run Full Diagnostic Suite"}
            </button>
          </div>

          {/* Results Table */}
          <div className="space-y-3">
            {results.length === 0 ? (
              <div className="p-8 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-3">
                <Activity className="w-8 h-8 text-slate-600 mx-auto animate-pulse" />
                <div>
                  <p className="text-sm font-bold text-slate-300 font-display">No Diagnostics Generated Yet</p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 font-mono">
                    Click "Run Full Diagnostic Suite" above to test all 5 endpoints on <code className="text-indigo-400">www.uniagent.website</code> and view exact HTTP status code diagnostics.
                  </p>
                </div>
              </div>
            ) : (
              results.map((res, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-xl border font-mono text-xs space-y-3 transition-all ${
                    res.ok 
                      ? "bg-emerald-950/20 border-emerald-500/30" 
                      : res.status === 404
                      ? "bg-amber-950/20 border-amber-500/30"
                      : "bg-red-950/20 border-red-500/30"
                  }`}
                >
                  {/* Result Item Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        res.method === "GET" ? "bg-blue-500/20 text-blue-300" : "bg-purple-500/20 text-purple-300"
                      }`}>
                        {res.method}
                      </span>
                      <span className="font-bold text-slate-200">{res.endpoint}</span>
                      <span className="text-[10px] text-slate-500">[{res.timestamp}]</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">Latency: {res.latencyMs}ms</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                        res.ok 
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" 
                          : res.status === 404
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-red-500/20 text-red-300 border border-red-500/40"
                      }`}>
                        {res.ok ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <XCircle className="w-3 h-3 text-red-400" />}
                        {res.status !== null ? `HTTP ${res.status} ${res.statusText}` : res.statusText}
                      </span>
                    </div>
                  </div>

                  {/* Diagnosis & Actionable Recommendation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                    <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800 space-y-1">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold flex items-center gap-1">
                        <Activity className="w-3 h-3 text-indigo-400" /> Diagnostic Assessment
                      </div>
                      <p className="text-slate-300 font-sans text-xs leading-relaxed">
                        {res.diagnosis}
                      </p>
                    </div>

                    <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800 space-y-1">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-amber-400" /> Suggested Solution
                      </div>
                      <p className="text-slate-300 font-sans text-xs leading-relaxed">
                        {res.actionRequired}
                      </p>
                    </div>
                  </div>

                  {/* Response Payload Preview */}
                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                      Response Header Content-Type: <code className="text-indigo-300">{res.contentType || "N/A"}</code>
                    </div>
                    <pre className="p-2.5 rounded bg-slate-950 border border-slate-900 text-[10px] text-slate-300 overflow-x-auto max-h-32 font-mono">
                      {res.responsePreview}
                    </pre>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab Content: Custom Endpoint Probe */}
      {activeTab === "custom" && (
        <div className="space-y-4 font-mono text-xs">
          <h3 className="text-sm font-bold text-slate-200 font-display">Interactive HTTP Request Inspector</h3>
          <p className="text-xs text-slate-400 font-sans">
            Configure custom request parameters (HTTP Method, Endpoint Path, and JSON Body) to test specific microservice routes on demand.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">HTTP Method</label>
              <select
                value={customMethod}
                onChange={(e) => setCustomMethod(e.target.value as "GET" | "POST")}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Endpoint Path</label>
              <input
                type="text"
                value={customPath}
                onChange={(e) => setCustomPath(e.target.value)}
                placeholder="/api/health or /api/orchestrate"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleCustomTest}
                disabled={isRunning}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/25 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" /> Execute Probe
              </button>
            </div>
          </div>

          {customMethod === "POST" && (
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">POST Request Body (JSON)</label>
              <textarea
                value={postBody}
                onChange={(e) => setPostBody(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {results.length > 0 && (
            <div className="pt-2">
              <div className="text-xs font-bold text-slate-300 font-display mb-2">Probe Execution Log</div>
              <div className="space-y-3">
                {results.slice(0, 3).map((res, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold text-indigo-300">{res.method} {res.endpoint}</span>
                      <span className={`px-2 py-0.5 rounded font-bold ${res.ok ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>
                        HTTP {res.status || 0} ({res.latencyMs}ms)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-sans">{res.diagnosis}</p>
                    <pre className="p-2 bg-slate-900 rounded text-[10px] text-slate-300 overflow-x-auto max-h-24 font-mono">
                      {res.responsePreview}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Vercel Environment Variables Setup Guide */}
      {activeTab === "vercel_guide" && (
        <div className="space-y-5 text-xs text-slate-300 font-sans">
          
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold font-display text-sm">
              <Key className="w-4 h-4" /> Step-by-Step: Adding GEMINI_API_KEY to Vercel
            </div>
            <p className="leading-relaxed">
              When deploying to Vercel, serverless endpoints (like <code className="bg-amber-950/60 px-1 py-0.5 rounded font-mono text-xs text-amber-300">/api/health</code> and <code className="bg-amber-950/60 px-1 py-0.5 rounded font-mono text-xs text-amber-300">/api/orchestrate</code>) require your Gemini API key stored securely in Vercel's Environment Variables.
            </p>
          </div>

          <div className="space-y-4">
            
            {/* Field Breakdown Table */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="font-bold text-white font-display text-xs uppercase tracking-wider text-indigo-400">
                1. Understanding the Vercel Input Fields (Key, Value, Note)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px]">
                
                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400">Key</span>
                    <button 
                      onClick={handleCopyVercelKey}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                      title="Copy Key Name"
                    >
                      {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="text-slate-100 font-bold font-mono">GEMINI_API_KEY</div>
                  <p className="text-[10px] text-slate-400 font-sans leading-tight">
                    Must be entered EXACTLY as written above (uppercase with underscores). This matches <code className="text-emerald-300">process.env.GEMINI_API_KEY</code> in server code.
                  </p>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1">
                  <span className="font-bold text-indigo-400">Value</span>
                  <div className="text-slate-100 font-bold font-mono">AIzaSy...</div>
                  <p className="text-[10px] text-slate-400 font-sans leading-tight">
                    Paste your actual Google Gemini API Key string starting with <code className="text-indigo-300">AIzaSy...</code> from Google AI Studio.
                  </p>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1">
                  <span className="font-bold text-slate-400">Note / Comment</span>
                  <div className="text-slate-300 font-mono text-[10px]">Google AI Studio Gemini Key</div>
                  <p className="text-[10px] text-slate-400 font-sans leading-tight">
                    Optional description for your team to identify what this key is used for.
                  </p>
                </div>

              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="font-bold text-white font-display text-xs uppercase tracking-wider text-indigo-400">
                2. Exact Step-by-Step Vercel Workflow
              </h4>
              <ol className="space-y-2.5 font-sans text-xs">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs font-bold shrink-0 font-mono">1</span>
                  <div>
                    Log in to your <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline font-bold inline-flex items-center gap-1">Vercel Dashboard <ExternalLink className="w-3 h-3" /></a> and select your project (<code className="text-slate-300">universal-agent-architect</code>).
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs font-bold shrink-0 font-mono">2</span>
                  <div>
                    Click on the <strong className="text-white">Settings</strong> tab in the top navigation bar.
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs font-bold shrink-0 font-mono">3</span>
                  <div>
                    In the left-hand sidebar menu, click on <strong className="text-white">Environment Variables</strong>.
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs font-bold shrink-0 font-mono">4</span>
                  <div>
                    In the <strong className="text-white">Key</strong> box, type: <code className="bg-slate-900 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">GEMINI_API_KEY</code>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs font-bold shrink-0 font-mono">5</span>
                  <div>
                    In the <strong className="text-white">Value</strong> box, paste your secret Gemini API key string.
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs font-bold shrink-0 font-mono">6</span>
                  <div>
                    Ensure <strong className="text-white">Production</strong>, <strong className="text-white">Preview</strong>, and <strong className="text-white">Development</strong> checkboxes are selected, then click <strong className="text-indigo-400">Save</strong>.
                  </div>
                </li>

                <li className="flex items-start gap-2.5 p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-lg">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/30 text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0 font-mono">7</span>
                  <div className="space-y-1">
                    <strong className="text-emerald-300 uppercase tracking-wide text-[10px] font-mono block">CRITICAL FINAL STEP: REDEPLOY ON VERCEL</strong>
                    <p className="text-slate-300 text-xs">
                      Environment variables take effect on your <em>next build</em>. Go to the <strong className="text-white">Deployments</strong> tab in Vercel, click the 3 dots (<code className="text-slate-300 font-mono">...</code>) on your latest deployment, and click <strong className="text-emerald-400 font-bold">Redeploy</strong>.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
