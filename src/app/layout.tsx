import { Routes, Route } from 'react-router-dom'
import Home from './home'
import { ImmersionToggle } from '@/components/home/ImmersionToggle'
import { Sidebar } from '@/components/common/sidebar'

export default function Layout() {
  return (
    <div className="w-full h-screen bg-home">
      <header className="w-full h-20" />
      <div className="flex h-[calc(100vh-80px)]">
        <nav className="w-60 shrink-0 flex flex-col items-start pt-6 px-6 gap-6">
          <ImmersionToggle />
          <Sidebar />
        </nav>
        <main className="flex-1 pb-8 h-full overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
