"use client";

/**
 * Loader — full-screen warm veil that fades out once the scene's first frame
 * has committed (`ready` in the UI store).
 */
import { useUIStore } from "@/lib/store";

export function Loader() {
  const ready = useUIStore((s) => s.ready);
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-[#f4e3c8] transition-opacity duration-1000 ${
        ready ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-4 text-[#7a5a2e]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#7a5a2e] border-t-transparent" />
        <p className="text-sm tracking-[0.3em] uppercase">Preparing flight…</p>
      </div>
    </div>
  );
}
