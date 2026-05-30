'use client'
import Link from 'next/link'
import { useState } from 'react'

const REGIONS = [
  { name: 'Indo-Pacific', slug: 'indo-pacific' },
  { name: 'Euro-Atlantic', slug: 'euro-atlantic' },
  { name: 'MENA', slug: 'mena' },
  { name: 'Sub-Saharan Africa', slug: 'sub-saharan-africa' },
  { name: 'Latin America', slug: 'latin-america' },
]

const TOPICS = [
  { name: 'Geoeconomics', slug: 'geoeconomics' },
  { name: 'Defense & Security', slug: 'defense-security' },
  { name: 'Energy Policy', slug: 'energy-policy' },
  { name: 'Information Warfare', slug: 'information-warfare' },
  { name: 'Global Governance', slug: 'global-governance' },
  { name: 'Maritime Security', slug: 'maritime-security' },
]

export default function WireHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hoveredNav, setHoveredNav] = useState<string | null>(null)

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
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/wire"
              className="px-3 py-2 text-wire-muted hover:text-white 
                text-sm transition-colors rounded-lg hover:bg-wire-card">
              Analysis
            </Link>

            {/* Regions dropdown */}
            <div className="relative"
              onMouseEnter={() => setHoveredNav('regions')}
              onMouseLeave={() => setHoveredNav(null)}>
              <Link href="/wire/regions"
                className="flex items-center gap-1 px-3 py-2 
                  text-wire-muted hover:text-white text-sm 
                  transition-colors rounded-lg hover:bg-wire-card">
                Regions
                <svg className="w-3 h-3 opacity-60" fill="none" 
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" 
                    strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              {hoveredNav === 'regions' && (
                <div className="absolute top-full left-0 mt-1 w-52 
                  bg-wire-bg border border-wire-border rounded-xl 
                  shadow-xl shadow-black/20 py-2 z-50">
                  {REGIONS.map(r => (
                    <Link key={r.slug}
                      href={`/wire/region/${r.slug}`}
                      className="block px-4 py-2 text-sm text-wire-muted 
                        hover:text-white hover:bg-wire-card transition-colors">
                      {r.name}
                    </Link>
                  ))}
                  <div className="border-t border-wire-border mt-2 pt-2">
                    <Link href="/wire/regions"
                      className="block px-4 py-2 text-xs text-wire-accent 
                        hover:bg-wire-card transition-colors">
                      View all regions →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Topics dropdown */}
            <div className="relative"
              onMouseEnter={() => setHoveredNav('topics')}
              onMouseLeave={() => setHoveredNav(null)}>
              <Link href="/wire/topics"
                className="flex items-center gap-1 px-3 py-2 
                  text-wire-muted hover:text-white text-sm 
                  transition-colors rounded-lg hover:bg-wire-card">
                Topics
                <svg className="w-3 h-3 opacity-60" fill="none" 
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" 
                    strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              {hoveredNav === 'topics' && (
                <div className="absolute top-full left-0 mt-1 w-52 
                  bg-wire-bg border border-wire-border rounded-xl 
                  shadow-xl shadow-black/20 py-2 z-50">
                  {TOPICS.map(t => (
                    <Link key={t.slug}
                      href={`/wire/topic/${t.slug}`}
                      className="block px-4 py-2 text-sm text-wire-muted 
                        hover:text-white hover:bg-wire-card transition-colors">
                      {t.name}
                    </Link>
                  ))}
                  <div className="border-t border-wire-border mt-2 pt-2">
                    <Link href="/wire/topics"
                      className="block px-4 py-2 text-xs text-wire-accent 
                        hover:bg-wire-card transition-colors">
                      View all topics →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/wire/experts"
              className="px-3 py-2 text-wire-muted hover:text-white 
                text-sm transition-colors rounded-lg hover:bg-wire-card">
              Experts
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link href="/institute"
              className="hidden md:block text-wire-muted hover:text-white 
                text-xs transition-colors border border-wire-border 
                px-3 py-1.5 rounded-lg hover:border-wire-muted">
              Institute →
            </Link>
            <Link href="/admin/login"
              className="text-wire-muted hover:text-white text-xs 
                transition-colors">
              Admin
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-wire-muted hover:text-white p-1">
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
          <div className="md:hidden border-t border-wire-border py-3 
            space-y-1">
            <Link href="/wire"
              className="block px-3 py-2 text-wire-muted hover:text-white 
                text-sm transition-colors"
              onClick={() => setMobileOpen(false)}>
              Analysis
            </Link>
            <Link href="/wire/regions"
              className="block px-3 py-2 text-wire-muted hover:text-white 
                text-sm transition-colors"
              onClick={() => setMobileOpen(false)}>
              Regions
            </Link>
            {REGIONS.map(r => (
              <Link key={r.slug}
                href={`/wire/region/${r.slug}`}
                className="block px-6 py-1.5 text-wire-muted hover:text-white 
                  text-xs transition-colors"
                onClick={() => setMobileOpen(false)}>
                · {r.name}
              </Link>
            ))}
            <Link href="/wire/topics"
              className="block px-3 py-2 text-wire-muted hover:text-white 
                text-sm transition-colors"
              onClick={() => setMobileOpen(false)}>
              Topics
            </Link>
            {TOPICS.map(t => (
              <Link key={t.slug}
                href={`/wire/topic/${t.slug}`}
                className="block px-6 py-1.5 text-wire-muted hover:text-white 
                  text-xs transition-colors"
                onClick={() => setMobileOpen(false)}>
                · {t.name}
              </Link>
            ))}
            <Link href="/wire/experts"
              className="block px-3 py-2 text-wire-muted hover:text-white 
                text-sm transition-colors"
              onClick={() => setMobileOpen(false)}>
              Experts
            </Link>
            <Link href="/institute"
              className="block px-3 py-2 text-wire-muted hover:text-white 
                text-sm transition-colors"
              onClick={() => setMobileOpen(false)}>
              Institute
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
