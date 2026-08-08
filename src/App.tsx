/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  Search, 
  Settings, 
  Flame, 
  Workflow, 
  ChevronRight, 
  BadgeHelp,
  Fingerprint,
  FileCode,
  AlertOctagon,
  Lightbulb,
  Megaphone,
  UserPlus,
  Globe,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Key
} from "lucide-react";

import MetricCard from "./components/MetricCard";
import OrchestrationLoop from "./components/OrchestrationLoop";
import PlanGenerator from "./components/PlanGenerator";
import VaultPattern from "./components/VaultPattern";
import ReliabilityAnalysis from "./components/ReliabilityAnalysis";
import ArchitectChat from "./components/ArchitectChat";
import SubscriptionManager from "./components/SubscriptionManager";
import ShoppingDirectory from "./components/ShoppingDirectory";
import ApiStatusIndicator from "./components/ApiStatusIndicator";
import GatewayStatus from "./components/GatewayStatus";
import GrokAdAdvisor from "./components/GrokAdAdvisor";
import SignUpModal from "./components/SignUpModal";
import DiagnosticUtility from "./components/DiagnosticUtility";

export default function App() {
  const [activeBarrier, setActiveBarrier] = useState<"dom" | "bot" | "trust" | null>("dom");
  const [sharedPrompt, setSharedPrompt] = useState<string>("");
  const [isSignUpOpen, setIsSignUpOpen] = useState<boolean>(false);

  // Admin / Owner Visibility Controls for Ad Campaigns
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return localStorage.getItem("uniagent_admin_owner") === "true" || true;
  });
  const [showAdCampaigns, setShowAdCampaigns] = useState<boolean>(() => {
    return localStorage.getItem("uniagent_show_ads") !== "false";
  });
  const [showAdminPinModal, setShowAdminPinModal] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>("");
  const [pinError, setPinError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("uniagent_admin_owner", isAdminMode ? "true" : "false");
  }, [isAdminMode]);

  useEffect(() => {
    localStorage.setItem("uniagent_show_ads", showAdCampaigns ? "true" : "false");
  }, [showAdCampaigns]);

  const handleUnlockAdmin = () => {
    if (enteredPin === "0000" || enteredPin.trim().toLowerCase() === "admin") {
      setIsAdminMode(true);
      setShowAdminPinModal(false);
      setEnteredPin("");
      setPinError(null);
    } else {
      setPinError("Invalid PIN. (Default Owner PIN is 0000)");
    }
  };

  // Dynamic feedback descriptors for barriers
  const barrierDetails = {
    dom: {
      title: "The Fragile DOM Node Conundrum",
      implication: "Traditional selectors like '#buy-now-button' or CSS class paths decay continuously. Website structural adjustments cause prompt scraper scripts to crash immediately within production environments.",
      techSolution: "Multimodal Perception: The agent uses deep vision screenshotting combined with OCR mapping to locate checkout coordinates, mimicking natural user perception."
    },
    bot: {
      title: "Stealth Bypass of Cloudflare & Akamai",
      implication: "Static browser instances (Vanilla puppeteer) are blocked in milliseconds by scraper-guards inspecting JA3 TLS handshakes, HTTP2 frame layouts, and straight mouse coordinates.",
      techSolution: "Go-based Proxy Injectors: Rotating through dynamic residential subnets while spoofing client hardware signatures and generating bezier splines."
    },
    trust: {
      title: "High-Stakes Account Leak Mitigation",
      implication: "Directing an LLM to fill checkouts while possessing raw credit credentials invites prompt-injection vectors where external sites command the model to leak user credentials.",
      techSolution: "The Blind Enclave: Isolating vision systems entirely. Pushing transaction inputs programmatically behind simulated masks."
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* 1. Header Banner */}
      <header className="border-b border-slate-900/80 bg-[#070b16] sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-600/20 glow-indigo">
              Ω
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-widest font-display">
                  UNIVERSAL AGENT ARCHITECTURE
                </span>
                <span className="text-[9px] font-mono bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/25 uppercase font-bold tracking-wider">
                  Spec-v3.2
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-505 tracking-wide uppercase">
                Interactive Emulation & Safety Dashboard
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 font-sans text-xs font-semibold">
            {/* Owner/Admin Visibility Toggle */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 font-mono text-[11px]">
              {isAdminMode ? (
                <>
                  <button
                    onClick={() => setShowAdCampaigns(!showAdCampaigns)}
                    className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                      showAdCampaigns 
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" 
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                    title={showAdCampaigns ? "Ad Campaigns button & section are VISIBLE" : "Ad Campaigns button & section are HIDDEN"}
                  >
                    {showAdCampaigns ? <Eye className="h-3.5 w-3.5 text-indigo-200" /> : <EyeOff className="h-3.5 w-3.5 text-slate-400" />}
                    <span>{showAdCampaigns ? "Ads Visible" : "Ads Hidden"}</span>
                  </button>
                  <button
                    onClick={() => setIsAdminMode(false)}
                    className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-amber-400 transition-colors"
                    title="Lock Admin Mode (Lock visibility settings)"
                  >
                    <Unlock className="h-3.5 w-3.5 text-emerald-400" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAdminPinModal(true)}
                  className="px-2.5 py-1 text-slate-400 hover:text-white flex items-center gap-1 font-bold transition-colors"
                  title="Click to enter Owner PIN and access Admin Controls"
                >
                  <Lock className="h-3.5 w-3.5 text-amber-400" />
                  <span>Owner Mode</span>
                </button>
              )}
            </div>

            <button
              onClick={() => setIsSignUpOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 cursor-pointer font-mono text-xs"
            >
              <UserPlus className="h-4 w-4 text-indigo-200" /> Sign Up
            </button>
            <GatewayStatus />
            <ApiStatusIndicator />
          </div>
        </div>
      </header>

      {/* 2. Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Top Hero Pitch */}
        <section className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/60 text-indigo-300 text-xs font-semibold uppercase tracking-widest border border-indigo-500/30 font-mono shadow-md">
            <Globe className="h-3.5 w-3.5 text-emerald-400" />
            <span>Official Domain: www.uniagent.website</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-none font-display">
            Buying things on the internet is <span className="text-indigo-400 relative">harder than it looks.</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-450 leading-relaxed max-w-2xl mx-auto">
            Building a true "Universal Browser Action Agent" isn't merely about writing better prompts. It requires an orchestrator capable of multimodal perception, stealth TLS tunneling, and secure payment isolate enclaves.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsSignUpOpen(true)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-2 shadow-xl shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <UserPlus className="h-4 w-4 text-indigo-200" /> Sign Up to www.uniagent.website
            </button>
            {showAdCampaigns && (
              <a
                href="#ads"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold font-mono transition-colors flex items-center gap-1.5"
              >
                <span>🎯 Build Ad Campaigns</span>
                {isAdminMode && (
                  <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30 font-mono">
                    Owner Only
                  </span>
                )}
              </a>
            )}
          </div>
        </section>

        {/* 3. Top Metrics Section */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Agent System Autonomy"
            value="96.4%"
            change="+2.1% drift protection"
            isPositive={true}
            icon={<Cpu className="h-5 w-5" />}
            glowColor="indigo"
            helperText="Stabilized across 15,000 runs"
          />
          <MetricCard
            title="Anticipated CDP Latency"
            value="142ms"
            change="-12ms optimization"
            isPositive={true}
            icon={<Terminal className="h-5 w-5" />}
            glowColor="amber"
            helperText="Heuristic coordinate compilation"
          />
          <MetricCard
            title="Credential Vault Status"
            value="Isolated"
            change="100% blind mask"
            isPositive={true}
            icon={<ShieldCheck className="h-5 w-5" />}
            glowColor="emerald"
            helperText="Shielded from prompt injections"
          />
          <MetricCard
            title="Proxy Subnet Target"
            value="US-East"
            change="Residential IP pools"
            isPositive={false}
            icon={<Fingerprint className="h-5 w-5" />}
            glowColor="indigo"
            helperText="TLS ja3 Fingerprints active"
          />
        </section>

        {/* Real-time Connectivity & Diagnostic Suite */}
        <DiagnosticUtility />

        <hr className="border-slate-900" />

        {/* 4. Section 1: The Core Barriers */}
        <section className="space-y-6">
          <div className="border-l-2 border-indigo-500 pl-3">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider font-display">
              1. The Barriers to Agent Autonomy
            </h2>
            <p className="text-xs text-slate-400 font-mono">Why simple automation structures fail in high-stakes environments</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Barrier Card 1 */}
            <div 
              onClick={() => setActiveBarrier("dom")}
              className={`p-5 rounded-xl border transition-all cursor-pointer ${
                activeBarrier === "dom" 
                  ? "bg-slate-900/80 border-indigo-500 shadow-lg shadow-indigo-600/5 glow-indigo" 
                  : "bg-slate-900/20 border-slate-900 hover:bg-slate-900/40 hover:border-slate-800"
              }`}
            >
              <div className="w-9 h-9 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-display text-base font-bold text-indigo-400 mb-3">
                01
              </div>
              <h3 className="font-bold text-sm text-white font-display uppercase tracking-wide">
                Fragile DOM Anchors
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                E-commerce UI updates change button triggers hourly. Static CSS selectors represent an immediate break vector.
              </p>
            </div>

            {/* Barrier Card 2 */}
            <div 
              onClick={() => setActiveBarrier("bot")}
              className={`p-5 rounded-xl border transition-all cursor-pointer ${
                activeBarrier === "bot" 
                  ? "bg-slate-900/80 border-amber-500/80 shadow-lg shadow-amber-600/5 glow-amber" 
                  : "bg-slate-900/20 border-slate-900 hover:bg-slate-900/40 hover:border-slate-800"
              }`}
            >
              <div className="w-9 h-9 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-display text-base font-bold text-amber-400 mb-3">
                02
              </div>
              <h3 className="font-bold text-sm text-white font-display uppercase tracking-wide">
                Anti-Bot Warfare
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Cloudflare, Akamai and Datadome analyze canvas telemetry, mouse vectors, and socket protocol headers instantly.
              </p>
            </div>

            {/* Barrier Card 3 */}
            <div 
              onClick={() => setActiveBarrier("trust")}
              className={`p-5 rounded-xl border transition-all cursor-pointer ${
                activeBarrier === "trust" 
                  ? "bg-slate-900/80 border-emerald-500/80 shadow-lg shadow-emerald-500/5 glow-emerald" 
                  : "bg-slate-900/20 border-slate-900 hover:bg-slate-900/40 hover:border-slate-800"
              }`}
            >
              <div className="w-9 h-9 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-display text-base font-bold text-emerald-400 mb-3">
                03
              </div>
              <h3 className="font-bold text-sm text-white font-display uppercase tracking-wide">
                Context-Window Leaks
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Prompt injections allow dynamic websites to command browser agents to exfiltrate cached credit cards or profiles.
              </p>
            </div>
          </div>

          {/* Dynamic feedback panel depending on selection */}
          {activeBarrier && (
            <div className="rounded-xl border border-slate-900 bg-slate-950 p-5 flex gap-4 items-start animate-fadeIn">
              <div className="rounded bg-indigo-500/10 p-2 text-indigo-400 shrink-0">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white font-display uppercase tracking-wide">
                  {barrierDetails[activeBarrier].title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  <span className="text-slate-205 font-semibold">Implication:</span> {barrierDetails[activeBarrier].implication}
                </p>
                <p className="text-xs text-indigo-300 mt-2 leading-relaxed">
                  <span className="text-indigo-400 font-bold uppercase tracking-wider text-[10px] font-mono select-none mr-2">[solved]</span>
                  {barrierDetails[activeBarrier].techSolution}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* 5. Section 2: Interactive Orchestration Loop */}
        <section id="orchestration" className="scroll-mt-20">
          <div className="border-l-2 border-indigo-500 pl-3 mb-6">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider font-display flex items-center gap-2">
              2. The Stepping Orchestration Loop
            </h2>
            <p className="text-xs text-slate-400 font-mono">Step through standard client-side browser emulator sequences</p>
          </div>

          <OrchestrationLoop />
        </section>

        {/* 5.5. Section 3: The E-Commerce Storefront Matrix */}
        <section id="directory" className="scroll-mt-20">
          <div className="border-l-2 border-indigo-500 pl-3 mb-6">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider font-display">
              3. The E-Commerce Storefront Matrix
            </h2>
            <p className="text-xs text-slate-400 font-mono">Browse and launch specialized agent prompts for 60+ major shopping retailers</p>
          </div>

          <ShoppingDirectory onSelectPrompt={setSharedPrompt} />
        </section>

        {/* 5.8. Section 4: Multi-Platform Ad Strategy Advisor (Visible when showAdCampaigns is enabled) */}
        {showAdCampaigns && (
          <section id="ads" className="scroll-mt-20">
            <div className="border-l-2 border-indigo-500 pl-3 mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wider font-display flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-indigo-400" />
                  4. Multi-Platform Ad Strategy Advisor (X, Meta, TikTok, Amazon, eBay)
                </h2>
                <p className="text-xs text-slate-400 font-mono">Optimize campaigns, ad copy, and search titles for X (Twitter), Facebook/Meta, TikTok, Amazon, and eBay</p>
              </div>
              {isAdminMode && (
                <button
                  onClick={() => setShowAdCampaigns(false)}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-800 rounded text-[10px] font-mono flex items-center gap-1 transition-colors"
                  title="Hide this section from visitors"
                >
                  <EyeOff className="h-3 w-3" /> Hide Section
                </button>
              )}
            </div>

            <GrokAdAdvisor />
          </section>
        )}

        {/* 6. Section 4: The Brain Plan Generator */}
        <section id="sandbox" className="scroll-mt-20">
          <div className="border-l-2 border-indigo-550 pl-3 mb-6">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider font-display">
              4. Interactive: The LLM Brain Pipeline
            </h2>
            <p className="text-xs text-slate-400 font-mono">Compile natural language intents into execution-ready JSON objects</p>
          </div>

          <PlanGenerator externalPrompt={sharedPrompt} />
        </section>

        {/* 7. Section 5: Secure Vault Integration */}
        <section id="vault" className="scroll-mt-20">
          <div className="border-l-2 border-emerald-500 pl-3 mb-6">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider font-display">
              5. Secure Transaction Sandboxing
            </h2>
            <p className="text-xs text-slate-400 font-mono">Isolate structural credentials using hardware sockets and vision-blinding masks</p>
          </div>

          <VaultPattern />
        </section>

        {/* 7.5. Section 6: Secure Active PayPal Subscriptions */}
        <section id="subscriptions" className="scroll-mt-20">
          <div className="border-l-2 border-blue-500 pl-3 mb-6">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider font-display">
              6. PayPal Billing & Account Hook Handshakes
            </h2>
            <p className="text-xs text-slate-400 font-mono">Simulate user authentication, active subscription lifecycles, and automated webhook triggers</p>
          </div>

          <SubscriptionManager />
        </section>

        {/* 8. Section 7: Accuracy & Audit analytics */}
        <section id="chart" className="scroll-mt-20">
          <div className="border-l-2 border-indigo-500 pl-3 mb-6">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider font-display">
              7. Project Drifts over time
            </h2>
            <p className="text-xs text-slate-400 font-mono">Statistical evidence behind multimodal visual actions vs traditional DOM automation</p>
          </div>

          <ReliabilityAnalysis />
        </section>

      </main>

      {/* Footer Specification Details */}
      <footer className="bg-[#04060d] border-t border-slate-900 py-12 text-slate-500 text-xs text-center font-mono space-y-2">
        <p className="uppercase tracking-widest text-[10px] text-slate-405 font-bold">
          UNIVERSAL ACTION ENCLAVE SYSTEM ARCHITECTURE REPORT
        </p>
        <p className="text-[10px] text-slate-600">
          &copy; {new Date().getFullYear()} Google AI Studio Build - Full-Stack React Framework Compilation.
        </p>
      </footer>

      {/* Floating Chief Architect Chat widget */}
      <ArchitectChat />

      {/* Member Sign Up Modal for www.uniagent.website */}
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        defaultDomain="www.uniagent.website"
      />

      {/* Owner Mode Access Control PIN Modal */}
      {showAdminPinModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => {
                setShowAdminPinModal(false);
                setPinError(null);
                setEnteredPin("");
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs font-mono"
            >
              ✕ Close
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
                <Key className="h-4 w-4" /> Owner / Admin Access Lock
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                Unlock Owner Controls
              </h3>
              <p className="text-xs text-slate-400">
                Enter your Owner Security PIN to toggle the visibility of the "Build Ad Campaigns" advisor and manage private tools.
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                  Owner PIN Code (Default: 0000)
                </label>
                <input
                  type="password"
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUnlockAdmin()}
                  placeholder="Enter PIN..."
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-center text-lg tracking-widest font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>

              {pinError && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-lg font-sans">
                  {pinError}
                </div>
              )}

              <button
                onClick={handleUnlockAdmin}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                <Unlock className="h-4 w-4" /> Unlock Owner Controls
              </button>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <div className="font-bold text-slate-300 flex items-center gap-1">
                  💡 Quick Tip:
                </div>
                <div>Default PIN is <code className="text-indigo-400 font-bold">0000</code> or type <code className="text-indigo-400 font-bold">admin</code>. You can hide or reveal the Ad Advisor button anytime!</div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
