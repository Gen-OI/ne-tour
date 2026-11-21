import React, { useState } from "react";
import { placesStore } from "../lib/placesStore";

export default function AdminDialog({ isOpen, onClose, places = [] }) {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === "demo123") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid passcode. Hint: demo123");
    }
  };

  const handleVerify = (id) => {
    placesStore.verifyPick(id);
  };

  const handleDelete = (id) => {
    if (confirm("Remove this place from community listings?")) {
      placesStore.deletePlace(id);
    }
  };

  const localPicks = places.filter((p) => p.type === "pick");

  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-[var(--kmm-sheet)] text-[var(--kmm-ink)] border border-[var(--kmm-rule)] rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[var(--kmm-rule)] flex items-center justify-between bg-[var(--kmm-bg)]">
          <div>
            <h3 className="font-bold text-base text-[var(--kmm-ink)]">Community Admin Review</h3>
            <p className="text-xs text-[var(--kmm-muted)]">
              Manage vouched local recommendations and pending submissions
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[var(--kmm-muted)] hover:text-[var(--kmm-ink)]"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="p-8 max-w-sm mx-auto w-full space-y-4 text-center">
            <div>
              <div className="w-10 h-10 rounded-full bg-[var(--kmm-faint)] flex items-center justify-center mx-auto text-lg mb-2">
                🔒
              </div>
              <h4 className="font-bold text-sm text-[var(--kmm-ink)]">Admin Authentication</h4>
              <p className="text-xs text-[var(--kmm-muted)] mt-1">
                Enter the community review passcode (default: <code>demo123</code>)
              </p>
            </div>

            <div>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Passcode"
                className="w-full p-2.5 rounded bg-[var(--kmm-bg)] border border-[var(--kmm-rule)] text-[var(--kmm-ink)] text-center text-sm focus:outline-none focus:border-[var(--kmm-accent)]"
              />
              {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded bg-[var(--kmm-accent)] text-white font-semibold text-xs hover:opacity-90 transition-opacity"
            >
              Sign In to Review
            </button>
          </form>
        ) : (
          <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
            <div className="flex items-center justify-between bg-[var(--kmm-faint)] p-2.5 rounded border border-[var(--kmm-rule)]">
              <span className="text-[var(--kmm-muted)]">
                Logged in as <b>Community Moderator</b>
              </span>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-[var(--kmm-accent)] hover:underline font-medium"
              >
                Lock Session
              </button>
            </div>

            <div className="divide-y divide-[var(--kmm-rule)] border border-[var(--kmm-rule)] rounded">
              {localPicks.map((pick) => {
                const isPending = pick.status === "awaiting";
                return (
                  <div
                    key={pick.id}
                    className="p-3 flex items-start justify-between gap-3 bg-[var(--kmm-sheet)] hover:bg-[var(--kmm-bg)] transition-colors"
                  >
                    <div className="space-y-1 max-w-md">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[var(--kmm-ink)]">{pick.name}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                            isPending
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                              : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          }`}
                        >
                          {pick.tag || pick.status}
                        </span>
                      </div>
                      <p className="text-[var(--kmm-soft)] italic">"{pick.quote}"</p>
                      <div className="text-[11px] text-[var(--kmm-muted)] flex items-center gap-3">
                        <span>
                          By {pick.addedBy} ({pick.role})
                        </span>
                        <span>•</span>
                        <span>{pick.vouches || 0} vouches</span>
                        <span>•</span>
                        <span>{pick.state}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isPending && (
                        <button
                          onClick={() => handleVerify(pick.id)}
                          className="px-2.5 py-1 rounded bg-emerald-600 text-white font-medium hover:bg-emerald-700"
                        >
                          ✓ Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(pick.id)}
                        className="px-2 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
