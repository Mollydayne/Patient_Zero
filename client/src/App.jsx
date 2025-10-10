import TopBar from './components/TopBar.jsx'
import LogoHeader from './components/LogoHeader.jsx'
import { SearchSection, RecentViewed } from './components/HomeSections.jsx'

export default function App(){
  return (
    <div className="app light">
      <TopBar />
      <main className="container">
        <LogoHeader />
        <SearchSection />
        <RecentViewed />
      </main>
      <footer className="footer muted">© {new Date().getFullYear()} Patient Zero</footer>
    </div>
  )
}
