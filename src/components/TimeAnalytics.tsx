"use client";

import React, { useState } from 'react';
import { Task, EnergyLevel } from '@/types/task';
import { Clock, Timer, CheckCircle2, BookmarkCheck, Trash2, Search, Zap, BatteryMedium, BatteryLow, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TimeAnalyticsProps {
  tasks: Task[];
  onDeleteTask: (taskId: string) => void;
}

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  
  const parts = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0 || h > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  
  return parts.join(' ');
};

const TimeAnalytics = ({ tasks, onDeleteTask }: TimeAnalyticsProps) => {
  const [search, setSearch] = useState('');
  const [selectedTaskTitle, setSelectedTaskTitle] = useState<string | null>(null);

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalSeconds = tasks.reduce((acc, task) => acc + task.timeSpent, 0);
  const completedTasksCount = tasks.filter(t => t.subtasks.length > 0 && t.subtasks.every(s => s.completed)).length;

  // Calculate averages for a specific task title across different energy levels
  const getAveragesForTitle = (title: string) => {
    const relevantTasks = tasks.filter(t => t.title.toLowerCase() === title.toLowerCase() && t.isRemembered);
    
    const stats: Record<EnergyLevel, { total: number; count: number }> = {
      high: { total: 0, count: 0 },
      mid: { total: 0, count: 0 },
      low: { total: 0, count: 0 }
    };

    relevantTasks.forEach(t => {
      if (t.energyLevel) {
        stats[t.energyLevel].total += t.timeSpent;
        stats[t.energyLevel].count += 1;
      }
    });

    return stats;
  };

  return (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 bg-indigo-50 rounded-3xl border border-indigo-100 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <Clock size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Total Focus</span>
          </div>
          <p className="text-2xl font-black text-indigo-900">{formatTime(totalSeconds)}</p>
        </div>
        <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-100 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <CheckCircle2 size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Finished</span>
          </div>
          <p className="text-2xl font-black text-emerald-900">{completedTasksCount} Tasks</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h4 className="font-black text-slate-800 flex items-center gap-2 text-lg shrink-0">
            <Timer size={20} className="text-indigo-500" />
            Time Log
          </h4>
          <div className="relative flex-1 max-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <Input 
              placeholder="Search tasks..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 rounded-xl text-xs border-slate-200"
            />
          </div>
        </div>
        
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-400 italic">No matching logs.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map(task => {
              const isDone = task.subtasks.length > 0 && task.subtasks.every(s => s.completed);
              const isSelected = selectedTaskTitle === task.title;
              const averages = isSelected ? getAveragesForTitle(task.title) : null;
              
              return (
                <div key={task.id} className="space-y-2">
                  <div 
                    className={cn(
                      "flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-white shadow-sm group cursor-pointer transition-all",
                      isSelected && "ring-2 ring-indigo-500/20 border-indigo-100"
                    )}
                    onClick={() => setSelectedTaskTitle(isSelected ? null : task.title)}
                  >
                    <div className="flex flex-col items-start text-left gap-1 min-w-0 flex-1">
                      <span className={`text-sm font-bold truncate w-full ${isDone ? 'text-emerald-600' : 'text-slate-700'}`}>
                        {task.title}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {formatTime(task.timeSpent)}
                        </span>
                        {task.isRemembered && (
                          <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                            <BookmarkCheck size={10} /> 
                            {task.energyLevel} energy
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTask(task.id);
                        }}
                        className="w-8 h-8 rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </Button>
                      <ChevronRight size={16} className={cn("text-slate-300 transition-transform", isSelected && "rotate-90")} />
                    </div>
                  </div>

                  {isSelected && averages && (
                    <div className="grid grid-cols-3 gap-2 px-2 animate-in slide-in-from-top-2 duration-200">
                      {(['high', 'mid', 'low'] as EnergyLevel[]).map(level => {
                        const stats = averages[level];
                        const avg = stats.count > 0 ? Math.round(stats.total / stats.count) : 0;
                        const Icon = level === 'high' ? Zap : level === 'mid' ? BatteryMedium : BatteryLow;
                        const color = level === 'high' ? 'text-amber-600' : level === 'mid' ? 'text-blue-600' : 'text-slate-600';
                        const bg = level === 'high' ? 'bg-amber-50' : level === 'mid' ? 'bg-blue-50' : 'bg-slate-50';

                        return (
                          <div key={level} className={cn("p-2 rounded-xl border border-slate-100 flex flex-col items-center gap-1", bg)}>
                            <Icon size={12} className={color} />
                            <span className="text-[8px] font-black uppercase text-slate-400">{level} Avg</span>
                            <span className="text-[10px] font-bold text-slate-700">{avg > 0 ? formatTime(avg) : '--'}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <p className="text-[10px] text-slate-400 text-center italic">
        Click a task to see your average completion times across different energy levels.
      </p>
    </div>
  );
};

export default TimeAnalytics;