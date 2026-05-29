'use client'
import Link from 'next/link'
import { useState } from 'react'

export function WireHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-wire-bg border-b border-wire-border sticky 
      top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/wire" className="flex items-center gap-2">
            <span className="text-white font-bold text-lg 
              tracking-widest uppercase">
              Stratosphere
            </span>
            <span className="text-wire-accent text-sm font-medium 
              bg-wire-accent/10 px-2 py-0.5 rounded">
              Wire
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {[
              { href: '/wire', label: 'Analysis' },
              { href: '/wire/regions', label: 'Regions' },
              { href: '/wire/topics', label: 'Topics' },
              { href: '/wire/experts', label: 'Experts' },
            ].map(item => (
              <Link key={item.href} href={item.href}
                className="text-wire-muted hover:text-white text-sm 
                  transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link href="/institute"
              className="hidden md:block text-wire-muted hover:text-white 
                text-xs transition-colors border border-wire-border 
                px-3 py-1.5 rounded-lg hover:border-wire-muted">
              Institute →
            </Link>
            <Link href="/admin"
              className="text-wire-muted hover:text-white text-xs 
                transition-colors">
              Admin
            </Link>
            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-wire-muted hover:text-white p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2}
                  d={menuOpen 
                    ? "M6 18L18 6M6 6l12 12" 
                    : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-wire-border py-3 
            space-y-1">
            {[
              { href: '/wire', label: 'Analysis' },
              { href: '/wire/regions', label: 'Regions' },
              { href: '/wire/topics', label: 'Topics' },
              { href: '/wire/experts', label: 'Experts' },
              { href: '/institute', label: 'Institute' },
            ].map(item => (
              <Link key={item.href} href={item.href}
                className="block px-2 py-2 text-wire-muted 
                  hover:text-white text-sm transition-colors"
                onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}

export default WireHeader
