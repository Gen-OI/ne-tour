import React from "react";

export default function Hero({ totalPlaces = 0 }) {
  return (
    <section className="relative overflow-hidden bg-[#1b4332] text-[#fdfbf7] py-20 sm:py-28 lg:py-32">
      {/* Background Photography with atmospheric overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80"
          alt="Northeast India pristine mountain landscape"
          className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f291e] via-[#1b4332]/85 to-[#1b4332]/90" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fdfbf7]/10 border border-[#fdfbf7]/20 backdrop-blur-xs text-xs font-medium text-[#d8f3dc]">
          <span className="w-2 h-2 rounded-full bg-[#52b788] animate-pulse" />
          <span>Curated by indigenous locals &bull; {totalPlaces} places uncovered</span>
        </div>

        {/* Required Headings */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#fdfbf7] leading-[1.15]">
            Discover the Northeast Beyond the Ordinary.
          </h1>
          <p className="text-base sm:text-xl font-normal text-[#d8f3dc] max-w-2xl mx-auto leading-relaxed">
            Hidden places, shared by the people who know them best.
          </p>
        </div>

        {/* Required Main Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href="#explore"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#fdfbf7] text-[#1b4332] hover:bg-[#ede8dc] font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>🧭 Explore Hidden Places</span>
          </a>
          <a
            href="#share"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-transparent border-2 border-[#fdfbf7] text-[#fdfbf7] hover:bg-[#fdfbf7]/10 font-bold text-sm tracking-wide transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>🌿 Share a Hidden Place</span>
          </a>
        </div>

        {/* Trust & Simplicity Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-[#fdfbf7]/15 max-w-3xl mx-auto text-left">
          <div className="flex items-start gap-3">
            <span className="text-xl">🌿</span>
            <div>
              <h4 className="text-sm font-semibold text-[#fdfbf7]">100% Local Wisdom</h4>
              <p className="text-xs text-[#d8f3dc]/80 mt-0.5">
                Uploaded by residents, village elders, and conservation guides.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">📍</span>
            <div>
              <h4 className="text-sm font-semibold text-[#fdfbf7]">Pinned Trailheads</h4>
              <p className="text-xs text-[#d8f3dc]/80 mt-0.5">
                Exact geographic coordinates for offbeat groves and river pools.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">🛡️</span>
            <div>
              <h4 className="text-sm font-semibold text-[#fdfbf7]">Community Respect</h4>
              <p className="text-xs text-[#d8f3dc]/80 mt-0.5">
                Essential local precautions and seasonal guidance on every spot.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
