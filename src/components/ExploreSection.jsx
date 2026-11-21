import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const STATES = [
  "All",
  "Arunachal Pradesh",
  "Assam",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Sikkim",
  "Tripura"
];

function createForestMarker(isSelected) {
  return L.divIcon({
    className: `forest-pin-wrapper ${isSelected ? "active" : ""}`,
    html: `
      <div class="forest-pin">
        <span class="forest-pin-inner"></span>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  });
}

export default function ExploreSection({ places = [] }) {
  const [selectedState, setSelectedState] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);

  // Filtered places list
  const filteredPlaces = places.filter((p) => {
    const matchesState =
      selectedState === "All" ||
      p.state?.toLowerCase() === selectedState.toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      p.name?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query) ||
      p.recommendation?.toLowerCase().includes(query) ||
      p.contributor_name?.toLowerCase().includes(query) ||
      p.state?.toLowerCase().includes(query);

    return matchesState && matchesSearch;
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered around Northeast India
    const map = L.map(mapContainerRef.current, {
      center: [26.0, 93.0],
      zoom: 7,
      minZoom: 6,
      maxZoom: 15,
      zoomControl: false,
      scrollWheelZoom: true
    });

    // Clean, natural OpenStreetMap / CartoDB tiles
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19
      }
    ).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    markersGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Sync Markers with filtered places
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = markersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    filteredPlaces.forEach((place) => {
      if (!place.latitude || !place.longitude) return;

      const isSelected = selectedPlace?.id === place.id;
      const marker = L.marker([place.latitude, place.longitude], {
        icon: createForestMarker(isSelected)
      });

      marker.on("click", () => {
        setSelectedPlace(place);
        map.flyTo([place.latitude, place.longitude], Math.max(map.getZoom(), 9), {
          duration: 0.8
        });
      });

      group.addLayer(marker);
    });

    // If initial place isn't selected, select the first one
    if (!selectedPlace && filteredPlaces.length > 0) {
      setSelectedPlace(filteredPlaces[0]);
    }
  }, [filteredPlaces, selectedPlace]);

  // Handle Card Click to focus map
  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
    const map = mapInstanceRef.current;
    if (map && place.latitude && place.longitude) {
      map.flyTo([place.latitude, place.longitude], 10, { duration: 0.8 });
    }
  };

  return (
    <section id="explore" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <span className="text-xs font-bold tracking-wider uppercase text-[#40916c] block">
          Section 2 &bull; For Travellers
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1b4332] tracking-tight">
          Explore Hidden Places
        </h2>
        <p className="text-sm sm:text-base text-[#2b261d]/80 leading-relaxed">
          Real sanctuaries, living trails, and rural cloistered groves discovered by Northeast residents. Click any pin or card to read the local recommendation.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#ffffff] border border-[#ede8dc] rounded-2xl p-4 sm:p-5 shadow-sm mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, recommendation, or contributor..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#f7f4ed] border border-[#ede8dc] text-sm text-[#1b4332] placeholder-gray-400 focus:outline-none focus:border-[#2d6a4f] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs p-1"
              >
                ✕
              </button>
            )}
          </div>

          <div className="text-xs font-medium text-[#40916c] shrink-0">
            Showing <b>{filteredPlaces.length}</b> places
          </div>
        </div>

        {/* State Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-[#1b4332] shrink-0 mr-1">
            State:
          </span>
          {STATES.map((state) => {
            const isSelected = selectedState === state;
            return (
              <button
                key={state}
                type="button"
                onClick={() => setSelectedState(state)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-[#1b4332] text-[#fdfbf7] shadow-xs"
                    : "bg-[#f7f4ed] text-[#1b4332] hover:bg-[#ede8dc] border border-[#ede8dc]"
                }`}
              >
                {state}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map & Place Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Interactive OpenStreetMap Container */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#ede8dc] shadow-md overflow-hidden flex flex-col">
          <div className="p-3 bg-[#f7f4ed] border-b border-[#ede8dc] flex items-center justify-between text-xs text-[#1b4332] font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1b4332]"></span>
              OpenStreetMap View
            </span>
            <span className="text-gray-500 font-normal">
              Click markers to view local recommendations
            </span>
          </div>

          <div className="relative w-full h-[420px] sm:h-[520px]">
            <div ref={mapContainerRef} className="w-full h-full" />
          </div>
        </div>

        {/* Selected Place Details Card (Required Information) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedPlace ? (
            <div className="bg-[#ffffff] border border-[#ede8dc] rounded-2xl overflow-hidden shadow-md space-y-5 animate-in fade-in duration-200">
              {/* Place Photograph */}
              <div className="relative h-56 sm:h-64 w-full bg-[#f7f4ed] overflow-hidden">
                <img
                  src={selectedPlace.photo_url}
                  alt={selectedPlace.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";
                  }}
                />
                <div className="absolute top-3 left-3 bg-[#1b4332]/90 backdrop-blur-xs text-[#fdfbf7] text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                  {selectedPlace.state}
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded-md">
                  {selectedPlace.latitude?.toFixed(4)}, {selectedPlace.longitude?.toFixed(4)}
                </div>
              </div>

              {/* Information Body */}
              <div className="p-5 sm:p-6 space-y-5 pt-0">
                <div>
                  <h3 className="text-2xl font-bold text-[#1b4332] leading-tight">
                    {selectedPlace.name}
                  </h3>
                  <p className="text-xs text-[#40916c] font-medium mt-1">
                    Shared by <b>{selectedPlace.contributor_name}</b>
                  </p>
                </div>

                {/* Local Recommendation */}
                <div className="bg-[#f7f4ed] border-l-3 border-[#2d6a4f] p-4 rounded-r-xl space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#1b4332] block">
                    🌿 Why Locals Recommend This Place
                  </span>
                  <p className="text-sm text-[#2b261d] italic leading-relaxed">
                    "{selectedPlace.recommendation}"
                  </p>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#40916c] mb-1.5">
                    Location Description
                  </h4>
                  <p className="text-xs sm:text-sm text-[#2b261d]/85 leading-relaxed">
                    {selectedPlace.description}
                  </p>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#ede8dc]">
                  <div className="bg-[#fdfbf7] p-3 rounded-xl border border-[#ede8dc]">
                    <span className="block text-[11px] font-bold text-[#40916c] uppercase tracking-wider mb-0.5">
                      📅 Best Visiting Season
                    </span>
                    <span className="text-xs font-semibold text-[#1b4332]">
                      {selectedPlace.best_season || "October to April"}
                    </span>
                  </div>

                  <div className="bg-[#fdfbf7] p-3 rounded-xl border border-[#ede8dc]">
                    <span className="block text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-0.5">
                      ⚠️ Travel Precautions
                    </span>
                    <span className="text-xs text-[#2b261d]/85 line-clamp-3">
                      {selectedPlace.precautions || "Respect community customs and leave no trace."}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white border border-[#ede8dc] rounded-2xl text-gray-500">
              Select a marker on the map to view place details.
            </div>
          )}
        </div>
      </div>

      {/* Discover Cards Grid */}
      <div className="mt-14 space-y-5">
        <div className="flex items-center justify-between border-b border-[#ede8dc] pb-3">
          <h3 className="text-xl font-bold text-[#1b4332]">
            All Places in {selectedState === "All" ? "Northeast India" : selectedState} ({filteredPlaces.length})
          </h3>
          <span className="text-xs text-[#40916c] font-medium">
            Click any card to locate on the map
          </span>
        </div>

        {filteredPlaces.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#ede8dc] space-y-3">
            <div className="text-3xl">🌿</div>
            <h4 className="text-base font-bold text-[#1b4332]">
              No places found matching your filters.
            </h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Be the first local from this region to share a hidden place with fellow travellers!
            </p>
            <a
              href="#share"
              className="inline-block mt-2 px-5 py-2 rounded-full bg-[#1b4332] text-white text-xs font-semibold"
            >
              Share this place
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPlaces.map((place) => {
              const isSelected = selectedPlace?.id === place.id;
              return (
                <div
                  key={place.id}
                  onClick={() => handleSelectPlace(place)}
                  className={`bg-white rounded-xl border overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? "border-[#1b4332] ring-2 ring-[#1b4332]/20"
                      : "border-[#ede8dc] hover:border-[#40916c]"
                  }`}
                >
                  <div>
                    <div className="relative h-40 w-full overflow-hidden bg-[#f7f4ed]">
                      <img
                        src={place.photo_url}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";
                        }}
                      />
                      <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1b4332]/90 text-white">
                        {place.state}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="font-bold text-sm text-[#1b4332] group-hover:text-[#2d6a4f] transition-colors leading-snug line-clamp-1">
                        {place.name}
                      </h4>
                      <p className="text-xs text-[#2b261d]/80 line-clamp-2 italic">
                        "{place.recommendation}"
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 text-[11px] text-[#40916c] flex items-center justify-between border-t border-[#f7f4ed] mt-2">
                    <span>By {place.contributor_name}</span>
                    <span className="font-semibold text-[#1b4332] group-hover:underline">
                      View pin &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
