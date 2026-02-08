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
        "flex items-center justify-between p-3 rounded-xl transition-all duration-200 border group",
        completed ? "bg-muted/30 border-transparent opacity-60" : "bg-white border-slate-100 hover:border-primary/20 hover:shadow-sm"
      )}
    >
      <div className="flex items-center space-x-3 flex-1">
        <Checkbox 
          checked={completed} 
          onCheckedChange={onToggle}
          className="h-5 w-5 rounded-full"
        />
        <span className={cn(
          "text-sm font-medium transition-all",
          completed && "line-through text-muted-foreground"
        )}>
          {title}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-colors",
          isTimerRunning ? "bg-indigo-100 text-indigo-700 animate-pulse" : "bg-slate-50 text-slate-400"
        )}>
          <Clock size={10} />
          {formatTime(timeSpent)}
        </div>
        
        {!completed && (
          <div className="flex items-center">
            <ManualTimeLog onLogTime={onManualLog} />
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleTimer}
              className={cn(
                "h-8 w-8 rounded-full transition-all",
                isTimerRunning ? "text-indigo-600 bg-indigo-50" : "text-slate-300 hover:text-indigo-600 hover:bg-indigo-50"
              )}
            >
              {isTimerRunning ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubtaskItem;