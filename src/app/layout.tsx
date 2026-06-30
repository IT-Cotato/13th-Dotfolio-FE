import { Routes, Route } from 'react-router-dom'
import Home from './home'

export default function Layout() {
  return (
    <div className="w-full h-screen">
      <header className="w-full h-[80px] border-b border-[var(--color-grey-100)]" />
      <div className="flex h-[calc(100vh-80px)]">
        <nav className="w-[240px] shrink-0 border-r border-[var(--color-grey-100)]" />
        <main className="flex-1 px-6 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
