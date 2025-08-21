// components/Loader.tsx
"use client";

import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="flex flex-col items-center gap-4">
        {/* Shadcn-style spinner using lucide icon */}
        <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
        <p className="text-white text-lg font-medium animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
