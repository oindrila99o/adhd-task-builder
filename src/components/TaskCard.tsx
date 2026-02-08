"use client";

import React, { useState } from 'react';
import { Task } from '@/types/task';
import SubtaskItem from './SubtaskItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trash2, ChevronDown, ChevronUp, Loader2, Split } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onBreakdown: (taskId: string) => Promise<void>;
}

const TaskCard = ({ task, onToggleSubtask, onDeleteTask, onBreakdown }: TaskCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isBreakingDown, setIsBreakingDown] = useState(false);
  
  const completedCount = task.subtasks.filter(s => s.completed).length;
  const totalCount = task.subtasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleBreakdownClick = async () => {
    setIsBreakingDown(true);
    await onBreakdown(task.id);
    setIsBreakingDown(false);
    setIsExpanded(true);
  };

  return (
    <Card className="overflow-hidden border-none shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-xl font-bold text-slate-800">{task.title}</CardTitle>
            {totalCount > 0 ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{completedCount} of {totalCount} steps completed</span>
                <span>•</span>
                <span>{Math.round(progress)}%</span>
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">No steps yet</p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {totalCount === 0 && (
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handleBreakdownClick}
                disabled={isBreakingDown}
                className="h-9 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none font-semibold px-4 gap-2"
              >
                {isBreakingDown ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <Split size={16} />
                    <span>Break Down</span>
                  </>
                )}
              </Button>
            )}
            {totalCount > 0 && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-slate-400 hover:text-slate-600"
              >
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDeleteTask(task.id)}
              className="text-slate-400 hover:text-destructive"
            >
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