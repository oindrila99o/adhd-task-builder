"use client";

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, Loader2 } from "lucide-react";
import { Task } from '@/types/task';
import { showSuccess } from '@/utils/toast';

interface TaskInputProps {
  onAddTask: (task: Task) => void;
}

const TaskInput = ({ onAddTask }: TaskInputProps) => {
  const [title, setTitle] = useState('');

  const handleAdd = () => {
    if (!title.trim()) return;
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      subtasks: [],
      createdAt: new Date(),
    };
    
    onAddTask(newTask);
    setTitle('');
    showSuccess("Task added to your list!");
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative group">
        <Input
          placeholder="What's on your mind?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-16 px-6 text-lg rounded-2xl border-2 border-slate-200 focus:border-primary/50 transition-all shadow-sm pr-20"
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <div className="absolute right-2 top-2 bottom-2 flex gap-2">
          <Button 
            onClick={handleAdd}
            disabled={!title.trim()}
            className="h-full rounded-xl px-4 bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={20} />
          </Button>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Press Enter to add a task, then click "Break Down" to see the magic.
      </p>
    </div>
  );
};

export default TaskInput;