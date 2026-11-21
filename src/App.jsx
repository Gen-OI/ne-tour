import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import NETourHero from "./components/template/NETourHero.jsx";
import ExploreSection from "./components/ExploreSection.jsx";
import ShareSection from "./components/ShareSection.jsx";
import Footer from "./components/Footer.jsx";
import AdminModal from "./components/AdminModal.jsx";
import { fetchApprovedPlaces, fetchPendingPlaces } from "./lib/supabase.js";

export default function App() {
  const [places, setPlaces] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load public approved places
  const loadApproved = async () => {
    try {
      const data = await fetchApprovedPlaces();
      setPlaces(data || []);
    } catch (err) {
      console.error("Failed to load approved places:", err);
    } finally {
      setLoading(false);
    }
  };

  // Check pending places count for admin badge
  const checkPending = async () => {
    try {
      const pending = await fetchPendingPlaces();
      setPendingCount(pending ? pending.length : 0);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    loadApproved();
    checkPending();
  }, []);

  const handlePlaceSubmitted = () => {
    checkPending();
  };

  const handlePlaceApproved = () => {
    loadApproved();
    checkPending();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] text-[#2b261d]">
      {/* Navigation */}
      <Navbar
        onOpenAdmin={() => setIsAdminOpen(true)}
        pendingCount={pendingCount}
      />

      {/* Hero Section */}
      <NETourHero totalPlaces={places.length} onExplore={() => { const el = document.getElementById('explore'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} onAdd={() => { const el = document.getElementById('share'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} />

      <main className="flex-1">
        {/* Section 2: Explore Places (For Travellers) */}
        <ExploreSection places={places} />

        {/* Section 1: Share a Place (For Locals) */}
        <ShareSection onPlaceSubmitted={handlePlaceSubmitted} />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Admin Review Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onPlaceApproved={handlePlaceApproved}
      />
    </div>
  );
}
