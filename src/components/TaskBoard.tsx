"use client";

import { useState } from "react";
import { useAppStore, type Status } from "@/store/useAppStore";
import { TaskCard } from "@/components/TaskCard";
import { cn, isToday } from "@/lib/utils";

interface TaskBoardProps {
  filter?: "today" | "all";
}

const columns: { status: Status; label: string }[] = [
  { status: "TODO", label: "To Do" },
  { status: "IN_PROGRESS", label: "In Progress" },
  { status: "DONE", label: "Done" },
];

export function TaskBoard({ filter = "all" }: TaskBoardProps) {
  const tasks = useAppStore((s) => s.tasks);
  const reorderTasks = useAppStore((s) => s.reorderTasks);
  const [dragOverColumn, setDragOverColumn] = useState<Status | null>(null);

  const filtered = tasks.filter((t) => {
    if (filter === "today") return isToday(t.date ?? t.createdAt);
    return true;
  });

  const handleDragOver = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(status);
  };

  const handleDragLeave = (e: React.DragEvent, status: Status) => {
    if (e.currentTarget === e.target || !e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn((prev) => (prev === status ? null : prev));
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: Status) => {
    e.preventDefault();
    setDragOverColumn(null);

    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const targetTasks = tasks
      .filter((t) => t.status === targetStatus && t.id !== taskId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const cardElements = e.currentTarget.querySelectorAll<HTMLElement>("[draggable='true']");
    let insertIndex = targetTasks.length;

    cardElements.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      if (e.clientY > mid) insertIndex = i + 1;
      else if (insertIndex === targetTasks.length) insertIndex = i;
    });

    const reordered = [...targetTasks];
    reordered.splice(insertIndex, 0, task);

    const updates: { id: string; status?: Status; order?: number }[] = [];
    reordered.forEach((t, i) => {
      const u: { id: string; status?: Status; order?: number } = { id: t.id, order: i };
      if (t.id === taskId && t.status !== targetStatus) u.status = targetStatus;
      updates.push(u);
    });

    reorderTasks(updates);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {columns.map((col) => {
        const colTasks = filtered
          .filter((t) => t.status === col.status)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        return (
          <div key={col.status} className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                {col.label}
              </h3>
              <span className="text-xs text-muted-foreground/50">
                {colTasks.length}
              </span>
            </div>
            <div
              onDragOver={(e) => handleDragOver(e, col.status)}
              onDragLeave={(e) => handleDragLeave(e, col.status)}
              onDrop={(e) => handleDrop(e, col.status)}
              className={cn(
                "flex flex-col gap-2 min-h-32 rounded-lg border border-dashed p-2 transition-colors",
                dragOverColumn === col.status
                  ? "border-foreground/40 bg-accent/50"
                  : "border-border",
              )}
            >
              {colTasks.length === 0 ? (
                <div
                  className={cn(
                    "flex flex-1 items-center justify-center text-xs transition-colors",
                    dragOverColumn === col.status
                      ? "text-muted-foreground/60"
                      : "text-muted-foreground/40",
                  )}
                >
                  {dragOverColumn === col.status ? "Drop here" : "No tasks"}
                </div>
              ) : (
                colTasks.map((t) => <TaskCard key={t.id} task={t} />)
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
