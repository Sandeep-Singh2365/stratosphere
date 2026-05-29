'use client'
import { useEffect, useRef, useState } from 'react'

const REGION_MARKERS = [
  {
    name: 'Indo-Pacific',
    slug: 'indo-pacific',
    color: '#3b82f6',
    lat: 15, lng: 115,
    description: 'South China Sea, ASEAN, Quad dynamics'
  },
  {
    name: 'Euro-Atlantic',
    slug: 'euro-atlantic',
    color: '#8b5cf6',
    lat: 52, lng: 15,
    description: 'NATO, EU, Eastern Europe'
  },
  {
    name: 'Middle East & North Africa',
    slug: 'mena',
    color: '#f59e0b',
    lat: 25, lng: 45,
    description: 'Gulf states, Levant, North Africa'
  },
  {
    name: 'Sub-Saharan Africa',
    slug: 'sub-saharan-africa',
    color: '#10b981',
    lat: 0, lng: 20,
    description: 'Sahel, Horn of Africa, Great Lakes'
  },
  {
    name: 'Latin America',
    slug: 'latin-america',
    color: '#ef4444',
    lat: -15, lng: -60,
    description: 'South America, Caribbean, Mexico'
  },
]

interface WorldMapProps {
  theme: 'wire' | 'institute'
  section: 'wire' | 'institute'
  articleCounts?: Record<string, number>
}

export default function WorldMap({ theme, section, articleCounts }: WorldMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !mapRef.current || mapInstanceRef.current) return

    const initMap = async () => {
      const L = (await import('leaflet')).default

      // Load CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link')
        link.id = 'leaflet-css'
        link.rel = 'stylesheet'
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'
        document.head.appendChild(link)
      }

      // Wait a tick for CSS
      await new Promise(r => setTimeout(r, 50))

      if (!mapRef.current) return

      const tileUrl = theme === 'wire'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

      const map = L.map(mapRef.current, {
        center: [20, 20],
        zoom: 2,
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: false,
      })

      L.tileLayer(tileUrl, {
        maxZoom: 10,
      }).addTo(map)

      const regionPath = section === 'wire' ? '/wire/region' : '/institute/region'

      REGION_MARKERS.forEach(region => {
        const count = articleCounts?.[region.slug] ?? 0
        const radius = Math.max(12, Math.min(30, 12 + count * 3))

        const circle = L.circleMarker([region.lat, region.lng], {
          radius,
          color: region.color,
          fillColor: region.color,
          fillOpacity: 0.6,
          weight: 2,
        })

        circle.bindPopup(`
          <div style="min-width:140px;font-family:sans-serif">
            <strong style="color:${region.color};font-size:13px">
              ${region.name}
            </strong>
            <p style="color:#666;font-size:11px;margin:4px 0">
              ${region.description}
            </p>
            <p style="font-size:11px;margin:4px 0">
              ${count} article${count !== 1 ? 's' : ''}
            </p>
            <a href="${regionPath}/${region.slug}" 
               style="color:${region.color};font-size:11px">
              View coverage →
            </a>
          </div>
        `)

        circle.addTo(map)
      })

      mapInstanceRef.current = map
    }

    initMap().catch(console.error)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [mounted, theme, section, articleCounts])

  const isWire = theme === 'wire'

  if (!mounted) {
    return (
      <div className={`h-80 rounded-xl flex items-center justify-center ${
        isWire
          ? 'bg-wire-card border border-wire-border'
          : 'bg-institute-card border border-institute-border'
      }`}>
        <p className={`text-sm ${isWire ? 'text-wire-muted' : 'text-institute-muted'}`}>
          Loading map...
        </p>
      </div>
    )
  }

  return (
    <div
      ref={mapRef}
      className="h-80 rounded-xl overflow-hidden border border-wire-border"
      style={{ zIndex: 0 }}
    />
  )
}
