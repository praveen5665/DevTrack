"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";

const PRESETS = [25, 50] as const;

export function FocusTimer() {
  const tasks = useAppStore((s) => s.tasks);
  const logSession = useAppStore((s) => s.logSession);

  const [preset, setPreset] = useState<number>(PRESETS[0]);
  const [secondsLeft, setSecondsLeft] = useState(preset * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastLoggedMinuteRef = useRef(0);

  const activeTasks = tasks.filter((t) => t.status !== "DONE");

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setSecondsLeft(preset * 60);
    lastLoggedMinuteRef.current = 0;
  }, [preset, clearTimer]);

  useEffect(() => {
    reset();
  }, [preset, reset]);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }

    const elapsed = preset * 60 - secondsLeft;
    const currentMinute = Math.floor(elapsed / 60);
    if (isRunning && currentMinute > lastLoggedMinuteRef.current) {
      lastLoggedMinuteRef.current = currentMinute;
      logSession({ taskId: selectedTaskId, durationMinutes: 1 });
    }

    if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      clearTimer();
    }
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, secondsLeft, clearTimer]);

  const handleStartPause = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(preset * 60);
      lastLoggedMinuteRef.current = 0;
    }
    setIsRunning((prev) => !prev);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const display = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  const progress = 1 - secondsLeft / (preset * 60);
  const circumference = 2 * Math.PI * 72;
  const offset = circumference * (1 - progress);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6">
      <div className="relative flex items-center justify-center">
        <svg className="size-48 -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r="72"
            fill="none"
            stroke="currentColor"
            className="text-muted/30"
            strokeWidth="6"
          />
          <circle
            cx="80"
            cy="80"
            r="72"
            fill="none"
            stroke="currentColor"
            className="text-primary transition-all duration-1000 ease-linear"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-5xl font-bold tabular-nums tracking-tight">
            {display}
          </span>
          <span className="mt-1 text-xs text-muted-foreground">
            {preset} min session
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {PRESETS.map((p) => (
          <Button
            key={p}
            variant={preset === p ? "default" : "outline"}
            size="sm"
            onClick={() => {
              if (!isRunning) setPreset(p);
            }}
            disabled={isRunning}
          >
            <Timer className="size-3.5" />
            {p}m
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={handleStartPause} className="w-28">
          {isRunning ? (
            <>
              <Pause className="size-4" /> Pause
            </>
          ) : secondsLeft === 0 ? (
            <>
              <RotateCcw className="size-4" /> Restart
            </>
          ) : (
            <>
              <Play className="size-4" /> Start
            </>
          )}
        </Button>
        {isRunning && (
          <Button variant="outline" size="icon" onClick={reset}>
            <RotateCcw className="size-4" />
          </Button>
        )}
      </div>

      <div className="w-full max-w-xs">
        <Select
          value={selectedTaskId}
          onValueChange={(v) => setSelectedTaskId(v || null)}
        >
          <SelectTrigger className="w-full text-xs">
            <SelectValue placeholder="Link to a task (optional)">
              {(value: string | null) => {
                if (!value) return "Link to a task (optional)";
                const task = activeTasks.find((t) => t.id === value);
                return task?.title ?? value;
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No task</SelectItem>
            {activeTasks.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
