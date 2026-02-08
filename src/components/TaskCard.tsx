"use client";

import React from 'react';
import { Task } from '@/types/task';
import SubtaskItem from './SubtaskItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskCard = ({ task, onToggleSubtask, onDeleteTask }: TaskCardProps) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  
  const completedCount = task.subtasks.filter(s => s.completed).length;
  const totalCount = task.subtasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <Card className="overflow-hidden border-none shadow-lg bg-slate-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-xl font-bold text-slate-800">{task.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{completedCount} of {totalCount} steps completed</span>
              <span>•</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-slate-400 hover:text-slate-600"
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
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
        <Progress value={progress} className="h-2 mt-4" />
      </CardHeader>
      
      {isExpanded && (
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