import { useEffect, useState } from 'react'

export default function TopBar(){
  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className="btn btn--outline">Profil</button>
      </div>
      <div className="topbar__center"></div>
      <div className="topbar__right"><Clock /></div>
    </header>
  )
}

function Clock(){
  const [now, setNow] = useState(new Date())
  useEffect(()=>{ const id=setInterval(()=>setNow(new Date()),1000); return ()=>clearInterval(id)},[])
  const d = now.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric'})
  const t = now.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})
  return <div className="clock">{d}<br/>{t}</div>
}
