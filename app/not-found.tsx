import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-xl w-full relative aspect-[4/3] mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://static.vecteezy.com/system/resources/previews/001/857/111/non_2x/error-404-page-not-found-landing-page-concept-for-mobile-and-pc-free-vector.jpg"
          alt="404 Not Found"
          className="object-contain w-full h-full drop-shadow-2xl hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
        Oops! Page Not Found
      </h1>
      
      <p className="text-muted-foreground text-lg max-w-md mb-10">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <Link href="/">
        <button className="bg-primary text-primary-foreground px-8 py-3.5 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2">
          Back to Homepage
        </button>
      </Link>
    </div>
  );
}
