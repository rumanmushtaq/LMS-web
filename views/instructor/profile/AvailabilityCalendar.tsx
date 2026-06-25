"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvailabilitySlot {
  day: string; // e.g. "Monday", "Tuesday"
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "17:00"
}

interface Props {
  availability: AvailabilitySlot[];
}

const DAYS_OF_WEEK = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function buildCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function AvailabilityCalendar({ availability }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const cells = buildCalendar(year, month);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  // Map day-name → slots
  const slotsByDay = new Map<string, AvailabilitySlot[]>();
  availability.forEach(slot => {
    const key = slot.day;
    if (!slotsByDay.has(key)) slotsByDay.set(key, []);
    slotsByDay.get(key)!.push(slot);
  });

  const getSlotsForDate = (day: number) => {
    const dayName = DAYS_OF_WEEK[new Date(year, month, day).getDay()];
    return slotsByDay.get(dayName) ?? [];
  };

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft size={16} />
        </button>
        <h4 className="font-bold text-sm text-foreground">
          {MONTH_NAMES[month]} {year}
        </h4>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border/30">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
          <div key={d} className="py-2 text-center text-[10px] font-bold uppercase text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (!day) return <div key={i} className="min-h-[56px] border-b border-r border-border/20 last:border-r-0" />;
          const slots = getSlotsForDate(day);
          const hasSlots = slots.length > 0;
          const todayCell = isToday(day);
          return (
            <div
              key={i}
              className={cn(
                "min-h-[56px] p-1.5 border-b border-r border-border/20 last:border-r-0 transition-colors",
                hasSlots ? "bg-primary/5 hover:bg-primary/10 cursor-pointer" : "hover:bg-muted/30",
                todayCell && "ring-1 ring-inset ring-primary/40"
              )}
            >
              <div className={cn(
                "text-[11px] font-bold mb-1 w-5 h-5 flex items-center justify-center rounded-full",
                todayCell
                  ? "bg-primary text-primary-foreground"
                  : hasSlots
                  ? "text-primary"
                  : "text-muted-foreground"
              )}>
                {day}
              </div>
              {hasSlots && (
                <div className="flex flex-col gap-0.5">
                  {slots.slice(0, 1).map((s, si) => (
                    <div key={si} className="text-[8px] leading-tight text-primary/80 font-medium truncate flex items-center gap-0.5">
                      <Clock size={7} />
                      {s.startTime}–{s.endTime}
                    </div>
                  ))}
                  {slots.length > 1 && (
                    <span className="text-[8px] text-primary/60">+{slots.length - 1} more</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-3 border-t border-border/30 bg-muted/20">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-primary/20 border border-primary/40" />
          <span className="text-[10px] text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-[10px] text-muted-foreground">Today</span>
        </div>
        {availability.length > 0 && (
          <div className="ml-auto text-[10px] text-muted-foreground">
            {[...new Set(availability.map(a => a.day))].join(" · ")}
          </div>
        )}
      </div>
    </div>
  );
}
