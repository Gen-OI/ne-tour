import React from "react";
import { placesStore } from "../lib/placesStore";

export default function PicksPanel({
  place,
  nearbyPicks = [],
  onClose,
  onSelectPick,
  onOpenAddModal
}) {
  if (!place) return null;

  const isCertified = place.type === "certified";

  return (
    <div className="absolute top-4 right-4 z-[400] w-full max-w-[380px] max-h-[calc(100%-2rem)] flex flex-col bg-[var(--kmm-sheet)] text-[var(--kmm-ink)] border border-[var(--kmm-rule)] rounded-md shadow-2xl backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-right-4 duration-200">
      {/* Header */}
      <div className="p-4 border-b border-[var(--kmm-rule)] bg-[var(--kmm-bg)] flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`inline-block w-2.5 h-2.5 ${
                isCertified ? "rounded-none bg-[var(--kmm-ink)]" : "rounded-full bg-[var(--kmm-accent)]"
              }`}
            />
            <span className="text-xs uppercase font-bold tracking-wider text-[var(--kmm-muted)]">
              {isCertified ? "Certified Destination" : "Local Pick"}
            </span>
          </div>
          <h3 className="text-lg font-bold text-[var(--kmm-ink)] leading-snug">{place.name}</h3>
          <p className="text-xs text-[var(--kmm-muted)]">
            {place.state} &bull; {place.alt}m alt &bull; [{place.coords[0].toFixed(3)}, {place.coords[1].toFixed(3)}]
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-[var(--kmm-faint)] text-[var(--kmm-muted)] hover:text-[var(--kmm-ink)] transition-colors"
          aria-label="Close panel"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4 overflow-y-auto space-y-4 text-sm divide-y divide-[var(--kmm-rule)]">
        {/* Main Place Info */}
        <div className="space-y-2">
          {place.summary && <p className="text-[var(--kmm-soft)] leading-relaxed">{place.summary}</p>}
          {place.quote && (
            <blockquote className="pl-3 border-l-2 border-[var(--kmm-accent)] italic text-[var(--kmm-soft)] bg-[var(--kmm-faint)] py-1.5 pr-2 rounded-r">
              "{place.quote}"
            </blockquote>
          )}
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="bg-[var(--kmm-faint)] p-2 rounded">
              <span className="block text-[var(--kmm-muted)] font-medium">Best Season</span>
              <span className="font-semibold text-[var(--kmm-soft)]">{place.bestSeason || "Year-round"}</span>
            </div>
            <div className="bg-[var(--kmm-faint)] p-2 rounded">
              <span className="block text-[var(--kmm-muted)] font-medium">Community Status</span>
              <span className="font-semibold text-[var(--kmm-soft)]">{place.tag || "Verified"}</span>
            </div>
          </div>
          {place.accessNote && (
            <p className="text-xs text-[var(--kmm-muted)]">
              <strong className="text-[var(--kmm-soft)]">Access note:</strong> {place.accessNote}
            </p>
          )}
        </div>

        {/* Nearby Local Picks (when viewing a certified destination) */}
        {isCertified && (
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--kmm-ink)]">
                Locals' Picks Nearby ({nearbyPicks.length})
              </h4>
              <button
                onClick={onOpenAddModal}
                className="text-xs font-semibold text-[var(--kmm-accent)] hover:underline flex items-center gap-1"
              >
                <span>+ Add Pick</span>
              </button>
            </div>

            {nearbyPicks.length === 0 ? (
              <p className="text-xs italic text-[var(--kmm-muted)] py-2">
                No local picks added yet near this destination. Be the first local to vouch for one!
              </p>
            ) : (
              <div className="space-y-3">
                {nearbyPicks.map((pick) => {
                  const isInTrip = placesStore.isInTrip(pick.id);
                  return (
                    <div
                      key={pick.id}
                      className="p-3 bg-[var(--kmm-faint)] border border-[var(--kmm-rule)] rounded-md hover:border-[var(--kmm-accent)] transition-all cursor-pointer group"
                      onClick={() => onSelectPick(pick)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="font-semibold text-sm group-hover:text-[var(--kmm-accent)] transition-colors">
                          {pick.name}
                        </h5>
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-[var(--kmm-bg)] border border-[var(--kmm-rule)] text-[var(--kmm-muted)] shrink-0">
                          {pick.tag}
                        </span>
                      </div>

                      <blockquote className="mt-1 text-xs italic text-[var(--kmm-soft)]">
                        "{pick.quote}"
                      </blockquote>

                      <div className="mt-2 text-[11px] text-[var(--kmm-muted)] flex items-center justify-between">
                        <span>
                          Added by {pick.addedBy}, <i>{pick.role}</i>
                        </span>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-[var(--kmm-rule)] flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            placesStore.vouch(pick.id);
                          }}
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-[var(--kmm-sheet)] border border-[var(--kmm-rule)] rounded hover:bg-[var(--kmm-bg)] transition-colors font-medium text-[var(--kmm-soft)]"
                        >
                          <span>▲</span>
                          <span>{pick.vouches || 0} vouches</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            placesStore.toggleTrip(pick.id);
                          }}
                          className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                            isInTrip
                              ? "bg-[var(--kmm-ink)] text-[var(--kmm-sheet)]"
                              : "bg-[var(--kmm-accent)] text-white hover:opacity-90"
                          }`}
                        >
                          {isInTrip ? "✓ In Trip" : "+ Trip"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
