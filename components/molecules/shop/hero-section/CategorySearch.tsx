"use client";

import { Search, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import instructorsService from "@/services/instructors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CategorySearch = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await instructorsService.getFilterOptions();
        if (response.categories) {
          setCategories(response.categories.map((c: any) => c.name));
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== "All Categories") {
      params.set("category", selectedCategory);
    }
    if (searchValue.trim()) {
      params.set("search", searchValue.trim());
    }

    router.push(`/instructors?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center bg-white dark:bg-card rounded-full border border-foreground/10 p-2 w-full max-w-3xl shadow-2xl relative z-50">
      {/* Category Toggle */}
      <div className="hidden sm:block">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px] rounded-full h-12 bg-transparent border-0 focus:ring-0 focus:ring-offset-0 font-semibold px-6 hover:bg-foreground/5 cursor-pointer">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 flex-shrink-0" />
              <SelectValue placeholder="Category" />
            </div>
          </SelectTrigger>
          <SelectContent position="popper" className="rounded-2xl border-border/50 shadow-xl min-w-[200px] mt-2">
            <SelectItem
              value="All Categories"
              className="cursor-pointer font-medium h-10 rounded-xl"
            >
              All Categories
            </SelectItem>
            {categories.map((cat) => (
              <SelectItem
                key={cat}
                value={cat}
                className="cursor-pointer font-medium h-10 rounded-xl"
              >
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="hidden sm:block w-[1px] h-8 bg-foreground/10 mx-2" />

      {/* Search Input */}
      <div className="flex-1 relative w-full sm:w-auto">
        <Input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search Instructors..."
          className="h-14 sm:h-12 border-0 bg-transparent text-foreground placeholder:text-foreground/60 focus-visible:ring-0 px-6 sm:px-4 text-base"
        />
      </div>

      {/* Search Button */}
      <Button
        onClick={handleSearch}
        className="w-full sm:w-auto h-14 sm:h-12 px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/25 transition-all"
      >
        <Search className="w-5 h-5 mr-2" />
        <span>Search</span>
      </Button>
    </div>
  );
};

export default CategorySearch;
