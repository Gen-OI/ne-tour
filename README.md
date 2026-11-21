# Offbeat Northeast — Locals' Guide to Hidden Places

A responsive travel landing page and community map where locals recommend hidden places near famous certified destinations across Northeast India.

Template design base: **Kamm Trek Landing** by **@kedhareswer (MIT)**.  
MIT License details preserved in [LICENSE-template](file:///c:/Users/ASUS%20TUF%20GAMING%20A15/OneDrive/Desktop/NE%20Tour/LICENSE-template).

---

## Features

1. **Lit Relief Hero Model**:
   - Stylised procedural 2.5D relief model of the Eastern Himalayan and Patkai hill ranges with waymark red trail connecting 6 certified regional anchors.
   - Clickable destination pins, "Explore the map" quick jump, and "+ Add a local pick" trigger.
2. **How to Read a Local Pick (Map Legend)**:
   - Cartographic markers explained: Certified destination (square), Local pick (circle), Verified by locals, Awaiting verification (dashed), Visit with a local guide, Seasonal, and Community Vouches.
3. **Featured Route (Topographic Map Sheet)**:
   - Topographic contour map showing the *Southern Angami Highlands Trail* (Kisama Heritage Village to Khonoma to Dzukou Valley North Ridge) with elevation gain/loss, walking times, and local tips.
4. **Vouched Local Picks**:
   - Pick cards with individual topographic map excerpts, local quotes, contributor name & role, best season, access notes, and instant vouching.
5. **Explore the Map (Embedded App)**:
   - OpenStreetMap / Leaflet interactive map with custom square and circle markers.
   - "Locals' Picks" pop-up / drawer when destinations are selected.
   - Interactive route planning between certified hubs with distance, travel time, and automatic suggestion of local picks along the corridor.
   - Live journey simulation with animated traveler marker.
   - Trip list bookmarking.
   - "+ Add a local pick" form to submit new places.
   - Passcode-protected community admin review panel (`demo123`).
6. **Local-led Walks**:
   - Illustrative upcoming community departures with dates, resident guides, difficulty, and places left.
7. **Notes from Locals**:
   - Hut-book styled community logbook entries built from local quotes and vouch counts.
8. **Ask a Local Host**:
   - Contact and inquiry form with validation and confirmation feedback.
9. **Themes & Presets**:
   - Default: **Golden Hour** day map.
   - Toggle: **Alpenglow** night map.
   - Preset: **Winter Frost** seasonal palette switch.
   - System light / dark preference detection (`prefers-color-scheme`).
   - `prefers-reduced-motion` accessibility support.

---

## Development

```bash
# Start development server
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

---

## Verification & Editorial Notes
> [!NOTE]
> Coordinates marked with `verify: true` in [src/data/places.js](file:///c:/Users/ASUS%20TUF%20GAMING%20A15/OneDrive/Desktop/NE%20Tour/src/data/places.js) (such as Dzukou Valley North Ridge and Mawryngkhang Bamboo Trail) should be verified with village elders and local guides before trekking into backcountry zones.
> 
> *Sample content: the places are real, but the quotes, names, dates and coordinates are illustrative.*
