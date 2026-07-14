/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
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
  Lightbulb
} from "lucide-react";

import MetricCard from "./components/MetricCard";
import OrchestrationLoop from "./components/OrchestrationLoop";
import PlanGenerator from "./components/PlanGenerator";
import VaultPattern from "./components/VaultPattern";
import ReliabilityAnalysis from "./components/ReliabilityAnalysis";
import ArchitectChat from "./components/ArchitectChat";
import SubscriptionManager from "./components/SubscriptionManager";
import ShoppingDirectory from "./components/ShoppingDirectory";

export default function App() {
  const [activeBarrier, setActiveBarrier] = useState<"dom" | "bot" | "trust" | null>("dom");
  const [sharedPrompt, setSharedPrompt] = useState<string>("");

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

          <div className="hidden md:flex items-center gap-6 font-mono text-xs">
            <a href="#orchestration" className="text-slate-400 hover:text-white transition-colors">
              // Loop
            </a>
            <a href="#directory" className="text-slate-400 hover:text-white transition-colors">
              // Shops
            </a>
            <a href="#sandbox" className="text-slate-400 hover:text-white transition-colors">
              // Brain
            </a>
            <a href="#vault" className="text-slate-400 hover:text-white transition-colors">
              // Vault
            </a>
            <a href="#subscriptions" className="text-slate-400 hover:text-white transition-colors">
              // Billing
            </a>
            <a href="#chart" className="text-slate-400 hover:text-white transition-colors">
              // Audit
            </a>
            <span className="text-slate-600 shrink-0">|</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              CDP Agent Node Online
            </div>
          </div>
        </div>
      </header>

      {/* 2. Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Top Hero Pitch */}
        <section className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/5 text-indigo-300 text-xs font-semibold uppercase tracking-widest border border-indigo-500/10 font-mono">
            System Design Specification
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-none font-display">
            Buying things on the internet is <span className="text-indigo-400 relative">harder than it looks.</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-450 leading-relaxed max-w-2xl mx-auto">
            Building a true "Universal Browser Action Agent" isn't merely about writing better prompts. It requires an orchestrator capable of multimodal perception, stealth TLS tunneling, and secure payment isolate enclaves.
          </p>
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

    </div>
  );
}
