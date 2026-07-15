import { Routes, Route } from 'react-router-dom'
import Home from './home'
import Record from './record'
import { ImmersionToggle } from '@/components/home/ImmersionToggle'
import { Sidebar } from '@/components/common/sidebar'
import AlarmIcon from '@/assets/alarm.svg'
import ProfileIcon from '@/assets/profile.svg'
import MenuIcon from '@/assets/menu.svg'

export default function Layout() {
  return (
    <div className="w-full h-screen bg-home">
      <header className="w-full h-20 relative flex items-center justify-between pl-8 pr-6">
        <div className="flex items-center gap-4">
          <MenuIcon className="w-6 h-6 text-grey-700 cursor-pointer" />
          <span className="font-nexon text-logo text-grey-600">Dotfolio</span>
        </div>
        <div className="flex items-center gap-5">
          <div className="relative p-0.75">
            <AlarmIcon className="w-6 h-6 text-grey-700 cursor-pointer"  />
            <span className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-error-text" />
          </div>
          <ProfileIcon className="w-6 h-6 text-grey-700 cursor-pointer" />
        </div>
      </header>
      <div className="flex h-[calc(100vh-80px)]">
        <nav className="w-60 shrink-0 flex flex-col items-start py-6 px-6 gap-6">
          <ImmersionToggle />
          <Sidebar />
        </nav>
        <main className="flex-1 pb-8 pr-6 h-full overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/record" element={<Record />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
