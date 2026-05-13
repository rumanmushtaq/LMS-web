"use client";

import { useState, useEffect } from "react";
import { Loader2, Calendar as CalendarIcon, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import InstructorLayout from "../InstructorLayout";
import instructorsService, { MyStudent } from "@/services/instructors";

export default function StudentsGridPage() {
  const [students, setStudents] = useState<MyStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    instructorsService
      .getMyStudents()
      .then((res) => setStudents(res.data))
      .catch((err) => setError("Failed to load students."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-r from-rose-50 via-white to-blue-50 dark:from-rose-950/20 dark:via-background dark:to-blue-950/20 border-b border-border/50">
        <div className="container mx-auto px-6 py-10 text-center relative">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
            Students Grid
          </h1>
          <nav className="flex items-center justify-center gap-2 text-[14px] text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span className="h-1 w-2 bg-[var(--primary)] rounded-full mx-1"></span>
            <span className="text-foreground font-medium">Students Grid</span>
          </nav>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary)] py-8 rounded-b-[40px] px-8 relative overflow-hidden mb-8">
         <div className="absolute top-0 right-0 h-full w-1/2 opacity-20 pointer-events-none">
           <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
             <circle cx="200" cy="200" r="150" fill="currentColor" />
           </svg>
         </div>
         <div className="flex flex-col md:flex-row items-center justify-between z-10 relative">
           <div className="flex items-center gap-6">
             <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white">
                <Image src="/images/avatar-02.jpg" alt="user" width={96} height={96} />
             </div>
             <div>
               <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">Eugene Andre <span className="text-white/80">✏️</span></h2>
               <p className="text-white/80">Instructor</p>
             </div>
           </div>
           <div className="flex gap-4 mt-6 md:mt-0">
             <button className="bg-white text-[var(--primary)] font-semibold px-6 py-2.5 rounded-full hover:bg-white/90">Add New Course</button>
             <button className="bg-[var(--primary)] text-white font-semibold px-6 py-2.5 rounded-full hover:bg-[var(--primary)]/90">Student Dashboard</button>
           </div>
         </div>
      </section>

      <InstructorLayout>
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-foreground">Students</h2>
          <div className="flex items-center gap-3">
             <div className="flex bg-muted rounded-lg p-1">
               <button className="p-2 bg-white rounded shadow-sm text-foreground"><LayoutGridIcon className="w-4 h-4" /></button>
               <button className="p-2 text-muted-foreground"><ListIcon className="w-4 h-4" /></button>
             </div>
             <div className="relative">
               <input type="text" placeholder="Search" className="border border-border/50 rounded-lg pl-10 pr-4 py-2 w-[240px] bg-card text-sm focus:outline-none focus:ring-2 ring-[var(--primary)]/50" />
               <SearchIcon className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
             </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[300px] bg-card rounded-2xl border border-border/60">
            <Loader2 className="h-10 w-10 animate-spin text-[var(--primary)]" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[300px] text-destructive">
            {error}
          </div>
        ) : students.length === 0 ? (
          <div className="flex items-center justify-center min-h-[300px] text-muted-foreground">
            No students found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student, idx) => (
              <div key={student._id || idx} className="bg-card border border-border/60 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-muted relative">
                  {student.avatar ? (
                    <Image src={student.avatar} alt={student.fullName} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center">No Image</div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg text-foreground">{student.fullName}</h3>
                    <button className="text-muted-foreground hover:text-foreground"><MessageSquareIcon className="w-4 h-4" /></button>
                  </div>
                  <div className="flex items-center text-sm text-[var(--primary)] mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{student.location || "Unknown"}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                     <div className="flex items-center text-sm text-muted-foreground">
                       <CalendarIcon className="w-4 h-4 mr-2 text-[var(--primary)]" />
                       {new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(student.joinDate))}
                     </div>
                     <div className="flex items-center text-sm font-medium text-foreground">
                       <BookIcon className="w-4 h-4 mr-2 text-[var(--primary)]" /> {student.courseCount} Courses
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </InstructorLayout>
    </>
  );
}

// Inline icons that weren't imported
function LayoutGridIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>; }
function ListIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>; }
function SearchIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>; }
function MessageSquareIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function BookIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-0-5H20"/></svg>; }
