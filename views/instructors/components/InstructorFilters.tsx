"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react";
import { FilterOptionsResponse } from "@/services/instructors";
import { cn } from "@/lib/utils";

interface InstructorFiltersProps {
  filterOptions: FilterOptionsResponse | null;
  selectedCategories: string[];
  selectedInstructors: string[];
  selectedLevels: string[];
  priceRange: [number, number];
  maxPrice: number;
  onCategoryChange: (category: string) => void;
  onInstructorChange: (id: string) => void;
  onLevelChange: (level: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onClear: () => void;
}

const INITIAL_SHOW = 4;

const CollapsibleSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-border/50 pb-5 mb-5 last:mb-0 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between font-semibold text-[15px] text-foreground mb-3 hover:text-primary transition-colors"
      >
        {title}
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {open && children}
    </div>
  );
};

export default function InstructorFilters({
  filterOptions,
  selectedCategories,
  selectedInstructors,
  selectedLevels,
  priceRange,
  maxPrice,
  onCategoryChange,
  onInstructorChange,
  onLevelChange,
  onPriceChange,
  onClear,
}: InstructorFiltersProps) {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllInstructors, setShowAllInstructors] = useState(false);

  const categories = filterOptions?.categories ?? [];
  const instructors = filterOptions?.instructors ?? [];
  const levels = filterOptions?.levels ?? [];

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, INITIAL_SHOW);
  const visibleInstructors = showAllInstructors
    ? instructors
    : instructors.slice(0, INITIAL_SHOW);

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedInstructors.length > 0 ||
    selectedLevels.length > 0;

  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-foreground" />
          <h2 className="text-xl font-bold text-foreground">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-sm text-[#FF4667] hover:text-[#E63E5C] font-medium transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Categories */}
      <CollapsibleSection title="Categories">
        <ul className="space-y-2.5">
          {visibleCategories.map((cat) => (
            <li key={cat.name} className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id={`cat-${cat.name}`}
                checked={selectedCategories.includes(cat.name)}
                onChange={() => onCategoryChange(cat.name)}
                className="h-4 w-4 rounded border-border accent-[#FF4667] cursor-pointer"
              />
              <label
                htmlFor={`cat-${cat.name}`}
                className="text-[14px] text-foreground/80 cursor-pointer hover:text-foreground transition-colors flex-1"
              >
                {cat.name}{" "}
                <span className="text-muted-foreground">({cat.count})</span>
              </label>
            </li>
          ))}
        </ul>
        {categories.length > INITIAL_SHOW && (
          <button
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="mt-3 text-[13px] font-semibold text-[#FF4667] hover:text-[#E63E5C] transition-colors"
          >
            {showAllCategories ? "See Less" : "See More"}
          </button>
        )}
      </CollapsibleSection>

      {/* Instructors */}
      <CollapsibleSection title="Instructors">
        <ul className="space-y-2.5">
          {visibleInstructors.map((inst) => (
            <li key={inst._id} className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id={`inst-${inst._id}`}
                checked={selectedInstructors.includes(inst._id)}
                onChange={() => onInstructorChange(inst._id)}
                className="h-4 w-4 rounded border-border accent-[#FF4667] cursor-pointer"
              />
              <label
                htmlFor={`inst-${inst._id}`}
                className="text-[14px] text-foreground/80 cursor-pointer hover:text-foreground transition-colors flex-1"
              >
                {inst.fullName}{" "}
                {inst.count > 0 && (
                  <span className="text-muted-foreground">({inst.count})</span>
                )}
              </label>
            </li>
          ))}
        </ul>
        {instructors.length > INITIAL_SHOW && (
          <button
            onClick={() => setShowAllInstructors(!showAllInstructors)}
            className="mt-3 text-[13px] font-semibold text-[#FF4667] hover:text-[#E63E5C] transition-colors"
          >
            {showAllInstructors ? "See Less" : "See More"}
          </button>
        )}
      </CollapsibleSection>

      {/* Price Range */}
      <CollapsibleSection title="Price Range">
        <div className="px-1">
          <div className="mb-3 flex items-center justify-between text-[13px] text-muted-foreground">
            <span>${priceRange[0].toLocaleString()}</span>
            <span>${priceRange[1].toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={0}
            max={maxPrice || 100000}
            step={100}
            value={priceRange[1]}
            onChange={(e) =>
              onPriceChange([priceRange[0], Number(e.target.value)])
            }
            className={cn(
              "w-full h-1.5 rounded-full appearance-none cursor-pointer",
              "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4",
              "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FF4667]",
              "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white",
              "[&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer",
              "bg-gradient-to-r from-[#FF4667] to-border",
            )}
          />
        </div>
      </CollapsibleSection>

      {/* Level */}
      <CollapsibleSection title="Level">
        <ul className="space-y-2.5">
          {(levels.length > 0
            ? levels
            : [
                { name: "beginner", count: 0 },
                { name: "intermediate", count: 0 },
                { name: "advanced", count: 0 },
                { name: "expert", count: 0 },
              ]
          ).map((lv) => (
            <li key={lv.name} className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id={`lv-${lv.name}`}
                checked={selectedLevels.includes(lv.name)}
                onChange={() => onLevelChange(lv.name)}
                className="h-4 w-4 rounded border-border accent-[#FF4667] cursor-pointer"
              />
              <label
                htmlFor={`lv-${lv.name}`}
                className="text-[14px] text-foreground/80 cursor-pointer hover:text-foreground transition-colors capitalize flex-1"
              >
                {lv.name}{" "}
                {lv.count > 0 && (
                  <span className="text-muted-foreground">({lv.count})</span>
                )}
              </label>
            </li>
          ))}
        </ul>
      </CollapsibleSection>
    </aside>
  );
}
