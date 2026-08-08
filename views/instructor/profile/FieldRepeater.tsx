"use client";

import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RepeaterColumn {
  /** Key on each row object. */
  key: string;
  label: string;
  type?: "text" | "time";
  placeholder?: string;
  /** Renders a <select> instead of an input. */
  options?: string[];
  /** Tailwind width class for the column, e.g. "md:w-40". */
  className?: string;
}

interface FieldRepeaterProps<Row extends Record<string, string>> {
  title: string;
  description?: string;
  rows: Row[];
  columns: RepeaterColumn[];
  /** A fresh, empty row — used when "Add" is pressed. */
  blankRow: Row;
  onChange: (rows: Row[]) => void;
  addLabel?: string;
  emptyLabel?: string;
}

/**
 * Editor for a list of uniform records — availability slots, education,
 * work history.
 *
 * These three fields are rendered on the tutor profile but had no way to be
 * edited: they are arrays of objects, so a plain text input cannot express
 * them.
 */
export function FieldRepeater<Row extends Record<string, string>>({
  title,
  description,
  rows,
  columns,
  blankRow,
  onChange,
  addLabel = "Add row",
  emptyLabel = "Nothing added yet.",
}: FieldRepeaterProps<Row>) {
  const updateCell = (index: number, key: string, value: string) => {
    onChange(rows.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  };

  const removeRow = (index: number) => {
    onChange(rows.filter((_, i) => i !== index));
  };

  const addRow = () => {
    onChange([...rows, { ...blankRow }]);
  };

  const inputClass =
    "w-full h-12 px-4 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

  return (
    <div className="md:col-span-2 space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-foreground">{title}</h4>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-1.5 shrink-0 px-4 py-2 rounded-xl border border-border bg-background hover:bg-muted text-xs font-bold text-foreground transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          {addLabel}
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground italic px-1">{emptyLabel}</p>
      ) : (
        <div className="space-y-3">
          {rows.map((row, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row md:items-end gap-3 p-4 rounded-2xl border border-border/60 bg-background/40"
            >
              {columns.map((column) => (
                <div
                  key={column.key}
                  className={cn("flex-1 space-y-1.5 min-w-0", column.className)}
                >
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 ml-1">
                    {column.label}
                  </label>

                  {column.options ? (
                    <select
                      value={row[column.key] ?? ""}
                      onChange={(e) => updateCell(index, column.key, e.target.value)}
                      className={cn(inputClass, "appearance-none")}
                    >
                      <option value="">Select…</option>
                      {column.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={column.type === "time" ? "time" : "text"}
                      value={row[column.key] ?? ""}
                      onChange={(e) => updateCell(index, column.key, e.target.value)}
                      placeholder={column.placeholder}
                      className={inputClass}
                    />
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => removeRow(index)}
                aria-label={`Remove ${title} row ${index + 1}`}
                className="h-12 w-12 shrink-0 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5 transition-all"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FieldRepeater;
