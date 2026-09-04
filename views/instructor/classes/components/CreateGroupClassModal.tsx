"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Users,
  BookOpen,
  Loader2,
  Copy,
  Check,
  Link2,
} from "lucide-react";
import { createGroupClass } from "@/services/classes";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CreateGroupClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called once a class has been created, so the list can refresh. */
  onCreated: () => void;
}

const emptyForm = {
  title: "",
  description: "",
  startTime: "",
  endTime: "",
  maxStudents: "10",
  price: "",
};

export default function CreateGroupClassModal({
  isOpen,
  onClose,
  onCreated,
}: CreateGroupClassModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  /**
   * The link is the point of the whole form: the tutor pastes it to students
   * in chat. So the modal does not close on success — it swaps to showing the
   * link until they have copied it.
   */
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const reset = () => {
    setForm(emptyForm);
    setInviteLink(null);
    setCopied(false);
  };

  const handleClose = () => {
    onClose();
    // Let the exit animation finish before wiping the contents.
    setTimeout(reset, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (new Date(form.endTime) <= new Date(form.startTime)) {
      toast.error("End time must be after start time.");
      return;
    }
    const seats = Number(form.maxStudents);
    if (!Number.isInteger(seats) || seats < 1) {
      toast.error("A group class needs at least one seat.");
      return;
    }
    const price = Number(form.price);
    // A zero price cannot be charged, so no student could ever buy a seat —
    // the class would be created but permanently unjoinable.
    if (!(price > 0)) {
      toast.error("Set a seat price above zero, or students cannot join.");
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createGroupClass({
        title: form.title,
        description: form.description,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
        maxStudents: seats,
        price,
      });
      const cls = created?.data ?? created;
      setInviteLink(`${window.location.origin}/classes/join/${cls.inviteToken}`);
      onCreated();
      toast.success("Group class created — now share the link.");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to create the group class.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyLink = async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be denied; the link is on screen to copy by hand.
      toast.error("Could not copy — select the link and copy it manually.");
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-border bg-muted/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all";
  const labelClass =
    "text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-lg bg-card border border-border/60 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="relative px-6 py-5 flex items-start gap-4"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.35 0.08 275) 0%, oklch(0.45 0.22 300) 100%)",
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shrink-0">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-white">
                    {inviteLink ? "Share your class" : "Create a Group Class"}
                  </h2>
                  <p className="text-white/70 text-sm mt-0.5">
                    {inviteLink
                      ? "Send this link to the students you want in the class"
                      : "Students join by paying for a seat"}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  aria-label="Close"
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6">
                {inviteLink ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-green-500/10 mx-auto">
                      <Link2 className="w-7 h-7 text-green-500" />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Anyone with this link can pay for a seat while seats
                      remain. Paste it to a student in chat.
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        readOnly
                        value={inviteLink}
                        onFocus={(e) => e.currentTarget.select()}
                        className={cn(inputClass, "font-mono text-xs")}
                      />
                      <button
                        type="button"
                        onClick={copyLink}
                        className="shrink-0 px-3 py-2.5 rounded-xl border border-border hover:bg-muted transition-colors"
                        aria-label="Copy invite link"
                      >
                        {copied ? (
                          <Check size={16} className="text-green-500" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.7 0.15 210), oklch(0.45 0.22 300))",
                      }}
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                      <label className={labelClass}>Class Title</label>
                      <div className="relative">
                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          name="title"
                          value={form.title}
                          onChange={handleChange}
                          required
                          placeholder="e.g. Trigonometry Intensive"
                          className={cn(inputClass, "pl-9")}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>What will you cover?</label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        rows={3}
                        placeholder="Describe the topics this group session covers..."
                        className={cn(inputClass, "resize-none")}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Start Time</label>
                        <input
                          type="datetime-local"
                          name="startTime"
                          value={form.startTime}
                          onChange={handleChange}
                          required
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>End Time</label>
                        <input
                          type="datetime-local"
                          name="endTime"
                          value={form.endTime}
                          onChange={handleChange}
                          required
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Seats</label>
                        <input
                          type="number"
                          name="maxStudents"
                          min={1}
                          step={1}
                          value={form.maxStudents}
                          onChange={handleChange}
                          required
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Price per seat</label>
                        <input
                          type="number"
                          name="price"
                          min={0.01}
                          step="0.01"
                          value={form.price}
                          onChange={handleChange}
                          required
                          placeholder="500"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
                      >
                        Cancel
                      </button>
                      <button
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
                        {isSubmitting ? "Creating…" : "Create Class"}
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
