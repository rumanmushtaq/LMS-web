"use client";

import { LayoutGrid, List, Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface InstructorToolbarProps {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  viewMode: "list" | "grid";
  sortBy: string;
  search: string;
  onViewChange: (mode: "list" | "grid") => void;
  onSortChange: (sort: string) => void;
  onSearchChange: (val: string) => void;
}

const SORT_OPTIONS = [
  { label: "Newly Published", value: "newlyPublished" },
  { label: "Top Rated", value: "rating" },
  { label: "Most Students", value: "students" },
  { label: "Name (A-Z)", value: "nameAsc" },
  { label: "Name (Z-A)", value: "nameDesc" },
];

export default function InstructorToolbar({
  totalCount,
  currentPage,
  pageSize,
  viewMode,
  sortBy,
  search,
  onViewChange,
  onSortChange,
  onSearchChange,
}: InstructorToolbarProps) {
  const start = Math.min((currentPage - 1) * pageSize + 1, totalCount);
  const end = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Results count */}
      <p className="flex-1 text-[14px] text-muted-foreground whitespace-nowrap">
        {totalCount > 0 ? (
          <>
            Showing{" "}
            <span className="font-semibold text-foreground">
              {start}-{end}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">{totalCount}</span>{" "}
            results
          </>
        ) : (
          "No results found"
        )}
      </p>

      {/* View toggle */}
      <div className="flex items-center gap-1 rounded-lg border border-border p-1 bg-background">
        <button
          onClick={() => onViewChange("grid")}
          aria-label="Grid view"
          className={cn(
            "p-1.5 rounded-md transition-all",
            viewMode === "grid"
              ? "bg-[var(--primary)] text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <LayoutGrid className="h-4 w-4" />
        </button>
        <button
          onClick={() => onViewChange("list")}
          aria-label="List view"
          className={cn(
            "p-1.5 rounded-md transition-all",
            viewMode === "list"
              ? "bg-[var(--primary)] text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <List className="h-4 w-4" />
        </button>
      </div>

      {/* Sort dropdown */}
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="appearance-none h-9 pl-3 pr-8 rounded-lg border border-border bg-background text-[14px] text-foreground font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-colors"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 w-48 pl-9 pr-3 rounded-lg border border-border bg-background text-[14px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-colors"
        />
      </div>
    </div>
  );
}
