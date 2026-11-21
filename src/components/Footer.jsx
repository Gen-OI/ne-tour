import React from "react";

export default function Footer({ onOpenAdmin }) {
  return (
    <footer className="bg-[#1b4332] text-[#fdfbf7] py-12 border-t border-[#0f291e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">⛰</span>
            <span className="font-extrabold text-base tracking-tight text-[#fdfbf7]">
              Offbeat Northeast
            </span>
          </div>
          <p className="text-xs text-[#d8f3dc]/70 mt-1">
            A simple, community-powered hidden-place discovery platform.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-[#d8f3dc]">
          <a href="#explore" className="hover:text-white transition-colors">
            Explore Places
          </a>
          <a href="#share" className="hover:text-white transition-colors">
            Share a Place
          </a>
          <button
            type="button"
            onClick={onOpenAdmin}
            className="hover:text-white transition-colors underline"
          >
            Moderator (admin123)
          </button>
        </div>

        <p className="text-[11px] text-[#d8f3dc]/50 text-center sm:text-right">
          Respect local customs &bull; Carry out your trash &bull; Support village hosts
        </p>
      </div>
    </footer>
  );
}
