import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function startOfDay(d: Date | number) {
  const date = new Date(d);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function getTodayBounds() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start.getTime() + 86400000);
  return { start: start.getTime(), end: end.getTime() };
}

export function isToday(timestamp: number) {
  const { start, end } = getTodayBounds();
  return timestamp >= start && timestamp < end;
}

export function dateToInputValue(timestamp: number) {
  const d = new Date(timestamp);
  return d.toLocaleDateString("en-CA");
}

export function inputValueToDate(value: string) {
  return startOfDay(new Date(value + "T00:00:00"));
}

export function formatDate(timestamp: number) {
  const d = new Date(timestamp);
  const today = new Date();
  const sameYear = d.getFullYear() === today.getFullYear();
  const opts: Intl.DateTimeFormatOptions = sameYear
    ? { month: "short", day: "numeric" }
    : { month: "short", day: "numeric", year: "numeric" };
  return d.toLocaleDateString("en-US", opts);
}

export function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
