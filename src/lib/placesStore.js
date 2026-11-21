import { ALL_PLACES, CERTIFIED_DESTINATIONS, LOCAL_PICKS } from "../data/places.js";

const STORAGE_KEY = "offbeat_ne_places_v1";
const TRIPS_KEY = "offbeat_ne_trips_v1";

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Storage error:", e);
  }
}

class PlacesStore {
  constructor() {
    this.places = loadFromStorage(STORAGE_KEY, ALL_PLACES);
    this.trips = loadFromStorage(TRIPS_KEY, ["pick-khonoma", "pick-dzukou"]);
    this.selectedPlace = this.places.find(p => p.id === "cert-kisama") || this.places[0];
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this);
      } catch (err) {
        console.error("Listener error:", err);
      }
    }
  }

  getCertifiedDestinations() {
    return this.places.filter(p => p.type === "certified");
  }

  getLocalPicks() {
    return this.places.filter(p => p.type === "pick");
  }

  getPicksNear(certifiedId) {
    return this.places.filter(p => p.type === "pick" && p.nearCertifiedId === certifiedId);
  }

  setSelectedPlace(place) {
    this.selectedPlace = place;
    this.notify();
  }

  vouch(placeId) {
    this.places = this.places.map(p => {
      if (p.id === placeId) {
        return { ...p, vouches: (p.vouches || 0) + 1 };
      }
      return p;
    });
    saveToStorage(STORAGE_KEY, this.places);
    this.notify();
  }

  addPick(draft) {
    const newPick = {
      id: "pick-" + Date.now().toString(36),
      type: "pick",
      status: "awaiting",
      tag: "Awaiting verification",
      vouches: 1,
      verify: false,
      ...draft
    };
    this.places = [newPick, ...this.places];
    saveToStorage(STORAGE_KEY, this.places);
    this.notify();
    return newPick;
  }

  verifyPick(placeId) {
    this.places = this.places.map(p => {
      if (p.id === placeId) {
        return {
          ...p,
          status: "verified",
          tag: "Verified by locals"
        };
      }
      return p;
    });
    saveToStorage(STORAGE_KEY, this.places);
    this.notify();
  }

  deletePlace(placeId) {
    this.places = this.places.filter(p => p.id !== placeId);
    saveToStorage(STORAGE_KEY, this.places);
    this.notify();
  }

  toggleTrip(placeId) {
    if (this.trips.includes(placeId)) {
      this.trips = this.trips.filter(id => id !== placeId);
    } else {
      this.trips = [...this.trips, placeId];
    }
    saveToStorage(TRIPS_KEY, this.trips);
    this.notify();
  }

  isInTrip(placeId) {
    return this.trips.includes(placeId);
  }
}

export const placesStore = new PlacesStore();
