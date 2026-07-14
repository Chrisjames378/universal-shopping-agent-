/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  glowColor?: "indigo" | "emerald" | "amber";
  helperText?: string;
  onClick?: () => void;
}

export default function MetricCard({
  title,
  value,
  change,
  isPositive,
  icon,
  glowColor = "indigo",
  helperText,
  onClick
}: MetricCardProps) {
  
  const borderColors = {
    indigo: "border-indigo-500/20 hover:border-indigo-500/50 hover:bg-indigo-950/20",
    emerald: "border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-950/20",
    amber: "border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-950/20",
  };

  const bgGlows = {
    indigo: "group-hover:bg-indigo-500/10",
    emerald: "group-hover:bg-emerald-500/10",
    amber: "group-hover:bg-amber-500/10",
  };

  const textColors = {
    indigo: "text-indigo-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
  };

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border bg-slate-900/40 p-5 transition-all duration-300 backdrop-blur-md group ${borderColors[glowColor]} ${
        onClick ? "cursor-pointer transform hover:-translate-y-1" : ""
      }`}
    >
      {/* Background radial highlight */}
      <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-slate-500/5 blur-xl transition-all duration-500 group-hover:scale-150" />
      
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">
            {title}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-white tracking-tight">
              {value}
            </span>
            <span
              className={`text-xs font-semibold ${
                isPositive ? "text-emerald-400" : "text-slate-400"
              }`}
            >
              {change}
            </span>
          </div>
        </div>
        
        <div className={`rounded-lg p-2 bg-slate-950 border border-slate-800 transition-colors duration-300 ${bgGlows[glowColor]} ${textColors[glowColor]}`}>
          {icon}
        </div>
      </div>

      {helperText && (
        <div className="mt-3 border-t border-slate-800/60 pt-2">
          <p className="text-xs font-mono text-slate-500 line-clamp-1">
            {helperText}
          </p>
        </div>
      )}
    </div>
  );
}
