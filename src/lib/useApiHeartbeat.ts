/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { safeResponseJson } from "./safeFetch";

export type ApiHealthStatus = "online" | "decoupled" | "degraded" | "offline";

export interface EndpointHealth {
  endpoint: string;
  ok: boolean;
  status: number;
  latencyMs: number;
  error?: string;
}

export interface ApiHeartbeatState {
  status: ApiHealthStatus;
  latencyMs: number | null;
  lastChecked: Date | null;
  mode: "live_gemini" | "fallback_simulation" | "client_decoupled";
  hasApiKey: boolean;
  consecutiveFailures: number;
  isPinging: boolean;
  endpoints: EndpointHealth[];
  pingNow: () => Promise<void>;
}

export function useApiHeartbeat(intervalMs: number = 12000): ApiHeartbeatState {
  const [status, setStatus] = useState<ApiHealthStatus>("online");
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [mode, setMode] = useState<"live_gemini" | "fallback_simulation" | "client_decoupled">("live_gemini");
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);
  const [consecutiveFailures, setConsecutiveFailures] = useState<number>(0);
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [endpoints, setEndpoints] = useState<EndpointHealth[]>([]);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const pingEndpoints = useCallback(async () => {
    if (isPinging) return;
    setIsPinging(true);

    const startTime = performance.now();
    let isHealthOk = false;
    let measuredLatency = 0;
    let serverMode: "live_gemini" | "fallback_simulation" | "client_decoupled" = "client_decoupled";
    let apiKeyDetected = false;
    const currentEndpoints: EndpointHealth[] = [];

    // 1. Check /api/health (or fallback /health)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const healthStart = performance.now();
      let res = await fetch("/api/health", {
        method: "GET",
        headers: { "Cache-Control": "no-cache", "Accept": "application/json" },
        signal: controller.signal
      });

      let contentType = res.headers.get("content-type");
      let isJson = contentType && contentType.includes("application/json");

      // Attempt fallback if /api/health returned non-JSON / 404
      if ((!res.ok || !isJson) && !controller.signal.aborted) {
        try {
          const altRes = await fetch("/health", {
            method: "GET",
            headers: { "Cache-Control": "no-cache", "Accept": "application/json" },
            signal: controller.signal
          });
          const altType = altRes.headers.get("content-type");
          if (altRes.ok && altType && altType.includes("application/json")) {
            res = altRes;
            isJson = true;
          }
        } catch (_) {
          // Keep primary res response
        }
      }

      clearTimeout(timeoutId);

      const healthLatency = Math.round(performance.now() - healthStart);

      if (res.ok && isJson) {
        const body = await safeResponseJson(res);
        if (body) {
          isHealthOk = true;
          measuredLatency = healthLatency;
          serverMode = body.mode || (body.hasApiKey ? "live_gemini" : "fallback_simulation");
          apiKeyDetected = !!body.hasApiKey;

          currentEndpoints.push({
            endpoint: "/api/health (Gemini AI Brain)",
            ok: true,
            status: res.status,
            latencyMs: healthLatency
          });
        }
      } else {
        currentEndpoints.push({
          endpoint: "/api/health (Gemini AI Brain)",
          ok: false,
          status: res.status,
          latencyMs: healthLatency,
          error: `HTTP ${res.status} (${isJson ? "JSON Error" : "Returned non-JSON HTML/404 Page"})`
        });
      }
    } catch (err: any) {
      const errLatency = Math.round(performance.now() - startTime);
      currentEndpoints.push({
        endpoint: "/api/health (Gemini AI Brain)",
        ok: false,
        status: 0,
        latencyMs: errLatency,
        error: err.name === "AbortError" ? "Connection Timed Out (6s)" : (err.message || "Network Unreachable")
      });
    }

    // 2. Check /api/paypal/state
    try {
      const ppStart = performance.now();
      const ppRes = await fetch("/api/paypal/state", {
        method: "GET",
        headers: { "Cache-Control": "no-cache" }
      });
      const ppLatency = Math.round(performance.now() - ppStart);
      const isPpJson = ppRes.headers.get("content-type")?.includes("application/json");

      if (ppRes.ok && isPpJson) {
        currentEndpoints.push({
          endpoint: "/api/paypal/state (PayPal Gateway)",
          ok: true,
          status: ppRes.status,
          latencyMs: ppLatency
        });
      } else {
        currentEndpoints.push({
          endpoint: "/api/paypal/state (PayPal Gateway)",
          ok: false,
          status: ppRes.status,
          latencyMs: ppLatency,
          error: `HTTP ${ppRes.status}`
        });
      }
    } catch (ppErr: any) {
      currentEndpoints.push({
        endpoint: "/api/paypal/state (PayPal Gateway)",
        ok: false,
        status: 0,
        latencyMs: 0,
        error: ppErr.message || "Offline Fallback"
      });
    }

    if (!isMountedRef.current) return;

    setLastChecked(new Date());
    setEndpoints(currentEndpoints);

    if (isHealthOk) {
      setLatencyMs(measuredLatency);
      setConsecutiveFailures(0);
      setHasApiKey(apiKeyDetected);
      setMode(serverMode);
      if (serverMode === "fallback_simulation") {
        setStatus("degraded");
      } else {
        setStatus("online");
      }
    } else {
      setConsecutiveFailures(prev => prev + 1);
      setLatencyMs(null);
      setMode("client_decoupled");
      // Use 'decoupled' state to indicate client autonomous engine is active without alarming red status
      setStatus("decoupled");
    }

    setIsPinging(false);
  }, [isPinging]);

  useEffect(() => {
    // Initial ping on load
    pingEndpoints();

    // Periodic heartbeat timer
    const timer = setInterval(() => {
      pingEndpoints();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs, pingEndpoints]);

  return {
    status,
    latencyMs,
    lastChecked,
    mode,
    hasApiKey,
    consecutiveFailures,
    isPinging,
    endpoints,
    pingNow: pingEndpoints
  };
}
