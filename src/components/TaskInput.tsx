"use client";

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus, Loader2 } from "lucide-react";
import { simulateTaskBreakdown } from '@/utils/breakdown';
import { Task } from '@/types/task';
import { showSuccess, showError } from '@/utils/toast';

interface TaskInputProps {
  onAddTask: (task: Task) => void;
}

const TaskInput = ({ onAddTask }: TaskInputProps) => {
  const [title, setTitle] = useState('');
  const [isBreakingDown, setIsBreakingDown] = useState(false);

  const handleAddManual = () => {
    if (!title.trim()) return;
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      subtasks: [],
      createdAt: new Date(),
    };
    
    onAddTask(newTask);
    setTitle('');
    showSuccess("Task added!");
  };

  const handleAutoBreakdown = async () => {
    if (!title.trim()) {
      showError("Please enter a task first");
      return;
    }

    setIsBreakingDown(true);
    try {
      const subtaskTitles = await simulateTaskBreakdown(title);
      
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: title.trim(),
        subtasks: subtaskTitles.map(t => ({
          id: crypto.randomUUID(),
          title: t,
          completed: false
        })),
        createdAt: new Date(),
      };

      onAddTask(newTask);
      setTitle('');
      showSuccess("Task broken down successfully!");
    } catch (error) {
      showError("Failed to break down task");
    } finally {
      setIsBreakingDown(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative group">
        <Input
          placeholder="What big task are you tackling today?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-16 px-6 text-lg rounded-2xl border-2 border-slate-200 focus:border-primary/50 transition-all shadow-sm pr-32"
          onKeyDown={(e) => e.key === 'Enter' && handleAutoBreakdown()}
        />
        <div className="absolute right-2 top-2 bottom-2 flex gap-2">
          <Button 
            onClick={handleAutoBreakdown}
            disabled={isBreakingDown || !title.trim()}
            className="h-full rounded-xl px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isBreakingDown ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Sparkles size={18} className="mr-2" />
                Break Down
              </>
            )}
          </Button>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Tip: Try "Clean my room", "Build a React app", or "Write a research paper"
      </p>
    </div>
  );
};

export default TaskInput;