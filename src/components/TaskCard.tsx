"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Task } from '@/types/task';
import SubtaskItem from './SubtaskItem';
import ManualTimeLog from './ManualTimeLog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  Split, 
  Play, 
  Pause, 
  Clock, 
  Bookmark, 
  BookmarkCheck,
  Target,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onBreakdown: (taskId: string) => Promise<void>;
  onUpdateTime: (taskId: string, seconds: number, isRunning: boolean) => void;
  onUpdateSubtaskTime: (taskId: string, subtaskId: string, seconds: number, isRunning: boolean) => void;
  onRemember: (taskId: string) => void;
}

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const TaskCard = ({ task, onToggleSubtask, onDeleteTask, onBreakdown, onUpdateTime, onUpdateSubtaskTime, onRemember }: TaskCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBreakingDown, setIsBreakingDown] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const completedCount = task.subtasks.filter(s => s.completed).length;
  const totalCount = task.subtasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  useEffect(() => {
    const activeSubtask = task.subtasks.find(s => s.isTimerRunning);
    
    if (task.isTimerRunning || activeSubtask) {
      timerRef.current = setInterval(() => {
        if (activeSubtask) {
          onUpdateSubtaskTime(task.id, activeSubtask.id, activeSubtask.timeSpent + 1, true);
          onUpdateTime(task.id, task.timeSpent + 1, true);
        } else if (task.isTimerRunning) {
          onUpdateTime(task.id, task.timeSpent + 1, true);
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [task.isTimerRunning, task.timeSpent, task.subtasks, task.id, onUpdateTime, onUpdateSubtaskTime]);

  const handleBreakdownClick = async () => {
    setIsBreakingDown(true);
    await onBreakdown(task.id);
    setIsBreakingDown(false);
    setIsExpanded(true);
  };

  const toggleMainTimer = () => {
    if (!task.isTimerRunning) {
      task.subtasks.forEach(s => {
        if (s.isTimerRunning) onUpdateSubtaskTime(task.id, s.id, s.timeSpent, false);
      });
    }
    onUpdateTime(task.id, task.timeSpent, !task.isTimerRunning);
  };

  const toggleSubtaskTimer = (subtaskId: string) => {
    const subtask = task.subtasks.find(s => s.id === subtaskId);
    if (!subtask) return;

    const newIsRunning = !subtask.isTimerRunning;

    if (newIsRunning) {
      if (task.isTimerRunning) onUpdateTime(task.id, task.timeSpent, false);
      task.subtasks.forEach(s => {
        if (s.id !== subtaskId && s.isTimerRunning) {
          onUpdateSubtaskTime(task.id, s.id, s.timeSpent, false);
        }
      });
    }

    onUpdateSubtaskTime(task.id, subtaskId, subtask.timeSpent, newIsRunning);
  };

  const handleManualLog = (seconds: number) => {
    onUpdateTime(task.id, task.timeSpent + seconds, task.isTimerRunning || false);
  };

  const handleSubtaskManualLog = (subtaskId: string, seconds: number) => {
    const subtask = task.subtasks.find(s => s.id === subtaskId);
    if (!subtask) return;
    onUpdateSubtaskTime(task.id, subtaskId, subtask.timeSpent + seconds, subtask.isTimerRunning || false);
    onUpdateTime(task.id, task.timeSpent + seconds, task.isTimerRunning || false);
  };

  return (
    <div className={cn(
      "group relative bg-white rounded-[2.5rem] p-6 transition-all duration-500 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] hover:-translate-y-1",
      task.isTimerRunning && "ring-2 ring-indigo-500/20 bg-indigo-50/30"
    )}>
      {/* Header Section */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex gap-4 flex-1">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-300",
            task.isTimerRunning ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-slate-50 text-slate-400"
          )}>
            {totalCount > 0 ? <Layers size={24} /> : <Target size={24} />}
          </div>
          
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-black text-slate-800 truncate leading-tight">
                {task.title}
              </h3>
              {task.isRemembered && (
                <div className="bg-amber-100 text-amber-700 p-1 rounded-full" title="Time Remembered">
                  <BookmarkCheck size={14} />
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-tight transition-all",
                task.isTimerRunning ? "bg-indigo-100 text-indigo-700 animate-pulse" : "bg-slate-100 text-slate-500"
              )}>
                <Clock size={14} />
                {formatTime(task.timeSpent)}
              </div>
              {totalCount > 0 && (
                <span className="text-xs font-bold text-slate-400">
                  {completedCount}/{totalCount} steps
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {!task.isRemembered && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onRemember(task.id)}
              className="w-10 h-10 rounded-full text-slate-400 hover:text-amber-600 hover:bg-amber-50"
            >
              <Bookmark size={20} />
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMainTimer}
            className={cn(
              "w-10 h-10 rounded-full transition-all",
              task.isTimerRunning ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md" : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
            )}
          >
            {task.isTimerRunning ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </Button>
          
          <ManualTimeLog onLogTime={handleManualLog} />
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDeleteTask(task.id)}
            className="w-10 h-10 rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50"
          >
            <Trash2 size={20} />
          </Button>
        </div>
      </div>

      {/* Progress & Actions */}
      <div className="space-y-4">
        {totalCount > 0 ? (
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
              <span className="text-xs font-black text-indigo-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2.5 bg-slate-100" />
          </div>
        ) : (
          <Button 
            onClick={handleBreakdownClick}
            disabled={isBreakingDown}
            className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold gap-2 shadow-lg shadow-slate-200 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            {isBreakingDown ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Split size={20} />
                <span>Break Down Task</span>
              </>
            )}
          </Button>
        )}

        {totalCount > 0 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            {isExpanded ? (
              <>Hide Steps <ChevronUp size={14} /></>
            ) : (
              <>Show {totalCount} Steps <ChevronDown size={14} /></>
            )}
          </button>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && totalCount > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-50 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          {task.subtasks.map((subtask) => (
            <SubtaskItem 
              key={subtask.id}
              title={subtask.title}
              completed={subtask.completed}
              timeSpent={subtask.timeSpent}
              isTimerRunning={subtask.isTimerRunning}
              onToggle={() => onToggleSubtask(task.id, subtask.id)}
              onToggleTimer={(e) => {
                e.stopPropagation();
                toggleSubtaskTimer(subtask.id);
              }}
              onManualLog={(seconds) => handleSubtaskManualLog(subtask.id, seconds)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskCard;