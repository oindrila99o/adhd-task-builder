"use client";

import React from 'react';
import { Task } from '@/types/task';
import { Clock, Timer, CheckCircle2 } from 'lucide-react';

interface TimeAnalyticsProps {
  tasks: Task[];
}

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h > 0 ? `${h}h ` : ''}${m}m ${s}s`;
};

const TimeAnalytics = ({ tasks }: TimeAnalyticsProps) => {
  const totalSeconds = tasks.reduce((acc, task) => acc + task.timeSpent, 0);
  const completedTasks = tasks.filter(t => t.subtasks.length > 0 && t.subtasks.every(s => s.completed)).length;

  return (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <Clock size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Total Time</span>
          </div>
          <p className="text-xl font-black text-indigo-900">{formatTime(totalSeconds)}</p>
        </div>
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <CheckCircle2 size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
          </div>
          <p className="text-xl font-black text-emerald-900">{completedTasks} Tasks</p>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-bold text-slate-800 flex items-center gap-2">
          <Timer size={18} className="text-slate-400" />
          Recent Activity
        </h4>
        {tasks.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No tasks recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {tasks.slice(0, 5).map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-sm font-medium text-slate-700 truncate max-w-[150px]">{task.title}</span>
                <span className="text-xs font-mono bg-white px-2 py-1 rounded-md border border-slate-200">
                  {formatTime(task.timeSpent)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeAnalytics;