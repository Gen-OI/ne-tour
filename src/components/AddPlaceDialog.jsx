import React, { useState } from "react";
import { placesStore } from "../lib/placesStore";

export default function AddPlaceDialog({
  isOpen,
  onClose,
  destinations = [],
  initialCoords = null
}) {
  const [name, setName] = useState("");
  const [nearCertifiedId, setNearCertifiedId] = useState(
    destinations[0]?.id || "cert-kisama"
  );
  const [state, setState] = useState("Nagaland");
  const [lat, setLat] = useState(initialCoords ? initialCoords.lat.toFixed(4) : "25.6200");
  const [lng, setLng] = useState(initialCoords ? initialCoords.lng.toFixed(4) : "94.0500");
  const [alt, setAlt] = useState("1600");
  const [addedBy, setAddedBy] = useState("");
  const [role, setRole] = useState("Community Scout");
  const [bestSeason, setBestSeason] = useState("October to April");
  const [accessNote, setAccessNote] = useState("");
  const [quote, setQuote] = useState("");
  const [tag, setTag] = useState("Awaiting verification");
  const [requiresGuide, setRequiresGuide] = useState(false);
  const [seasonal, setSeasonal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !addedBy.trim() || !quote.trim()) {
      alert("Please provide place name, your name, and a local quote.");
      return;
    }

    placesStore.addPick({
      name: name.trim(),
      nearCertifiedId,
      state,
      coords: [parseFloat(lat) || 25.6, parseFloat(lng) || 94.0],
      alt: parseInt(alt, 10) || 1200,
      addedBy: addedBy.trim(),
      role: role.trim(),
      bestSeason,
      accessNote: accessNote.trim() || "Local shared sumos or walking path.",
      quote: quote.trim(),
      tag,
      requiresGuide,
      seasonal
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-[var(--kmm-sheet)] text-[var(--kmm-ink)] border border-[var(--kmm-rule)] rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-[var(--kmm-rule)] flex items-center justify-between bg-[var(--kmm-bg)] sticky top-0 z-10">
          <div>
            <h3 className="font-bold text-base text-[var(--kmm-ink)]">Add a Local Pick</h3>
            <p className="text-xs text-[var(--kmm-muted)]">
              Recommend a hidden spot known to locals near a certified destination
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[var(--kmm-muted)] hover:text-[var(--kmm-ink)]"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h4 className="font-bold text-base text-[var(--kmm-ink)]">Pick Submitted for Review!</h4>
            <p className="text-xs text-[var(--kmm-muted)]">
              Your pin has been added with an <i>Awaiting verification</i> dashed ring. Other locals can vouch for it right away!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-[var(--kmm-muted)] mb-1">
                Place Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Khonoma Alder Terraces"
                className="w-full p-2 rounded bg-[var(--kmm-bg)] border border-[var(--kmm-rule)] text-[var(--kmm-ink)] focus:outline-none focus:border-[var(--kmm-accent)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[var(--kmm-muted)] mb-1">
                  Nearest Certified Destination
                </label>
                <select
                  value={nearCertifiedId}
                  onChange={(e) => setNearCertifiedId(e.target.value)}
                  className="w-full p-2 rounded bg-[var(--kmm-bg)] border border-[var(--kmm-rule)] text-[var(--kmm-ink)]"
                >
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-[var(--kmm-muted)] mb-1">
                  State
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-2 rounded bg-[var(--kmm-bg)] border border-[var(--kmm-rule)] text-[var(--kmm-ink)]"
                >
                  <option value="Nagaland">Nagaland</option>
                  <option value="Assam">Assam</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Tripura">Tripura</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-[var(--kmm-muted)] mb-1">
                  Latitude
                </label>
                <input
                  type="text"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="w-full p-2 rounded bg-[var(--kmm-bg)] border border-[var(--kmm-rule)] text-[var(--kmm-ink)]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[var(--kmm-muted)] mb-1">
                  Longitude
                </label>
                <input
                  type="text"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  className="w-full p-2 rounded bg-[var(--kmm-bg)] border border-[var(--kmm-rule)] text-[var(--kmm-ink)]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[var(--kmm-muted)] mb-1">
                  Altitude (m)
                </label>
                <input
                  type="number"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  className="w-full p-2 rounded bg-[var(--kmm-bg)] border border-[var(--kmm-rule)] text-[var(--kmm-ink)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[var(--kmm-muted)] mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={addedBy}
                  onChange={(e) => setAddedBy(e.target.value)}
                  placeholder="e.g. Kevisato Angami"
                  className="w-full p-2 rounded bg-[var(--kmm-bg)] border border-[var(--kmm-rule)] text-[var(--kmm-ink)]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[var(--kmm-muted)] mb-1">
                  Your Local Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Village Elder, Guide"
                  className="w-full p-2 rounded bg-[var(--kmm-bg)] border border-[var(--kmm-rule)] text-[var(--kmm-ink)]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[var(--kmm-muted)] mb-1">
                Local's Quote / Advice *
              </label>
              <textarea
                required
                rows={2}
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="What should visitors notice or respect here?"
                className="w-full p-2 rounded bg-[var(--kmm-bg)] border border-[var(--kmm-rule)] text-[var(--kmm-ink)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[var(--kmm-muted)] mb-1">
                  Best Season
                </label>
                <input
                  type="text"
                  value={bestSeason}
                  onChange={(e) => setBestSeason(e.target.value)}
                  className="w-full p-2 rounded bg-[var(--kmm-bg)] border border-[var(--kmm-rule)] text-[var(--kmm-ink)]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[var(--kmm-muted)] mb-1">
                  Access Note
                </label>
                <input
                  type="text"
                  value={accessNote}
                  onChange={(e) => setAccessNote(e.target.value)}
                  placeholder="e.g. Shared sumo or trail details"
                  className="w-full p-2 rounded bg-[var(--kmm-bg)] border border-[var(--kmm-rule)] text-[var(--kmm-ink)]"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requiresGuide}
                  onChange={(e) => setRequiresGuide(e.target.checked)}
                />
                <span>Requires local guide</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={seasonal}
                  onChange={(e) => setSeasonal(e.target.checked)}
                />
                <span>Seasonal access only</span>
              </label>
            </div>

            <div className="pt-3 border-t border-[var(--kmm-rule)] flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded border border-[var(--kmm-rule)] hover:bg-[var(--kmm-bg)] text-[var(--kmm-soft)] font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-[var(--kmm-accent)] text-white hover:opacity-90 font-semibold"
              >
                Add Pin to Map
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
