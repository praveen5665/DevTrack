"use client";

import { useAppStore } from "@/store/useAppStore";
import { getTodayBounds, formatMinutes } from "@/lib/utils";
import { ListChecks, Timer, ArrowUp } from "lucide-react";

export function MetricsWidget() {
  const tasks = useAppStore((s) => s.tasks);
  const sessions = useAppStore((s) => s.sessions);

  const { start: todayStart } = getTodayBounds();

  const completedToday = tasks.filter(
    (t) => t.status === "DONE" && (t.date ?? t.createdAt) >= todayStart,
  ).length;

  const totalTodayTasks = tasks.filter(
    (t) => (t.date ?? t.createdAt) >= todayStart,
  ).length;

  const minutesToday = sessions
    .filter((s) => s.completedAt >= todayStart)
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="flex items-center gap-3 rounded-xl border bg-card p-4 text-sm">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
          <ListChecks className="size-5 text-primary" />
        </div>
        <div>
          <div className="text-2xl font-semibold tracking-tight">
            {completedToday}
            <span className="ml-1 text-base font-normal text-muted-foreground">
              / {totalTodayTasks}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">Tasks done today</div>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl border bg-card p-4 text-sm">
        <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
          <Timer className="size-5 text-blue-500" />
        </div>
        <div>
          <div className="text-2xl font-semibold tracking-tight">
            {formatMinutes(minutesToday)}
          </div>
          <div className="text-xs text-muted-foreground">
            Focus minutes today
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl border bg-card p-4 text-sm">
        <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
          <ArrowUp className="size-5 text-emerald-500" />
        </div>
        <div>
          <div className="text-2xl font-semibold tracking-tight">
            {tasks.filter((t) => t.status !== "DONE").length}
          </div>
          <div className="text-xs text-muted-foreground">Active tasks</div>
        </div>
      </div>
    </div>
  );
}
