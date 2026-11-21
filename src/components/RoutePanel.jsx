import React, { useState, useEffect } from "react";
import {
  calculateTotalDistance,
  getPicksAlongRoute,
  interpolateWaypoints,
  startJourneySimulation
} from "../lib/route";
import { placesStore } from "../lib/placesStore";

export default function RoutePanel({
  destinations = [],
  allPicks = [],
  onRouteCalculated,
  onSimulationStep,
  onSimulationEnd,
  onSelectPick
}) {
  const [startId, setStartId] = useState("cert-kisama");
  const [endId, setEndId] = useState("cert-cherrapunji");
  const [routeData, setRouteData] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("route"); // route | trips

  // Recalculate route whenever start or end changes
  useEffect(() => {
    const startObj = destinations.find((d) => d.id === startId);
    const endObj = destinations.find((d) => d.id === endId);

    if (!startObj || !endObj || startId === endId) {
      setRouteData(null);
      if (onRouteCalculated) onRouteCalculated([]);
      return;
    }

    const stops = [startObj, endObj];
    const waypoints = interpolateWaypoints(stops, 30);
    const totalKm = calculateTotalDistance([startObj.coords, endObj.coords]);
    const estHours = (totalKm / 35).toFixed(1); // avg hill speed ~35km/h

    // Find local picks along this corridor
    const nearbyPicks = getPicksAlongRoute(waypoints, allPicks, 45);

    const calculated = {
      start: startObj,
      end: endObj,
      waypoints,
      totalKm: Math.round(totalKm),
      estHours,
      nearbyPicks
    };

    setRouteData(calculated);
    if (onRouteCalculated) onRouteCalculated(waypoints);
  }, [startId, endId, destinations, allPicks]);

  // Handle simulation
  const handleStartSimulation = () => {
    if (!routeData || isSimulating) return;

    setIsSimulating(true);
    setSimProgress(0);

    const stopSimulation = startJourneySimulation({
      points: routeData.waypoints,
      intervalMs: 140,
      onStep: ({ coord, progress }) => {
        setSimProgress(progress);
        if (onSimulationStep) onSimulationStep(coord);
      },
      onComplete: () => {
        setIsSimulating(false);
        setSimProgress(100);
        if (onSimulationEnd) onSimulationEnd();
      }
    });

    return stopSimulation;
  };

  const handleStopSimulation = () => {
    setIsSimulating(false);
    if (onSimulationEnd) onSimulationEnd();
  };

  // Saved trips
  const tripPicks = allPicks.filter((p) => placesStore.isInTrip(p.id));

  return (
    <div className="bg-[var(--kmm-sheet)] border border-[var(--kmm-rule)] rounded-lg p-4 space-y-4 shadow-sm text-sm">
      {/* Tabs */}
      <div className="flex border-b border-[var(--kmm-rule)] pb-2 gap-4">
        <button
          onClick={() => setActiveTab("route")}
          className={`pb-1 font-semibold text-xs tracking-wider uppercase transition-colors ${
            activeTab === "route"
              ? "border-b-2 border-[var(--kmm-accent)] text-[var(--kmm-accent)]"
              : "text-[var(--kmm-muted)] hover:text-[var(--kmm-ink)]"
          }`}
        >
          Plan a Route
        </button>
        <button
          onClick={() => setActiveTab("trips")}
          className={`pb-1 font-semibold text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5 ${
            activeTab === "trips"
              ? "border-b-2 border-[var(--kmm-accent)] text-[var(--kmm-accent)]"
              : "text-[var(--kmm-muted)] hover:text-[var(--kmm-ink)]"
          }`}
        >
          <span>Trip List</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[var(--kmm-faint)] text-[var(--kmm-soft)]">
            {tripPicks.length}
          </span>
        </button>
      </div>

      {activeTab === "route" ? (
        <div className="space-y-3">
          {/* Form Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--kmm-muted)] mb-1">
                Start Destination
              </label>
              <select
                value={startId}
                onChange={(e) => setStartId(e.target.value)}
                className="w-full text-xs p-2 rounded bg-[var(--kmm-bg)] border border-[var(--kmm-rule)] text-[var(--kmm-ink)] focus:outline-none focus:border-[var(--kmm-accent)]"
              >
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.state})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--kmm-muted)] mb-1">
                Destination Target
              </label>
              <select
                value={endId}
                onChange={(e) => setEndId(e.target.value)}
                className="w-full text-xs p-2 rounded bg-[var(--kmm-bg)] border border-[var(--kmm-rule)] text-[var(--kmm-ink)] focus:outline-none focus:border-[var(--kmm-accent)]"
              >
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.state})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {routeData && (
            <div className="space-y-3 pt-2">
              {/* Route Summary Badge */}
              <div className="flex items-center justify-between p-2.5 bg-[var(--kmm-faint)] rounded border border-[var(--kmm-rule)] text-xs">
                <div>
                  <span className="text-[var(--kmm-muted)]">Distance:</span>{" "}
                  <strong className="text-[var(--kmm-ink)]">{routeData.totalKm} km</strong>
                </div>
                <div>
                  <span className="text-[var(--kmm-muted)]">Drive time:</span>{" "}
                  <strong className="text-[var(--kmm-ink)]">~{routeData.estHours} hrs</strong>
                </div>
                <div>
                  <span className="text-[var(--kmm-muted)]">Local picks:</span>{" "}
                  <strong className="text-[var(--kmm-accent)]">{routeData.nearbyPicks.length} suggested</strong>
                </div>
              </div>

              {/* Simulation Controls */}
              <div className="flex items-center gap-2">
                {!isSimulating ? (
                  <button
                    onClick={handleStartSimulation}
                    className="flex-1 py-2 px-3 text-xs font-semibold rounded bg-[var(--kmm-accent)] text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>▶ Simulate Journey</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStopSimulation}
                    className="flex-1 py-2 px-3 text-xs font-semibold rounded bg-amber-600 text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>⏸ Pause Simulation ({simProgress}%)</span>
                  </button>
                )}
              </div>

              {/* Progress bar */}
              {isSimulating && (
                <div className="w-full bg-[var(--kmm-faint)] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[var(--kmm-accent)] h-1.5 transition-all duration-150"
                    style={{ width: `${simProgress}%` }}
                  />
                </div>
              )}

              {/* Suggested Picks along the route */}
              <div className="pt-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[var(--kmm-muted)] mb-2">
                  Local Picks Along This Journey ({routeData.nearbyPicks.length})
                </h5>
                {routeData.nearbyPicks.length === 0 ? (
                  <p className="text-xs italic text-[var(--kmm-muted)]">
                    No picks registered within 45 km of this straight segment.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {routeData.nearbyPicks.map((pick) => (
                      <div
                        key={pick.id}
                        onClick={() => onSelectPick && onSelectPick(pick)}
                        className="p-2 bg-[var(--kmm-bg)] border border-[var(--kmm-rule)] rounded hover:border-[var(--kmm-accent)] cursor-pointer text-xs flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-semibold text-[var(--kmm-ink)]">{pick.name}</div>
                          <div className="text-[11px] text-[var(--kmm-muted)]">
                            {pick.tag} &bull; {pick.vouches || 0} vouches
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            placesStore.toggleTrip(pick.id);
                          }}
                          className="text-[11px] px-2 py-0.5 rounded bg-[var(--kmm-sheet)] border border-[var(--kmm-rule)] text-[var(--kmm-soft)] hover:bg-[var(--kmm-faint)]"
                        >
                          {placesStore.isInTrip(pick.id) ? "✓ Saved" : "+ Add"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Saved Trips View */
        <div className="space-y-2">
          {tripPicks.length === 0 ? (
            <p className="text-xs italic text-[var(--kmm-muted)] py-4 text-center">
              Your trip list is empty. Click "+ Add to Trip" on any local pick to curate your itinerary!
            </p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {tripPicks.map((pick) => (
                <div
                  key={pick.id}
                  className="p-2.5 bg-[var(--kmm-faint)] border border-[var(--kmm-rule)] rounded flex items-center justify-between text-xs"
                >
                  <div>
                    <h6 className="font-semibold text-[var(--kmm-ink)]">{pick.name}</h6>
                    <p className="text-[11px] text-[var(--kmm-muted)]">
                      {pick.state} &bull; {pick.bestSeason}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectPick && onSelectPick(pick)}
                      className="px-2 py-0.5 bg-[var(--kmm-sheet)] border border-[var(--kmm-rule)] rounded hover:bg-[var(--kmm-bg)] text-[var(--kmm-soft)]"
                    >
                      View
                    </button>
                    <button
                      onClick={() => placesStore.toggleTrip(pick.id)}
                      className="px-2 py-0.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded"
                      title="Remove from trip"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
