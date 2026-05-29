'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

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

export function WireHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<'regions' | 'topics' | null>(null)

  const regionsRef = useRef<HTMLDivElement>(null)
  const topicsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        openDropdown === 'regions' && 
        regionsRef.current && 
        !regionsRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null)
      }
      if (
        openDropdown === 'topics' && 
        topicsRef.current && 
        !topicsRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openDropdown])

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
            <Link href="/wire" className="text-wire-muted hover:text-white text-sm transition-colors">
              Analysis
            </Link>

            {/* Regions Dropdown */}
            <div className="relative" ref={regionsRef}>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'regions' ? null : 'regions')}
                className="text-wire-muted hover:text-white text-sm transition-colors flex items-center gap-1 focus:outline-none"
              >
                Regions <span className="text-[10px]">▼</span>
              </button>
              {openDropdown === 'regions' && (
                <div className="absolute left-0 mt-2 bg-wire-bg border border-wire-border rounded-lg shadow-lg z-50 py-2 min-w-40">
                  {REGIONS.map(r => (
                    <Link
                      key={r.slug}
                      href={`/wire/region/${r.slug}`}
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2 text-sm text-wire-muted hover:text-white hover:bg-wire-card transition-colors"
                    >
                      {r.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Topics Dropdown */}
            <div className="relative" ref={topicsRef}>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'topics' ? null : 'topics')}
                className="text-wire-muted hover:text-white text-sm transition-colors flex items-center gap-1 focus:outline-none"
              >
                Topics <span className="text-[10px]">▼</span>
              </button>
              {openDropdown === 'topics' && (
                <div className="absolute left-0 mt-2 bg-wire-bg border border-wire-border rounded-lg shadow-lg z-50 py-2 min-w-48">
                  {TOPICS.map(t => (
                    <Link
                      key={t.slug}
                      href={`/wire/topic/${t.slug}`}
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2 text-sm text-wire-muted hover:text-white hover:bg-wire-card transition-colors"
                    >
                      {t.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/wire/experts" className="text-wire-muted hover:text-white text-sm transition-colors">
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
