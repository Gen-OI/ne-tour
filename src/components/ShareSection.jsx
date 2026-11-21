import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { submitPlace } from "../lib/supabase";

const NORTHEAST_STATES = [
  "Arunachal Pradesh",
  "Assam",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Sikkim",
  "Tripura"
];

// Default coordinates centered near Northeast India
const DEFAULT_COORDS = [26.0, 93.0];

export default function ShareSection({ onPlaceSubmitted }) {
  const [formData, setFormData] = useState({
    name: "",
    state: "Nagaland",
    latitude: 25.65,
    longitude: 94.05,
    description: "",
    recommendation: "",
    best_season: "October to April",
    precautions: "",
    contributor_name: ""
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Initialize interactive location picker map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [formData.latitude, formData.longitude],
      zoom: 7,
      minZoom: 5,
      maxZoom: 15,
      zoomControl: false
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19
      }
    ).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    const pinIcon = L.divIcon({
      className: "picker-pin-wrapper",
      html: '<div class="picker-pin"></div>',
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });

    const marker = L.marker([formData.latitude, formData.longitude], {
      icon: pinIcon,
      draggable: true
    }).addTo(map);

    markerRef.current = marker;
    mapInstanceRef.current = map;

    // Click map to set pin
    map.on("click", (e) => {
      const lat = parseFloat(e.latlng.lat.toFixed(4));
      const lng = parseFloat(e.latlng.lng.toFixed(4));
      marker.setLatLng([lat, lng]);
      setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
    });

    // Drag pin to adjust
    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      const lat = parseFloat(pos.lat.toFixed(4));
      const lng = parseFloat(pos.lng.toFixed(4));
      setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Image File Selection
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Photograph file size should be under 10MB.");
        return;
      }
      setPhotoFile(file);
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.name.trim()) {
      setErrorMsg("Please enter the place name.");
      return;
    }
    if (!formData.recommendation.trim()) {
      setErrorMsg("Please tell travellers why locals recommend this place.");
      return;
    }
    if (!formData.contributor_name.trim()) {
      setErrorMsg("Please provide your name as the contributor.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitPlace(formData, photoFile);
      if (result.success) {
        setSubmittedSuccess(true);
        if (onPlaceSubmitted) onPlaceSubmitted(result.data);

        // Reset form
        setFormData({
          name: "",
          state: "Nagaland",
          latitude: 25.65,
          longitude: 94.05,
          description: "",
          recommendation: "",
          best_season: "October to April",
          precautions: "",
          contributor_name: ""
        });
        setPhotoFile(null);
        setPhotoPreview(null);
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setErrorMsg("Could not submit the place. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="share" className="py-16 sm:py-24 bg-[#f7f4ed] border-t border-[#ede8dc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-bold tracking-wider uppercase text-[#40916c] block">
            Section 1 &bull; For Locals
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1b4332] tracking-tight">
            Share a Hidden Place
          </h2>
          <p className="text-sm sm:text-base text-[#2b261d]/80 leading-relaxed">
            Know a secluded sacred forest, river pool, or community craft cloister in your village? Recommend it to responsible travellers.
          </p>
        </div>

        {/* Success Confirmation Box */}
        {submittedSuccess ? (
          <div className="bg-white border-2 border-[#2d6a4f] rounded-2xl p-8 sm:p-12 text-center shadow-lg space-y-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-[#d8f3dc] text-[#1b4332] flex items-center justify-center text-3xl font-bold mx-auto">
              ✓
            </div>
            <h3 className="text-2xl font-bold text-[#1b4332]">
              Thank You for Your Recommendation!
            </h3>
            <p className="text-sm text-[#2b261d]/80 max-w-lg mx-auto leading-relaxed">
              Your place has been recorded. To protect local communities and maintain trust, new submissions remain <b>pending</b> until reviewed by local moderators.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => setSubmittedSuccess(false)}
                className="px-6 py-2.5 rounded-full bg-[#1b4332] text-[#fdfbf7] font-semibold text-xs hover:bg-[#2d6a4f] transition-all"
              >
                + Share Another Place
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#ede8dc] rounded-2xl p-6 sm:p-10 shadow-sm space-y-6"
          >
            {errorMsg && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* 1. Place Name & State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#1b4332] uppercase tracking-wider mb-2">
                  Place Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Khonoma Terraced Alder Sanctuary"
                  className="w-full p-3 rounded-xl bg-[#f7f4ed] border border-[#ede8dc] text-sm text-[#1b4332] focus:outline-none focus:border-[#2d6a4f] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b4332] uppercase tracking-wider mb-2">
                  State Selection *
                </label>
                <select
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  className="w-full p-3 rounded-xl bg-[#f7f4ed] border border-[#ede8dc] text-sm text-[#1b4332] focus:outline-none focus:border-[#2d6a4f] focus:bg-white transition-all font-medium"
                >
                  {NORTHEAST_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Photograph Upload */}
            <div>
              <label className="block text-xs font-bold text-[#1b4332] uppercase tracking-wider mb-2">
                Photograph Upload
              </label>
              <div className="border-2 border-dashed border-[#ede8dc] hover:border-[#40916c] rounded-2xl p-4 sm:p-6 text-center transition-all bg-[#fdfbf7]">
                {photoPreview ? (
                  <div className="relative inline-block">
                    <img
                      src={photoPreview}
                      alt="Upload preview"
                      className="max-h-56 rounded-xl object-cover shadow-sm mx-auto"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreview(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 text-xs"
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-3xl text-[#40916c]">📷</div>
                    <p className="text-xs font-semibold text-[#1b4332]">
                      Click to choose a landscape photograph
                    </p>
                    <p className="text-[11px] text-gray-500">
                      JPG, PNG or WEBP up to 10MB
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      id="photo-upload-input"
                    />
                    <label
                      htmlFor="photo-upload-input"
                      className="inline-block mt-1 px-4 py-2 rounded-full bg-[#ede8dc] hover:bg-[#dfd8c5] text-[#1b4332] text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Browse Device
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Location Selection Using Map */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-[#1b4332] uppercase tracking-wider">
                  Location Selection Using Map *
                </label>
                <span className="text-[11px] font-mono bg-[#ede8dc] text-[#1b4332] px-2 py-0.5 rounded">
                  Pinned: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-2">
                Click anywhere on the map or drag the pin to set the exact coordinates of this hidden place.
              </p>
              <div className="h-56 sm:h-64 rounded-xl overflow-hidden border border-[#ede8dc] relative shadow-inner">
                <div ref={mapContainerRef} className="w-full h-full" />
              </div>
            </div>

            {/* 4. Short Description */}
            <div>
              <label className="block text-xs font-bold text-[#1b4332] uppercase tracking-wider mb-2">
                Short Description *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="What kind of place is this? (e.g. A serene mountain river basin framed by ancient alder agroforests...)"
                className="w-full p-3 rounded-xl bg-[#f7f4ed] border border-[#ede8dc] text-sm text-[#1b4332] focus:outline-none focus:border-[#2d6a4f] focus:bg-white transition-all"
              />
            </div>

            {/* 5. Why Locals Recommend This Place */}
            <div>
              <label className="block text-xs font-bold text-[#1b4332] uppercase tracking-wider mb-2">
                Why Locals Recommend This Place *
              </label>
              <textarea
                required
                rows={3}
                value={formData.recommendation}
                onChange={(e) =>
                  setFormData({ ...formData, recommendation: e.target.value })
                }
                placeholder="What makes this place special to residents? (e.g. The morning mist at dawn, traditional smoked tea at the village morung...)"
                className="w-full p-3 rounded-xl bg-[#f7f4ed] border border-[#ede8dc] text-sm text-[#1b4332] focus:outline-none focus:border-[#2d6a4f] focus:bg-white transition-all"
              />
            </div>

            {/* 6. Best Visiting Season & Travel Precautions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#1b4332] uppercase tracking-wider mb-2">
                  Best Visiting Season *
                </label>
                <input
                  type="text"
                  required
                  value={formData.best_season}
                  onChange={(e) =>
                    setFormData({ ...formData, best_season: e.target.value })
                  }
                  placeholder="e.g. October to April, or monsoon for lilies"
                  className="w-full p-3 rounded-xl bg-[#f7f4ed] border border-[#ede8dc] text-sm text-[#1b4332] focus:outline-none focus:border-[#2d6a4f] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b4332] uppercase tracking-wider mb-2">
                  Travel Precautions
                </label>
                <input
                  type="text"
                  value={formData.precautions}
                  onChange={(e) =>
                    setFormData({ ...formData, precautions: e.target.value })
                  }
                  placeholder="e.g. ILP permit needed; steep walking path; carry reusable bottles"
                  className="w-full p-3 rounded-xl bg-[#f7f4ed] border border-[#ede8dc] text-sm text-[#1b4332] focus:outline-none focus:border-[#2d6a4f] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* 7. Contributor Name */}
            <div>
              <label className="block text-xs font-bold text-[#1b4332] uppercase tracking-wider mb-2">
                Contributor Name *
              </label>
              <input
                type="text"
                required
                value={formData.contributor_name}
                onChange={(e) =>
                  setFormData({ ...formData, contributor_name: e.target.value })
                }
                placeholder="e.g. Kevisato Angami, Village Conservation Guide"
                className="w-full p-3 rounded-xl bg-[#f7f4ed] border border-[#ede8dc] text-sm text-[#1b4332] focus:outline-none focus:border-[#2d6a4f] focus:bg-white transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3 border-t border-[#ede8dc]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-[#1b4332] hover:bg-[#2d6a4f] text-[#fdfbf7] font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Submitting Place...</span>
                ) : (
                  <span>🌿 Submit Place for Community Review</span>
                )}
              </button>
              <p className="text-center text-[11px] text-gray-500 mt-2.5">
                New submissions stay pending until verified to ensure respectful and responsible travel.
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
