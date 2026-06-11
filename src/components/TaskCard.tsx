"use client";

import { useState } from "react";
import { useAppStore, type Task, type Status } from "@/store/useAppStore";
import { isToday, dateToInputValue, inputValueToDate, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditTaskDialog } from "@/components/EditTaskDialog";
import { Trash2, Calendar, Pencil } from "lucide-react";

const categoryColors: Record<Task["category"], string> = {
  DSA: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  LLD: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  SYSTEM_DESIGN:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  FUNDAMENTALS:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  PROJECT:
    "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800",
};

const priorityColors: Record<Task["priority"], string> = {
  P1: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
  P2: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  P3: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  P4: "bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700",
};

const statusOptions: Status[] = ["TODO", "IN_PROGRESS", "DONE"];

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const updateTaskStatus = useAppStore((s) => s.updateTaskStatus);
  const updateTaskDate = useAppStore((s) => s.updateTaskDate);
  const deleteTask = useAppStore((s) => s.deleteTask);
  const [editingDate, setEditingDate] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const taskDate = task.date ?? task.createdAt;
  const isTaskToday = isToday(taskDate);

  return (
    <div className="group flex flex-col gap-1.5 rounded-lg border bg-card p-3 text-sm transition-colors hover:border-foreground/20">
      <div className="font-medium">{task.title}</div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="outline" className={categoryColors[task.category]}>
          {task.category === "SYSTEM_DESIGN" ? "SD" : task.category}
        </Badge>
        <Badge variant="outline" className={priorityColors[task.priority]}>
          {task.priority}
        </Badge>
        <Select
          value={task.status}
          onValueChange={(v) => updateTaskStatus(task.id, v as Status)}
        >
          <SelectTrigger className="h-7 text-xs" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "TODO" ? "To Do" : s === "IN_PROGRESS" ? "In Progress" : "Done"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => setEditOpen(true)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
        >
          <Pencil className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => deleteTask(task.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>

      {editingDate ? (
        <Input
          type="date"
          defaultValue={dateToInputValue(taskDate)}
          className="h-6 w-32 text-xs"
          onBlur={(e) => {
            if (e.target.value) {
              updateTaskDate(task.id, inputValueToDate(e.target.value));
            }
            setEditingDate(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
            if (e.key === "Escape") setEditingDate(false);
          }}
          autoFocus
        />
      ) : (
        <button
          onClick={() => setEditingDate(true)}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-muted transition-colors w-fit"
        >
          <Calendar className="size-3" />
          {isTaskToday ? "Today" : formatDate(taskDate)}
        </button>
      )}

      <EditTaskDialog
        task={task}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  );
}
