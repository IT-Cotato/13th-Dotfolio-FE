import { Routes, Route } from 'react-router-dom'
import Home from './home'

export default function Layout() {
  return (
    <div className="w-full h-screen bg-home">
      <header className="w-full h-[80px]" />
      <div className="flex h-[calc(100vh-80px)]">
        <nav className="w-[240px] shrink-0" />
        <main className="flex-1 px-6 pt-6 pb-8 h-full">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
