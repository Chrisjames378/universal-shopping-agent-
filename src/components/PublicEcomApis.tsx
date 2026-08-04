/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Globe, 
  Sparkles, 
  Search, 
  ShoppingBag, 
  RefreshCw, 
  Loader2, 
  Check, 
  ExternalLink, 
  Tag, 
  Play, 
  Layers, 
  Apple, 
  Database, 
  Zap,
  Info
} from "lucide-react";

interface PublicEcomApisProps {
  onSelectPrompt: (prompt: string) => void;
}

export default function PublicEcomApis({ onSelectPrompt }: PublicEcomApisProps) {
  const [activeApi, setActiveApi] = useState<"fakestore" | "dummyjson" | "openfoodfacts">("fakestore");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Data States
  const [fakeStoreProducts, setFakeStoreProducts] = useState<any[]>([]);
  const [dummyJsonProducts, setDummyJsonProducts] = useState<any[]>([]);
  const [foodFactsProducts, setFoodFactsProducts] = useState<any[]>([]);
  const [foodSearchQuery, setFoodSearchQuery] = useState("chocolate");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  // Fetch FakeStore API
  const fetchFakeStore = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://fakestoreapi.com/products?limit=10");
      if (!res.ok) throw new Error("Failed to fetch FakeStore API data");
      const data = await res.json();
      setFakeStoreProducts(data);
    } catch (err: any) {
      setError(err.message || "Failed to load FakeStore API");
    } finally {
      setLoading(false);
    }
  };

  // Fetch DummyJSON Products API
  const fetchDummyJson = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://dummyjson.com/products?limit=12");
      if (!res.ok) throw new Error("Failed to fetch DummyJSON API data");
      const data = await res.json();
      setDummyJsonProducts(data.products || []);
    } catch (err: any) {
      setError(err.message || "Failed to load DummyJSON API");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Open Food Facts API (Search for products/additives)
  const fetchOpenFoodFacts = async (query: string = foodSearchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=10`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch Open Food Facts API");
      const data = await res.json();
      setFoodFactsProducts(data.products || []);
    } catch (err: any) {
      setError(err.message || "Failed to load Open Food Facts API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeApi === "fakestore" && fakeStoreProducts.length === 0) {
      fetchFakeStore();
    } else if (activeApi === "dummyjson" && dummyJsonProducts.length === 0) {
      fetchDummyJson();
    } else if (activeApi === "openfoodfacts" && foodFactsProducts.length === 0) {
      fetchOpenFoodFacts("chocolate");
    }
  }, [activeApi]);

  const handleLaunchProductPrompt = (productTitle: string, price?: number | string, storeName?: string) => {
    const store = storeName || (activeApi === "fakestore" ? "FakeStore Marketplace" : activeApi === "dummyjson" ? "DummyJSON Direct Store" : "Open Food Facts Directory");
    const priceText = price ? ` listed around $${price}` : "";
    const prompt = `Perform an automated shopping audit for "${productTitle}"${priceText} on ${store}. Verify stock availability, compare rating scores, and generate automated checkout steps.`;
    onSelectPrompt(prompt);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono bg-sky-500/10 text-sky-400 px-2.5 py-0.5 rounded-full border border-sky-500/20 uppercase font-bold tracking-wider">
              100% Free Public APIs
            </span>
            <span className="text-xs text-slate-400 font-mono">Zero Key Credentials Required</span>
          </div>
          <h4 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <Database className="h-5 w-5 text-sky-400" />
            Live Free E-Commerce & Retail API Catalog
          </h4>
          <p className="text-xs text-slate-400 max-w-2xl">
            Directly test live product feeds, additive databases, and inventory records using high-availability open public REST APIs without requiring API keys or subscriptions.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400">
            <span className="text-slate-300 font-bold">🌐 Direct Documentation Links:</span>
            <a href="https://fakestoreapi.com" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline flex items-center gap-1">
              FakeStore API ↗
            </a>
            <span>•</span>
            <a href="https://dummyjson.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline flex items-center gap-1">
              DummyJSON API ↗
            </a>
            <span>•</span>
            <a href="https://world.openfoodfacts.org" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1">
              Open Food Facts API ↗
            </a>
          </div>
        </div>

        {/* API Selector Switcher */}
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveApi("fakestore")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeApi === "fakestore"
                ? "bg-sky-500 text-white font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            FakeStore API
          </button>
          <button
            onClick={() => setActiveApi("dummyjson")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeApi === "dummyjson"
                ? "bg-indigo-500 text-white font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            DummyJSON API
          </button>
          <button
            onClick={() => setActiveApi("openfoodfacts")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeApi === "openfoodfacts"
                ? "bg-emerald-500 text-white font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Apple className="h-3.5 w-3.5" />
            Open Food Facts
          </button>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-slate-950/40 border border-slate-900 rounded-xl space-y-3">
          <Loader2 className="h-8 w-8 text-sky-400 animate-spin" />
          <p className="text-xs font-mono text-slate-400">Fetching live API catalog payload...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl flex items-center justify-between">
          <span>Error loading API data: {error}</span>
          <button
            onClick={() => {
              if (activeApi === "fakestore") fetchFakeStore();
              if (activeApi === "dummyjson") fetchDummyJson();
              if (activeApi === "openfoodfacts") fetchOpenFoodFacts();
            }}
            className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 rounded text-rose-200 font-bold"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* FakeStore API View */}
          {activeApi === "fakestore" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>API Endpoint: <code className="text-sky-300 bg-slate-900 px-1.5 py-0.5 rounded">https://fakestoreapi.com/products</code></span>
                <button
                  onClick={fetchFakeStore}
                  className="flex items-center gap-1 text-slate-400 hover:text-white"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Reload Payload
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {fakeStoreProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-slate-950/60 border border-slate-850 hover:border-sky-500/30 transition-all rounded-xl p-4 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        {p.image && (
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-12 h-12 object-contain rounded bg-white p-1 shrink-0"
                          />
                        )}
                        <div className="space-y-0.5 overflow-hidden">
                          <span className="text-[10px] font-mono text-sky-400 uppercase font-bold block truncate">
                            {p.category}
                          </span>
                          <h6 className="text-xs font-bold text-white leading-snug line-clamp-2">
                            {p.title}
                          </h6>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono pt-1">
                        <span className="text-emerald-400 font-bold">${p.price?.toFixed(2)}</span>
                        {p.rating && (
                          <span className="text-amber-400 text-[11px]">
                            ★ {p.rating.rate} ({p.rating.count})
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleLaunchProductPrompt(p.title, p.price, "FakeStore API")}
                      className="w-full py-1.5 bg-sky-600/20 hover:bg-sky-600 text-sky-300 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      Test Execution Prompt
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DummyJSON API View */}
          {activeApi === "dummyjson" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>API Endpoint: <code className="text-indigo-300 bg-slate-900 px-1.5 py-0.5 rounded">https://dummyjson.com/products</code></span>
                <button
                  onClick={fetchDummyJson}
                  className="flex items-center gap-1 text-slate-400 hover:text-white"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Reload Payload
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {dummyJsonProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-slate-950/60 border border-slate-850 hover:border-indigo-500/30 transition-all rounded-xl p-4 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        {p.thumbnail && (
                          <img
                            src={p.thumbnail}
                            alt={p.title}
                            className="w-12 h-12 object-cover rounded bg-slate-900 shrink-0"
                          />
                        )}
                        <div className="space-y-0.5 overflow-hidden">
                          <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold block truncate">
                            {p.brand || p.category}
                          </span>
                          <h6 className="text-xs font-bold text-white leading-snug line-clamp-2">
                            {p.title}
                          </h6>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono pt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-bold">${p.price}</span>
                          {p.discountPercentage && (
                            <span className="text-[10px] text-rose-400 bg-rose-500/10 px-1 rounded">
                              -{p.discountPercentage}%
                            </span>
                          )}
                        </div>
                        <span className="text-slate-400 text-[10px]">Stock: {p.stock}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleLaunchProductPrompt(p.title, p.price, "DummyJSON Direct Store")}
                      className="w-full py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      Test Execution Prompt
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Open Food Facts API View */}
          {activeApi === "openfoodfacts" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-850">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Apple className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-bold text-white font-display">Open Food Facts & Additives Query:</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-80">
                  <input
                    type="text"
                    placeholder="Search food items or additives..."
                    value={foodSearchQuery}
                    onChange={(e) => setFoodSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") fetchOpenFoodFacts(foodSearchQuery);
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-emerald-500/50"
                  />
                  <button
                    onClick={() => fetchOpenFoodFacts(foodSearchQuery)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all shrink-0"
                  >
                    Search
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {foodFactsProducts.map((p, idx) => {
                  const title = p.product_name || p.product_name_en || "Food Item";
                  const brands = p.brands || "Generic";
                  const nutriScore = p.nutriscore_grade?.toUpperCase();
                  const additivesCount = p.additives_tags?.length || 0;

                  return (
                    <div
                      key={p.code || idx}
                      className="bg-slate-950/60 border border-slate-850 hover:border-emerald-500/30 transition-all rounded-xl p-4 flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start gap-3">
                          {p.image_front_small_url && (
                            <img
                              src={p.image_front_small_url}
                              alt={title}
                              className="w-12 h-12 object-contain rounded bg-white p-0.5 shrink-0"
                            />
                          )}
                          <div className="space-y-0.5 overflow-hidden">
                            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block truncate">
                              {brands}
                            </span>
                            <h6 className="text-xs font-bold text-white leading-snug line-clamp-2">
                              {title}
                            </h6>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs font-mono pt-1">
                          {nutriScore && (
                            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                              Nutri-Score: {nutriScore}
                            </span>
                          )}
                          <span className="text-[10px] text-amber-400 font-bold">
                            {additivesCount} Additives Listed
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const prompt = `Perform an Open Food Facts audit for "${title}" by ${brands}. Extract additives, ingredients risk score, and verify availability on online grocery stores.`;
                          onSelectPrompt(prompt);
                        }}
                        className="w-full py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <Play className="h-3 w-3 fill-current" />
                        Run Additive Audit Prompt
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
