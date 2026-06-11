"use client";

import { useState } from "react";
import { useAppStore, type Category, type Priority } from "@/store/useAppStore";
import { startOfDay, dateToInputValue, inputValueToDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

const categories: { value: Category; label: string }[] = [
  { value: "DSA", label: "DSA" },
  { value: "LLD", label: "LLD" },
  { value: "SYSTEM_DESIGN", label: "System Design" },
  { value: "FUNDAMENTALS", label: "Fundamentals" },
  { value: "PROJECT", label: "Project" },
];

const priorities: { value: Priority; label: string }[] = [
  { value: "P1", label: "P1 - Critical" },
  { value: "P2", label: "P2 - High" },
  { value: "P3", label: "P3 - Medium" },
  { value: "P4", label: "P4 - Low" },
];

export function TaskForm() {
  const addTask = useAppStore((s) => s.addTask);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("DSA");
  const [priority, setPriority] = useState<Priority>("P3");
  const [date, setDate] = useState(() => dateToInputValue(startOfDay(Date.now())));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({
      title: title.trim(),
      category,
      priority,
      status: "TODO",
      date: inputValueToDate(date),
    });
    setTitle("");
    setDate(dateToInputValue(startOfDay(Date.now())));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <div className="flex-1 basis-36">
        <Input
          placeholder="What to work on?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <Select
        value={category}
        onValueChange={(v) => setCategory(v as Category)}
      >
        <SelectTrigger className="w-28">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {categories.map((c) => (
            <SelectItem key={c.value} value={c.value}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={priority}
        onValueChange={(v) => setPriority(v as Priority)}
      >
        <SelectTrigger className="w-28">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {priorities.map((p) => (
            <SelectItem key={p.value} value={p.value}>
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-36"
      />
      <Button type="submit" disabled={!title.trim()}>
        <Plus className="size-4" />
        Add
      </Button>
    </form>
  );
}
