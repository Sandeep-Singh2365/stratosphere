'use client'
import Link from 'next/link'
import { useState } from 'react'

export function InstituteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-institute-card border-b border-institute-border 
      sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/institute" className="flex items-center gap-2">
            <span className="text-institute-text font-serif font-bold 
              text-lg tracking-wide uppercase">
              Stratosphere
            </span>
            <span className="text-institute-accent text-sm font-serif 
              font-medium bg-amber-50 px-2 py-0.5 rounded 
              border border-amber-200">
              Institute
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {[
              { href: '/institute', label: 'Research' },
              { href: '/institute/briefs', label: 'Publications' },
              { href: '/institute/fellows', label: 'Fellows' },
            ].map(item => (
              <Link key={item.href} href={item.href}
                className="text-institute-muted hover:text-institute-text 
                  text-sm transition-colors font-serif">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link href="/wire"
              className="hidden md:block text-institute-muted 
                hover:text-institute-text text-xs transition-colors 
                border border-institute-border px-3 py-1.5 rounded-lg 
                hover:border-institute-muted">
              Wire →
            </Link>
            <Link href="/admin/login"
              className="text-institute-muted hover:text-institute-text 
                text-xs transition-colors">
              Admin
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-institute-muted 
                hover:text-institute-text p-1"
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
          <div className="md:hidden border-t border-institute-border 
            py-3 space-y-1">
            {[
              { href: '/institute', label: 'Research' },
              { href: '/institute/briefs', label: 'Publications' },
              { href: '/institute/fellows', label: 'Fellows' },
              { href: '/wire', label: 'Wire' },
            ].map(item => (
              <Link key={item.href} href={item.href}
                className="block px-2 py-2 text-institute-muted 
                  hover:text-institute-text text-sm font-serif 
                  transition-colors"
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

export default InstituteHeader
