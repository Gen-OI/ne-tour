import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom Leaflet DivIcon helpers
function createCertifiedIcon(name) {
  return L.divIcon({
    className: "custom-map-marker certified-marker",
    html: `
      <div class="marker-square" title="${name}">
        <span class="marker-sq-inner"></span>
      </div>
      <div class="marker-popup-label">${name}</div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
}

function createPickIcon(name, status, tag) {
  const isAwaiting = status === "awaiting";
  const isGuide = tag === "Visit with a local guide";
  return L.divIcon({
    className: `custom-map-marker pick-marker ${isAwaiting ? "marker-awaiting" : ""} ${isGuide ? "marker-guide" : ""}`,
    html: `
      <div class="marker-circle" title="${name}">
        <span class="marker-circle-dot"></span>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
}

function createTravelerIcon() {
  return L.divIcon({
    className: "traveler-marker",
    html: `
      <div class="traveler-pulse">
        <span class="traveler-dot"></span>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
}

export default function MapView({
  certifiedPlaces = [],
  localPicks = [],
  selectedPlace = null,
  onSelectPlace,
  onMapClick,
  routeCoords = [],
  simulatedCoord = null,
  activeFilter = "all"
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routePolylineRef = useRef(null);
  const travelerMarkerRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered around Northeast India (Nagaland, Assam, Meghalaya)
    const map = L.map(mapContainerRef.current, {
      center: [26.0, 93.4],
      zoom: 7,
      minZoom: 6,
      maxZoom: 14,
      zoomControl: false,
      scrollWheelZoom: true
    });

    // Clean CartoDB Positron / OSM tiles that blend with topo map themes
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    map.on("click", (e) => {
      if (onMapClick) {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    });

    mapInstanceRef.current = map;

    // Ensure map takes full container bounds
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

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Filter picks if needed
    const filteredPicks = localPicks.filter((pick) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "guide") return pick.requiresGuide;
      if (activeFilter === "seasonal") return pick.seasonal;
      if (activeFilter === "verified") return pick.status === "verified";
      if (activeFilter === "awaiting") return pick.status === "awaiting";
      return true;
    });

    // 1. Certified destinations (Squares)
    certifiedPlaces.forEach((place) => {
      const marker = L.marker(place.coords, {
        icon: createCertifiedIcon(place.name)
      }).addTo(map);

      marker.on("click", () => {
        if (onSelectPlace) onSelectPlace(place);
      });

      markersRef.current.push(marker);
    });

    // 2. Local picks (Circles)
    filteredPicks.forEach((pick) => {
      const marker = L.marker(pick.coords, {
        icon: createPickIcon(pick.name, pick.status, pick.tag)
      }).addTo(map);

      marker.on("click", () => {
        if (onSelectPlace) onSelectPlace(pick);
      });

      markersRef.current.push(marker);
    });
  }, [certifiedPlaces, localPicks, activeFilter, onSelectPlace]);

  // Update Route Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }

    if (routeCoords && routeCoords.length > 1) {
      const poly = L.polyline(routeCoords, {
        color: "var(--kmm-accent, #cf2a2f)",
        weight: 3.5,
        opacity: 0.9,
        dashArray: "6, 6"
      }).addTo(map);

      routePolylineRef.current = poly;
      map.fitBounds(poly.getBounds(), { padding: [50, 50], maxZoom: 10 });
    }
  }, [routeCoords]);

  // Update Simulated Traveler Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!simulatedCoord) {
      if (travelerMarkerRef.current) {
        travelerMarkerRef.current.remove();
        travelerMarkerRef.current = null;
      }
      return;
    }

    if (!travelerMarkerRef.current) {
      travelerMarkerRef.current = L.marker(simulatedCoord, {
        icon: createTravelerIcon(),
        zIndexOffset: 1000
      }).addTo(map);
    } else {
      travelerMarkerRef.current.setLatLng(simulatedCoord);
    }

    map.panTo(simulatedCoord, { animate: true, duration: 0.2 });
  }, [simulatedCoord]);

  // Pan to selected place
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedPlace) return;
    map.flyTo(selectedPlace.coords, Math.max(map.getZoom(), 9), {
      duration: 0.8
    });
  }, [selectedPlace]);

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-lg overflow-hidden border border-[var(--kmm-rule)] shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full min-h-[520px]" />
    </div>
  );
}
