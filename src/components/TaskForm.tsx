"use client";

import { useState } from "react";
import { useAppStore, type Category, type Priority, DEFAULT_CATEGORIES } from "@/store/useAppStore";
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

const ADD_CUSTOM = "__add_custom__";

function categoryLabel(value: string): string {
  if (value === "SYSTEM_DESIGN") return "System Design";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

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

  const handleCategoryChange = (v: string | null) => {
    if (!v) return;
    if (v === ADD_CUSTOM) {
      const name = window.prompt("Custom category name:");
      if (name?.trim()) {
        setCategory(name.trim());
      }
      return;
    }
    setCategory(v);
  };

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
        onValueChange={handleCategoryChange}
      >
        <SelectTrigger className="w-28">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {DEFAULT_CATEGORIES.map((c) => (
            <SelectItem key={c} value={c}>
              {categoryLabel(c)}
            </SelectItem>
          ))}
          <SelectItem value={ADD_CUSTOM}>+ Add custom...</SelectItem>
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
