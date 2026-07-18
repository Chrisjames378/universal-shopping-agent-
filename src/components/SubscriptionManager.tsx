/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  CreditCard, 
  ShieldCheck, 
  RefreshCw, 
  User, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Bell, 
  X, 
  Play, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  Activity
} from "lucide-react";
import { UserAccount, PayPalSubscription, SubscriptionPlan, RenewalNotification } from "../types";

export default function SubscriptionManager() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<PayPalSubscription[]>([]);
  const [notifications, setNotifications] = useState<RenewalNotification[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Interface state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [pendingSubscriptionId, setPendingSubscriptionId] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<"auth" | "confirm" | "done">("auth");
  const [isSimulatingRenewal, setIsSimulatingRenewal] = useState<boolean>(false);

  // Fetch the backend state
  const fetchState = async () => {
    try {
      const response = await fetch("/api/paypal/state");
      if (!response.ok) {
        throw new Error(`Failed to load subscription database: status ${response.status}`);
      }
      const data = await response.json();
      setUsers(data.users || []);
      setCurrentUserId(data.currentUserId || "");
      setPlans(data.plans || []);
      setSubscriptions(data.subscriptions || []);
      setNotifications(data.notifications || []);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching subscription state:", err);
      // Only set error if we've failed multiple times or it's a persistent issue
      // to avoid flashing errors during dev server restarts
      if (err.name !== "TypeError" || !err.message.includes("Failed to fetch")) {
        setError(err.message || "Endpoint error - is your server container alive?");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
    // Poll notifications/subscriptions every 4 seconds to catch background updates seamlessly
    const interval = setInterval(fetchState, 4000);
    return () => clearInterval(interval);
  }, []);

  // Set the current emulated user session
  const handleUserSelect = async (userId: string) => {
    try {
      setLoading(true);
      const res = await fetch("/api/paypal/user/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      if (!res.ok) throw new Error("Could not propagate user change on the backend.");
      await fetchState();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to a target plan
  const handleSubscribeInitiate = async (planId: string) => {
    try {
      setLoading(true);
      const res = await fetch("/api/paypal/subscription/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, billingCycle: "monthly" })
      });
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || "Failed to create subscription agreement.");
      }
      const result = await res.json();
      
      // Update local copy immediately and open the checkout dialog
      setPendingSubscriptionId(result.subscription.id);
      setIsCheckoutOpen(true);
      setCheckoutStep("auth");
      await fetchState();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Approve the pending checkout inside the emulated secure popup frame
  const handleApproveCheckout = async () => {
    if (!pendingSubscriptionId) return;
    try {
      setCheckoutStep("confirm");
      
      // Emulate brief loading delay representing the secure banking verification tunnel handshake
      await new Promise(resolve => setTimeout(resolve, 1500));

      const res = await fetch("/api/paypal/subscription/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId: pendingSubscriptionId })
      });
      if (!res.ok) throw new Error("Handshake failed to capture buyer tokens on server.");
      
      setCheckoutStep("done");
      await fetchState();
      
      // Auto-close success modal after brief delay
      setTimeout(() => {
        setIsCheckoutOpen(false);
        setPendingSubscriptionId(null);
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    }
  };

  // Cancel the active subscription
  const handleCancelSubscription = async (subId: string) => {
    if (!window.confirm("Are you sure you want to stop this PayPal automated recurring billing cycle? Your premium access will terminate.")) {
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/paypal/subscription/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId: subId })
      });
      if (!res.ok) throw new Error("Cancellation route failed.");
      await fetchState();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Simulate automated renewal event or payment failure (Webhook injection)
  const handleSimulateRenewal = async (subId: string, simulateFailure: boolean) => {
    try {
      setIsSimulatingRenewal(true);
      const res = await fetch("/api/paypal/subscription/simulate-renewal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId: subId, simulateFailure })
      });
      if (!res.ok) throw new Error("Simulator renewal trigger crashed.");
      await fetchState();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSimulatingRenewal(false);
    }
  };

  // Switch to selected active user subscription
  const currentUser = users.find(u => u.id === currentUserId);
  const activeSubscription = subscriptions.find(s => s.userId === currentUserId && s.status !== "CANCELLED");

  return (
    <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-6 relative overflow-hidden space-y-8">
      
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#090d16_1px,transparent_1px),linear-gradient(to_bottom,#090d16_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

      {/* Title Header */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full border border-blue-500/25 uppercase font-bold tracking-wider">
              Live PayPal SDK Integration
            </span>
          </div>
          <h3 className="text-xl font-bold font-display text-white tracking-tight flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-400" />
            Active PayPal Subscriptions Engine
          </h3>
          <p className="text-xs text-slate-400">
            A secure gateway mapping recurring billing tiers to authorized developer entities via sandboxed popups and server webhook payloads.
          </p>
        </div>

        {/* User login emulator dropdown */}
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-400 text-xs font-bold">
              <User className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-mono text-slate-500 font-bold leading-none">Emulated Account</span>
              <span className="block text-xs font-semibold text-slate-205">{currentUser?.email || "Guest User"}</span>
            </div>
          </div>
          <select 
            value={currentUserId}
            onChange={(e) => handleUserSelect(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300 font-mono outline-none focus:border-blue-500/50"
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.username} ({u.email.split("@")[0]})</option>
            ))}
          </select>
        </div>
      </div>

      {/* System Errors notification */}
      {error && (
        <div className="bg-rose-950/20 border border-rose-500/20 rounded-lg p-3.5 flex items-start gap-3 animate-fadeIn">
          <AlertTriangle className="h-4.5 w-4.5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="block text-xs font-bold text-rose-200">Database Transaction Warning</span>
            <span className="block text-[11px] font-mono text-rose-405 leading-relaxed mt-0.5">{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-slate-500 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Grid: Plans Listing & Active State */}
      <div className="relative grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Tiers Selection & Actions (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Subscription Summary card */}
          {activeSubscription ? (
            <div className="bg-gradient-to-r from-blue-950/15 to-emerald-950/15 border border-slate-850 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wide font-semibold block">Authorized Agreement</span>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white uppercase font-display tracking-tight">
                      {plans.find(p => p.id === activeSubscription.planId)?.name}
                    </h4>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      activeSubscription.status === "ACTIVE" 
                        ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" 
                        : activeSubscription.status === "APPROVAL_PENDING"
                        ? "bg-yellow-500/10 text-yellow-300 border border-yellow-500/20 animate-pulse"
                        : "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                    }`}>
                      {activeSubscription.status}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-xs text-slate-400 font-bold">${activeSubscription.price} <span className="text-[10px] text-slate-500 font-normal">/ {activeSubscription.billingCycle}</span></span>
                  <span className="block text-[10px] font-mono text-slate-500">ID: {activeSubscription.id}</span>
                </div>
              </div>

              {/* Status details line */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-950/60 p-3.5 rounded-lg border border-slate-900 font-mono text-xs">
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-bold">Created On</span>
                  <span className="block text-slate-300 mt-0.5">{new Date(activeSubscription.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-bold">Next Charge</span>
                  <span className="block text-slate-300 mt-0.5">
                    {activeSubscription.nextPaymentDate 
                      ? new Date(activeSubscription.nextPaymentDate).toLocaleDateString()
                      : "Awaiting approval"}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="block text-[10px] text-slate-500 uppercase font-bold">Renew Status</span>
                  <span className="block text-slate-300 mt-0.5">
                    {activeSubscription.autoRenew ? "✓ Auto-Renew Active" : "✗ Terminating Cycle"}
                  </span>
                </div>
              </div>

              {/* Subscription management tools */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                {activeSubscription.status === "APPROVAL_PENDING" ? (
                  <button
                    onClick={() => {
                      setPendingSubscriptionId(activeSubscription.id);
                      setIsCheckoutOpen(true);
                      setCheckoutStep("auth");
                    }}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg flex items-center gap-1.5"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Complete Authorization Popup
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleCancelSubscription(activeSubscription.id)}
                      className="bg-slate-900 border border-slate-800 hover:border-rose-500/30 hover:bg-rose-950/10 text-slate-350 hover:text-rose-300 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Halt / Cancel Auto-Renew
                    </button>

                    <button
                      disabled={isSimulatingRenewal}
                      onClick={() => handleSimulateRenewal(activeSubscription.id, false)}
                      className="bg-indigo-600/10 border border-indigo-500/20 hover:bg-indigo-600/20 text-indigo-300 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <RefreshCw className={`h-3 w-3 ${isSimulatingRenewal ? "animate-spin" : ""}`} />
                      Simulate Renewal Webhook
                    </button>

                    <button
                      disabled={isSimulatingRenewal}
                      onClick={() => handleSimulateRenewal(activeSubscription.id, true)}
                      className="bg-amber-600/10 border border-amber-500/20 hover:bg-amber-600/20 text-amber-300 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                      Simulate Billing Failure
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/60 border border-slate-850 p-6 rounded-xl text-center space-y-2">
              <Zap className="h-7 w-7 text-indigo-400 mx-auto animate-pulse" />
              <h4 className="font-bold text-sm text-white uppercase font-display tracking-wider">No Active Subscriptions</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                This account is currently running on the standard sandbox profile. Select from the recurring PayPal billing structures below to deploy dedicated stealth cluster resources.
              </p>
            </div>
          )}

          {/* Subscriptions Plans Lists */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase text-slate-400 font-mono tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              Standard Cloud Automation Tiers
            </h4>

            <div className="grid sm:grid-cols-3 gap-4">
              {plans.map(plan => {
                const isActivePlan = activeSubscription?.planId === plan.id;
                return (
                  <div 
                    key={plan.id}
                    className={`bg-slate-950 p-4 rounded-xl border flex flex-col justify-between transition-all ${
                      isActivePlan 
                        ? "border-blue-500 shadow-md shadow-blue-500/5 ring-1 ring-blue-500/10" 
                        : "border-slate-850 hover:border-slate-800"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="space-y-0.5">
                        <span className="block text-[10px] font-mono text-slate-500 uppercase font-bold">{plan.billingCycle} billing</span>
                        <h5 className="font-bold text-sm text-white font-display tracking-tight leading-snug">{plan.name}</h5>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed min-h-[42px]">{plan.description}</p>
                      
                      <hr className="border-slate-900" />

                      <ul className="space-y-1.5">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="text-[10px] font-mono text-slate-350 flex items-start gap-1.5">
                            <span className="text-blue-400 font-bold">•</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-900/80 flex items-center justify-between gap-2">
                      <div>
                        <span className="block text-xs font-extrabold text-white leading-none">${plan.price}</span>
                        <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">USD / mo</span>
                      </div>

                      <button
                        onClick={() => handleSubscribeInitiate(plan.id)}
                        disabled={loading || isActivePlan}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-1 ${
                          isActivePlan 
                            ? "bg-slate-900 text-slate-500 border border-slate-800 cursor-default" 
                            : "bg-blue-600/10 text-blue-300 border border-blue-500/30 hover:bg-blue-600 hover:text-white"
                        }`}
                      >
                        {isActivePlan ? "Deployed" : "Subscribe"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Live Webhook Streams Console (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <h4 className="text-xs font-bold uppercase text-slate-400 font-mono tracking-wider flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              Webhook Web Sockets Console
            </h4>
            
            <button
              onClick={fetchState}
              className="text-slate-550 hover:text-white transition-colors"
              title="Query active network state"
            >
              <RefreshCw className="h-3 w-3" />
            </button>
          </div>

          <p className="text-[10px] text-slate-400 leading-normal">
            PayPal streams notifications directly to our backend socket. Incoming webhooks are logged below in real-time.
          </p>

          <div className="rounded-xl border border-slate-900 bg-slate-950 p-4 font-mono text-[11px] h-[340px] overflow-y-auto space-y-3 scrollbar-thin">
            {notifications.length === 0 ? (
              <div className="text-slate-600 italic text-center pt-24">
                &lt;socket connected - awaiting events&gt;
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="border-b border-slate-900 pb-2.5 last:border-b-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded leading-none ${
                      notif.type === "BILLING_SUCCESS"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-555/20"
                        : notif.type === "BILLING_FAILED"
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        : notif.type === "CANCELLED"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}>
                      {notif.type}
                    </span>
                    <span className="text-[9px] text-slate-500">
                      {new Date(notif.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <p className="text-slate-300 leading-normal text-[10px]" style={{ wordBreak: "break-word" }}>{notif.message}</p>
                  
                  <div className="flex items-center justify-between text-[9px] text-slate-600 pt-0.5">
                    <span>Agreement: {notif.subscriptionId.substring(0, 16)}...</span>
                    {notif.amount > 0 && (
                      <span className="font-bold text-slate-400">${notif.amount} USD</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Interactive PayPal Sandbox Enclave Dialog Modal */}
      {isCheckoutOpen && pendingSubscriptionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#0c101d] border border-blue-500/30 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl space-y-5">
            
            {/* Modal Header */}
            <div className="bg-blue-950/20 border-b border-blue-900/30 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[10px] font-mono text-slate-450 uppercase font-bold tracking-widest leading-none">
                  SECURE PORTAL PIN: ISOLATED_CDP_HANDSHAKE
                </span>
              </div>
              <button 
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setPendingSubscriptionId(null);
                }}
                className="text-slate-450 hover:text-white transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-2 space-y-4">
              <div className="text-center space-y-1">
                <div className="inline-block bg-[#003087] rounded-lg px-4 py-2 text-white font-sans font-black tracking-tight italic text-xl shadow select-none mb-3">
                  PayPal <span className="text-[#0079c1] font-extrabold not-italic text-sm tracking-normal uppercase ml-1">Sandbox</span>
                </div>
                
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                  Confirm recurring billing arrangement
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Authenticate securely below to sign the payment terms for client profile entity: <strong>{currentUser?.email}</strong>
                </p>
              </div>

              {/* Order pricing card */}
              <div className="bg-slate-950 px-4 py-3 rounded-lg border border-slate-900 flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-bold">Billing Cycle Plan</span>
                  <span className="block text-slate-205 font-bold mt-0.5">
                    {plans.find(p => p.id === subscriptions.find(s => s.id === pendingSubscriptionId)?.planId)?.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-slate-505 uppercase font-bold">Sum per month</span>
                  <span className="block text-blue-400 font-bold mt-0.5">
                    ${subscriptions.find(s => s.id === pendingSubscriptionId)?.price}.00 USD
                  </span>
                </div>
              </div>

              {/* Steps status indicator */}
              <div className="border border-slate-900 bg-slate-950/40 p-3.5 rounded-lg">
                {checkoutStep === "auth" ? (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-400 leading-normal text-center">
                      Our <strong>Blind Enclave Vault</strong> forces this verification context outside of standard optical models. The scraper reads no input characters.
                    </p>
                    <button
                      onClick={handleApproveCheckout}
                      className="w-full bg-[#ffc439] hover:bg-[#e2af31] text-slate-900 font-bold py-2 px-4 rounded-lg text-xs tracking-tight transition-all flex items-center justify-center gap-1.5 shadow"
                    >
                      Authorize & Initiate Agreement
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : checkoutStep === "confirm" ? (
                  <div className="py-4 text-center space-y-2.5">
                    <RefreshCw className="h-5 w-5 text-amber-400 mx-auto animate-spin" />
                    <p className="text-[11px] font-mono text-slate-400">Performing publickey TLS handshake verification with PayPal merchant billing accounts...</p>
                  </div>
                ) : (
                  <div className="py-2 text-center space-y-2 animate-scaleIn">
                    <CheckCircle2 className="h-6 w-6 text-emerald-450 mx-auto" />
                    <p className="text-[11px] font-mono text-emerald-400 font-bold">Subscription approved successfully over webhook backplane!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-950 border-t border-slate-900 px-6 py-3.5 text-center">
              <span className="text-[9px] font-mono text-slate-500 leading-none flex items-center justify-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-400 shrink-0" />
                SSL ENCRYPTION: TLS_1.3_CHACHA20_POLY1305_SHA256 SHIELD ACTIVE
              </span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
