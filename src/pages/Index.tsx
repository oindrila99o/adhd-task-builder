"use client";

import React, { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import TaskInput from '@/components/TaskInput';
import TaskCard from '@/components/TaskCard';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { LayoutGrid, ListTodo, Sparkles } from 'lucide-react';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('tasksplit_tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load tasks", e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('tasksplit_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (newTask: Task) => {
    setTasks([newTask, ...tasks]);
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
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
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-indigo-600 transition-colors">Dashboard</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">History</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Settings</a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 max-w-2xl mx-auto leading-tight">
            Stop procrastinating. <br />
            <span className="text-indigo-600">Start doing.</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Enter any large task and our AI will break it down into small, actionable steps you can actually finish.
          </p>
          
          <div className="pt-4">
            <TaskInput onAddTask={handleAddTask} />
          </div>
        </section>

        {/* Tasks List */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListTodo className="text-indigo-600" size={20} />
              <h3 className="text-xl font-bold text-slate-800">Your Projects</h3>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button className="p-1.5 rounded-md bg-white shadow-sm text-indigo-600">
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ListTodo className="text-slate-300" size={32} />
              </div>
              <h4 className="text-lg font-semibold text-slate-600">No tasks yet</h4>
              <p className="text-slate-400">Enter a task above to see the magic happen.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onToggleSubtask={handleToggleSubtask}
                  onDeleteTask={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="py-12 border-t border-slate-100 mt-20">
        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 opacity-50 grayscale">
            <Sparkles size={16} />
            <span className="text-sm font-bold">TaskSplit</span>
          </div>
          <p className="text-sm text-slate-400">Helping you conquer big goals, one step at a time.</p>
          <MadeWithDyad />
        </div>
      </footer>
    </div>
  );
};

export default Index;