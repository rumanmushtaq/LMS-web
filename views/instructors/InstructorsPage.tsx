"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Home, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import instructorsService, {
  FilterOptionsResponse,
  InstructorProfile,
} from "@/services/instructors";
import InstructorFilters from "./components/InstructorFilters";
import InstructorToolbar from "./components/InstructorToolbar";
import InstructorListCard from "./components/InstructorListCard";
import InstructorGridCard from "./components/InstructorGridCard";
import InstructorPagination from "./components/InstructorPagination";

type ViewMode = "list" | "grid";

const PAGE_SIZE = 9;

export default function InstructorsPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category");

  // Data state
  const [instructors, setInstructors] = useState<InstructorProfile[]>([]);
  const [filterOptions, setFilterOptions] =
    useState<FilterOptionsResponse | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState("newlyPublished");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : [],
  );
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);

  // Debounce search
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  // Sync state with URL params
  useEffect(() => {
    const s = searchParams.get("search") || "";
    const c = searchParams.get("category");

    setSearch(s);
    setDebouncedSearch(s);
    if (c) {
      setSelectedCategories([c]);
    } else {
      setSelectedCategories([]);
    }
    setCurrentPage(1);
  }, [searchParams]);

  // Load filter options once
  useEffect(() => {
    instructorsService
      .getFilterOptions()
      .then((opts) => {
        setFilterOptions(opts);
        setPriceRange([opts.priceRange.min, opts.priceRange.max]);
      })
      .catch(console.error);
  }, []);

  // Debounce search input
  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(val);
      setCurrentPage(1);
    }, 400);
  };

  // Fetch instructors whenever filters change
  const fetchInstructors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await instructorsService.getInstructors({
        page: currentPage,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        category:
          selectedCategories.length === 1 ? selectedCategories[0] : undefined,
        level: selectedLevels.length === 1 ? selectedLevels[0] : undefined,
        instructorIds:
          selectedInstructors.length > 0 ? selectedInstructors : undefined,
        priceMax:
          priceRange[1] !== filterOptions?.priceRange.max
            ? priceRange[1]
            : undefined,
        priceMin:
          priceRange[0] !== filterOptions?.priceRange.min
            ? priceRange[0]
            : undefined,
        sortBy,
      });
      setInstructors(res.data ?? []);
      setTotalCount(res.totalCount ?? 0);
      setTotalPages(res.totalPages ?? 1);
    } catch {
      setError("Failed to load instructors. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    debouncedSearch,
    selectedCategories,
    selectedInstructors,
    selectedLevels,
    priceRange,
    sortBy,
    filterOptions,
  ]);

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  // Filter handlers
  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
    setCurrentPage(1);
  };

  const toggleInstructor = (id: string) => {
    setSelectedInstructors((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
    setCurrentPage(1);
  };

  const toggleLevel = (lv: string) => {
    setSelectedLevels((prev) =>
      prev.includes(lv) ? prev.filter((l) => l !== lv) : [...prev, lv],
    );
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSelectedCategories([]);
    setSelectedInstructors([]);
    setSelectedLevels([]);
    setPriceRange([
      filterOptions?.priceRange.min ?? 0,
      filterOptions?.priceRange.max ?? 100000,
    ]);
    setSearch("");
    setDebouncedSearch("");
    setCurrentPage(1);
    setSortBy("newlyPublished");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-rose-50 via-white to-blue-50 dark:from-rose-950/20 dark:via-background dark:to-blue-950/20 border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,70,103,0.08),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(99,102,241,0.06),_transparent_60%)]" />
        <div className="container mx-auto px-6 py-14 text-center relative">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight mb-3">
            Instructor List
          </h1>
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-[14px] text-muted-foreground">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-[var(--primary)]" />
            <span className="text-foreground font-medium">Instructor List</span>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-10">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
            <div className="sticky top-24 rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
              <InstructorFilters
                filterOptions={filterOptions}
                selectedCategories={selectedCategories}
                selectedInstructors={selectedInstructors}
                selectedLevels={selectedLevels}
                priceRange={priceRange}
                maxPrice={filterOptions?.priceRange.max ?? 100000}
                onCategoryChange={toggleCategory}
                onInstructorChange={toggleInstructor}
                onLevelChange={toggleLevel}
                onPriceChange={(r) => {
                  setPriceRange(r);
                  setCurrentPage(1);
                }}
                onClear={handleClear}
              />
            </div>
          </aside>

          {/* Content Area */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <InstructorToolbar
              totalCount={totalCount}
              currentPage={currentPage}
              pageSize={PAGE_SIZE}
              viewMode={viewMode}
              sortBy={sortBy}
              search={search}
              onViewChange={setViewMode}
              onSortChange={(s) => {
                setSortBy(s);
                setCurrentPage(1);
              }}
              onSearchChange={handleSearchChange}
            />

            {/* Content: loading / error / empty / list */}
            {loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-10 w-10 animate-spin text-[var(--primary)]" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <p className="text-destructive font-medium">{error}</p>
                <button
                  onClick={fetchInstructors}
                  className="px-5 py-2 rounded-full bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary)] transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : instructors.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <div className="text-5xl">🔍</div>
                <p className="text-xl font-semibold text-foreground">
                  No instructors found
                </p>
                <p className="text-muted-foreground text-sm">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={handleClear}
                  className="mt-2 px-6 py-2 rounded-full bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary)] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : viewMode === "list" ? (
              <div className="flex flex-col gap-4">
                {instructors.map((instructor) => (
                  <InstructorListCard
                    key={instructor._id}
                    instructor={instructor}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {instructors.map((instructor) => (
                  <InstructorGridCard
                    key={instructor._id}
                    instructor={instructor}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && instructors.length > 0 && (
              <div className="mt-8">
                <InstructorPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(p) => {
                    setCurrentPage(p);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
