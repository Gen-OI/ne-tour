


// Uses the KxSans and KxSerif fonts defined in index.css

({ onExplore, onAdd }) {
  return (
    <section className="relative bg-forest-100 text-cream-100 py-20 text-center overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">Discover the Northeast Beyond the Ordinary.</h1>
        <p className="text-xl mb-8">Hidden places, shared by the people who know them best.</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onExplore}
            className="px-6 py-3 bg-cream-200 text-forest-800 font-semibold rounded hover:bg-cream-300 transition"
          >
            Explore Hidden Places
          </button>
          <button
            onClick={onAdd}
            className="px-6 py-3 bg-forest-600 text-cream-100 font-semibold rounded hover:bg-forest-700 transition"
          >
            Share a Hidden Place
          </button>
        </div>
      </div>
    </section>
  );
}
