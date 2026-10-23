'use client';

import React, { useState } from 'react';
import { formatPrice } from '@/lib/utils';

interface AreaChartProps {
  data: { date: string; revenue: number; orders: number }[];
}

export function LuxuryAreaChart({ data = [] }: AreaChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-white/40">
        No transaction telemetry available
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue), 100);
  const width = 650;
  const height = 220;
  const padding = 40;

  const points = data.map((d, index) => {
    const x = padding + (index / Math.max(data.length - 1, 1)) * (width - 2 * padding);
    const y = height - padding - (d.revenue / maxRevenue) * (height - 2 * padding);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, idx) => {
    if (idx === 0) return `M ${p.x} ${p.y}`;
    const prev = points[idx - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="relative w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-64 overflow-visible">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#641C32" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#641C32" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#B83B5E" />
            <stop offset="50%" stopColor="#E8CFA8" />
            <stop offset="100%" stopColor="#E8CFA8" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = height - padding - ratio * (height - 2 * padding);
          return (
            <g key={ratio}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="rgba(232, 207, 168, 0.12)"
                strokeDasharray="4 4"
              />
              <text
                x={padding - 8}
                y={y + 3}
                fill="#8E889B"
                fontSize="9"
                textAnchor="end"
                fontFamily="monospace"
              >
                ${Math.round(ratio * maxRevenue)}
              </text>
            </g>
          );
        })}

        {/* Area and Line Paths */}
        <path d={areaD} fill="url(#areaGradient)" />
        <path d={pathD} fill="none" stroke="url(#lineGradient)" strokeWidth="2.5" />

        {/* Data points & Interactive Hover Rings */}
        {points.map((p, idx) => (
          <g
            key={idx}
            className="cursor-pointer transition-all"
            onMouseEnter={() => setHoverIndex(idx)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <circle
              cx={p.x}
              cy={p.y}
              r={hoverIndex === idx ? 6 : 3.5}
              fill="#E8CFA8"
              stroke="#641C32"
              strokeWidth="2"
            />
            {/* X Axis Labels */}
            {(idx === 0 || idx === Math.floor(points.length / 2) || idx === points.length - 1) && (
              <text
                x={p.x}
                y={height - 12}
                fill="#8E889B"
                fontSize="10"
                textAnchor="middle"
              >
                {p.date}
              </text>
            )}
          </g>
        ))}
      </svg>

      {/* Floating Tooltip Box */}
      {hoverIndex !== null && points[hoverIndex] && (
        <div
          className="absolute z-20 pointer-events-none p-3 rounded-2xl bg-[#1B1720] border border-[#E8CFA8] shadow-2xl text-xs space-y-1"
          style={{
            left: `${(points[hoverIndex].x / width) * 100}%`,
            top: '20px',
            transform: 'translateX(-50%)',
          }}
        >
          <p className="font-bold text-[#E8CFA8]">{points[hoverIndex].date}</p>
          <p className="text-white font-serif font-bold text-sm">
            Revenue: {formatPrice(points[hoverIndex].revenue)}
          </p>
          <p className="text-[11px] text-white/60">Orders: {points[hoverIndex].orders}</p>
        </div>
      )}
    </div>
  );
}

interface DonutChartProps {
  data: { name: string; value: number }[];
}

export function LuxuryDonutChart({ data = [] }: DonutChartProps) {
  const COLORS = ['#641C32', '#B83B5E', '#E8CFA8', '#D4AF37', '#8E889B', '#4A2E18'];
  const total = data.reduce((acc, d) => acc + d.value, 0) || 1;

  let accumulatedAngle = 0;

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-44 h-44">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
          {data.map((item, idx) => {
            const percentage = item.value / total;
            const strokeDasharray = `${percentage * 251.2} 251.2`;
            const strokeDashoffset = -accumulatedAngle * 251.2;
            accumulatedAngle += percentage;

            return (
              <circle
                key={item.name}
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke={COLORS[idx % COLORS.length]}
                strokeWidth="16"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-700 hover:opacity-80"
              />
            );
          })}
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[9px] uppercase tracking-wider text-white/50">Total</span>
          <span className="font-serif text-sm font-bold text-[#E8CFA8]">
            ${total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

interface BarChartProps {
  data: { date: string; revenue: number; orders: number }[];
}

export function LuxuryBarChart({ data = [] }: BarChartProps) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 100);

  return (
    <div className="h-64 flex items-end gap-3 pt-6 pb-2 px-2 overflow-x-auto">
      {data.map((d, idx) => {
        const heightPercent = Math.max(8, (d.revenue / maxRevenue) * 100);
        return (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2 group min-w-[32px]">
            <div className="relative w-full flex items-end justify-center h-48 bg-white/5 rounded-t-xl overflow-hidden">
              <div
                className="w-full bg-[#641C32] group-hover:bg-[#B83B5E] transition-all rounded-t-xl"
                style={{ height: `${heightPercent}%` }}
              />
              <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1B1720] text-[#E8CFA8] text-[10px] font-bold px-2 py-0.5 rounded border border-[#E8CFA8]/40 whitespace-nowrap pointer-events-none">
                ${d.revenue}
              </div>
            </div>
            <span className="text-[10px] text-white/50 truncate max-w-[36px]">{d.date}</span>
          </div>
        );
      })}
    </div>
  );
}
