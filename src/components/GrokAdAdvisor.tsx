/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Megaphone, Search, TrendingUp, MessageSquare, Check, Loader2, Sparkles, AlertCircle } from "lucide-react";

export default function GrokAdAdvisor() {
  const [adCopy, setAdCopy] = useState("Get the best deals on our new tech gear. Shop today.");
  const [targetAudience, setTargetAudience] = useState("Gamers");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!adCopy) return;
    
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/grok/analyze-ad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ adCopy, targetAudience })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze ad copy");
      }

      setAnalysisResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-slate-950/40 p-5 rounded-xl border border-slate-900 space-y-6 text-left animate-fadeIn">
      <div className="flex items-start gap-4">
        <div className="rounded-lg bg-indigo-600/10 p-2.5 text-indigo-400 border border-indigo-500/10 shrink-0">
          <Megaphone className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-base font-bold text-white uppercase font-display tracking-tight">
            Grok AI & X-Ads Strategy Advisor
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            Leverage Grok's real-time knowledge graph to optimize X (Twitter) advertising campaigns, boost engagement, and maximize return on ad spend (ROAS) for your e-commerce storefronts.
          </p>
        </div>
      </div>

      <hr className="border-slate-900" />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column: Input Form */}
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-display">Target Audience / Demographic</label>
            <input 
              type="text" 
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors"
              placeholder="e.g. Gamers, Fitness Enthusiasts"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-display">Current Ad Copy</label>
            <textarea 
              value={adCopy}
              onChange={(e) => setAdCopy(e.target.value)}
              rows={4}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors resize-none"
              placeholder="Enter the ad copy you want to optimize..."
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !adCopy.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-3 px-4 rounded-lg flex justify-center items-center gap-2 transition-colors uppercase tracking-wider text-xs font-display"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing X Firehose Data...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Analyze with Grok API
              </>
            )}
          </button>

          {error && (
            <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-lg flex items-center gap-2 text-red-400 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Right Column: Results */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-5 relative overflow-hidden min-h-[350px]">
          {!analysisResult && !isAnalyzing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 p-6 text-center space-y-3">
              <MessageSquare className="h-8 w-8 text-slate-700" />
              <p className="text-xs">Enter your ad copy and audience to generate real-time Grok sentiment analysis and optimization suggestions.</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-indigo-400 space-y-4 bg-slate-950/50 backdrop-blur-sm z-10">
              <Loader2 className="h-8 w-8 animate-spin" />
              <div className="text-xs font-mono font-bold tracking-wider uppercase animate-pulse">Running Grok Models...</div>
            </div>
          )}

          {analysisResult && !isAnalyzing && (
            <div className="space-y-5 h-full overflow-y-auto pr-2 custom-scrollbar animate-fadeIn">
              
              {analysisResult.isMocked && (
                <div className="bg-amber-950/30 border border-amber-900/50 rounded-md p-2 flex items-start gap-2">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-400/90 leading-relaxed font-mono">
                    {analysisResult.warning}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Sentiment</div>
                  <div className="text-xs font-bold text-white truncate">{analysisResult.sentiment}</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Trend Sync</div>
                  <div className="text-xs font-bold text-emerald-400">{analysisResult.trend_alignment}</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Ad Score</div>
                  <div className="text-xs font-bold text-indigo-400 text-lg">{analysisResult.score}/100</div>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Search className="h-3 w-3 text-indigo-400" /> Analysis
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {analysisResult.analysis}
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="h-3 w-3 text-indigo-400" /> Key Improvements
                </h5>
                <ul className="space-y-1.5">
                  {analysisResult.improvements.map((imp: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h5 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-indigo-400" /> Grok Optimized Variants
                </h5>
                <div className="space-y-2">
                  {analysisResult.revised_copy_suggestions.map((sug: string, idx: number) => (
                    <div key={idx} className="bg-indigo-950/20 border border-indigo-500/20 p-3 rounded-lg text-xs text-indigo-100 italic leading-relaxed">
                      {sug}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
