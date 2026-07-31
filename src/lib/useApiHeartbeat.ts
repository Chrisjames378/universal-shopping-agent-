/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from "react";

export type ApiHealthStatus = "online" | "degraded" | "offline";

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

    // 1. Check /api/health
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const healthStart = performance.now();
      const res = await fetch("/api/health", {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const healthLatency = Math.round(performance.now() - healthStart);

      const contentType = res.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");

      if (res.ok && isJson) {
        const body = await res.json();
        isHealthOk = true;
        measuredLatency = healthLatency;
        serverMode = body.mode || (body.hasApiKey ? "live_gemini" : "fallback_simulation");
        apiKeyDetected = !!body.hasApiKey;

        currentEndpoints.push({
          endpoint: "/api/health",
          ok: true,
          status: res.status,
          latencyMs: healthLatency
        });
      } else {
        currentEndpoints.push({
          endpoint: "/api/health",
          ok: false,
          status: res.status,
          latencyMs: healthLatency,
          error: `HTTP ${res.status} ${res.statusText || "Non-JSON response"}`
        });
      }
    } catch (err: any) {
      const errLatency = Math.round(performance.now() - startTime);
      currentEndpoints.push({
        endpoint: "/api/health",
        ok: false,
        status: 0,
        latencyMs: errLatency,
        error: err.name === "AbortError" ? "Connection Timed Out (6s)" : (err.message || "Network Unreachable")
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
      setStatus("offline");
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
