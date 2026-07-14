/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { TrendingUp, Award, HelpCircle, BarChart3, ChevronRight, RefreshCw } from "lucide-react";

interface Checkpoint {
  label: string;
  underScraper: number;
  orchestrated: number;
  unstableReason: string;
  stableReason: string;
}

const CHECKPOINTS: Checkpoint[] = [
  {
    label: "Week 1",
    underScraper: 95,
    orchestrated: 98,
    unstableReason: "Scrapers work on day one. Raw selectors point to static IDs cleanly.",
    stableReason: "Full visual models map viewport offsets. Optimal initial execution loop."
  },
  {
    label: "Week 4",
    underScraper: 60,
    orchestrated: 97,
    unstableReason: "Sellers update dynamic node configurations. #buy-btn changes to #checkout-submit, prompting model hallucinations.",
    stableReason: "Omnipresent vision scanning ignores DOM structural shifting. Target pixel positions resolved."
  },
  {
    label: "Week 12",
    underScraper: 40,
    orchestrated: 96,
    unstableReason: "Akamai or Kasada upgrade device fingerprint inspection. Simple headless instances prompt constant captchas.",
    stableReason: "Go-based proxy wrapper spoofs TLS handshakes cleanly, rotating residential IP blocks."
  },
  {
    label: "Week 24",
    underScraper: 15,
    orchestrated: 96,
    unstableReason: "System drift makes scripts unusable. Overburdened prompt structures exceed context budget limitations.",
    stableReason: "Dynamic heuristic-correction loops bypass custom seller wrappers perfectly. 100% stable execution."
  }
];

export default function ReliabilityAnalysis() {
  const [activeIdx, setActiveIdx] = useState<number>(1); // default to week 4
  const activeCheckpoint = CHECKPOINTS[activeIdx];

  return (
    <div className="rounded-xl border border-slate-850 bg-slate-900/40 backdrop-blur-md p-6 glow-indigo space-y-6">
      
      {/* Header and description */}
      <div className="border-b border-slate-800/80 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              Reliability Audit
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
              <TrendingUp className="h-3.5 w-3.5 text-indigo-400" />
              <span>Projected Drifts over time</span>
            </div>
          </div>
          <h3 className="text-xl font-bold font-display text-white">
            Architecture Over Prompting
          </h3>
          <p className="text-xs text-slate-400">
            Why decoupling "Intent Plan" from "CDP Execution" keeps reliability at 96%+ across website redesigns.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-center">
        
        {/* SVG Grouped Bar Chart */}
        <div className="lg:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col justify-between min-h-[300px]">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-4">
            <span className="text-[10px] font-mono text-slate-400">ANALYSIS PROFILE: TRANSACTION SUCCESS RATES</span>
            <span className="text-[10px] font-mono text-indigo-400 font-bold">ACTIVE BENCHMARK</span>
          </div>

          {/* Grouped Bars */}
          <div className="space-y-4 flex-1 flex flex-col justify-around py-2">
            {CHECKPOINTS.map((checkpoint, chkIdx) => {
              const isActive = activeIdx === chkIdx;

              return (
                <div 
                  key={checkpoint.label}
                  onClick={() => setActiveIdx(chkIdx)}
                  className={`group p-2.5 rounded-lg border transition-all cursor-pointer ${
                    isActive 
                      ? "bg-indigo-950/20 border-indigo-500/30" 
                      : "bg-transparent border-transparent hover:bg-slate-900/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold font-display text-white">{checkpoint.label} Checkpoint</span>
                    <span className="text-[10px] font-mono text-slate-500">click to analyze drift details</span>
                  </div>

                  <div className="grid grid-cols-12 gap-3 items-center">
                    {/* Prompt-based Scraper bar */}
                    <div className="col-span-12 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-450 font-medium">1. Prompt Scrapers</span>
                        <span className="text-slate-400 font-bold">{checkpoint.underScraper}% success</span>
                      </div>
                      <div className="h-2 rounded bg-slate-900 overflow-hidden">
                        <div 
                          className="h-full bg-slate-500/60 rounded transition-all duration-1000 ease-out"
                          style={{ width: `${checkpoint.underScraper}%` }}
                        />
                      </div>
                    </div>

                    {/* Orchestrated Agent bar */}
                    <div className="col-span-12 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-indigo-400 font-bold">2. Our Orchestrated Agent</span>
                        <span className="text-indigo-300 font-bold">{checkpoint.orchestrated}% success</span>
                      </div>
                      <div className="h-2 rounded bg-slate-900 overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded transition-all duration-1000 ease-out"
                          style={{ width: `${checkpoint.orchestrated}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between text-[9px] font-mono text-slate-500">
            <span>METRIC: ORDER VALIDATION COMPLETED</span>
            <span>N=15,000 TRANSACTIONS SAMPLE</span>
          </div>
        </div>

        {/* Diagnostic Drift details panel */}
        <div className="lg:col-span-5 space-y-4 h-full flex flex-col justify-between">
          <div className="rounded-xl border border-slate-850 bg-slate-950/40 p-5 space-y-4">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono block border-b border-slate-900 pb-2">
              Deep Diagnostic: {activeCheckpoint.label}
            </span>

            {/* Unstable Column */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-rose-450 uppercase tracking-wider block font-bold">
                ⚠️ Scraper Decay Vector
              </span>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {activeCheckpoint.underScraper}% success. {activeCheckpoint.unstableReason}
              </p>
            </div>

            {/* Stable Column */}
            <div className="space-y-1 border-t border-slate-900 pt-3">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block font-bold">
                🛡️ Orchestrator Mitigation
              </span>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {activeCheckpoint.orchestrated}% success. {activeCheckpoint.stableReason}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex gap-3 items-start">
            <Award className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-xs font-semibold text-white">Continuous Self-Correction</h5>
              <p className="text-[10px] text-indigo-200 leading-relaxed font-sans">
                By maintaining a persistent historical offset database of typical checkouts, our system handles and corrects form changes dynamically using human-like retries.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
