"use client";

import React, { useState } from 'react';
import { DailyTask } from '@/types/task';
import DailyTaskItem from './DailyTaskItem';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, CalendarDays } from 'lucide-react';

interface DailyTaskSectionProps {
  dailyTasks: DailyTask[];
  onToggle: (id: string) => void;
  onAdd: (title: string) => void;
  onDelete: (id: string) => void;
}

const DailyTaskSection = ({ dailyTasks, onToggle, onAdd, onDelete }: DailyTaskSectionProps) => {
  const [newTitle, setNewTitle] = useState('');

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onAdd(newTitle.trim());
    setNewTitle('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-100 rounded-lg">
            <CalendarDays className="text-amber-600" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Daily Rituals</h3>
            <p className="text-xs text-slate-500 font-medium">Resets every 24 hours</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Input 
          placeholder="Add a daily habit..." 
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="rounded-xl border-slate-200 focus:ring-amber-500"
        />
        <Button 
          onClick={handleAdd}
          className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-4"
        >
          <Plus size={20} />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {dailyTasks.map((task) => (
          <div key={task.id} className="group">
            <DailyTaskItem 
              title={task.title}
              completed={task.completed}
              isAiSuggested={task.isAiSuggested}
              onToggle={() => onToggle(task.id)}
              onDelete={() => onDelete(task.id)}
            />
          </div>
        ))}
      </div>
      
      {dailyTasks.length === 0 && (
        <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-sm text-slate-400">No rituals for today yet.</p>
        </div>
      )}
    </div>
  );
};

export default DailyTaskSection;