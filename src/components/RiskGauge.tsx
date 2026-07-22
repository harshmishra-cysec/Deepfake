import React from "react";
import { RiskLevel } from "../types";

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, level }) => {
  // Clamp score between 0 and 100
  const normalizedScore = Math.min(100, Math.max(0, score));

  // Gauge parameters for semi-circle
  const radius = 70;
  const strokeWidth = 14;
  const arcLength = Math.PI * radius; // Approx 219.91
  const strokeDashoffset = arcLength * (1 - normalizedScore / 100);

  // Pivot center at (90, 88)
  const cx = 90;
  const cy = 88;
  const needleLength = 52;

  // Calculate needle angle (radians)
  // score 0 => Math.PI (180 deg, pointing left)
  // score 50 => Math.PI / 2 (90 deg, pointing top)
  // score 100 => 0 (0 deg, pointing right)
  const needleAngleRad = Math.PI - (normalizedScore / 100) * Math.PI;
  const needleX = cx + needleLength * Math.cos(needleAngleRad);
  const needleY = cy - needleLength * Math.sin(needleAngleRad);

  // Color mappings
  const getColor = () => {
    if (normalizedScore <= 40) return { main: "#10b981", bg: "#d1fae5", text: "text-emerald-700", label: "Low Risk" };
    if (normalizedScore <= 70) return { main: "#f59e0b", bg: "#fef3c7", text: "text-amber-700", label: "Medium Risk" };
    return { main: "#ef4444", bg: "#ffe4e6", text: "text-rose-700", label: "High Risk" };
  };

  const colors = getColor();

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative w-56 h-32 flex items-center justify-center">
        <svg className="w-56 h-36 overflow-visible" viewBox="0 0 180 110">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 20 88 A 70 70 0 0 1 160 88"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active Score Arc */}
          <path
            d="M 20 88 A 70 70 0 0 1 160 88"
            fill="none"
            stroke={colors.main}
            strokeWidth={strokeWidth}
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />

          {/* Needle Pointer */}
          <line
            x1={cx}
            y1={cy}
            x2={needleX}
            y2={needleY}
            stroke="#0f172a"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />

          {/* Pivot Center Cap */}
          <circle cx={cx} cy={cy} r="6" fill="#0f172a" stroke="#ffffff" strokeWidth="2" />
          <circle cx={needleX} cy={needleY} r="3" fill={colors.main} />

          {/* Scale Labels */}
          <text x="14" y="104" className="text-[10px] font-bold fill-slate-400">0</text>
          <text x="90" y="12" className="text-[10px] font-bold fill-slate-400" textAnchor="middle">50</text>
          <text x="162" y="104" className="text-[10px] font-bold fill-slate-400">100</text>
        </svg>

        {/* Center Score Readout */}
        <div className="absolute bottom-0 flex flex-col items-center text-center">
          <span className="text-3xl font-black tracking-tight text-slate-900 leading-none">
            {normalizedScore}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            Risk Score / 100
          </span>
        </div>
      </div>

      {/* Legend Scale */}
      <div className="w-full max-w-xs mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-3 gap-1 text-center text-[11px] font-medium text-slate-500">
        <div className="flex flex-col items-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mb-0.5"></span>
          <span>0 - 40</span>
          <span className="text-[10px] text-slate-400">Low</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="w-2 h-2 rounded-full bg-amber-500 mb-0.5"></span>
          <span>41 - 70</span>
          <span className="text-[10px] text-slate-400">Medium</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="w-2 h-2 rounded-full bg-rose-500 mb-0.5"></span>
          <span>71 - 100</span>
          <span className="text-[10px] text-slate-400">High</span>
        </div>
      </div>
    </div>
  );
};

