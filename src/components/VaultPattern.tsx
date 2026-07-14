/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { Lock, Unlock, EyeOff, ShieldCheck, HelpCircle, HardDrive, KeyRound, ExternalLink, CreditCard } from "lucide-react";

export default function VaultPattern() {
  const [vaultActive, setVaultActive] = useState<boolean>(false);
  const [injectState, setInjectState] = useState<"empty" | "injecting" | "filled">("empty");
  const [paypalSubscribed, setPaypalSubscribed] = useState<boolean>(false);

  const handleToggle = (checked: boolean) => {
    setVaultActive(checked);
    if (checked) {
      setInjectState("injecting");
      setTimeout(() => {
        setInjectState("filled");
        setPaypalSubscribed(true);
      }, 1200);
    } else {
      setInjectState("empty");
      setPaypalSubscribed(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-850 bg-slate-900/40 backdrop-blur-md p-6 glow-emerald space-y-6">
      
      {/* Header info */}
      <div className="border-b border-slate-800/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              Vault & Security
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
              <KeyRound className="h-3.5 w-3.5 text-emerald-400" />
              <span>Domain Isolation Protocol</span>
            </div>
          </div>
          <h3 className="text-xl font-bold font-display text-white">
            The Safe PayPal Blind Sandbox Design
          </h3>
          <p className="text-xs text-slate-400">
            Protecting sensitive federated billing logins from model prompt-routing exposure leaks.
          </p>
        </div>

        {/* Dynamic Enclave status badge */}
        <div className={`rounded-full px-3 py-1 border text-[10px] font-mono uppercase tracking-widest font-bold flex items-center gap-1.5 transition-all ${
          vaultActive 
            ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" 
            : "bg-slate-950 border-slate-800 text-slate-500"
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${vaultActive ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`} />
          {vaultActive ? "Vault Tunnel: Isolated" : "Vault Tunnel: Inactive"}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        
        {/* Paradigm Concept Explanation Block */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-3.5">
            <p className="text-xs text-slate-300 leading-relaxed">
              Federated OAuth portals (like PayPal checkout redirections) are highly targeted by clickjacking attacks. Standard bots can easily leak subscription login cookies or trigger mock page models. 
              Our <strong>PayPal Blind Vault</strong> pattern routes popups to a secondary sandboxed frame. The agent decides where to place the subscription trigger, while actual authentication is verified over an encrypted backplane link.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="rounded-xl border border-slate-850 bg-slate-950/60 p-3.5 space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-500/20">A</span>
                  <span className="text-xs font-bold text-white">Browser Agent</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Has high cognitive vision. Explores DOM layouts and identifies targeted elements, but has zero read/write credentials access.
                </p>
              </div>

              <div className="rounded-xl border border-slate-850 bg-slate-950/60 p-3.5 space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/20">B</span>
                  <span className="text-xs font-bold text-white">Stealth Crypt Vault</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Locked hardware enclave. Blind to the screen viewport. Programmatically pushes tokens via atomic local system tunnels directly.
                </p>
              </div>
            </div>
          </div>

          {/* Toggle Controller Card */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">
                  PayPal Sandbox Enclave
                </span>
                <span className="text-[10px] font-mono text-slate-500 tracking-wide">
                  Isolate subscription tokens during federated login
                </span>
              </div>

              {/* Toggle switch template */}
              <button
                onClick={() => handleToggle(!vaultActive)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  vaultActive ? "bg-emerald-600" : "bg-slate-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    vaultActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="border-t border-slate-900 pt-2 flex items-center gap-2">
              {vaultActive ? (
                <>
                  <Lock className="h-4 w-4 text-emerald-400" />
                  <p className="text-xs font-mono text-emerald-300">
                    Blind security socket is open and actively isolating context.
                  </p>
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4 text-amber-500" />
                  <p className="text-xs font-mono text-slate-500">
                    Vault off. Standard browser processes have un-shielded access.
                  </p>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Simulated Browser Checkout Viewport */}
        <div className="bg-slate-950 rounded-xl p-5 border border-slate-850 flex flex-col justify-between relative overflow-hidden min-h-[300px]">
          
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-b border-slate-900 pb-2 mb-4">
            <span>
              REDIRECT_GATEWAY: PAYPAL_SUBSCRIPTIONS_V1
            </span>
            <span className={vaultActive ? "text-emerald-400 font-bold" : "text-slate-600"}>
              {vaultActive ? "🛡️ PORTAL_ENCRYPTED_CDP" : "⚠️ VISION_EXPOSED"}
            </span>
          </div>

          {/* PayPal Subscription Form Display */}
          <div className="space-y-4 flex-1 flex flex-col justify-center items-center">
            <div className="bg-[#ffc439] rounded-lg p-3 text-center text-slate-900 font-semibold text-xs tracking-tight max-w-xs flex items-center gap-2 justify-center shadow-lg w-full border border-yellow-500">
              <span className="font-sans font-black italic text-blue-800 text-sm">PayPal</span>
              <span>Subscribe with 1-Click</span>
            </div>
            <p className="text-[10px] text-slate-400 text-center max-w-xs leading-relaxed">
              Requires short-lived federated vault cookie. The vision model sees only the golden bounds but never scans the underlying PayPal password keys.
            </p>

            {paypalSubscribed && (
              <div className="w-full bg-emerald-950/20 border border-emerald-550/20 p-2.5 rounded-lg text-center animate-fadeIn">
                <p className="text-xs font-mono text-emerald-400 font-bold">✓ Subscription Hook Verified</p>
                <p className="text-[10px] font-mono text-slate-400 mt-1">ID: sub_prod_paypal_88127391</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-900">
            <p className="text-[10px] font-mono text-slate-405 leading-loose">
              SECURE ENVELOPE: <span className="text-slate-400">TLS_DHE_RSA_WITH_AES_256_GCM_SHA384</span>
            </p>
          </div>

          {/* Blind Secure shield Overlay */}
          {vaultActive && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 animate-fadeIn transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 shadow-lg shadow-emerald-500/10">
                <ShieldCheck className="h-7 w-7 text-emerald-400 animate-bounce" />
              </div>

              <h4 className="font-bold text-white font-display text-sm uppercase tracking-wider">
                PayPal Auth Segment Locked
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 px-6 leading-relaxed bg-[#0b0f19]/40 py-2 rounded-lg">
                We loaded your PayPal subscription flow inside a temporary secondary profile sandbox, executing federated consent entirely blind. No user cookie leaks possible.
              </p>
              
              <div className="mt-4 rounded bg-slate-900 border border-slate-800 p-2 font-mono text-[10px] text-emerald-300 max-w-xs truncate">
                Exchange Token: authorized_sub_hash_ok
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
