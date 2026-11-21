import React, { useState, useEffect } from "react";
import { fetchPendingPlaces, approvePlace, rejectPlace } from "../lib/supabase";

export default function AdminModal({ isOpen, onClose, onPlaceApproved }) {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingPlaces, setPendingPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loadPending = async () => {
    setLoading(true);
    try {
      const data = await fetchPendingPlaces();
      setPendingPlaces(data);
    } catch (err) {
      console.error("Error loading pending places:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadPending();
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === "admin123" || passcode === "demo123") {
      setIsAuthenticated(true);
      setErrorMsg("");
      loadPending();
    } else {
      setErrorMsg("Incorrect passcode. (Default: admin123)");
    }
  };

  const handleApprove = async (placeId) => {
    try {
      await approvePlace(placeId);
      setPendingPlaces((prev) => prev.filter((p) => p.id !== placeId));
      if (onPlaceApproved) onPlaceApproved(placeId);
    } catch (err) {
      alert("Error approving place");
    }
  };

  const handleReject = async (placeId) => {
    if (confirm("Reject and remove this submission?")) {
      try {
        await rejectPlace(placeId);
        setPendingPlaces((prev) => prev.filter((p) => p.id !== placeId));
      } catch (err) {
        alert("Error rejecting place");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-[#ffffff] text-[#1b4332] border border-[#ede8dc] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#ede8dc] bg-[#f7f4ed] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔒</span>
            <div>
              <h3 className="font-bold text-base text-[#1b4332]">
                Community Moderator Review
              </h3>
              <p className="text-xs text-[#40916c]">
                Review submissions before they appear publicly on the map
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="p-8 max-w-sm mx-auto w-full space-y-4 text-center">
            <p className="text-xs text-gray-600">
              Enter moderator passcode to review community submissions:
            </p>
            <input
              type="password"
              autoFocus
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Passcode (admin123)"
              className="w-full p-2.5 rounded-xl bg-[#f7f4ed] border border-[#ede8dc] text-sm text-center text-[#1b4332] focus:outline-none focus:border-[#2d6a4f]"
            />
            {errorMsg && <p className="text-xs text-red-600">{errorMsg}</p>}
            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-[#1b4332] text-white text-xs font-semibold hover:bg-[#2d6a4f] transition-colors"
            >
              Sign In
            </button>
          </form>
        ) : (
          <div className="p-5 overflow-y-auto flex-1 space-y-4">
            <div className="flex items-center justify-between text-xs bg-[#fdfbf7] p-3 rounded-xl border border-[#ede8dc]">
              <span>
                Pending Submissions: <b>{pendingPlaces.length}</b>
              </span>
              <button
                onClick={loadPending}
                className="text-[#2d6a4f] hover:underline font-semibold"
              >
                ↻ Refresh
              </button>
            </div>

            {loading ? (
              <p className="text-xs text-center py-8 text-gray-500">
                Loading submissions...
              </p>
            ) : pendingPlaces.length === 0 ? (
              <div className="text-center py-12 space-y-2 text-gray-500">
                <span className="text-3xl">✓</span>
                <p className="text-sm font-semibold text-[#1b4332]">
                  No pending submissions!
                </p>
                <p className="text-xs">
                  All local recommendations have been reviewed and approved.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingPlaces.map((place) => (
                  <div
                    key={place.id}
                    className="p-4 bg-[#fdfbf7] border border-[#ede8dc] rounded-xl flex flex-col sm:flex-row gap-4 justify-between items-start"
                  >
                    <div className="flex gap-3">
                      {place.photo_url && (
                        <img
                          src={place.photo_url}
                          alt={place.name}
                          className="w-20 h-20 rounded-lg object-cover shrink-0"
                        />
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[#1b4332]">
                            {place.name}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                            Pending
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {place.state} &bull; Shared by <b>{place.contributor_name}</b>
                        </p>
                        <p className="text-xs italic text-[#2b261d]">
                          "{place.recommendation}"
                        </p>
                        {place.precautions && (
                          <p className="text-[11px] text-amber-800">
                            <b>Precautions:</b> {place.precautions}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                      <button
                        onClick={() => handleApprove(place.id)}
                        className="flex-1 px-4 py-1.5 rounded-full bg-[#1b4332] text-white text-xs font-semibold hover:bg-[#2d6a4f] shadow-xs"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleReject(place.id)}
                        className="flex-1 px-4 py-1.5 rounded-full border border-red-300 text-red-600 text-xs font-medium hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
