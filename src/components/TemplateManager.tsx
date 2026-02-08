"use client";

import React, { useState } from 'react';
import { TaskTemplate } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Save } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

interface TemplateManagerProps {
  templates: TaskTemplate[];
  onSaveTemplate: (template: TaskTemplate) => void;
  onDeleteTemplate: (id: string) => void;
}

const TemplateManager = ({ templates, onSaveTemplate, onDeleteTemplate }: TemplateManagerProps) => {
  const [trigger, setTrigger] = useState('');
  const [subtaskInput, setSubtaskInput] = useState('');
  const [currentSubtasks, setCurrentSubtasks] = useState<string[]>([]);

  const addSubtask = () => {
    if (!subtaskInput.trim()) return;
    setCurrentSubtasks([...currentSubtasks, subtaskInput.trim()]);
    setSubtaskInput('');
  };

  const handleSave = () => {
    if (!trigger.trim() || currentSubtasks.length === 0) return;
    
    onSaveTemplate({
      id: crypto.randomUUID(),
      trigger: trigger.trim().toLowerCase(),
      subtasks: currentSubtasks,
    });
    
    setTrigger('');
    setCurrentSubtasks([]);
    showSuccess(`Saved custom breakdown for "${trigger}"`);
  };

  return (
    <div className="space-y-8 py-4">
      <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <h4 className="font-bold text-slate-800">Create Custom Breakdown</h4>
        <div className="space-y-2">
          <Label htmlFor="trigger">When I type this task...</Label>
          <Input 
            id="trigger" 
            placeholder="e.g. Morning Routine" 
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Break it down into these steps:</Label>
          <div className="flex gap-2">
            <Input 
              placeholder="Add a step..." 
              value={subtaskInput}
              onChange={(e) => setSubtaskInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSubtask()}
            />
            <Button size="icon" onClick={addSubtask} variant="outline">
              <Plus size={18} />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {currentSubtasks.map((s, i) => (
              <div key={i} className="bg-white px-3 py-1 rounded-full text-xs font-medium border border-slate-200 flex items-center gap-2">
                {s}
                <button onClick={() => setCurrentSubtasks(currentSubtasks.filter((_, idx) => idx !== i))}>
                  <Trash2 size={12} className="text-slate-400 hover:text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <Button className="w-full gap-2" onClick={handleSave} disabled={!trigger || currentSubtasks.length === 0}>
          <Save size={18} />
          Save Custom Rule
        </Button>
      </div>

      <div className="space-y-4">
        <h4 className="font-bold text-slate-800">Your Saved Breakdowns</h4>
        {templates.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No custom rules yet.</p>
        ) : (
          <div className="space-y-3">
            {templates.map((t) => (
              <div key={t.id} className="p-3 border border-slate-100 rounded-xl flex items-center justify-between group hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-semibold text-sm text-slate-700 capitalize">{t.trigger}</p>
                  <p className="text-xs text-slate-400">{t.subtasks.length} steps defined</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onDeleteTemplate(t.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={16} className="text-slate-400 hover:text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateManager;