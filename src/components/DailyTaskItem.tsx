"use client";

import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DailyTaskItemProps {
  title: string;
  completed: boolean;
  isAiSuggested: boolean;
  onToggle: () => void;
  onDelete?: () => void;
}

const DailyTaskItem = ({ title, completed, isAiSuggested, onToggle, onDelete }: DailyTaskItemProps) => {
  return (
    <div 
      className={cn(
        "flex items-center justify-between p-3 rounded-xl transition-all duration-200 border",
        completed 
          ? "bg-slate-50/50 border-transparent opacity-60" 
          : "bg-white border-slate-100 shadow-sm hover:border-indigo-200"
      )}
    >
      <div className="flex items-center space-x-3">
        <Checkbox 
          checked={completed} 
          onCheckedChange={onToggle}
          className="h-5 w-5 rounded-md border-2"
        />
        <div className="flex flex-col">
          <span className={cn(
            "text-sm font-semibold transition-all",
            completed && "line-through text-slate-400"
          )}>
            {title}
          </span>
          {isAiSuggested && !completed && (
            <span className="text-[10px] font-bold text-indigo-500 flex items-center gap-1 uppercase tracking-wider">
              <Sparkles size={10} /> AI Suggestion
            </span>
          )}
        </div>
      </div>
      
      {!isAiSuggested && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onDelete}
          className="h-8 w-8 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 size={14} />
        </Button>
      )}
    </div>
  );
};

export default DailyTaskItem;