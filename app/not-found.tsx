import Link from "next/link";
import Image from "next/image";
import { Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-card shadow-xl md:grid-cols-2">
        {/* Left: message */}
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <Image
            src="/images/logo-image.png"
            alt="Varona Academy"
            width={150}
            height={60}
            className="h-12 w-auto object-contain mb-6"
            priority
          />

          <p className="text-sm font-black uppercase tracking-[0.3em] text-primary">
            Error 404
          </p>
          <h1 className="mt-2 text-4xl font-black leading-tight tracking-tight text-foreground">
            Page not found
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            The page you&apos;re looking for might have been removed, had its
            name changed, or is temporarily unavailable.
          </p>

          <div className="mt-8">
            <Link href="/">
              <button className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:-translate-y-0.5 active:scale-95">
                <Home className="h-4 w-4" />
                Back to Homepage
              </button>
            </Link>
          </div>
        </div>

        {/* Right: brand panel */}
        <div className="relative hidden items-center justify-center overflow-hidden bg-gradient-to-br from-[#7520C8] via-[#8b1fb8] to-[#4a1878] p-12 md:flex">
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#b026a9]/40 blur-3xl" />
          <div className="absolute -bottom-20 -right-12 h-72 w-72 rounded-full bg-[#ffd36b]/20 blur-3xl" />

          <div className="relative z-10 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 ring-1 ring-white/20 backdrop-blur-md">
              <Compass className="h-12 w-12 text-white" strokeWidth={1.5} />
            </div>
            <p className="text-7xl font-black tracking-tight text-white drop-shadow">
              404
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.3em] text-white/70">
              Lost in space
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
