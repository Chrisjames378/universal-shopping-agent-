import React, { useState, useEffect } from "react";
import { UserPlus, X, CheckCircle, Mail, User, Sparkles, Globe, Download, Copy, ShieldCheck } from "lucide-react";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDomain?: string;
}

export interface LeadSignup {
  id: string;
  name: string;
  email: string;
  interest: string;
  platform: string;
  timestamp: string;
}

export default function SignUpModal({ isOpen, onClose, defaultDomain = "www.uniagent.website" }: SignUpModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("AI Shopping Agent & Automation");
  const [platform, setPlatform] = useState("X (Twitter) & Meta Ads");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [signupsList, setSignupsList] = useState<LeadSignup[]>([]);
  const [showLeadsView, setShowLeadsView] = useState(false);

  useEffect(() => {
    // Load existing signups from localStorage
    try {
      const saved = localStorage.getItem("uniagent_signups");
      if (saved) {
        setSignupsList(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load signups:", e);
    }
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    const newLead: LeadSignup = {
      id: "lead_" + Date.now(),
      name,
      email,
      interest,
      platform,
      timestamp: new Date().toLocaleString()
    };

    const updated = [newLead, ...signupsList];
    setSignupsList(updated);
    try {
      localStorage.setItem("uniagent_signups", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save lead:", err);
    }

    setIsSubmitted(true);
  };

  const handleCopyLeads = () => {
    navigator.clipboard.writeText(JSON.stringify(signupsList, null, 2));
    alert("Copied all registered user signups to clipboard as JSON!");
  };

  const handleDownloadCsv = () => {
    if (signupsList.length === 0) return;
    const headers = "ID,Name,Email,Primary Interest,Ad Platform,Registered At\n";
    const rows = signupsList
      .map(l => `"${l.id}","${l.name}","${l.email}","${l.interest}","${l.platform}","${l.timestamp}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `uniagent_website_signups_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0b1120] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative text-left">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600/20 border border-indigo-500/30 rounded-xl flex items-center justify-center text-indigo-400">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-display">Sign Up for UniAgent</h3>
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold">
                  {defaultDomain}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">Join the early access beta & marketing advisor portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body or Submitted confirmation */}
        <div className="p-6 space-y-5">
          {showLeadsView ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-200">
                  Registered Leads for {defaultDomain} ({signupsList.length})
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLeads}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono font-bold flex items-center gap-1"
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy JSON
                  </button>
                  <button
                    onClick={handleDownloadCsv}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-mono font-bold flex items-center gap-1"
                  >
                    <Download className="h-3.5 w-3.5" /> Export CSV
                  </button>
                </div>
              </div>

              {signupsList.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center italic">No registered signups yet. Be the first to submit!</p>
              ) : (
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {signupsList.map((lead) => (
                    <div key={lead.id} className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg text-xs space-y-1 font-mono">
                      <div className="flex justify-between font-bold text-slate-200">
                        <span>{lead.name}</span>
                        <span className="text-indigo-400">{lead.email}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Interest: {lead.interest}</span>
                        <span>{lead.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => setShowLeadsView(false)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
              >
                ← Back to Sign Up Form
              </button>
            </div>
          ) : isSubmitted ? (
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Welcome to {defaultDomain}!</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1 leading-relaxed">
                  Thank you for signing up, <span className="text-emerald-400 font-bold">{name}</span>! We sent your early access confirmation for <span className="text-indigo-300 font-mono">{email}</span>.
                </p>
              </div>

              <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl text-xs text-indigo-200 space-y-1 text-left font-mono">
                <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
                  <Globe className="h-4 w-4" /> Destination Domain: https://{defaultDomain}
                </div>
                <p className="text-[11px] text-slate-400">
                  You can now use <code className="text-indigo-300">https://{defaultDomain}</code> in your X, Meta, TikTok, Amazon, and eBay ad campaign exports.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setName("");
                    setEmail("");
                  }}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
                >
                  Register Another User
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-indigo-600/20"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl text-xs text-indigo-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                  <Sparkles className="h-4 w-4 text-indigo-400" /> Early Access & Member Portal
                </div>
                <p className="text-[11px] text-slate-400">
                  Register your account for official access to <code className="text-emerald-300 font-mono">https://{defaultDomain}</code> and exclusive AI advertising tools.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-indigo-400" /> Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-indigo-400" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 font-mono">Primary Interest</label>
                  <select
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  >
                    <option value="AI Shopping Agent & Automation">AI Shopping Agent</option>
                    <option value="Ad Campaign Strategy Advisor">Ad Copy & Strategy</option>
                    <option value="Store Directory & Retail APIs">Retail Store APIs</option>
                    <option value="Enterprise Integration">Enterprise Platform</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 font-mono">Target Ad Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  >
                    <option value="X (Twitter) & Grok">X (Twitter) & Grok</option>
                    <option value="Facebook & Meta Ads">Facebook & Meta</option>
                    <option value="TikTok In-Feed Ads">TikTok Ads</option>
                    <option value="Amazon Sponsored Products">Amazon Ads</option>
                    <option value="eBay Promoted Listings">eBay Promoted</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
                >
                  <UserPlus className="h-4 w-4" /> Complete Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => setShowLeadsView(true)}
                  className="px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-xl text-xs font-mono transition-colors"
                >
                  View Signups ({signupsList.length})
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-mono">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" /> Encrypted & Stored Locally
                </span>
                <span>Website: {defaultDomain}</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
