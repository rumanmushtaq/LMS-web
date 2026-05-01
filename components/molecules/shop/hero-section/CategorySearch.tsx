"use client";

import { Search, ChevronDown, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CategorySearch = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center bg-card/10 backdrop-blur-xl rounded-full border border-foreground/10 p-2 w-full max-w-3xl shadow-2xl">
      {/* Category Toggle (Simple for now) */}
      <Button
        variant="ghost"
        className="hidden sm:flex items-center gap-2 rounded-full h-12 px-6 text-foreground hover:bg-foreground/5 border-0"
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="font-semibold">Category</span>
        <ChevronDown className="w-4 h-4 opacity-70" />
      </Button>

      <div className="hidden sm:block w-[1px] h-8 bg-foreground/10 mx-2" />

      {/* Search Input */}
      <div className="flex-1 relative w-full sm:w-auto">
        <Input
          type="text"
          placeholder="Search Courses, Instructors"
          className="h-14 sm:h-12 border-0 bg-transparent text-foreground placeholder:text-foreground/60 focus-visible:ring-0 px-6 sm:px-4 text-base"
        />
      </div>

      {/* Search Button */}
      <Button className="w-full sm:w-auto h-14 sm:h-12 px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/25 transition-all">
        <Search className="w-5 h-5 mr-2" />
        <span>Search</span>
      </Button>
    </div>
  );
};

export default CategorySearch;
