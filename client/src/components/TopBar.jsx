import { useEffect, useState } from 'react'

export default function TopBar(){
  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className="btn btn--outline">Profil</button>
      </div>
      <div className="topbar__center"></div>
      <div className="topbar__right"><Clock offsetYears={9} /></div>
    </header>
  )
}

function addYearsClamped(date, years) {
  // Ajoute des années en évitant les bugs de 29 fév -> 1er mars
  const d = new Date(date)
  const month = d.getMonth()
  d.setFullYear(d.getFullYear() + years)
  if (d.getMonth() !== month) d.setDate(0) // recule au dernier jour du mois précédent si overflow
  return d
}

function Clock({ offsetYears = 0 }){
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // Date/heure "in-game" = temps réel décalé
  const gameNow = addYearsClamped(now, offsetYears)

  const d = gameNow.toLocaleDateString('fr-FR', { day:'2-digit', month:'2-digit', year:'numeric' })
  const t = gameNow.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })

  return (
    <div className="clock text-right leading-tight" data-era={`+${offsetYears}y`}>
      {d}<br/>{t}
    </div>
  )
}
