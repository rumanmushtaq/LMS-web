"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarClock, BookOpen, Loader2, CheckCircle2 } from "lucide-react";
import { requestClass } from "@/services/classes";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RequestClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorId: string;
  tutorName: string;
}

export default function RequestClassModal({
  isOpen,
  onClose,
  tutorId,
  tutorName,
}: RequestClassModalProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.startTime || !form.endTime) {
      toast.error("Please fill in both start and end times.");
      return;
    }
    if (new Date(form.endTime) <= new Date(form.startTime)) {
      toast.error("End time must be after start time.");
      return;
    }

    setIsSubmitting(true);
    try {
      await requestClass({
        tutorId,
        title: form.title,
        description: form.description,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
      });
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setForm({ title: "", description: "", startTime: "", endTime: "" });
      }, 2000);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to send class request."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-border bg-muted/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-lg bg-card border border-border/60 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header gradient */}
              <div
                className="relative px-6 py-5 flex items-start gap-4"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.35 0.08 275) 0%, oklch(0.45 0.22 300) 100%)",
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shrink-0">
                  <CalendarClock className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-white">
                    Request a Class
                  </h2>
                  <p className="text-white/70 text-sm mt-0.5">
                    with{" "}
                    <span className="font-semibold text-white">{tutorName}</span>
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center gap-3 py-8"
                  >
                    <CheckCircle2 className="w-14 h-14 text-green-500" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Request Sent!
                    </h3>
                    <p className="text-sm text-muted-foreground text-center">
                      {tutorName} will review your request and get back to you.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Class Title */}
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                        Class Title
                      </label>
                      <div className="relative">
                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          id="request-class-title"
                          type="text"
                          name="title"
                          value={form.title}
                          onChange={handleChange}
                          required
                          placeholder="e.g. Introduction to Calculus"
                          className={cn(inputClass, "pl-9")}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                        What do you want to learn?
                      </label>
                      <textarea
                        id="request-class-description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        rows={3}
                        placeholder="Describe the topics you'd like to cover in this session..."
                        className={cn(inputClass, "resize-none")}
                      />
                    </div>

                    {/* Date/Time row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                          Start Time
                        </label>
                        <input
                          id="request-class-start"
                          type="datetime-local"
                          name="startTime"
                          value={form.startTime}
                          onChange={handleChange}
                          required
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                          End Time
                        </label>
                        <input
                          id="request-class-end"
                          type="datetime-local"
                          name="endTime"
                          value={form.endTime}
                          onChange={handleChange}
                          required
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        id="request-class-submit"
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60 transition-all hover:scale-[1.02] active:scale-95"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.7 0.15 210), oklch(0.45 0.22 300))",
                        }}
                      >
                        {isSubmitting ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : null}
                        {isSubmitting ? "Sending…" : "Send Request"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
