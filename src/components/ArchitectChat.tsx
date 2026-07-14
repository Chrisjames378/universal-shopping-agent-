/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, ShieldAlert, Sparkles, AlertTriangle, CornerDownLeft } from "lucide-react";
import { Message } from "../types";

export default function ArchitectChat() {
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [inputVal, setInputVal] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      text: "Developer node online. I am the Chief Systems Architect. Ask me about dynamic DOM perception, Residential Proxy setups, JA3 TLS Fingerprinting, or the Blind Vault micro-enclave mechanism.",
      timestamp: new Date().toLocaleTimeString().split(" ")[0]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chatOpen]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputVal;
    if (!textToSend.trim() || loading) return;

    if (!customText) {
      setInputVal("");
    }

    const userMsgId = "user-" + Date.now();
    const newHistory = [...messages, {
      id: userMsgId,
      role: "user" as const,
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString().split(" ")[0]
    }];

    setMessages(newHistory);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: newHistory.filter(h => h.id !== "init")
        })
      });

      if (!response.ok) {
        let errMsg = `Server returned status ${response.status}.`;
        try {
          const errData = await response.json();
          if (errData.message || errData.error) {
            errMsg = errData.message || (typeof errData.error === "object" ? JSON.stringify(errData.error) : errData.error);
          }
        } catch (_) {
          // Use standard error info
        }

        // Segment error modes cleanly based on HTTP codes
        if (response.status === 401 || response.status === 403) {
          throw new Error(`🔑 **Authentication Failure (Code ${response.status}):**\nYour Gemini API key credentials appear invalid or restricted. Please ensure a valid **GEMINI_API_KEY** is configured securely inside the **Secrets panel** of your Google AI Studio workspace.`);
        } else if (response.status === 429) {
          throw new Error(`⏳ **Resource Limits Reached (Code 429):**\nThe processor was throttled due to rapid requests. Please pause for 15-30 seconds to allow the resource quota to replenish successfully.`);
        } else if (response.status >= 500) {
          throw new Error(`⚙️ **Container Execution Fault (Code ${response.status}):**\nThe custom server runtime encountered a core compilation exception.\n\n*Diagnostics:* \`"${errMsg}"\`\n\nPlease check server logs for uncaught route handlers.`);
        } else {
          throw new Error(`🛡️ **Request Mismatched (Code ${response.status}):**\nThe browser engine validation rejected this prompt structure.\n\n*Details:* \`"${errMsg}"\``);
        }
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.message || (typeof data.error === "object" ? JSON.stringify(data.error) : data.error));
      }

      setMessages(prev => [
        ...prev,
        {
          id: "assistant-" + Date.now(),
          role: "assistant" as const,
          text: data.response,
          timestamp: new Date().toLocaleTimeString().split(" ")[0]
        }
      ]);

    } catch (err: any) {
      console.error("Architect chat failed:", err);
      
      let finalErrMsg = err.message || "Please verify standard server configuration rules.";
      
      // Handle physical browser offline or connection refused types
      if (err instanceof TypeError && err.message?.toLowerCase().includes("fetch")) {
        finalErrMsg = `🌐 **Host Connection Severed:**\nUnable to negotiate a handshake with the backend portal. Please verify your internet connection and make sure your server container is online.`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: "err-" + Date.now(),
          role: "assistant" as const,
          text: `⚠️ **Architect Node: Connection Error**\n\n${finalErrMsg}`,
          timestamp: new Date().toLocaleTimeString().split(" ")[0]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (q: string) => {
    handleSend(q);
  };

  // Basic formatter for Bold text (**text**) and code blocks (```text```) or Bullet lines
  const formatText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, lineIdx) => {
      // Bullet list item
      if (line.trim().startsWith("-") || line.trim().startsWith("*")) {
        const content = line.replace(/^[-*]\s*/, "");
        return (
          <li key={lineIdx} className="ml-4 list-disc text-slate-300 text-xs my-0.5 leading-relaxed">
            {parseInlines(content)}
          </li>
        );
      }
      // Simple paragraph
      return (
        <p key={lineIdx} className="text-xs text-slate-200 leading-relaxed my-1.5 font-sans">
          {parseInlines(line)}
        </p>
      );
    });
  };

  const parseInlines = (str: string) => {
    // Escape or wrap raw inline highlights like `code` or **bold**
    const parts = str.split(/(\*\*.*?\*\*|`.*?`)/);
    return parts.map((part, partIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={partIdx} className="font-extrabold text-white text-xs">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={partIdx} className="bg-slate-950 px-1 py-0.5 rounded text-[10px] font-mono text-indigo-300 border border-slate-900">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Floating Chat Container */}
      {chatOpen && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-80 sm:w-96 h-[480px] mb-4 flex flex-col overflow-hidden glow-indigo animate-scaleUp">
          
          {/* Header */}
          <div className="bg-slate-950 p-4 border-b border-slate-850 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-display font-black text-xs">
                👷
              </div>
              <div>
                <h4 className="font-bold text-white text-xs font-display flex items-center gap-1.5">
                  Chief Systems Architect
                  <span className="inline-flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                </h4>
                <p className="text-[9px] font-mono text-slate-500">Universal Automated Tunnel Spec</p>
              </div>
            </div>

            <button 
              onClick={() => setChatOpen(false)}
              className="text-slate-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Panel */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-950/40 space-y-3.5 scrollbar-thin">
            {messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div 
                  key={m.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"} items-start gap-2.5 max-w-[90%] ${
                    isUser ? "ml-auto" : "mr-auto"
                  }`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/10 flex items-center justify-center text-[10px] select-none shrink-0 mt-1">
                      🤖
                    </div>
                  )}

                  <div className={`rounded-lg p-3 text-xs border ${
                    isUser 
                      ? "bg-indigo-600 text-white rounded-tr-none border-transparent font-medium" 
                      : "bg-slate-900/60 text-slate-300 rounded-tl-none border-slate-800/80"
                  }`}>
                    {isUser ? <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p> : formatText(m.text)}
                    <span className="text-[8px] text-slate-500 block text-right mt-1 font-mono">{m.timestamp}</span>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2.5 max-w-[70%] mr-auto">
                <div className="w-6 h-6 rounded bg-indigo-500/15 border border-indigo-500/10 flex items-center justify-center text-[10px] shrink-0 animate-spin">
                  🔄
                </div>
                <div className="bg-slate-900/40 rounded-lg p-3 text-xs border border-slate-850 text-slate-500 font-mono animate-pulse">
                  architect formulating design reply...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick chips suggested inputs */}
          <div className="px-3 py-1.5 bg-slate-950/80 border-t border-slate-900 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none select-none">
            <button
               onClick={() => handleQuickQuestion("Why visually segment the DOM instead of selectors?")}
               className="text-[9px] font-mono bg-slate-900 text-slate-400 border border-slate-850 px-2 py-1 rounded-md hover:text-white hover:border-slate-700 transition"
            >
              DOM segment logic?
            </button>
            <button
               onClick={() => handleQuickQuestion("How do you bypass Cloudflare & Akamai TLS handshakes?")}
               className="text-[9px] font-mono bg-slate-900 text-slate-400 border border-slate-850 px-2 py-1 rounded-md hover:text-white hover:border-slate-700 transition"
            >
              Anti-Bot bypass?
            </button>
            <button
               onClick={() => handleQuickQuestion("Explain the Blind Vault payment credentials design.")}
               className="text-[9px] font-mono bg-slate-900 text-slate-400 border border-slate-850 px-2 py-1 rounded-md hover:text-white hover:border-slate-700 transition"
            >
              Blind Crypt design?
            </button>
          </div>

          {/* Chat text Input */}
          <div className="p-3 bg-slate-950 border-t border-slate-900">
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/40 px-2 py-1">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                disabled={loading}
                placeholder="Ask technical architecture question..."
                className="flex-1 bg-transparent px-2 py-1 text-slate-100 text-xs focus:outline-none min-w-0"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !inputVal.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-850 text-white rounded p-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Send className="h-3 w-3" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 pt-2 px-1">
              <span>stealth pipeline control active</span>
              <span className="flex items-center gap-0.5">
                Press Enter
                <CornerDownLeft className="h-2 w-2" />
              </span>
            </div>
          </div>

        </div>
      )}

      {/* Floating Toggle Launcher */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-full py-3.5 px-5 shadow-2xl shadow-indigo-600/35 hover:scale-105 active:scale-95 transition-all text-xs flex items-center gap-2 cursor-pointer border border-indigo-500/20"
      >
        <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
        <span>Ask AI Architect</span>
        <span className="font-mono bg-indigo-900/40 px-1.5 py-0.5 rounded text-[8px] uppercase font-bold text-indigo-400 border border-indigo-500/10">v2.5</span>
      </button>

    </div>
  );
}
