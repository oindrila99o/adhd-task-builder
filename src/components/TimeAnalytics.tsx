"use client";

import React from 'react';
import { Task } from '@/types/task';
import { Clock, Timer, CheckCircle2, Calendar } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { format } from 'date-fns';

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
          Activity History
        </h4>
        
        {tasks.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-400 italic">No activity recorded yet.</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="space-y-3">
            {tasks.map(task => {
              const completedSubtasks = task.subtasks.filter(s => s.completed);
              const isDone = task.subtasks.length > 0 && task.subtasks.every(s => s.completed);
              
              return (
                <AccordionItem 
                  key={task.id} 
                  value={task.id} 
                  className="border border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden px-4"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex flex-col items-start text-left gap-1">
                      <span className={`text-sm font-bold ${isDone ? 'text-emerald-600' : 'text-slate-700'}`}>
                        {task.title}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {formatTime(task.timeSpent)}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {completedSubtasks.length} / {task.subtasks.length} steps
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-2 pt-2 border-t border-slate-50">
                      {completedSubtasks.length === 0 ? (
                        <p className="text-xs text-slate-400 italic text-center py-2">No steps completed yet.</p>
                      ) : (
                        completedSubtasks.map(sub => (
                          <div key={sub.id} className="flex items-center justify-between bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold text-slate-700">{sub.title}</span>
                              {sub.completedAt && (
                                <span className="text-[9px] text-slate-400 flex items-center gap-1">
                                  <Calendar size={10} />
                                  {format(new Date(sub.completedAt), 'MMM d, yyyy')}
                                </span>
                              )}
                            </div>
                            <CheckCircle2 size={14} className="text-emerald-500" />
                          </div>
                        ))
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default TimeAnalytics;