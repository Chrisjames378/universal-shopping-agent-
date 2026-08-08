/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { safeResponseJson } from "../lib/safeFetch";
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
  Info,
  Store,
  Code,
  Copy,
  Terminal,
  Code2,
  FileCode,
  Box,
  CheckCircle2
} from "lucide-react";

interface PublicEcomApisProps {
  onSelectPrompt: (prompt: string) => void;
}

export default function PublicEcomApis({ onSelectPrompt }: PublicEcomApisProps) {
  const [activeApi, setActiveApi] = useState<"shopify" | "fakestore" | "dummyjson" | "openfoodfacts">("shopify");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Data States
  const [fakeStoreProducts, setFakeStoreProducts] = useState<any[]>([]);
  const [dummyJsonProducts, setDummyJsonProducts] = useState<any[]>([]);
  const [foodFactsProducts, setFoodFactsProducts] = useState<any[]>([]);
  const [foodSearchQuery, setFoodSearchQuery] = useState("chocolate");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  // Shopify Storefront API States
  const [shopifyDomain, setShopifyDomain] = useState("demo-store.myshopify.com");
  const [shopifyToken, setShopifyToken] = useState("shpat_demo_storefront_access_token_2026");
  const [shopifyQuery, setShopifyQuery] = useState(`query {
  products(first: 4) {
    edges {
      node {
        id
        title
        handle
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 1) {
          edges {
            node {
              url
            }
          }
        }
      }
    }
  }
}`);
  const [shopifyResponse, setShopifyResponse] = useState<any>(null);
  const [copiedLiquid, setCopiedLiquid] = useState(false);

  // Fetch Shopify Storefront API
  const fetchShopifyStorefront = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/shopify/storefront", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopDomain: shopifyDomain,
          accessToken: shopifyToken,
          query: shopifyQuery
        })
      });
      const data = await safeResponseJson(res);
      setShopifyResponse(data);
    } catch (err: any) {
      setError(err.message || "Shopify Storefront query failed");
    } finally {
      setLoading(false);
    }
  };

  // Fetch FakeStore API
  const fetchFakeStore = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://fakestoreapi.com/products?limit=10");
      if (!res.ok) throw new Error("Failed to fetch FakeStore API data");
      const data = await safeResponseJson(res);
      if (!data) throw new Error("FakeStore API returned non-JSON format");
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
      const data = await safeResponseJson(res);
      if (!data) throw new Error("DummyJSON API returned non-JSON format");
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
      const data = await safeResponseJson(res);
      if (!data) throw new Error("Open Food Facts API returned non-JSON format");
      setFoodFactsProducts(data.products || []);
    } catch (err: any) {
      setError(err.message || "Failed to load Open Food Facts API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeApi === "shopify" && !shopifyResponse) {
      fetchShopifyStorefront();
    } else if (activeApi === "fakestore" && fakeStoreProducts.length === 0) {
      fetchFakeStore();
    } else if (activeApi === "dummyjson" && dummyJsonProducts.length === 0) {
      fetchDummyJson();
    } else if (activeApi === "openfoodfacts" && foodFactsProducts.length === 0) {
      fetchOpenFoodFacts("chocolate");
    }
  }, [activeApi]);

  const handleLaunchProductPrompt = (productTitle: string, price?: number | string, storeName?: string) => {
    const store = storeName || (activeApi === "shopify" ? "Shopify Storefront API" : activeApi === "fakestore" ? "FakeStore Marketplace" : activeApi === "dummyjson" ? "DummyJSON Direct Store" : "Open Food Facts Directory");
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
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 uppercase font-bold tracking-wider">
              🛍️ Shopify Storefront & Public APIs
            </span>
            <span className="text-xs text-slate-400 font-mono">Headless, Theme App Extensions & App Proxy</span>
          </div>
          <h4 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <Store className="h-5 w-5 text-emerald-400" />
            Shopify Storefront API & E-Commerce Catalog
          </h4>
          <p className="text-xs text-slate-400 max-w-2xl">
            Yes! Deploy your AI shopping app on Shopify using the GraphQL Storefront API, Theme iFrame Liquid extensions, Shopify App Proxies, or Hydrogen. Test live store queries below.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400">
            <span className="text-slate-300 font-bold">🌐 Direct Documentation Links:</span>
            <a href="https://shopify.dev/docs/api/storefront" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1 font-bold">
              Shopify Storefront GraphQL ↗
            </a>
            <span>•</span>
            <a href="https://fakestoreapi.com" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline flex items-center gap-1">
              FakeStore API ↗
            </a>
            <span>•</span>
            <a href="https://dummyjson.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline flex items-center gap-1">
              DummyJSON API ↗
            </a>
          </div>
        </div>

        {/* API Selector Switcher */}
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0 flex-wrap gap-1">
          <button
            onClick={() => setActiveApi("shopify")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeApi === "shopify"
                ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Store className="h-3.5 w-3.5" />
            Shopify Storefront
          </button>
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
          <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
          <p className="text-xs font-mono text-slate-400">Executing Shopify Storefront GraphQL Query...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl flex items-center justify-between">
          <span>Error executing query: {error}</span>
          <button
            onClick={() => {
              if (activeApi === "shopify") fetchShopifyStorefront();
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
          
          {/* SHOPIFY STOREFRONT API VIEW */}
          {activeApi === "shopify" && (
            <div className="space-y-6">
              
              {/* Top Sandbox Credentials & GraphQL Editor */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold font-mono">
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <Terminal className="h-4 w-4" /> Live Shopify GraphQL Storefront Sandbox
                  </span>
                  <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    Endpoint: POST /api/2024-04/graphql.json
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Shopify Store Domain (.myshopify.com)</label>
                    <input
                      type="text"
                      value={shopifyDomain}
                      onChange={(e) => setShopifyDomain(e.target.value)}
                      placeholder="your-store.myshopify.com"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Storefront Access Token (Optional)</label>
                    <input
                      type="text"
                      value={shopifyToken}
                      onChange={(e) => setShopifyToken(e.target.value)}
                      placeholder="shpat_..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* GraphQL Query Code Editor */}
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-bold flex items-center gap-1 text-slate-300">
                      <Code2 className="h-3.5 w-3.5 text-emerald-400" /> GraphQL Query Payload
                    </span>
                    <button
                      onClick={fetchShopifyStorefront}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-md flex items-center gap-1 transition-all"
                    >
                      <Play className="h-3 w-3 fill-current" /> Execute Query
                    </button>
                  </div>
                  <textarea
                    rows={7}
                    value={shopifyQuery}
                    onChange={(e) => setShopifyQuery(e.target.value)}
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500 leading-relaxed custom-scrollbar"
                  />
                </div>
              </div>

              {/* Shopify Live Product Cards Result */}
              {shopifyResponse?.data?.products?.edges && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Box className="h-4 w-4 text-emerald-400" /> Shopify Storefront Catalog Results ({shopifyResponse.data.products.edges.length} items)
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                      Source: {shopifyResponse.source || "Shopify Storefront API"}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {shopifyResponse.data.products.edges.map((edge: any, idx: number) => {
                      const p = edge.node;
                      const price = p.priceRange?.minVariantPrice?.amount;
                      const currency = p.priceRange?.minVariantPrice?.currencyCode || "USD";
                      const img = p.images?.edges?.[0]?.node?.url;

                      return (
                        <div
                          key={p.id || idx}
                          className="bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 transition-all rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-md"
                        >
                          <div className="space-y-2">
                            {img && (
                              <img
                                src={img}
                                alt={p.title}
                                className="w-full h-32 object-cover rounded-lg bg-slate-900 border border-slate-800"
                              />
                            )}
                            <div>
                              <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase block">
                                Shopify Product #{idx + 1}
                              </span>
                              <h6 className="text-xs font-bold text-white leading-snug line-clamp-2">
                                {p.title}
                              </h6>
                              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                                {p.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-between text-xs font-mono pt-1">
                              <span className="text-emerald-400 font-bold">${price} {currency}</span>
                              <span className="text-[9px] text-slate-500 truncate max-w-[100px]">{p.handle}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleLaunchProductPrompt(p.title, price, `Shopify Store (${shopifyDomain})`)}
                            className="w-full py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                          >
                            <Play className="h-3 w-3 fill-current" />
                            Launch Shopify Agent Audit
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4 SHOPIFY DEPLOYMENT METHODS GUIDE */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-white border-b border-slate-800 pb-3">
                  <span className="flex items-center gap-2 font-display text-sm text-emerald-400">
                    <FileCode className="h-5 w-5 text-emerald-400" />
                    How to Deploy this AI Shopping App on Shopify (4 Official Methods)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded">
                    Shopify Integration Architecture
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Method 1: Theme App Extension iFrame */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                        <Code className="h-4 w-4 text-emerald-400" /> 1. Shopify Theme Liquid Embed (Fastest)
                      </span>
                      <button
                        onClick={() => {
                          const liquidCode = `<-- Shopify Theme App Extension: AI Shopping Assistant -->\n<div id="ai-shopping-assistant-root" style="margin:24px 0;">\n  <iframe \n    src="https://www.uniagent.website" \n    style="width:100%; height:750px; border:none; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.15);"\n    allow="clipboard-write"\n  ></iframe>\n</div>`;
                          navigator.clipboard.writeText(liquidCode);
                          setCopiedLiquid(true);
                          setTimeout(() => setCopiedLiquid(false), 2000);
                        }}
                        className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded text-[10px] font-mono font-bold flex items-center gap-1 transition-colors"
                      >
                        {copiedLiquid ? <CheckCircle2 className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedLiquid ? "Copied Liquid!" : "Copy Snippet"}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      In your Shopify Admin, go to <span className="text-white font-mono">Online Store &gt; Themes &gt; Edit Code</span>, create a snippet <code className="text-emerald-400 font-mono">snippets/ai-shopping-assistant.liquid</code>, and insert:
                    </p>
                    <pre className="p-2.5 bg-slate-950 rounded border border-slate-800 text-[10px] font-mono text-emerald-200 overflow-x-auto select-all">
{`<div id="ai-shopping-assistant-root">
  <iframe src="https://www.uniagent.website" style="width:100%;height:750px;border:none;border-radius:12px;" />
</div>`}
                    </pre>
                  </div>

                  {/* Method 2: Headless Storefront API */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 space-y-2.5">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                      <Globe className="h-4 w-4 text-sky-400" /> 2. Headless Storefront (React / Next / Vite)
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Deploy this standalone React app on Cloud Run or Vercel and connect your Shopify catalog using <code className="text-sky-300 font-mono">@shopify/storefront-api-client</code>.
                    </p>
                    <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-[10px] font-mono text-sky-300 space-y-1">
                      <div>VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com</div>
                      <div>VITE_SHOPIFY_STOREFRONT_TOKEN=shpat_1234567890</div>
                    </div>
                  </div>

                  {/* Method 3: Shopify App Proxy */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 space-y-2.5">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                      <Zap className="h-4 w-4 text-amber-400" /> 3. Shopify App Proxy (/apps/ai-assistant)
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      In Shopify Partners Dashboard &gt; App Setup &gt; App Proxy, map Subpath <code className="text-amber-300 font-mono">/apps/ai-assistant</code> to <code className="text-amber-300 font-mono">https://www.uniagent.website/api/shopify/proxy</code>.
                    </p>
                    <p className="text-[10px] text-slate-400">
                      This keeps your AI app on your primary Shopify domain for maximum SEO and security authority.
                    </p>
                  </div>

                  {/* Method 4: Hydrogen / Remix */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 space-y-2.5">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                      <Box className="h-4 w-4 text-purple-400" /> 4. Shopify Hydrogen & Oxygen Hosting
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Import the AI agent components (<code className="text-purple-300 font-mono">&lt;GrokAdAdvisor /&gt;</code> and <code className="text-purple-300 font-mono">&lt;PlanGenerator /&gt;</code>) directly into Shopify Hydrogen Remix routes.
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Full server-side rendering natively supported on Shopify Oxygen global edge network.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}
          
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
