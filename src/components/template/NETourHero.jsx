import React from 'react';

export default function NETourHero({ onExplore, onAdd }) {
  return (
    <section
      style={{ backgroundColor: 'var(--forest-800)', color: 'var(--cream-50)' }}
      className="relative py-24 text-center overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, var(--forest-500) 0%, transparent 60%), radial-gradient(circle at 80% 20%, var(--earth-accent) 0%, transparent 50%)' }}
      />

      <div className="relative max-w-4xl mx-auto px-6">
        {/* Badge */}
        <span
          style={{ backgroundColor: 'var(--forest-600)', color: 'var(--cream-50)' }}
          className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
        >
          Northeast India • 8 States • Hidden Gems
        </span>

        {/* Heading */}
        <h1
          style={{ color: 'var(--cream-50)' }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-5 tracking-tight"
        >
          Discover the Northeast<br />
          <span style={{ color: 'var(--forest-500)' }}>Beyond the Ordinary.</span>
        </h1>

        {/* Subheading */}
        <p
          style={{ color: 'var(--cream-200)' }}
          className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Hidden places, shared by the people who know them best.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={onExplore}
            style={{ backgroundColor: 'var(--forest-500)', color: 'var(--forest-900)' }}
            className="px-8 py-3.5 font-bold rounded-full text-sm tracking-wide hover:opacity-90 transition-opacity shadow-lg"
          >
            🗺️ Explore Hidden Places
          </button>
          <button
            onClick={onAdd}
            style={{ border: '2px solid var(--forest-500)', color: 'var(--cream-50)', backgroundColor: 'transparent' }}
            className="px-8 py-3.5 font-bold rounded-full text-sm tracking-wide hover:opacity-80 transition-opacity"
          >
            + Share a Hidden Place
          </button>
        </div>
      </div>
    </section>
  );
}
