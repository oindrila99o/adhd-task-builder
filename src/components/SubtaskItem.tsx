"use client";

import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface SubtaskItemProps {
  title: string;
  completed: boolean;
  onToggle: () => void;
}

const SubtaskItem = ({ title, completed, onToggle }: SubtaskItemProps) => {
  return (
    <div 
      className={cn(
        "flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 border border-transparent",
        completed ? "bg-muted/50 opacity-60" : "bg-white hover:border-primary/20 hover:shadow-sm"
      )}
    >
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
  );
};

export default SubtaskItem;