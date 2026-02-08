"use client";

import React from 'react';
import { Task } from '@/types/task';
import { Clock, Timer, CheckCircle2, ArrowRight } from 'lucide-react';

interface TimeAnalyticsProps {
  tasks: Task[];
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

const TimeAnalytics = ({ tasks }: TimeAnalyticsProps) => {
  const totalSeconds = tasks.reduce((acc, task) => acc + task.timeSpent, 0);
  const completedTasks = tasks.filter(t => t.subtasks.length > 0 && t.subtasks.every(s => s.completed)).length;

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
          <p className="text-2xl font-black text-emerald-900">{completedTasks} Tasks</p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-black text-slate-800 flex items-center gap-2 text-lg">
          <Timer size={20} className="text-indigo-500" />
          Detailed Time Log
        </h4>
        {tasks.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-400 italic">No activity recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => {
              const isDone = task.subtasks.length > 0 && task.subtasks.every(s => s.completed);
              return (
                <div key={task.id} className="flex flex-col p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-bold truncate max-w-[200px] ${isDone ? 'text-emerald-600' : 'text-slate-700'}`}>
                      {task.title}
                    </span>
                    {isDone && <CheckCircle2 size={14} className="text-emerald-500" />}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <Clock size={12} />
                      Time Taken
                    </div>
                    <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      {formatTime(task.timeSpent)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeAnalytics;