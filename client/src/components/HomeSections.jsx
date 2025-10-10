export function SearchSection(){
  return (
    <section className="searchSection">
      <div className="searchBar">
        <span className="searchIcon" aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
            <path d="M20 20L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </span>
        <input placeholder="Rechercher un patient" aria-label="Rechercher un patient" />
        <button className="btn">Rechercher</button>
      </div>
      <p className="hint">Tape un nom pour vérifier si le patient est déjà connu.</p>
    </section>
  )
}

export function RecentViewed(){
  return (
    <section className="recent">
      <h2>Dernières fiches consultées</h2>
      <div className="recent__grid">
        <article className="recent__card" />
        <article className="recent__card" />
        <article className="recent__card" />
      </div>
    </section>
  )
}
