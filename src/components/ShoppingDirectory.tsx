/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Search, 
  Globe, 
  Sparkles, 
  ArrowUpRight, 
  ShoppingBag, 
  Layers, 
  MapPin, 
  Play, 
  Check, 
  HelpCircle, 
  Link2, 
  ChevronRight, 
  BookOpen, 
  Key, 
  Compass,
  DollarSign,
  Briefcase,
  ExternalLink,
  ShieldCheck,
  Megaphone,
  TrendingUp,
  MessageSquare
} from "lucide-react";
import { SHOPPING_SITES, ShoppingSite } from "../data/shoppingSites";

import GrokAdAdvisor from "./GrokAdAdvisor";

interface ShoppingDirectoryProps {
  onSelectPrompt: (prompt: string) => void;
}

export default function ShoppingDirectory({ onSelectPrompt }: ShoppingDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedSite, setSelectedSite] = useState<ShoppingSite | null>(SHOPPING_SITES[0]);
  const [activeTab, setActiveTab] = useState<"directory" | "paypal-advisor" | "grok-x-ads-advisor">("directory");
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  // Filter lists
  const categories = ["All", "Department", "Tech & Electronics", "Fashion & Apparel", "Beauty & Health", "Home & Living", "Sports & Outdoors", "Marketplaces & Direct"];
  const regions = ["All", "Oceania", "North America", "UK & Europe", "Global", "Asia"];

  const filteredSites = SHOPPING_SITES.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          site.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || site.category === selectedCategory;
    const matchesRegion = selectedRegion === "All" || site.region === selectedRegion;
    return matchesSearch && matchesCategory && matchesRegion;
  });

  const handleLaunchPrompt = (prompt: string) => {
    onSelectPrompt(prompt);
    setCopiedPrompt(prompt);
    
    // Smooth scroll up to the planner segment for optimal visual feedback
    const section = document.getElementById("sandbox");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }

    setTimeout(() => {
      setCopiedPrompt(null);
    }, 2500);
  };

  return (
    <div className="bg-slate-900/45 border border-slate-900 rounded-xl overflow-hidden p-6 space-y-6">
      
      {/* Tab Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono bg-indigo-505/10 text-indigo-400 px-2.5 py-1 rounded-full border border-indigo-500/25 uppercase font-bold tracking-wider">
            E-Commerce Storefront Matrix
          </span>
          <h3 className="text-xl font-bold font-display text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-indigo-400" />
            Active Shopping Storefront Directories ({SHOPPING_SITES.length} Sites)
          </h3>
          <p className="text-xs text-slate-400">
            Select from major global merchants to inject target schemas and test checkout paths inside the simulation enclaves.
          </p>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 shrink-0 self-start sm:self-center">
          <button
            onClick={() => setActiveTab("directory")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-2 ${
              activeTab === "directory"
                ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            Storefront Selector
          </button>
          <button
            onClick={() => setActiveTab("paypal-advisor")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-2 ${
              activeTab === "paypal-advisor"
                ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5" />
            PayPal Merchant Guide
          </button>
          <button
            onClick={() => setActiveTab("grok-x-ads-advisor")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-2 ${
              activeTab === "grok-x-ads-advisor"
                ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Megaphone className="h-3.5 w-3.5" />
            Grok X-Ads Advisor
          </button>
        </div>
      </div>

      {activeTab === "directory" ? (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Filters Row */}
          <div className="grid md:grid-cols-12 gap-4 items-center bg-slate-950/40 p-4 rounded-xl border border-slate-900">
            {/* Search Input */}
            <div className="relative md:col-span-4">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-slate-500" />
              </span>
              <input
                type="text"
                placeholder="Search across 60+ retailers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850/80 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-250 outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600 min-h-[38px]"
              />
            </div>

            {/* Category Filter */}
            <div className="md:col-span-4 flex items-center gap-2">
              <Layers className="h-4 w-4 text-slate-500 shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850/80 rounded-lg px-2.5 py-2 text-xs text-slate-300 font-medium outline-none focus:border-indigo-500/50 min-h-[38px]"
              >
                <option value="All">All Categories ({SHOPPING_SITES.filter(s => selectedRegion === "All" || s.region === selectedRegion).length})</option>
                {categories.slice(1).map(cat => (
                  <option key={cat} value={cat}>
                    {cat} ({SHOPPING_SITES.filter(s => s.category === cat && (selectedRegion === "All" || s.region === selectedRegion)).length})
                  </option>
                ))}
              </select>
            </div>

            {/* Region Filter */}
            <div className="md:col-span-4 flex items-center gap-2 font-mono">
              <MapPin className="h-4 w-4 text-slate-500 shrink-0" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850/80 rounded-lg px-2.5 py-2 text-xs text-slate-300 font-medium outline-none focus:border-indigo-500/50 min-h-[38px]"
              >
                <option value="All">All Regions (Global Coverage)</option>
                {regions.slice(1).map(reg => (
                  <option key={reg} value={reg}>
                    {reg} ({SHOPPING_SITES.filter(s => s.region === reg && (selectedCategory === "All" || s.category === selectedCategory)).length})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Master-Detail Split Grid */}
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            
            {/* Left list (7cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 uppercase tracking-widest pl-1">
                <span>Matching store records</span>
                <span>{filteredSites.length} showing</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-2.5 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
                {filteredSites.length === 0 ? (
                  <div className="sm:col-span-2 text-center py-10 text-slate-600 font-mono text-xs italic bg-slate-950/40 rounded-xl border border-slate-900 border-dashed">
                    No shops match standard credentials query filter.
                  </div>
                ) : (
                  filteredSites.map(site => {
                    const isSelected = selectedSite?.id === site.id;
                    return (
                      <div
                        key={site.id}
                        onClick={() => setSelectedSite(site)}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? "bg-indigo-950/20 border-indigo-500 shadow-md shadow-indigo-650/5"
                            : "bg-slate-950/50 border-slate-900 hover:border-slate-800 hover:bg-slate-900/35"
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-white text-xs font-bold font-display tracking-tight leading-none">
                              {site.name}
                            </span>
                            <span className="text-[8.5px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-850">
                              {site.region}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-[10px] text-indigo-400 font-mono">
                            <Link2 className="h-3 w-3 text-slate-600" />
                            <span>{site.domain}</span>
                          </div>
                        </div>

                        <div className="mt-3.5 pt-2.5 border-t border-slate-900/85 flex items-center justify-between">
                          <span className="text-[9.5px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-900 font-medium">
                            {site.category}
                          </span>
                          
                          <ChevronRight className={`h-3.5 w-3.5 transition-transform ${
                            isSelected ? "text-indigo-400 translate-x-1" : "text-slate-700"
                          }`} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Detailed Prompts Box (5cols) */}
            <div className="lg:col-span-5 bg-slate-950 rounded-xl border border-slate-900 p-5 space-y-4">
              {selectedSite ? (
                <div className="space-y-4 animate-scaleIn">
                  <div className="flex items-start justify-between border-b border-slate-900 pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white uppercase tracking-tight font-display">
                          {selectedSite.name}
                        </h4>
                        <span className="text-[8.5px] font-mono uppercase bg-indigo-500/15 text-indigo-400 px-1.5 py-0.5 rounded-full border border-indigo-500/25">
                          {selectedSite.region}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 leading-none block">{selectedSite.domain}</span>
                    </div>

                    <a 
                      href={`https://${selectedSite.domain}`} 
                      target="_blank" 
                      rel="noreferrer referrer" 
                      className="text-slate-500 hover:text-white transition-colors"
                      title="Visit Store Directly"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  {/* Summary constraints */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-slate-900/50 p-2 rounded border border-slate-900">
                      <span className="text-[9px] text-slate-550 block uppercase leading-none mb-1">Sector Class</span>
                      <span className="text-slate-300 font-sans font-bold text-[11px] truncate block">{selectedSite.category}</span>
                    </div>
                    <div className="bg-slate-900/50 p-2 rounded border border-slate-900">
                      <span className="text-[9px] text-slate-550 block uppercase leading-none mb-1">Cookie Vault</span>
                      <span className="text-emerald-400 font-bold block text-[11px]">🛡️ Active Isolate</span>
                    </div>
                  </div>

                  {/* Curated Prompts section */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-indigo-400" />
                      Decomposable Prompts (Try any!)
                    </span>

                    <div className="space-y-2.5">
                      {selectedSite.featuredPrompts.map((p, idx) => (
                        <div 
                          key={idx}
                          className="bg-slate-900/40 hover:bg-slate-900/80 border border-slate-900/80 p-3.5 rounded-lg space-y-3 transition-colors text-left"
                        >
                          <p className="text-xs text-slate-300 font-sans leading-relaxed italic">
                            "{p}"
                          </p>
                          
                          <button
                            onClick={() => handleLaunchPrompt(p)}
                            className="w-full bg-indigo-600/10 hover:bg-indigo-600 hover:text-white border border-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded text-[10px] font-mono font-bold tracking-wide uppercase transition-all flex items-center justify-center gap-1.5"
                          >
                            <Play className="h-3 w-3 shrink-0" />
                            Transfer into Agent Brain
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {copiedPrompt && (
                    <div className="bg-emerald-950/20 border border-emerald-500/25 p-2 rounded text-center text-[10.5px] font-mono text-emerald-400 animate-fadeIn">
                      ✓ Copied task query & focused Brain simulation!
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-20 text-slate-600 font-mono text-xs italic">
                  Select a store from the list to preview checkout schema templates.
                </div>
              )}
            </div>

          </div>

        </div>
      ) : activeTab === "paypal-advisor" ? (
        /* ADVISOR TABS */
        <div className="bg-slate-950/40 p-5 rounded-xl border border-slate-900 space-y-6 text-left animate-fadeIn">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-indigo-600/10 p-2.5 text-indigo-400 border border-indigo-500/10 shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white uppercase font-display tracking-tight">
                PayPal Developer Integration Setup Guide & Advice
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                A structured walkthrough addressing details on payment routing, developer client setups, and routing live e-commerce acquisitions safely.
              </p>
            </div>
          </div>

          <hr className="border-slate-900" />

          {/* Detailed Q&A Advice block */}
          <div className="space-y-5 text-xs text-slate-300 leading-relaxed">
            
            {/* The core answer */}
            <div className="p-4 rounded-lg bg-indigo-950/10 border border-indigo-500/10 space-y-2">
              <h5 className="font-extrabold text-white text-sm uppercase flex items-center gap-2 font-display">
                <DollarSign className="h-4 w-4 text-emerald-400" />
                "Do I need to add my info so I get paid?"
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                <strong>Yes, absolutely.</strong> To receive real payments via this platform, you must configure your own real-time credentials. By default, this application operates inside an isolated, emulated **PayPal Sandbox mode**, allowing you to cycle recurring billing triggers safely using simulated webhooks without any credit transactions.
              </p>
              <p className="text-xs text-indigo-300 leading-relaxed mt-1">
                To accept actual subscription money from active customers, you must obtain a **PayPal Business account** and connect your live client tokens inside your private hosting environment.
              </p>
            </div>

            {/* Implementation Steps */}
            <div className="space-y-3.5">
              <h5 className="font-bold text-slate-400 uppercase font-mono text-[10px] tracking-wider pl-1 font-semibold">
                How to configure live payouts step-by-step
              </h5>
              
              <div className="grid md:grid-cols-3 gap-4">
                {/* Step 1 */}
                <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold bg-indigo-500/10 px-2 py-0.5 rounded">Step 01</span>
                    <Briefcase className="h-3.5 w-3.5 text-slate-600" />
                  </div>
                  <h6 className="font-bold text-slate-200 leading-tight">Create PayPal Business</h6>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Convert your personal PayPal account to a <strong>Business Profile</strong>. This grants permissions to accept checkout orders and process subscriptions.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold bg-indigo-500/10 px-2 py-0.5 rounded">Step 02</span>
                    <Key className="h-3.5 w-3.5 text-slate-600" />
                  </div>
                  <h6 className="font-bold text-slate-200 leading-tight">Capture REST App Keys</h6>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Go to the <a href="https://developer.paypal.com" target="_blank" rel="noreferrer" className="text-indigo-400 underline hover:text-indigo-300">PayPal Developer Portal</a>. Click on 'Apps & Credentials', register your application, and capture your <strong>Client ID</strong> and <strong>Secret Key</strong>.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold bg-indigo-500/10 px-2 py-0.5 rounded">Step 03</span>
                    <ShieldCheck className="h-3.5 w-3.5 text-slate-650" />
                  </div>
                  <h6 className="font-bold text-slate-200 leading-tight">Add Keys to Secrets</h6>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Never hardcode secrets inside your code! Instead, insert <code>PAYPAL_CLIENT_ID</code> and <code>PAYPAL_SECRET</code> into the **Secrets Panel** (Workspace settings or your production <code>.env</code> configurations).
                  </p>
                </div>
              </div>
            </div>

            {/* Live vs Sandbox Setup Code Advice */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider pl-1 block font-semibold">
                Live SDK Handshake Boilerplate (Server-side proxy)
              </span>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-900 font-mono text-[11px] max-h-56 overflow-auto text-slate-300">
                <p className="text-slate-500">// Initialize real PayPal REST Node SDK safely on your backplane</p>
                <p className="text-slate-350">import paypal from '@paypal/checkout-server-sdk';</p>
                <br />
                <p className="text-slate-500">// Select sandbox or live mode depending on environment</p>
                <p className="text-slate-350">const environment = process.env.NODE_ENV === 'production'</p>
                <p className="text-slate-350">&nbsp;&nbsp;? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET_KEY)</p>
                <p className="text-slate-350">&nbsp;&nbsp;: new paypal.core.SandboxEnvironment('YOUR_MOCK_CLIENT_ID', 'YOUR_MOCK_SECRET');</p>
                <br />
                <p className="text-white">const payPalClient = new paypal.core.PayPalHttpClient(environment);</p>
              </div>
            </div>

          </div>
        </div>
      ) : activeTab === "grok-x-ads-advisor" ? (
        <GrokAdAdvisor />
      ) : null}

    </div>
  );
}
