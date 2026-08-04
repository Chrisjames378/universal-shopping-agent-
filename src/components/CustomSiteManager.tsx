/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Globe, Sparkles, Check, Store, Link, Play, Edit3, Tag, Layers, MapPin } from "lucide-react";
import { ShoppingSite } from "../data/shoppingSites";

export const CUSTOM_SITES_STORAGE_KEY = "universal_agent_custom_shopping_sites";

export function getStoredCustomSites(): ShoppingSite[] {
  try {
    const raw = localStorage.getItem(CUSTOM_SITES_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse custom shopping sites from localStorage", err);
    return [];
  }
}

export function saveCustomSitesToStorage(sites: ShoppingSite[]): void {
  try {
    localStorage.setItem(CUSTOM_SITES_STORAGE_KEY, JSON.stringify(sites));
  } catch (err) {
    console.error("Failed to save custom shopping sites to localStorage", err);
  }
}

interface CustomSiteManagerProps {
  onSelectPrompt: (prompt: string) => void;
  onSiteAdded?: () => void;
}

export default function CustomSiteManager({ onSelectPrompt, onSiteAdded }: CustomSiteManagerProps) {
  const [customSites, setCustomSites] = useState<ShoppingSite[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [category, setCategory] = useState<ShoppingSite["category"]>("Department");
  const [region, setRegion] = useState<ShoppingSite["region"]>("Global");
  const [promptText, setPromptText] = useState("");
  const [promptsList, setPromptsList] = useState<string[]>([]);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    setCustomSites(getStoredCustomSites());
  }, []);

  const handleAddPrompt = () => {
    if (!promptText.trim()) return;
    setPromptsList([...promptsList, promptText.trim()]);
    setPromptText("");
  };

  const handleRemovePrompt = (index: number) => {
    setPromptsList(promptsList.filter((_, i) => i !== index));
  };

  const handleSaveSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !domain.trim()) return;

    const cleanDomain = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "").replace(/\/.*$/, "");
    const finalPrompts = promptsList.length > 0 
      ? promptsList 
      : [`Find top rated featured items on ${name} (${cleanDomain}) and simulate cart addition.`];

    const newSite: ShoppingSite = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      domain: cleanDomain,
      category,
      region,
      featuredPrompts: finalPrompts
    };

    const updated = [newSite, ...customSites];
    setCustomSites(updated);
    saveCustomSitesToStorage(updated);

    // Reset Form
    setName("");
    setDomain("");
    setCategory("Department");
    setRegion("Global");
    setPromptText("");
    setPromptsList([]);
    setShowAddForm(false);
    setAddedSuccess(true);

    if (onSiteAdded) onSiteAdded();

    setTimeout(() => setAddedSuccess(false), 3000);
  };

  const handleDeleteSite = (id: string) => {
    const updated = customSites.filter(site => site.id !== id);
    setCustomSites(updated);
    saveCustomSitesToStorage(updated);
    if (onSiteAdded) onSiteAdded();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 uppercase font-bold tracking-wider">
              Zero-Cost Custom Integration
            </span>
            <span className="text-xs text-slate-400 font-mono">100% Free Client Storage</span>
          </div>
          <h4 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <Store className="h-5 w-5 text-emerald-400" />
            Custom Storefront & Integration Manager
          </h4>
          <p className="text-xs text-slate-400 max-w-2xl">
            Add any store domain, niche e-commerce merchant, or local retail site to your execution matrix. Custom sites persist in your browser for immediate testing with AI shopping prompts.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-emerald-950/50 flex items-center gap-2 shrink-0"
        >
          {showAddForm ? (
            <>Cancel</>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add Custom Store
            </>
          )}
        </button>
      </div>

      {addedSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-lg flex items-center gap-2 font-mono">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          New storefront added successfully! Available immediately in the directory matrix.
        </div>
      )}

      {/* Add Custom Store Modal / Form */}
      {showAddForm && (
        <form onSubmit={handleSaveSite} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h5 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <Plus className="h-4 w-4 text-emerald-400" />
              Register New E-Commerce Storefront
            </h5>
            <span className="text-[11px] text-slate-500 font-mono">Free Local Storage</span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Store Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Eco Living Goods"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Website Domain *</label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. ecolivinggoods.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500/50 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
              <div className="relative">
                <Layers className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500/50"
                >
                  <option value="Department">Department</option>
                  <option value="Tech & Electronics">Tech & Electronics</option>
                  <option value="Fashion & Apparel">Fashion & Apparel</option>
                  <option value="Beauty & Health">Beauty & Health</option>
                  <option value="Home & Living">Home & Living</option>
                  <option value="Sports & Outdoors">Sports & Outdoors</option>
                  <option value="Marketplaces & Direct">Marketplaces & Direct</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Target Region</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500/50 font-mono"
                >
                  <option value="Global">Global</option>
                  <option value="Oceania">Oceania (NZ / AU)</option>
                  <option value="North America">North America (US / CA)</option>
                  <option value="UK & Europe">UK & Europe</option>
                  <option value="Asia">Asia</option>
                </select>
              </div>
            </div>
          </div>

          {/* Custom Prompts Builder */}
          <div className="space-y-2 pt-2 border-t border-slate-850">
            <label className="block text-xs font-bold text-slate-300">
              Custom AI Shopping Execution Prompts (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Find organic bamboo sheets under $80 on Eco Living Goods and verify stock."
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddPrompt();
                  }
                }}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500/50"
              />
              <button
                type="button"
                onClick={handleAddPrompt}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-all"
              >
                Add Prompt
              </button>
            </div>

            {promptsList.length > 0 && (
              <ul className="space-y-1.5 pt-2">
                {promptsList.map((p, idx) => (
                  <li key={idx} className="flex items-center justify-between bg-slate-900/80 border border-slate-800/80 p-2 rounded-lg text-xs text-slate-300">
                    <span className="truncate pr-2">{p}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePrompt(idx)}
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-850">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Save Custom Store
            </button>
          </div>
        </form>
      )}

      {/* List of Custom Stores */}
      <div className="space-y-3">
        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
          Your Custom Storefronts ({customSites.length})
        </h5>

        {customSites.length === 0 ? (
          <div className="text-center py-10 bg-slate-950/40 border border-slate-900 border-dashed rounded-xl space-y-2">
            <Store className="h-8 w-8 text-slate-700 mx-auto" />
            <p className="text-xs text-slate-500 font-mono">
              No custom storefronts added yet. Click "Add Custom Store" above to add your own retail sites or regional platforms!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {customSites.map((site) => (
              <div
                key={site.id}
                className="bg-slate-950/60 border border-slate-850 hover:border-emerald-500/30 transition-all rounded-xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase">
                        Custom
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{site.region}</span>
                    </div>
                    <h6 className="text-sm font-bold text-white font-display">{site.name}</h6>
                    <a
                      href={`https://${site.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-400 hover:underline font-mono flex items-center gap-1"
                    >
                      <Globe className="h-3 w-3" />
                      {site.domain}
                    </a>
                  </div>

                  <button
                    onClick={() => handleDeleteSite(site.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                    title="Delete storefront"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-900">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                    Sample Agent Prompts
                  </span>
                  {site.featuredPrompts.map((p, i) => (
                    <div
                      key={i}
                      className="group flex items-center justify-between gap-2 bg-slate-900/60 hover:bg-emerald-950/20 p-2 rounded-lg border border-slate-850 transition-all text-xs"
                    >
                      <span className="text-slate-300 text-[11px] leading-relaxed truncate">{p}</span>
                      <button
                        onClick={() => onSelectPrompt(p)}
                        className="px-2.5 py-1 bg-emerald-600/20 group-hover:bg-emerald-600 text-emerald-300 group-hover:text-white rounded text-[10px] font-bold transition-all shrink-0 flex items-center gap-1"
                      >
                        <Play className="h-3 w-3 fill-current" />
                        Run
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
