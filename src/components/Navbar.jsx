import React from "react";

export default function Navbar({ onOpenAdmin, pendingCount = 0 }) {
  return (
    <header className="sticky top-0 z-40 bg-[#fdfbf7]/90 backdrop-blur-md border-b border-[#ede8dc] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand */}
        <a href="#top" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-[#1b4332] text-[#fdfbf7] flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-[#2d6a4f] transition-colors">
            ⛰
          </div>
          <div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#1b4332] block leading-none">
              Offbeat Northeast
            </span>
            <span className="text-[11px] font-medium text-[#40916c] uppercase tracking-wider block mt-1">
              Community Discovery
            </span>
          </div>
        </a>

        {/* Links */}
        <nav className="flex items-center gap-3 sm:gap-6 text-sm font-semibold text-[#1b4332]">
          <a
            href="#explore"
            className="hover:text-[#2d6a4f] transition-colors py-1 hidden sm:inline-block"
          >
            Explore Places
          </a>
          <a
            href="#share"
            className="px-4 py-2 rounded-full bg-[#1b4332] text-[#fdfbf7] hover:bg-[#2d6a4f] transition-all shadow-sm flex items-center gap-1.5 text-xs sm:text-sm font-medium"
          >
            <span>+</span>
            <span>Share a Place</span>
          </a>

          {/* Admin link */}
          <button
            type="button"
            onClick={onOpenAdmin}
            className="relative p-2 text-[#40916c] hover:text-[#1b4332] transition-colors text-xs flex items-center gap-1 border border-[#dfd8c5] rounded-full hover:bg-[#f7f4ed]"
            title="Moderator Review"
          >
            <span className="text-xs">🔒</span>
            <span className="hidden md:inline text-[11px] font-medium">Review</span>
            {pendingCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] flex items-center justify-center font-bold">
                {pendingCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
