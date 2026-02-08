"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Task } from '@/types/task';
import SubtaskItem from './SubtaskItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trash2, ChevronDown, ChevronUp, Loader2, Split, Play, Pause, Clock } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onBreakdown: (taskId: string) => Promise<void>;
  onUpdateTime: (taskId: string, seconds: number, isRunning: boolean) => void;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const TaskCard = ({ task, onToggleSubtask, onDeleteTask, onBreakdown, onUpdateTime }: TaskCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBreakingDown, setIsBreakingDown] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const completedCount = task.subtasks.filter(s => s.completed).length;
  const totalCount = task.subtasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  useEffect(() => {
    if (task.isTimerRunning) {
      timerRef.current = setInterval(() => {
        onUpdateTime(task.id, task.timeSpent + 1, true);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [task.isTimerRunning, task.timeSpent, task.id, onUpdateTime]);

  const handleBreakdownClick = async () => {
    setIsBreakingDown(true);
    await onBreakdown(task.id);
    setIsBreakingDown(false);
    setIsExpanded(true);
  };

  const toggleTimer = () => {
    onUpdateTime(task.id, task.timeSpent, !task.isTimerRunning);
  };

  return (
    <Card className="overflow-hidden border-none shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-bold text-slate-800">{task.title}</CardTitle>
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${task.isTimerRunning ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
                <Clock size={10} />
                {formatTime(task.timeSpent)}
              </div>
            </div>
            {totalCount > 0 ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{completedCount} of {totalCount} steps completed</span>
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">No steps yet</p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTimer}
              className={`rounded-full ${task.isTimerRunning ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
            >
              {task.isTimerRunning ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            </Button>
            
            {totalCount === 0 && (
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handleBreakdownClick}
                disabled={isBreakingDown}
                className="h-9 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none font-semibold px-4 gap-2"
              >
                {isBreakingDown ? <Loader2 className="animate-spin" size={16} /> : <><Split size={16} /><span>Break Down</span></>}
              </Button>
            )}
            {totalCount > 0 && (
              <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)} className="text-slate-400 hover:text-slate-600">
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => onDeleteTask(task.id)} className="text-slate-400 hover:text-destructive">
              <Trash2 size={18} />
            </Button>
          </div>
        </div>
        {totalCount > 0 && <Progress value={progress} className="h-2 mt-4" />}
      </CardHeader>
      
      {isExpanded && totalCount > 0 && (
        <CardContent className="pt-0 pb-6">
          <div className="space-y-2 mt-2">
            {task.subtasks.map((subtask) => (
              <SubtaskItem 
                key={subtask.id}
                title={subtask.title}
                completed={subtask.completed}
                onToggle={() => onToggleSubtask(task.id, subtask.id)}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default TaskCard;