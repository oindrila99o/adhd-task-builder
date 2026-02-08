"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { History, Clock } from "lucide-react";
import { showSuccess, showError } from '@/utils/toast';

interface ManualTimeLogProps {
  onLogTime: (seconds: number) => void;
}

const ManualTimeLog = ({ onLogTime }: ManualTimeLogProps) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleLog = () => {
    if (!startTime || !endTime) {
      showError("Please enter both start and end times");
      return;
    }

    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    let diffInSeconds = (end.getTime() - start.getTime()) / 1000;

    if (diffInSeconds < 0) {
      // Handle overnight tasks by adding 24 hours
      diffInSeconds += 24 * 60 * 60;
    }

    if (diffInSeconds === 0) {
      showError("End time must be different from start time");
      return;
    }

    onLogTime(diffInSeconds);
    setStartTime("");
    setEndTime("");
    setIsOpen(false);
    showSuccess("Time logged manually!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full">
          <History size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-black">
            <Clock className="text-indigo-600" />
            Manual Time Log
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="start" className="font-bold text-slate-700">Start Time</Label>
            <Input
              id="start"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="rounded-xl border-slate-200 h-12"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="end" className="font-bold text-slate-700">End Time</Label>
            <Input
              id="end"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="rounded-xl border-slate-200 h-12"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleLog} className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-lg">
            Log Duration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManualTimeLog;