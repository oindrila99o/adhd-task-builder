"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Task, TaskTemplate } from '@/types/task';
import TaskInput from '@/components/TaskInput';
import TaskCard from '@/components/TaskCard';
import TemplateManager from '@/components/TemplateManager';
import TimeAnalytics from '@/components/TimeAnalytics';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { ListTodo, Sparkles, Menu, BrainCircuit, Timer } from 'lucide-react';
import { simulateTaskBreakdown } from '@/utils/breakdown';
import { showSuccess, showError } from '@/utils/toast';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasksplit_tasks');
    const savedTemplates = localStorage.getItem('tasksplit_templates');
    if (savedTasks) {
      const parsed = JSON.parse(savedTasks);
      // Reset timers on load to prevent runaway intervals
      setTasks(parsed.map((t: Task) => ({ ...t, isTimerRunning: false })));
    }
    if (savedTemplates) setTemplates(JSON.parse(savedTemplates));
  }, []);

  useEffect(() => {
    localStorage.setItem('tasksplit_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('tasksplit_templates', JSON.stringify(templates));
  }, [templates]);

  const handleAddTask = (newTask: Task) => {
    setTasks([{ ...newTask, timeSpent: 0, isTimerRunning: false }, ...tasks]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          subtasks: task.subtasks.map(sub => 
            sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
          )
        };
      }
      return task;
    }));
  };

  const handleUpdateTime = useCallback((taskId: string, seconds: number, isRunning: boolean) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, timeSpent: seconds, isTimerRunning: isRunning } : t
    ));
  }, []);

  const handleBreakdownTask = async (taskId: string) => {
    const taskToBreak = tasks.find(t => t.id === taskId);
    if (!taskToBreak) return;

    try {
      const customTemplate = templates.find(t => 
        taskToBreak.title.toLowerCase().includes(t.trigger.toLowerCase())
      );

      let subtaskTitles: string[];
      
      if (customTemplate) {
        await new Promise(r => setTimeout(r, 800));
        subtaskTitles = customTemplate.subtasks;
        showSuccess("Using your custom breakdown!");
      } else {
        subtaskTitles = await simulateTaskBreakdown(taskToBreak.title);
        showSuccess("Task broken down!");
      }
      
      setTasks(tasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: subtaskTitles.map(title => ({
              id: crypto.randomUUID(),
              title,
              completed: false
            }))
          };
        }
        return task;
      }));
    } catch (error) {
      showError("Failed to break down task");
    }
  };

  const handleSaveTemplate = (template: TaskTemplate) => {
    setTemplates([template, ...templates]);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Sparkles className="text-white" size={22} />
            </div>
            <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              TaskSplit
            </h1>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                <Menu size={24} className="text-slate-600" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[90%] sm:w-[450px] overflow-y-auto">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-2xl font-black">Workspace</SheetTitle>
                <SheetDescription>Manage your custom rules and track your productivity.</SheetDescription>
              </SheetHeader>
              
              <Tabs defaultValue="analytics" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="analytics" className="gap-2">
                    <Timer size={16} />
                    Time Log
                  </TabsTrigger>
                  <TabsTrigger value="rules" className="gap-2">
                    <BrainCircuit size={16} />
                    Rules
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="analytics">
                  <TimeAnalytics tasks={tasks} />
                </TabsContent>
                <TabsContent value="rules">
                  <TemplateManager 
                    templates={templates} 
                    onSaveTemplate={handleSaveTemplate}
                    onDeleteTemplate={handleDeleteTemplate}
                  />
                </TabsContent>
              </Tabs>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        <section className="text-center space-y-6">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 max-w-2xl mx-auto leading-tight">
            Big goals, <br />
            <span className="text-indigo-600">small steps.</span>
          </h2>
          <div className="pt-4">
            <TaskInput onAddTask={handleAddTask} />
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListTodo className="text-indigo-600" size={20} />
              <h3 className="text-xl font-bold text-slate-800">Your Tasks</h3>
            </div>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ListTodo className="text-slate-300" size={32} />
              </div>
              <h4 className="text-lg font-semibold text-slate-600">Your list is empty</h4>
              <p className="text-slate-400">Add a task above to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onToggleSubtask={handleToggleSubtask}
                  onDeleteTask={handleDeleteTask}
                  onBreakdown={handleBreakdownTask}
                  onUpdateTime={handleUpdateTime}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="py-12 border-t border-slate-100 mt-20">
        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-4">
          <MadeWithDyad />
        </div>
      </footer>
    </div>
  );
};

export default Index;