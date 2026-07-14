/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, FileJson, PlayCircle, Loader2, AlertCircle, ShieldAlert, Cpu, Award } from "lucide-react";
import { ExecutionPlan } from "../types";

const PRESETS = [
  "Find me a vegan gluten-free pizza under $25 near downtown and order it...",
  "Search eBay for a Space Grey MacBook Pro M3 under $1400 with excellent merchant ratings.",
  "Check seat map on Delta Flight DL122, hold business class aisle seats, and trigger text notice."
];

interface PlanGeneratorProps {
  externalPrompt?: string;
}

export default function PlanGenerator({ externalPrompt }: PlanGeneratorProps = {}) {
  const [prompt, setPrompt] = useState<string>(PRESETS[0]);

  React.useEffect(() => {
    if (externalPrompt) {
      setPrompt(externalPrompt);
    }
  }, [externalPrompt]);
  const [isLlamas, setIsLlamas] = useState<boolean>(false); // Used to verify API load
  const [loading, setLoading] = useState<boolean>(false);
  const [errorStr, setErrorStr] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"visual" | "json">("visual");
  const [isMocked, setIsMocked] = useState<boolean>(true);
  const [warning, setWarning] = useState<string | null>(
    "Simulation mode active. Ready to generate schemas."
  );

  const [plan, setPlan] = useState<ExecutionPlan | null>({
    intent_classification: "purchase",
    extracted_constraints: {
      budget: 25,
      currency: "USD",
      attributes: ["vegan", "gluten-free", "near downtown"],
      raw_query: "Find me a vegan gluten-free pizza under $25 near downtown and order it..."
    },
    execution_steps: [
      {
        step_id: 1,
        action_type: "NAVIGATE",
        technical_details: "Stealth coordinate load. Set User-Agent to organic standard Chrome. Navigating to Yelp search page.",
        target_element_desc: "Default viewport index"
      },
      {
        step_id: 2,
        action_type: "VISION_SCAN",
        technical_details: "Analyze layout. Trigger OCR text bounding limits on restaurant grid lists, capturing coordinates of dietary check elements.",
        target_element_desc: "Dynamic cards matching pizza keywords"
      },
      {
        step_id: 3,
        action_type: "FILTER",
        technical_details: "Simulate linear spline trajectory. Check 'Gluten-Free' and 'Vegan' food filters under menu items.",
        target_element_desc: "Custom toggle buttons"
      },
      {
        step_id: 4,
        action_type: "SELECT_ITEM",
        technical_details: "Select the cheapest matching pizza box based on visual price tags computed via floating viewport analysis.",
        target_element_desc: "Vegan GF Custom Pizza row item"
      },
      {
        step_id: 5,
        action_type: "ADD_TO_CART",
        technical_details: "Inject click to dynamic 'Add Special' button, adjusting mouse acceleration rate dynamically to imitate real-world touch gestures.",
        target_element_desc: "CTA primary button"
      },
      {
        step_id: 6,
        action_type: "SECURE_CHECKOUT",
        technical_details: "Route inputs to Vault socket. Wait for Vault credentials backfill into target iframe. Confirm transaction.",
        target_element_desc: "Final Order Lock Node"
      }
    ],
    risk_assessment: {
      bot_detection_probability: "MEDIUM",
      anti_bot_triggers: ["reCAPTCHA dynamic click timing", "Kasada device hardware inspection"],
      requires_human_approval: true
    }
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setErrorStr(null);
    setWarning(null);

    try {
      const response = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() })
      });

      if (!response.ok) {
        let errMsg = `Server returned status ${response.status}.`;
        try {
          const errData = await response.json();
          if (errData.message || errData.error) {
            errMsg = errData.message || (typeof errData.error === "object" ? JSON.stringify(errData.error) : errData.error);
          }
        } catch (_) {
          // Fallback to standard status
        }

        if (response.status === 401 || response.status === 403) {
          throw new Error(`🔑 Authentication Failure (Code ${response.status}): Your Gemini API key credentials appear invalid. Please configure a valid GEMINI_API_KEY inside the Secrets panel of your workspace.`);
        } else if (response.status === 429) {
          throw new Error(`⏳ Rate Limit Throttled (Code 429): Gemini processor quota reached. Please wait a few moments before retrying.`);
        } else if (response.status >= 500) {
          throw new Error(`⚙️ Server Fault (Code ${response.status}): The orchestration microservice threw an uncaught compilation error. Details: "${errMsg}"`);
        } else {
          throw new Error(`🛡️ Request Validation Failed (Code ${response.status}): Details: "${errMsg}"`);
        }
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.message || (typeof data.error === "object" ? JSON.stringify(data.error) : data.error));
      }

      setPlan(data.plan);
      setIsMocked(!!data.isMocked);
      if (data.warning) {
        setWarning(data.warning);
      } else {
        setWarning(null);
      }
    } catch (err: any) {
      console.error("Failed to generate execution plan:", err);
      
      let finalErrMsg = err.message || "An unexpected parser failure occurred.";
      if (err instanceof TypeError && err.message?.toLowerCase().includes("fetch")) {
        finalErrMsg = `🌐 Handshake Interrupted: Unable to connect to the backend microservice. Verify your internet connection and verify the server bounds.`;
      }
      setErrorStr(finalErrMsg);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "NAVIGATE": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "VISION_SCAN": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "FILTER": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "SELECT_ITEM": return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "ADD_TO_CART": return "bg-pink-500/10 text-pink-400 border-pink-500/20";
      case "SECURE_CHECKOUT": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "RESOLVE_CAPTCHA": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "HUMAN_APPROVAL_WAIT": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="rounded-xl border border-slate-850 bg-slate-900/40 backdrop-blur-md p-6 glow-indigo space-y-6">
      
      {/* Header and Label */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              Interactive Sandbox
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Cpu className="h-3 w-3 text-indigo-400" />
              <span>Gemini 3.5 Flash Planner</span>
            </div>
          </div>
          <h3 className="text-xl font-bold font-display text-white">
            Multimodal Agent Brain Simulation
          </h3>
          <p className="text-xs text-slate-400">
            Deconstruct complex shopping prompts into deterministic, machine-executable action structures.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-center">
          <button
            onClick={() => setActiveTab("visual")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === "visual"
                ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Graphical Flow
          </button>
          <button
            onClick={() => setActiveTab("json")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === "json"
                ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FileJson className="h-3 w-3" />
            Serialized JSON
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left column: Input and options */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <label className="block text-xs font-bold tracking-wider text-slate-450 uppercase font-mono">
              Raw User Intent Query
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="Enter a shopping request or browser execution flow..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-sm text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all font-sans"
            />

            {/* Presets Grid */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                Recommended Presets
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {PRESETS.map((p, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(p)}
                    className={`text-left text-xs p-2 rounded-lg border transition-all text-slate-400 truncate ${
                      prompt === p
                        ? "bg-indigo-950/20 border-indigo-500/40 text-indigo-300 font-medium"
                        : "bg-slate-950/40 border-slate-900 hover:bg-slate-900/30"
                    }`}
                  >
                    "{p}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/40 space-y-2">
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition-all font-display tracking-wide shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  Orchestrator Decomposing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  Decompose & Compile Plan
                </>
              )}
            </button>

            {/* Offline Fallback/Warning */}
            {warning && (
              <div className="rounded-lg bg-indigo-950/30 border border-indigo-500/20 p-3 flex gap-2 items-start text-[11px] text-indigo-300 font-mono">
                <AlertCircle className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>{warning}</span>
              </div>
            )}

            {errorStr && (
              <div className="rounded-lg bg-rose-950/20 border border-rose-500/20 p-3 flex gap-2 items-start text-xs text-rose-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorStr}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Formatted Output tabs */}
        <div className="lg:col-span-7 bg-slate-950 rounded-xl border border-slate-850 p-4 min-h-[350px] flex flex-col justify-between">
          
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
              <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
              <div className="space-y-1">
                <p className="font-bold text-sm text-white">Generating Multi-Step Schema</p>
                <p className="text-xs text-slate-500 font-mono">Parsing semantic constraints, safety boundaries and risk matrixes...</p>
              </div>
            </div>
          ) : plan ? (
            <div className="flex-1 flex flex-col justify-between h-full space-y-4">
              
              {activeTab === "visual" ? (
                // GRAPHICAL WORKFLOW TAB
                <div className="space-y-4 flex-1 overflow-auto max-h-[420px]">
                  
                  {/* Top quick metrics breakdown */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-900/40 p-3.5 rounded-lg border border-slate-850 text-xs">
                    <div>
                      <span className="text-slate-500 font-mono block uppercase text-[10px]">Intent Class</span>
                      <span className="font-bold text-slate-300 tracking-wide uppercase">{plan.intent_classification}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-mono block uppercase text-[10px]">Budget Lock</span>
                      {plan.extracted_constraints.budget ? (
                        <span className="font-mono font-bold text-indigo-300">
                          {plan.extracted_constraints.budget} {plan.extracted_constraints.currency || "USD"}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">None Specified</span>
                      )}
                    </div>
                    <div>
                      <span className="text-slate-500 font-mono block uppercase text-[10px]">Bot Threshold</span>
                      <span className={`font-mono font-bold ${
                        plan.risk_assessment.bot_detection_probability === "HIGH" 
                          ? "text-rose-400" 
                          : plan.risk_assessment.bot_detection_probability === "MEDIUM" 
                          ? "text-amber-400" 
                          : "text-emerald-400"
                      }`}>{plan.risk_assessment.bot_detection_probability} PROB</span>
                    </div>
                  </div>

                  {/* Sequential Steps List */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono block">
                      Autonomous Pipeline steps
                    </span>
                    <div className="space-y-2.5">
                      {plan.execution_steps.map((st) => (
                        <div 
                          key={st.step_id}
                          className="group relative flex gap-3.5 items-start bg-slate-900/20 hover:bg-slate-900/60 p-3 rounded-lg border border-slate-900/60 hover:border-slate-800 transition-all"
                        >
                          <span className="absolute -left-1 hidden group-hover:block w-1.5 h-1/2 bg-indigo-500 rounded my-auto top-0 bottom-0" />
                          
                          <div className="flex flex-col items-center">
                            <span className="w-5 h-5 rounded-full bg-slate-900 text-[10px] font-mono font-bold text-slate-400 border border-slate-800 flex items-center justify-center">
                              {st.step_id}
                            </span>
                            <div className="h-full w-px bg-slate-900 border-dashed border-slate-800 my-1 flex-1 hidden" />
                          </div>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold border ${getActionColor(st.action_type)}`}>
                                {st.action_type}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                Target: <span className="text-slate-300 font-semibold font-sans">{st.target_element_desc}</span>
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 font-sans leading-relaxed pt-0.5">
                              {st.technical_details}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // SERIALIZED RAW JSON TAB
                <div className="flex-1 flex flex-col justify-between">
                  <div className="h-64 overflow-y-auto">
                    <pre className="text-emerald-400 font-mono text-xs whitespace-pre-wrap leading-relaxed select-text p-1">
                      {JSON.stringify(plan, null, 2)}
                    </pre>
                  </div>
                  
                  {/* Copy helper */}
                  <div className="border-t border-slate-800/80 pt-3 mt-3 flex items-center justify-between">
                    <p className="text-[10px] font-mono text-slate-500">
                      RFC-8259 Standard Serialized Schema
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(plan, null, 2));
                        alert("Copied raw JSON schema to clipboard.");
                      }}
                      className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 tracking-wide font-mono cursor-pointer"
                    >
                      Copy Schema Block
                    </button>
                  </div>
                </div>
              )}

              {/* Anti-Bot details bottom bar */}
              <div className="mt-4 border-t border-slate-800/80 pt-3 bg-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-400 font-mono gap-2">
                <span className="flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span>Mitigated: {plan.risk_assessment.anti_bot_triggers.join(", ") || "None"}</span>
                </span>
                <span className="text-slate-500 shrink-0">
                  Approval Override: <span className={plan.risk_assessment.requires_human_approval ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>{plan.risk_assessment.requires_human_approval ? "Active (Required)" : "Low Score"}</span>
                </span>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm font-mono">
              Waiting for prompt dispatch...
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
