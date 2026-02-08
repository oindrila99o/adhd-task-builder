"use client";

import React from 'react';
import { Task } from '@/types/task';
import { Clock, Timer, CheckCircle2, BookmarkCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const totalSeconds = tasks.reduce((acc, task) => acc + task.timeSpent, 0);
  const completedTasksCount = tasks.filter(t => t.subtasks.length > 0 && t.subtasks.every(s => s.completed)).length;

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
        <h4 className="font-black text-slate-800 flex items-center gap-2 text-lg">
          <Timer size={20} className="text-indigo-500" />
          Time Log
        </h4>
        
        {tasks.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-400 italic">No active logs.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => {
              const isDone = task.subtasks.length > 0 && task.subtasks.every(s => s.completed);
              
              return (
                <div 
                  key={task.id} 
                  className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-white shadow-sm group"
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
                          <BookmarkCheck size={10} /> Remembered
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDeleteTask(task.id)}
                    className="w-8 h-8 rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <p className="text-[10px] text-slate-400 text-center italic">
        Note: Tasks completed without being "remembered" will be automatically cleared.
      </p>
    </div>
  );
};

export default TimeAnalytics;