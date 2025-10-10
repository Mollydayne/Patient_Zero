import React from 'react'


export function SearchSection(){
return (
<section className="searchSection">
<div className="searchBar">
<span className="searchIcon" aria-hidden>
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M20 20L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
</span>
<input placeholder="Rechercher un patient" aria-label="Rechercher un patient" />
<button className="btn">Rechercher</button>
</div>
<p className="hint">Tape un nom pour vérifier si le patient est déjà connu.</p>
</section>
)
}


export function RecentViewed(){
const cards = [
{ id: 1, name: 'Fiche #1' },
{ id: 2, name: 'Fiche #2' },
{ id: 3, name: 'Fiche #3' },
]
return (
<section className="recent">
<h2>Dernières fiches consultées</h2>
<div className="recent__grid">
{cards.map(c => (
<article key={c.id} className="recent__card" aria-label={c.name} />
))}
</div>
</section>
)
}