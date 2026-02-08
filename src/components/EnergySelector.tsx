"use client";

import React from 'react';
import { EnergyLevel } from '@/types/task';
import { Zap, BatteryMedium, BatteryLow } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnergySelectorProps {
  currentLevel: EnergyLevel;
  onSelect: (level: EnergyLevel) => void;
}

const EnergySelector = ({ currentLevel, onSelect }: EnergySelectorProps) => {
  const levels: { id: EnergyLevel; label: string; icon: any; color: string; bg: string }[] = [
    { id: 'high', label: 'High', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'mid', label: 'Mid', icon: BatteryMedium, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'low', label: 'Low', icon: BatteryLow, color: 'text-slate-600', bg: 'bg-slate-50' },
  ];

  return (
    <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
      <span className="text-xs font-black uppercase tracking-widest text-slate-400">Current Energy</span>
      <div className="flex gap-2">
        {levels.map((level) => {
          const Icon = level.icon;
          const isActive = currentLevel === level.id;
          
          return (
            <button
              key={level.id}
              onClick={() => onSelect(level.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-3 rounded-2xl transition-all duration-300 border-2",
                isActive 
                  ? cn(level.bg, "border-indigo-500 scale-105 shadow-md") 
                  : "border-transparent hover:bg-slate-50"
              )}
            >
              <Icon size={20} className={isActive ? level.color : "text-slate-400"} />
              <span className={cn(
                "text-[10px] font-black uppercase",
                isActive ? "text-slate-900" : "text-slate-400"
              )}>
                {level.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EnergySelector;