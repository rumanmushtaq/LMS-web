"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { X, Clock, Calendar, Globe, Sparkles } from "lucide-react";
import type { AvailabilitySlot } from "@/services/instructors";

const DAY_MAP: Record<string, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6,
};

interface AvailabilityCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructorName: string;
  instructorTitle?: string | null;
  availability: AvailabilitySlot[];
  timezone?: string | null;
}

function buildEvents(availability: AvailabilitySlot[]) {
  if (!availability || availability.length === 0) return [];

  return availability.map((slot, idx) => {
    const dayIdx = DAY_MAP[slot.day.toLowerCase()] ?? 1;

    return {
      id: `avail-${idx}`,
      title: "Available",
      daysOfWeek: [dayIdx],
      startTime: slot.startTime,
      endTime: slot.endTime,
      backgroundColor: "transparent", // Handled by CSS
      borderColor: "transparent",
      textColor: "#ffffff",
      extendedProps: {
        day: slot.day,
        duration: `${slot.startTime} – ${slot.endTime}`,
      },
    };
  });
}

export default function AvailabilityCalendarModal({
  isOpen,
  onClose,
  instructorName,
  instructorTitle,
  availability,
  timezone,
}: AvailabilityCalendarModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<InstanceType<typeof FullCalendar>>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const events = useMemo(() => buildEvents(availability), [availability]);

  useEffect(() => {
    if (isOpen && calendarRef.current) {
      setTimeout(() => {
        calendarRef.current?.getApi().today();
      }, 100);
    }
  }, [isOpen]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose],
  );

  if (!isOpen) return null;

  const totalHours = availability.reduce((acc, slot) => {
    const [sh, sm] = slot.startTime.split(":").map(Number);
    const [eh, em] = slot.endTime.split(":").map(Number);
    return acc + (eh + em / 60 - (sh + sm / 60));
  }, 0);

  const days = [...new Set(availability.map((s) => s.day))];

  return (
    <>
      {/* OVERLAY */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(10, 15, 30, 0.65)",
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "24px", animation: "modalFadeIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      >
        {/* MODAL CONTAINER */}
        <div
          role="dialog" aria-modal="true"
          style={{
            position: "relative", width: "100%", maxWidth: 1100,
            height: "85vh", maxHeight: 900, minHeight: 600,
            background: "#ffffff", borderRadius: "32px",
            boxShadow: "0 40px 80px -20px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.2) inset",
            display: "flex", flexDirection: "column", overflow: "hidden",
            animation: "modalSlideUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        >
          {/* PREMIUM HEADER */}
          <div style={{
            padding: "40px 48px",
            background: "linear-gradient(to right, #ffffff, #f8fafc)",
            borderBottom: "1px solid rgba(0,0,0,0.04)",
            display: "flex", flexDirection: "column", gap: 24, flexShrink: 0,
            position: "relative", zIndex: 10,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ 
                    width: 48, height: 48, borderRadius: "16px", 
                    background: "linear-gradient(135deg, #38bdf8, #4f46e5)", 
                    display: "flex", alignItems: "center", justifyContent: "center", 
                    boxShadow: "0 10px 20px -5px rgba(79, 70, 229, 0.4)" 
                  }}>
                    <Calendar color="#fff" size={24} strokeWidth={2.5} />
                  </div>
                  <h2 style={{ 
                    fontSize: "36px", fontWeight: "800", color: "#0f172a", 
                    letterSpacing: "-0.03em", margin: 0, lineHeight: 1.1, 
                    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" 
                  }}>
                    {instructorName}'s Schedule
                  </h2>
                </div>
                {instructorTitle && (
                  <p style={{ 
                    fontSize: "17px", color: "#64748b", margin: "4px 0 0 60px", 
                    fontWeight: "500", letterSpacing: "-0.01em" 
                  }}>
                    {instructorTitle}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                style={{
                  width: 44, height: 44, borderRadius: "50%", background: "#f1f5f9", border: "none",
                  color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#fee2e2";
                  (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
                  (e.currentTarget as HTMLButtonElement).style.transform = "rotate(90deg) scale(1.1)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#f1f5f9";
                  (e.currentTarget as HTMLButtonElement).style.color = "#64748b";
                  (e.currentTarget as HTMLButtonElement).style.transform = "none";
                }}
              >
                <X size={22} strokeWidth={2.5} />
              </button>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", marginLeft: 60 }}>
              <StatChip icon={<Sparkles size={16} color="#0284c7" />} label={`${days.length} Active Days`} bg="#e0f2fe" color="#0369a1" borderColor="#bae6fd" />
              <StatChip icon={<Clock size={16} color="#059669" />} label={`${totalHours.toFixed(1)} Hrs / Week`} bg="#d1fae5" color="#047857" borderColor="#a7f3d0" />
              {timezone && <StatChip icon={<Globe size={16} color="#ea580c" />} label={timezone} bg="#ffedd5" color="#c2410c" borderColor="#fed7aa" />}
            </div>
          </div>

          {/* CALENDAR BODY */}
          <div style={{ flex: 1, overflowY: "hidden", background: "#f8fafc", position: "relative", padding: "10px 40px 40px" }} className="fc-elite-theme">
            <FullCalendar
              ref={calendarRef}
              plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{ left: "prev,next today", center: "title", right: "timeGridWeek,dayGridMonth" }}
              buttonText={{ today: "Today", week: "Week", month: "Month" }}
              events={events}
              slotMinTime="06:00:00"
              slotMaxTime="22:00:00"
              slotDuration="00:30:00"
              slotLabelInterval="01:00"
              expandRows={true}
              height="100%"
              stickyHeaderDates={true}
              allDaySlot={false}
              nowIndicator={true}
              weekends={true}
              businessHours={availability.map((slot) => ({
                daysOfWeek: [DAY_MAP[slot.day.toLowerCase()] ?? 1],
                startTime: slot.startTime,
                endTime: slot.endTime,
              }))}
              eventContent={(arg) => (
                <div style={{ 
                  padding: "10px 14px", display: "flex", flexDirection: "column", gap: 4, 
                  height: "100%", justifyContent: "flex-start", boxSizing: "border-box" 
                }}>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#ffffff", display: "flex", alignItems: "center", gap: 6, letterSpacing: "0.03em" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ffffff", boxShadow: "0 0 8px rgba(255,255,255,0.8)" }} />
                    {arg.event.title}
                  </div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.9)", fontWeight: "600" }}>
                    {arg.event.extendedProps.duration}
                  </div>
                </div>
              )}
            />
          </div>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

        @keyframes modalFadeIn { 
          from { opacity: 0; backdrop-filter: blur(0px); } 
          to { opacity: 1; backdrop-filter: blur(16px); } 
        }
        @keyframes modalSlideUp { 
          from { opacity: 0; transform: translateY(60px) scale(0.96); } 
          to { opacity: 1; transform: translateY(0) scale(1); } 
        }

        .fc-elite-theme {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .fc-elite-theme .fc {
          font-family: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif !important;
          flex: 1;
          --fc-border-color: #e2e8f0;
          --fc-button-text-color: #334155;
          --fc-button-bg-color: #ffffff;
          --fc-button-border-color: #cbd5e1;
          --fc-button-hover-bg-color: #f8fafc;
          --fc-button-hover-border-color: #94a3b8;
          --fc-button-active-bg-color: #0f172a;
          --fc-button-active-border-color: #0f172a;
          --fc-today-bg-color: rgba(14, 165, 233, 0.03);
          --fc-now-indicator-color: #0ea5e9;
        }

        /* TOOLBAR */
        .fc-elite-theme .fc-toolbar {
          padding: 24px 10px;
          margin-bottom: 0 !important;
        }

        .fc-elite-theme .fc-toolbar-title {
          font-size: 22px !important;
          font-weight: 800 !important;
          color: #0f172a !important;
          letter-spacing: -0.03em;
        }

        .fc-elite-theme .fc-button {
          font-size: 13px !important;
          font-weight: 700 !important;
          text-transform: capitalize !important;
          border-radius: 12px !important;
          padding: 10px 20px !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.02) !important;
        }

        .fc-elite-theme .fc-button-primary:not(:disabled).fc-button-active,
        .fc-elite-theme .fc-button-primary:not(:disabled):active {
          background: #0f172a !important;
          border-color: #0f172a !important;
          color: #ffffff !important;
          box-shadow: 0 8px 16px -4px rgba(15, 23, 42, 0.3) !important;
          transform: translateY(-1px);
        }

        /* HEADER CELLS */
        .fc-elite-theme .fc-col-header-cell {
          padding: 20px 0 !important;
          background: #f8fafc !important;
          border: none !important;
          border-bottom: 2px solid #e2e8f0 !important;
        }

        .fc-elite-theme .fc-col-header-cell-cushion {
          font-size: 14px !important;
          font-weight: 800 !important;
          color: #475569 !important;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* TIME LABELS */
        .fc-elite-theme .fc-timegrid-slot-label {
          font-size: 13px !important;
          color: #94a3b8 !important;
          font-weight: 700 !important;
          padding: 0 16px !important;
          border: none !important;
        }
        
        .fc-elite-theme .fc-timegrid-slot-label-cushion {
          transform: translateY(-10px);
        }

        /* EVENTS */
        .fc-elite-theme .fc-event {
          border-radius: 10px !important;
          border-width: 0 !important;
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25), inset 0 1px 0 rgba(255,255,255,0.2) !important;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          background: linear-gradient(135deg, #0ea5e9 0%, #4f46e5 100%) !important;
          cursor: pointer;
        }
        
        .fc-elite-theme .fc-event:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 12px 24px -4px rgba(14, 165, 233, 0.4), inset 0 1px 0 rgba(255,255,255,0.3) !important;
          z-index: 30 !important;
        }

        /* NON-BUSINESS HOURS */
        .fc-elite-theme .fc-non-business {
          background: #f1f5f9 !important;
          opacity: 0.6;
        }
        
        /* GRID BORDERS */
        .fc-elite-theme .fc-theme-standard td, .fc-elite-theme .fc-theme-standard th {
          border-color: #f1f5f9;
        }
        
        .fc-elite-theme .fc-theme-standard .fc-scrollgrid {
          border: none !important;
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01);
        }

        /* NOW INDICATOR */
        .fc-elite-theme .fc-timegrid-now-indicator-line { 
          border-width: 2px !important; 
          border-color: #0ea5e9 !important;
          box-shadow: 0 0 12px rgba(14, 165, 233, 0.5);
        }
        .fc-elite-theme .fc-timegrid-now-indicator-arrow { 
          border-width: 6px !important;
          border-color: transparent transparent transparent #0ea5e9 !important;
        }
      `}</style>
    </>
  );
}

function StatChip({ icon, label, bg, color, borderColor }: { icon: React.ReactNode; label: string; bg: string; color: string; borderColor: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "8px 20px", background: bg, border: `1px solid ${borderColor}`,
      borderRadius: "9999px", color: color, 
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "default",
      boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 16px -4px ${borderColor}`;
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLDivElement).style.transform = "none";
      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 4px rgba(0,0,0,0.02)";
    }}
    >
      {icon}
      <span style={{ fontSize: "14px", fontWeight: "700", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.01em" }}>{label}</span>
    </div>
  );
}

