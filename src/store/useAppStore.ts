"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Category = string;
export type Priority = "P1" | "P2" | "P3" | "P4";
export type Status = "TODO" | "IN_PROGRESS" | "DONE";

export const DEFAULT_CATEGORIES = ["DSA", "LLD", "SYSTEM_DESIGN", "FUNDAMENTALS", "PROJECT"] as const;

export interface Task {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  status: Status;
  date: number;
  createdAt: number;
  order?: number;
}

export interface StudySession {
  id: string;
  taskId: string | null;
  durationMinutes: number;
  completedAt: number;
}

export interface AppState {
  tasks: Task[];
  sessions: StudySession[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "order">) => void;
  updateTaskStatus: (id: string, status: Status) => void;
  updateTaskDate: (id: string, date: number) => void;
  updateTask: (id: string, data: Partial<Omit<Task, "id" | "createdAt">>) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (updates: { id: string; status?: Status; order?: number }[]) => void;
  logSession: (session: Omit<StudySession, "id" | "completedAt">) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      tasks: [],
      sessions: [],

  addTask: (task) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          ...task,
          id: crypto.randomUUID(),
          date: task.date,
          createdAt: Date.now(),
          order: Date.now(),
        },
      ],
    })),

  updateTaskStatus: (id, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
    })),

  updateTaskDate: (id, date) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, date } : t)),
    })),

  updateTask: (id, data) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),

  reorderTasks: (updates) =>
    set((state) => {
      const updated = [...state.tasks];
      for (const u of updates) {
        const idx = updated.findIndex((t) => t.id === u.id);
        if (idx !== -1) {
          if (u.status !== undefined) updated[idx] = { ...updated[idx], status: u.status };
          if (u.order !== undefined) updated[idx] = { ...updated[idx], order: u.order };
        }
      }
      return { tasks: updated };
    }),

      logSession: (session) =>
        set((state) => ({
          sessions: [
            ...state.sessions,
            {
              ...session,
              id: crypto.randomUUID(),
              completedAt: Date.now(),
            },
          ],
        })),
    }),
    { name: "devtrack-store" },
  ),
);
