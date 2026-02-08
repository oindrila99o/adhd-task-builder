"use client";

import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Play, Pause, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import ManualTimeLog from './ManualTimeLog';

interface SubtaskItemProps {
  title: string;
  completed: boolean;
  timeSpent: number;
  isTimerRunning?: boolean;
  onToggle: () => void;
  onToggleTimer: (e: React.MouseEvent) => void;
  onManualLog: (seconds: number) => void;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const SubtaskItem = ({ title, completed, timeSpent, isTimerRunning, onToggle, onToggleTimer, onManualLog }: SubtaskItemProps) => {
  return (
    <div 
      className={cn(
        "flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border group",
        completed 
          ? "bg-slate-50/50 border-transparent opacity-60" 
          : "bg-white border-slate-100 hover:border-indigo-200 hover:shadow-sm"
      )}
    >
      <div className="flex items-center space-x-4 flex-1">
        <Checkbox 
          checked={completed} 
          onCheckedChange={onToggle}
          className="h-6 w-6 rounded-lg border-2 border-slate-200 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
        />
        <span className={cn(
          "text-sm font-bold transition-all",
          completed ? "line-through text-slate-400" : "text-slate-700"
        )}>
          {title}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black transition-all",
          isTimerRunning ? "bg-indigo-100 text-indigo-700 animate-pulse" : "bg-slate-50 text-slate-400"
        )}>
          <Clock size={12} />
          {formatTime(timeSpent)}
        </div>
        
        {!completed && (
          <div className="flex items-center gap-1">
            <ManualTimeLog onLogTime={onManualLog} />
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleTimer}
              className={cn(
                "h-9 w-9 rounded-full transition-all",
                isTimerRunning 
                  ? "text-indigo-600 bg-indigo-50" 
                  : "text-slate-300 hover:text-indigo-600 hover:bg-indigo-50"
              )}
            >
              {isTimerRunning ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubtaskItem;