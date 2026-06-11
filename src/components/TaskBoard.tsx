"use client";

import { useAppStore, type Status } from "@/store/useAppStore";
import { TaskCard } from "@/components/TaskCard";
import { isToday } from "@/lib/utils";

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

  const filtered = tasks.filter((t) => {
    if (filter === "today") return isToday(t.date ?? t.createdAt);
    return true;
  });

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {columns.map((col) => {
        const colTasks = filtered
          .filter((t) => t.status === col.status)
          .sort((a, b) => {
            const priorityOrder = { P1: 0, P2: 1, P3: 2, P4: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          });

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
            <div className="flex flex-col gap-2 min-h-32 rounded-lg border border-dashed p-2">
              {colTasks.length === 0 ? (
                <div className="flex flex-1 items-center justify-center text-xs text-muted-foreground/40">
                  No tasks
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
