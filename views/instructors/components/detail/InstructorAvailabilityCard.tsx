import React, { useState } from "react";
import { CalendarDays, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
}

const DAY_INDEX: Record<string, number> = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

function getDayDuration(slot: AvailabilitySlot): number {
  const [sh, sm] = slot.startTime.split(":").map(Number);
  const [eh, em] = slot.endTime.split(":").map(Number);
  return (eh + em / 60) - (sh + sm / 60);
}

interface InstructorAvailabilityCardProps {
  availability: AvailabilitySlot[];
  pricePerHour?: number | null;
  timezone?: string | null;
  openCalendar?: () => void; // Kept as optional to not break parent if it still passes it
}

export function InstructorAvailabilityCard({ availability, pricePerHour, timezone }: InstructorAvailabilityCardProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  if (!availability || availability.length === 0) {
    return (
      <div style={{
        background: "#ffffff",
        borderRadius: 24,
        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.06)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{ padding: "32px", display: "flex", flexDirection: "column" }}>
          <SectionHeading>Availability Calendar</SectionHeading>
          <div style={{
            padding: "24px 16px", borderRadius: 16,
            background: "#f8fafc", border: "1px dashed #cbd5e1",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            marginTop: 16
          }}>
            <CalendarDays size={32} color="#94a3b8" />
            <p style={{ margin: 0, fontSize: 14, color: "#64748b", fontWeight: 500 }}>
              No availability schedule provided yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalHours = availability.reduce((acc, s) => acc + getDayDuration(s), 0);
  const availableDayIndexes = new Set(availability.map(slot => DAY_INDEX[slot.day]));

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const today = new Date();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const calendarCells = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push(i);
  }

  // Pad the rest of the grid
  const totalCells = Math.ceil(calendarCells.length / 7) * 7;
  while (calendarCells.length < totalCells) {
    calendarCells.push(null);
  }

  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 24,
      boxShadow: "0 10px 40px -10px rgba(0,0,0,0.06)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{ padding: "32px", display: "flex", flexDirection: "column" }}>
        <SectionHeading>Availability Calendar</SectionHeading>

        {/* Summary chips */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap", flexShrink: 0 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
            background: "#eef2ff", borderRadius: 30, border: "1px solid rgba(99, 102, 241, 0.15)",
          }}>
            <CalendarDays style={{ width: 12, height: 12, color: "#4f46e5" }} />
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "#4338ca" }}>
              {availability.length} slot{availability.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
            background: "#f0fdf4", borderRadius: 30, border: "1px solid rgba(16, 185, 129, 0.15)",
          }}>
            <Clock style={{ width: 12, height: 12, color: "#059669" }} />
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "#047857" }}>
              {totalHours.toFixed(1)} hrs/week
            </span>
          </div>
          {pricePerHour && (
            <div style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
              background: "#fffbeb", borderRadius: 30, border: "1px solid rgba(245, 158, 11, 0.15)",
            }}>
              <span style={{ fontSize: 11.5, fontWeight: 800, color: "#b45309" }}>
                ${pricePerHour}/hr
              </span>
            </div>
          )}
          {timezone && (
            <div style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
              background: "#f3f4f6", borderRadius: 30, border: "1px solid rgba(107, 114, 128, 0.15)",
            }}>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: "#374151" }}>
                {timezone}
              </span>
            </div>
          )}
        </div>

        {/* Mini Calendar UI */}
        <div style={{
          background: "#f8fafc",
          borderRadius: 20,
          padding: "24px",
          border: "1px solid #e2e8f0"
        }}>
          {/* Calendar Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.01em" }}>
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h3>
            <div style={{ display: "flex", gap: 8 }}>
              <button 
                onClick={handlePrevMonth}
                style={{
                  width: 32, height: 32, borderRadius: 10, background: "#fff",
                  border: "1px solid #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#475569", transition: "all 0.2s"
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f1f5f9"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#94a3b8"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#cbd5e1"; }}
              >
                <ChevronLeft style={{ width: 16, height: 16 }} />
              </button>
              <button 
                onClick={handleNextMonth}
                style={{
                  width: 32, height: 32, borderRadius: 10, background: "#fff",
                  border: "1px solid #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#475569", transition: "all 0.2s"
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f1f5f9"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#94a3b8"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#cbd5e1"; }}
              >
                <ChevronRight style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </div>

          {/* Weekdays */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 12 }}>
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
              <div key={day} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "#64748b" }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px 4px" }}>
            {calendarCells.map((dayObj, i) => {
              if (dayObj === null) {
                return <div key={`empty-${i}`} style={{ height: 36 }} />;
              }

              const dayOfWeek = i % 7;
              const isAvailable = availableDayIndexes.has(dayOfWeek);
              const isToday = 
                dayObj === today.getDate() && 
                currentMonth === today.getMonth() && 
                currentYear === today.getFullYear();

              return (
                <div key={i} style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: isAvailable ? 800 : 600,
                    cursor: "default",
                    background: isAvailable ? "#4f46e5" : "transparent",
                    color: isAvailable ? "#fff" : (isToday ? "#4f46e5" : "#334155"),
                    border: isToday && !isAvailable ? "2px solid #4f46e5" : "none",
                    boxShadow: isAvailable ? "0 4px 10px rgba(79, 70, 229, 0.3)" : "none",
                    position: "relative"
                  }}>
                    {dayObj}
                    {isAvailable && (
                      <div style={{
                        position: "absolute", bottom: 2,
                        width: 4, height: 4, borderRadius: "50%",
                        background: "#fff"
                      }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Available Times Legend */}
        <div style={{ marginTop: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: "0.05em", marginBottom: 12, textTransform: "uppercase" }}>Available Timeslots</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {availability.map((slot, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{slot.day}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#4f46e5" }}>{slot.startTime} - {slot.endTime}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
