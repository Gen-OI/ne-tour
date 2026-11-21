import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  HeroScene,
  RouteMap,
  Excerpt,
  FooterMap,
  Collar,
  Waymark,
  useTheme,
  KMM_CSS,
  trailPath,
  routeTotals,
  stageStarts,
  locate,
  altAt,
  SCENES
} from "./kamm-trek-landing.jsx";
import {
  CERTIFIED_DESTINATIONS,
  LOCAL_PICKS,
  FEATURED_ROUTE,
  LOCAL_WALKS
} from "../../data/places.js";
import { placesStore } from "../../lib/placesStore.js";
import MapView from "../MapView.jsx";
import PicksPanel from "../PicksPanel.jsx";
import RoutePanel from "../RoutePanel.jsx";
import AddPlaceDialog from "../AddPlaceDialog.jsx";
import AdminDialog from "../AdminDialog.jsx";

export default function OffbeatLanding() {
  // Theme and preset controls: default golden hour ("summer" preset)
  const [dark, setDark] = useTheme("system");
  const [preset, setPreset] = useState("summer"); // "summer" (golden hour / alpenglow) or "winter" (frost)
  const [seed] = useState(19);

  // Places state from store
  const [places, setPlaces] = useState(placesStore.places);
  const [selectedPlace, setSelectedPlace] = useState(placesStore.selectedPlace);
  const [activeFilter, setActiveFilter] = useState("all");

  // Route & simulation state in map
  const [plannedRouteCoords, setPlannedRouteCoords] = useState([]);
  const [simulatedCoord, setSimulatedCoord] = useState(null);

  // Dialogs
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [clickedMapCoord, setClickedMapCoord] = useState(null);

  // Contact / Ask host form state
  const [contactState, setContactState] = useState({
    name: "",
    email: "",
    place: "Khonoma Green Village",
    message: ""
  });
  const [contactSent, setContactSent] = useState(false);

  // Subscribe to placesStore
  useEffect(() => {
    return placesStore.subscribe((store) => {
      setPlaces([...store.places]);
      if (store.selectedPlace) {
        setSelectedPlace({ ...store.selectedPlace });
      }
    });
  }, []);

  // Filtered places
  const certifiedPlaces = useMemo(
    () => places.filter((p) => p.type === "certified"),
    [places]
  );
  const localPicks = useMemo(
    () => places.filter((p) => p.type === "pick"),
    [places]
  );

  // Nearby picks for the currently selected destination
  const nearbyPicks = useMemo(() => {
    if (!selectedPlace) return [];
    const targetId =
      selectedPlace.type === "certified"
        ? selectedPlace.id
        : selectedPlace.nearCertifiedId;
    return localPicks.filter((p) => p.nearCertifiedId === targetId);
  }, [selectedPlace, localPicks]);

  // Active scene key for template canvas shaders
  const sceneKey = preset + (dark ? "-night" : "-day");

  // Hero route setup: linking the 6 certified destinations
  const heroStart = useMemo(
    () => ({
      name: certifiedPlaces[0]?.name || "Kisama Heritage Village",
      alt: certifiedPlaces[0]?.alt || 1450,
      at: [0.15, 0.22]
    }),
    [certifiedPlaces]
  );

  const heroStages = useMemo(() => {
    const coordsMap = [
      [0.32, 0.38],
      [0.52, 0.32],
      [0.38, 0.65],
      [0.68, 0.25],
      [0.78, 0.72]
    ];
    return certifiedPlaces.slice(1, 6).map((dest, i) => ({
      to: dest.name,
      alt: dest.alt,
      at: coordsMap[i] || [0.5 + i * 0.08, 0.5 + i * 0.08],
      km: 24 + i * 18,
      hours: `${4 + i}h`,
      title: dest.summary,
      text: dest.summary,
      profile: [dest.alt - 200, dest.alt + 150, dest.alt],
      badge: `Destination ${i + 2}`,
      sleep: "Certified homestays & lodges"
    }));
  }, [certifiedPlaces]);

  const heroPath = useMemo(
    () => trailPath(heroStart, heroStages, seed),
    [heroStart, heroStages, seed]
  );

  // Topo featured route setup (Kisama -> Khonoma -> Dzukou Valley)
  const topoStart = FEATURED_ROUTE.start;
  const topoStages = useMemo(() => {
    return FEATURED_ROUTE.stages.map((st) => ({
      ...st,
      profile: [1450, 1600, st.gain ? 1450 + st.gain : 1800, st.loss ? 1450 + (st.gain || 0) - st.loss : 1600],
      title: st.kind,
      text: st.note
    }));
  }, []);
  const topoPath = useMemo(
    () => trailPath(topoStart, topoStages, seed),
    [topoStart, topoStages, seed]
  );

  // Topo interactive slider state
  const [activeDay, setActiveDay] = useState(0);
  const [sliderKm, setSliderKm] = useState(0);
  const activeStage = topoStages[activeDay] || topoStages[0];
  const walker = useMemo(() => {
    const st = topoStages[activeDay];
    return st ? { u: st.at[0], v: st.at[1] } : { u: topoStart.at[0], v: topoStart.at[1] };
  }, [activeDay, topoStages, topoStart]);

  // Contact form submission
  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactState.name || !contactState.email || !contactState.message) {
      alert("Please fill in your name, email, and message.");
      return;
    }
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactState({
        name: "",
        email: "",
        place: "Khonoma Green Village",
        message: ""
      });
    }, 4000);
  };

  return (
    <div
      className="kmm-root"
      data-theme={dark ? "dark" : "light"}
      data-preset={preset}
    >
      <style>{KMM_CSS}</style>

      {/* 1. NAVIGATION BAR */}
      <nav className="kmm-nav kmm-nav-solid">
        <a href="#top" className="kmm-brand">
          <Waymark />
          <b>Offbeat Northeast</b>
          <span>Locals' picks near famous places</span>
        </a>

        <div className="kmm-links hidden md:flex items-center gap-5">
          <a href="#legend">How to read</a>
          <a href="#featured-route">Featured route</a>
          <a href="#local-picks">Local picks</a>
          <a href="#explore-map">Explore the map</a>
          <a href="#walks">Local walks</a>
          <a href="#notes">Notes</a>
          <a href="#contact">Ask a host</a>
        </div>

        <div className="kmm-navend">
          {/* Theme toggle: Day (Golden Hour) vs Night (Alpenglow) */}
          <button
            type="button"
            className="kmm-themebtn"
            onClick={() => setDark(!dark)}
            aria-label={dark ? "Switch to Golden Hour day map" : "Switch to Alpenglow night map"}
            title={dark ? "Theme: Alpenglow (Click for Golden Hour)" : "Theme: Golden Hour (Click for Alpenglow)"}
          >
            {dark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Seasonal preset toggle: Summer/Autumn vs Winter frost */}
          <button
            type="button"
            onClick={() => setPreset(preset === "summer" ? "winter" : "summer")}
            className="text-xs px-2.5 py-1.5 rounded border border-current opacity-85 hover:opacity-100 transition-opacity font-semibold"
            title="Toggle Seasonal palette"
          >
            {preset === "summer" ? "🍂 Autumn" : "❄ Winter"}
          </button>

          {/* Quick CTA to Add Pick */}
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="kmm-btn kmm-btn-solid text-xs h-9 px-3"
          >
            + Add Pick
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="kmm-hero" id="top" aria-labelledby="hero-title">
        <HeroScene
          seed={seed}
          sceneKey={sceneKey}
          stages={heroStages}
          path={heroPath}
          live={{ stage: 0, label: "Kisama Community Base" }}
          sep=","
          photoTrail={false}
          dayWord="Pin"
          onPick={() => {
            const el = document.getElementById("explore-map");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />
        <div className="kmm-scrim" aria-hidden="true" />

        <div className="kmm-hero-copy">
          <div className="kmm-hero-text">
            <span className="text-xs tracking-wider uppercase font-bold text-[var(--kmm-ice)] mb-2 block">
              Offbeat Northeast &bull; Community Trail
            </span>
            <h1 id="hero-title" className="kmm-in max-w-2xl text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
              Tourists already go to the famous places. Locals know what to see next.
            </h1>
            <p className="mt-4 max-w-xl text-base text-[var(--kmm-soft)] text-white/90 leading-relaxed">
              Step beyond the tourist circuit. Certified destinations anchor the map; resident elders, naturalists, and craftspeople guide you to the sacred groves, quiet bamboo walks, and river hamlets just beyond.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href="#explore-map" className="kmm-btn kmm-btn-solid kmm-btn-lg">
                <Waymark />
                <span>Explore the map</span>
              </a>
              <button
                type="button"
                onClick={() => setIsAddOpen(true)}
                className="kmm-btn kmm-btn-ghost kmm-btn-lg bg-black/30 hover:bg-black/50 text-white backdrop-blur-xs"
              >
                + Add a local pick
              </button>
            </div>

            <p className="mt-3 text-xs opacity-75 italic text-white/80">
              * (Stylised relief model of the Eastern Himalayan & Patkai hill ranges with trail connecting 6 certified destinations)
            </p>
          </div>
        </div>
      </section>

      {/* 3. HOW TO READ A LOCAL PICK (MAP LEGEND) */}
      <section className="kmm-sec kmm-incl" id="legend" aria-labelledby="legend-title">
        <Collar grid="C3" note="Map Reading & Legend" />
        <div className="kmm-incl-lead kmm-rv">
          <h2 id="legend-title" className="text-2xl sm:text-3xl font-bold">How to read a local pick</h2>
          <p className="text-[var(--kmm-muted)] mt-1">
            Understanding cartographic markers, community verification rings, and local guidance icons on our map sheets.
          </p>
        </div>

        <ul className="kmm-incl-grid kmm-rv">
          <li className="kmm-incl-item">
            <span className="kmm-incl-tick inline-flex items-center justify-center font-bold text-sm bg-[var(--kmm-ink)] text-[var(--kmm-sheet)]">
              ■
            </span>
            <div>
              <p className="kmm-incl-h font-bold">Certified destination (square)</p>
              <p className="kmm-incl-p text-sm text-[var(--kmm-soft)]">
                Well-known regional anchor destination with established roads, visitor facilities, and official heritage status.
              </p>
            </div>
          </li>

          <li className="kmm-incl-item">
            <span className="kmm-incl-tick inline-flex items-center justify-center font-bold text-sm bg-[var(--kmm-accent)] text-white rounded-full">
              ●
            </span>
            <div>
              <p className="kmm-incl-h font-bold">Local pick (circle)</p>
              <p className="kmm-incl-p text-sm text-[var(--kmm-soft)]">
                A lesser-known ecological spot, artisan cloister, or community forest tucked away near a certified destination.
              </p>
            </div>
          </li>

          <li className="kmm-incl-item">
            <span className="kmm-incl-tick inline-flex items-center justify-center text-xs font-bold border-2 border-emerald-600 text-emerald-600 rounded-full">
              ✓
            </span>
            <div>
              <p className="kmm-incl-h font-bold">Verified by locals</p>
              <p className="kmm-incl-p text-sm text-[var(--kmm-soft)]">
                Corroborated by resident village councils or community elders for responsible access and cultural sensitivity.
              </p>
            </div>
          </li>

          <li className="kmm-incl-item">
            <span className="kmm-incl-tick inline-flex items-center justify-center text-xs font-bold border-2 border-dashed border-amber-600 text-amber-600 rounded-full">
              ◌
            </span>
            <div>
              <p className="kmm-incl-h font-bold">Awaiting verification (dashed)</p>
              <p className="kmm-incl-p text-sm text-[var(--kmm-soft)]">
                A newly suggested pin pending on-ground review from local conservation scouts and moderators.
              </p>
            </div>
          </li>

          <li className="kmm-incl-item">
            <span className="kmm-incl-tick inline-flex items-center justify-center text-xs font-bold bg-amber-100 text-amber-900 rounded">
              🥾
            </span>
            <div>
              <p className="kmm-incl-h font-bold">Visit with a local guide</p>
              <p className="kmm-incl-p text-sm text-[var(--kmm-soft)]">
                Terrain requiring indigenous navigation, such as cliffside bamboo ladders, sacred clan groves, or alpine frost ridges.
              </p>
            </div>
          </li>

          <li className="kmm-incl-item">
            <span className="kmm-incl-tick inline-flex items-center justify-center text-xs font-bold bg-cyan-100 text-cyan-900 rounded">
              ❄
            </span>
            <div>
              <p className="kmm-incl-h font-bold">Seasonal</p>
              <p className="kmm-incl-p text-sm text-[var(--kmm-soft)]">
                Floating reed phumdis or seasonal high blossoms only accessible during specific dry, lily, or winter frost windows.
              </p>
            </div>
          </li>

          <li className="kmm-incl-item">
            <span className="kmm-incl-tick inline-flex items-center justify-center text-xs font-bold bg-[var(--kmm-sheet)] border border-[var(--kmm-rule)] text-[var(--kmm-accent)]">
              ▲
            </span>
            <div>
              <p className="kmm-incl-h font-bold">Vouches</p>
              <p className="kmm-incl-p text-sm text-[var(--kmm-soft)]">
                Real-time endorsements from local residents and responsible travelers attesting to the place's integrity.
              </p>
            </div>
          </li>
        </ul>
      </section>

      {/* 4. FEATURED ROUTE (TOPO MAP PRINTED FLAT) */}
      <section className="kmm-sec kmm-route-sec" id="featured-route" aria-labelledby="route-title">
        <Collar grid="A1" note="Featured Topographic Traverse" />
        <div className="kmm-head kmm-rv">
          <h2 id="route-title" className="text-2xl sm:text-3xl font-bold">{FEATURED_ROUTE.name}</h2>
          <p className="kmm-head-p text-[var(--kmm-muted)]">
            A real traverse linking Kisama Heritage Village to Khonoma Green Village and Dzukou Valley North Ridge.
          </p>
        </div>

        <div className="kmm-route-grid">
          <div className="kmm-sheet-wrap">
            <RouteMap
              seed={seed}
              printKey={sceneKey}
              interval={50}
              start={topoStart}
              stages={topoStages}
              path={topoPath}
              peaks={FEATURED_ROUTE.peaks}
              pos={walker}
              active={activeDay}
              name={FEATURED_ROUTE.name}
              sep=","
            />
            <span className="kmm-sheetname" aria-hidden="true">
              {FEATURED_ROUTE.name} <i>1:50 000 Topographic Sheet</i>
            </span>
          </div>

          <article className="kmm-day p-4 bg-[var(--kmm-sheet)] border border-[var(--kmm-rule)] rounded-md space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--kmm-rule)] pb-2">
              <span className="kmm-day-badge text-xs font-bold uppercase tracking-wider text-[var(--kmm-accent)]">
                {activeStage.badge || `Stage ${activeDay + 1}`}
              </span>
              <span className="text-xs text-[var(--kmm-muted)]">Stage {activeDay + 1} of {topoStages.length}</span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[var(--kmm-ink)]">{activeStage.to}</h3>
              <p className="text-xs text-[var(--kmm-muted)] mt-0.5">{activeStage.kind}</p>
            </div>

            <p className="text-sm text-[var(--kmm-soft)]">{activeStage.note}</p>

            <blockquote className="p-2.5 rounded bg-[var(--kmm-faint)] border-l-2 border-[var(--kmm-accent)] text-xs italic text-[var(--kmm-soft)]">
              "{activeStage.localTip}"
            </blockquote>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
              <div className="p-2 bg-[var(--kmm-faint)] rounded">
                <span className="block text-[var(--kmm-muted)]">Distance</span>
                <b className="text-[var(--kmm-ink)]">{activeStage.km} km</b>
              </div>
              <div className="p-2 bg-[var(--kmm-faint)] rounded">
                <span className="block text-[var(--kmm-muted)]">Ascent</span>
                <b className="text-[var(--kmm-ink)]">+{activeStage.gain} m</b>
              </div>
              <div className="p-2 bg-[var(--kmm-faint)] rounded">
                <span className="block text-[var(--kmm-muted)]">Walking Time</span>
                <b className="text-[var(--kmm-ink)]">{activeStage.hours}</b>
              </div>
            </div>

            {/* Stage Selector Buttons */}
            <div className="flex gap-2 pt-2">
              {topoStages.map((st, idx) => (
                <button
                  key={st.to}
                  type="button"
                  onClick={() => setActiveDay(idx)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded border transition-colors ${
                    activeDay === idx
                      ? "bg-[var(--kmm-accent)] text-white border-[var(--kmm-accent)]"
                      : "bg-[var(--kmm-bg)] border-[var(--kmm-rule)] text-[var(--kmm-soft)] hover:border-[var(--kmm-accent)]"
                  }`}
                >
                  Stage {idx + 1}
                </button>
              ))}
            </div>
          </article>
        </div>
      </section>

      {/* 5. LOCAL PICKS CARDS (EACH HUT ON ITS OWN MAP EXCERPT) */}
      <section className="kmm-sec kmm-huts" id="local-picks" aria-labelledby="picks-title">
        <Collar grid="B2" note="Locals' Recommendations" />
        <div className="kmm-head kmm-rv">
          <h2 id="picks-title" className="text-2xl sm:text-3xl font-bold">Vouched Local Picks</h2>
          <p className="kmm-head-p text-[var(--kmm-muted)]">
            Each place presented on its own topographic excerpt, paired with quotes and notes directly from resident guardians.
          </p>
        </div>

        <div className="kmm-huts-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localPicks.slice(0, 6).map((pick, i) => (
            <div
              key={pick.id}
              className="kmm-hut-card bg-[var(--kmm-sheet)] border border-[var(--kmm-rule)] rounded-lg overflow-hidden shadow-sm flex flex-col justify-between hover:border-[var(--kmm-accent)] transition-all"
            >
              {/* Map Excerpt */}
              <div className="relative h-44 w-full bg-[var(--kmm-faint)] overflow-hidden">
                <Excerpt
                  seed={seed + i * 3}
                  printKey={sceneKey}
                  stage={{
                    to: pick.name,
                    alt: pick.alt,
                    at: [0.3 + (i % 3) * 0.2, 0.4 + (i % 2) * 0.2]
                  }}
                  path={topoPath}
                  index={i}
                  sep=","
                />
                <span className="absolute bottom-2 left-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[var(--kmm-sheet)]/90 backdrop-blur-xs text-[var(--kmm-ink)] border border-[var(--kmm-rule)]">
                  {pick.state} &bull; {pick.alt}m alt
                </span>
                <span className="absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-[var(--kmm-accent)] text-white">
                  {pick.tag}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-base text-[var(--kmm-ink)]">{pick.name}</h3>
                  <blockquote className="mt-2 text-xs italic text-[var(--kmm-soft)] border-l-2 border-[var(--kmm-accent)] pl-2.5">
                    "{pick.quote}"
                  </blockquote>
                </div>

                <div className="space-y-1.5 text-xs text-[var(--kmm-muted)] pt-2 border-t border-[var(--kmm-rule)]">
                  <p>
                    <b className="text-[var(--kmm-soft)]">Added by:</b> {pick.addedBy}, <i>{pick.role}</i>
                  </p>
                  <p>
                    <b className="text-[var(--kmm-soft)]">Best season:</b> {pick.bestSeason}
                  </p>
                  <p>
                    <b className="text-[var(--kmm-soft)]">Access:</b> {pick.accessNote}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[var(--kmm-rule)]">
                  <button
                    type="button"
                    onClick={() => placesStore.vouch(pick.id)}
                    className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded bg-[var(--kmm-faint)] hover:bg-[var(--kmm-bg)] font-semibold text-[var(--kmm-soft)] transition-colors"
                  >
                    <span>▲</span>
                    <span>{pick.vouches || 0} vouches</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlace(pick);
                      const el = document.getElementById("explore-map");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-xs font-semibold text-[var(--kmm-accent)] hover:underline"
                  >
                    View on map &rarr;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. EXPLORE THE MAP (EMBEDDED HACKATHON APP SECTION) */}
      <section className="kmm-sec relative py-12" id="explore-map" aria-labelledby="map-sec-title">
        <Collar grid="D4" note="Live Interactive Map" />
        <div className="kmm-head kmm-rv mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 id="map-sec-title" className="text-2xl sm:text-3xl font-bold">Explore the Interactive Map</h2>
              <p className="kmm-head-p text-[var(--kmm-muted)]">
                Certified destination squares anchor the region; click circles to discover local picks, plan custom routes, and simulate journeys.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddOpen(true)}
                className="kmm-btn kmm-btn-solid text-xs h-9 px-3"
              >
                + Add a local pick
              </button>
              <button
                type="button"
                onClick={() => setIsAdminOpen(true)}
                className="text-xs px-3 py-2 rounded border border-[var(--kmm-rule)] hover:bg-[var(--kmm-sheet)] text-[var(--kmm-muted)] font-medium transition-colors"
                title="Moderator review panel (passcode demo123)"
              >
                🔒 Admin Review
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
            <span className="text-[var(--kmm-muted)] font-semibold">Filter:</span>
            {[
              { id: "all", label: "All places" },
              { id: "verified", label: "Verified by locals" },
              { id: "guide", label: "Requires guide" },
              { id: "seasonal", label: "Seasonal" },
              { id: "awaiting", label: "Awaiting verification" }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1 rounded-full border transition-all ${
                  activeFilter === f.id
                    ? "bg-[var(--kmm-ink)] text-[var(--kmm-sheet)] border-[var(--kmm-ink)] font-bold"
                    : "bg-[var(--kmm-sheet)] border-[var(--kmm-rule)] text-[var(--kmm-soft)] hover:border-[var(--kmm-ink)]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Map and Panels Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Map Canvas Area */}
          <div className="lg:col-span-8 relative rounded-lg overflow-hidden border border-[var(--kmm-rule)] bg-[var(--kmm-sheet)] shadow-md">
            <MapView
              certifiedPlaces={certifiedPlaces}
              localPicks={localPicks}
              selectedPlace={selectedPlace}
              onSelectPlace={(p) => setSelectedPlace(p)}
              onMapClick={(coords) => {
                setClickedMapCoord(coords);
              }}
              routeCoords={plannedRouteCoords}
              simulatedCoord={simulatedCoord}
              activeFilter={activeFilter}
            />

            {/* Locals' Picks Pop-up Overlay inside the map area */}
            {selectedPlace && (
              <PicksPanel
                place={selectedPlace}
                nearbyPicks={nearbyPicks}
                onClose={() => setSelectedPlace(null)}
                onSelectPick={(pick) => setSelectedPlace(pick)}
                onOpenAddModal={() => setIsAddOpen(true)}
              />
            )}
          </div>

          {/* Route Planner & Trip List Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <RoutePanel
              destinations={certifiedPlaces}
              allPicks={localPicks}
              onRouteCalculated={(coords) => setPlannedRouteCoords(coords)}
              onSimulationStep={(coord) => setSimulatedCoord(coord)}
              onSimulationEnd={() => setSimulatedCoord(null)}
              onSelectPick={(pick) => setSelectedPlace(pick)}
            />

            {/* Quick helper card */}
            <div className="p-3 bg-[var(--kmm-sheet)] border border-[var(--kmm-rule)] rounded-lg text-xs space-y-1.5 text-[var(--kmm-muted)]">
              <p className="font-semibold text-[var(--kmm-ink)]">💡 Did you know?</p>
              <p>
                Clicking anywhere on the map sets coordinates you can use when adding a new pick with <b>+ Add Pick</b>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LOCAL-LED WALKS (DEPARTURES WITH PLACES LEFT) */}
      <section className="kmm-sec kmm-deps" id="walks" aria-labelledby="walks-title">
        <Collar grid="E5" note="Sample Departures" />
        <div className="kmm-head kmm-rv">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 id="walks-title" className="text-2xl sm:text-3xl font-bold">Local-led Walks</h2>
              <p className="kmm-head-p text-[var(--kmm-muted)]">
                Small-group community excursions led by resident elders and craftspeople.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-[var(--kmm-faint)] border border-[var(--kmm-rule)] text-[var(--kmm-muted)] italic">
              Illustrative sample departures
            </span>
          </div>
        </div>

        <div className="overflow-x-auto border border-[var(--kmm-rule)] rounded-lg bg-[var(--kmm-sheet)]">
          <table className="w-full text-left text-sm divide-y divide-[var(--kmm-rule)]">
            <thead className="bg-[var(--kmm-bg)] text-xs uppercase font-bold text-[var(--kmm-muted)]">
              <tr>
                <th className="p-3">Walk / Trail</th>
                <th className="p-3">Resident Guide</th>
                <th className="p-3">Date</th>
                <th className="p-3">Difficulty</th>
                <th className="p-3">Availability</th>
                <th className="p-3 text-right">Inquire</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--kmm-rule)]">
              {LOCAL_WALKS.map((walk) => (
                <tr key={walk.id} className="hover:bg-[var(--kmm-bg)] transition-colors">
                  <td className="p-3 font-semibold text-[var(--kmm-ink)]">
                    <div>{walk.place}</div>
                    <div className="text-xs text-[var(--kmm-muted)] font-normal">{walk.summary}</div>
                  </td>
                  <td className="p-3 text-xs text-[var(--kmm-soft)]">
                    <div><b>{walk.guide}</b></div>
                    <div className="text-[11px] text-[var(--kmm-muted)]">{walk.guideRole}</div>
                  </td>
                  <td className="p-3 text-xs font-medium text-[var(--kmm-soft)]">{walk.date}</td>
                  <td className="p-3 text-xs">
                    <span className="px-2 py-0.5 rounded bg-[var(--kmm-faint)] text-[var(--kmm-soft)] font-medium">
                      {walk.difficulty}
                    </span>
                  </td>
                  <td className="p-3 text-xs">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        walk.placesLeft <= 2 ? "text-[var(--kmm-accent)]" : "text-emerald-700 dark:text-emerald-400"
                      }`}
                    >
                      <span>●</span>
                      <span>{walk.placesLeft} places left</span>
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <a
                      href="#contact"
                      onClick={() =>
                        setContactState((prev) => ({
                          ...prev,
                          place: walk.place,
                          message: `Inquiring about joining ${walk.place} with ${walk.guide} on ${walk.date}.`
                        }))
                      }
                      className="inline-block text-xs font-semibold px-3 py-1.5 rounded bg-[var(--kmm-accent)] text-white hover:opacity-90"
                    >
                      Ask Host
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 8. NOTES FROM LOCALS (REVIEWS AS HUT-BOOK ENTRIES) */}
      <section className="kmm-sec kmm-book" id="notes" aria-labelledby="notes-title">
        <Collar grid="F6" note="Community Logbook" />
        <div className="kmm-head kmm-rv">
          <h2 id="notes-title" className="text-2xl sm:text-3xl font-bold">Notes from Locals</h2>
          <p className="kmm-head-p text-[var(--kmm-muted)]">
            Hut-book styled log entries drawn from quotes, elder wisdom, and community vouch logs across the Seven Sister states.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {localPicks.slice(0, 3).map((pick, i) => (
            <div
              key={pick.id}
              className="p-5 bg-[var(--kmm-sheet)] border border-[var(--kmm-rule)] rounded-lg shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--kmm-rule)] pb-2 text-xs">
                  <span className="font-mono text-[var(--kmm-muted)]">ENTRY #0{i + 14}</span>
                  <span className="px-1.5 py-0.5 rounded bg-[var(--kmm-faint)] text-[var(--kmm-accent)] font-bold">
                    ▲ {pick.vouches || 0} vouches
                  </span>
                </div>
                <blockquote className="text-sm italic text-[var(--kmm-ink)] font-serif leading-relaxed">
                  "{pick.quote}"
                </blockquote>
              </div>

              <div className="pt-3 border-t border-[var(--kmm-rule)] text-xs text-[var(--kmm-muted)]">
                <p className="font-bold text-[var(--kmm-soft)]">{pick.addedBy}</p>
                <p>{pick.role} &bull; {pick.name}, {pick.state}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. ASK A LOCAL HOST (CONTACT FORM) */}
      <section className="kmm-sec" id="contact" aria-labelledby="contact-title">
        <Collar grid="G7" note="Host Inquiries" />
        <div className="kmm-head kmm-rv mb-6">
          <h2 id="contact-title" className="text-2xl sm:text-3xl font-bold">Ask a Local Host</h2>
          <p className="kmm-head-p text-[var(--kmm-muted)]">
            Have questions about trail conditions, village permits, or cultural protocol? Send a message to the community coordinator.
          </p>
        </div>

        <div className="max-w-xl mx-auto p-6 bg-[var(--kmm-sheet)] border border-[var(--kmm-rule)] rounded-lg shadow-md">
          {contactSent ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                ✓
              </div>
              <h3 className="font-bold text-lg text-[var(--kmm-ink)]">Message Received by Host!</h3>
              <p className="text-xs text-[var(--kmm-muted)]">
                Thank you! Your message regarding <b>{contactState.place}</b> has been queued for our local community contact.
              </p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[var(--kmm-muted)] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactState.name}
                    onChange={(e) =>
                      setContactState({ ...contactState, name: e.target.value })
                    }
                    placeholder="Full name"
                    className="w-full p-2.5 rounded bg-[var(--kmm-bg)] border border-[var(--kmm-rule)] text-[var(--kmm-ink)] focus:outline-none focus:border-[var(--kmm-accent)]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[var(--kmm-muted)] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactState.email}
                    onChange={(e) =>
                      setContactState({ ...contactState, email: e.target.value })
                    }
                    placeholder="you@domain.com"
                    className="w-full p-2.5 rounded bg-[var(--kmm-bg)] border border-[var(--kmm-rule)] text-[var(--kmm-ink)] focus:outline-none focus:border-[var(--kmm-accent)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[var(--kmm-muted)] mb-1">
                  Destination / Local Pick of Interest
                </label>
                <select
                  value={contactState.place}
                  onChange={(e) =>
                    setContactState({ ...contactState, place: e.target.value })
                  }
                  className="w-full p-2.5 rounded bg-[var(--kmm-bg)] border border-[var(--kmm-rule)] text-[var(--kmm-ink)] focus:outline-none focus:border-[var(--kmm-accent)]"
                >
                  {places.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.state})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[var(--kmm-muted)] mb-1">
                  Message / Question *
                </label>
                <textarea
                  required
                  rows={4}
                  value={contactState.message}
                  onChange={(e) =>
                    setContactState({ ...contactState, message: e.target.value })
                  }
                  placeholder="Ask about seasonality, shared transport, respectful etiquette, or local guide availability..."
                  className="w-full p-2.5 rounded bg-[var(--kmm-bg)] border border-[var(--kmm-rule)] text-[var(--kmm-ink)] focus:outline-none focus:border-[var(--kmm-accent)]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded bg-[var(--kmm-accent)] text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Send Inquiry to Local Host
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="relative mt-16 bg-[var(--kmm-sheet)] border-t border-[var(--kmm-rule)] text-xs text-[var(--kmm-muted)]">
        <FooterMap
          seed={seed}
          printKey={sceneKey}
          interval={50}
          stages={topoStages}
          path={topoPath}
        />

        <div className="kmm-foot-cta p-8 text-center space-y-4">
          <p className="kmm-foot-title font-bold text-lg text-[var(--kmm-ink)]">
            Know a quiet place in the hills? Vouch for it on our map sheet.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setIsAddOpen(true)}
              className="kmm-btn kmm-btn-solid kmm-btn-lg"
            >
              <Waymark />
              <span>+ Add a local pick</span>
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-[var(--kmm-rule)] max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            Template by @kedhareswer (MIT). Built for <b>Offbeat Northeast</b>.
          </p>

          <p className="text-center sm:text-right max-w-md italic">
            Sample content: the places are real, but the quotes, names, dates and coordinates are illustrative.
          </p>

          <div>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="hover:underline font-semibold text-[var(--kmm-ink)]"
            >
              Moderator Review (demo123)
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddPlaceDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        destinations={certifiedPlaces}
        initialCoords={clickedMapCoord}
      />

      <AdminDialog
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        places={places}
      />
    </div>
  );
}
