'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function InstituteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

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
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/institute"
              className="px-3 py-2 text-institute-muted 
                hover:text-institute-text text-sm transition-colors 
                rounded-lg hover:bg-stone-50 font-serif">
              Research
            </Link>

            <Link href="/institute/fellows"
              className="px-3 py-2 text-institute-muted 
                hover:text-institute-text text-sm transition-colors 
                rounded-lg hover:bg-stone-50 font-serif">
              Fellows
            </Link>
            <Link href="/institute/briefs"
              className="px-3 py-2 text-institute-muted 
                hover:text-institute-text text-sm transition-colors 
                rounded-lg hover:bg-stone-50 font-serif">
              Publications
            </Link>
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
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-institute-muted 
                hover:text-institute-text p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2}
                  d={mobileOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-institute-border 
            py-3 space-y-1">
            <Link href="/institute"
              className="block px-3 py-2 text-institute-muted 
                hover:text-institute-text text-sm font-serif transition-colors"
              onClick={() => setMobileOpen(false)}>
              Research
            </Link>
            <Link href="/institute/fellows"
              className="block px-3 py-2 text-institute-muted 
                hover:text-institute-text text-sm font-serif transition-colors"
              onClick={() => setMobileOpen(false)}>
              Fellows
            </Link>
            <Link href="/institute/briefs"
              className="block px-3 py-2 text-institute-muted 
                hover:text-institute-text text-sm font-serif transition-colors"
              onClick={() => setMobileOpen(false)}>
              Publications
            </Link>
            <Link href="/wire"
              className="block px-3 py-2 text-institute-muted 
                hover:text-institute-text text-sm font-serif transition-colors"
              onClick={() => setMobileOpen(false)}>
              Wire
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
