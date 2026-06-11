"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MetricsWidget } from "@/components/MetricsWidget";
import { TaskForm } from "@/components/TaskForm";
import { TaskBoard } from "@/components/TaskBoard";
import { FocusTimer } from "@/components/FocusTimer";
import { ListTodo, Clock, Timer } from "lucide-react";

type Tab = "today" | "all" | "timer";

export function Dashboard() {
  const [tab, setTab] = useState<Tab>("today");

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">DevTrack</h1>
          <p className="text-xs text-muted-foreground">
            Personal productivity dashboard
          </p>
        </div>
      </header>

      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList variant="line">
          <TabsTrigger value="today">
            <ListTodo className="size-4" />
            Today
          </TabsTrigger>
          <TabsTrigger value="all">
            <Clock className="size-4" />
            All Tasks
          </TabsTrigger>
          <TabsTrigger value="timer">
            <Timer className="size-4" />
            Focus Timer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-4 flex flex-col gap-4">
          <MetricsWidget />
          <TaskForm />
          <TaskBoard filter="today" />
        </TabsContent>

        <TabsContent value="all" className="mt-4 flex flex-col gap-4">
          <MetricsWidget />
          <TaskForm />
          <TaskBoard filter="all" />
        </TabsContent>

        <TabsContent value="timer" className="mt-8">
          <FocusTimer />
        </TabsContent>
      </Tabs>
    </div>
  );
}
