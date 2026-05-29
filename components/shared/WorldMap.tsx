'use client'
import { useEffect, useState } from 'react'
import type { LatLngExpression } from 'leaflet'

// Region coverage data with coordinates
const REGION_MARKERS = [
  { 
    name: 'Indo-Pacific', 
    slug: 'indo-pacific',
    color: '#3b82f6',
    position: [15, 115] as LatLngExpression,
    description: 'South China Sea, ASEAN, Quad dynamics'
  },
  { 
    name: 'Euro-Atlantic', 
    slug: 'euro-atlantic',
    color: '#8b5cf6',
    position: [52, 15] as LatLngExpression,
    description: 'NATO, EU, Eastern Europe'
  },
  { 
    name: 'Middle East & North Africa', 
    slug: 'mena',
    color: '#f59e0b',
    position: [25, 45] as LatLngExpression,
    description: 'Gulf states, Levant, North Africa'
  },
  { 
    name: 'Sub-Saharan Africa', 
    slug: 'sub-saharan-africa',
    color: '#10b981',
    position: [0, 20] as LatLngExpression,
    description: 'Sahel, Horn of Africa, Great Lakes'
  },
  { 
    name: 'Latin America', 
    slug: 'latin-america',
    color: '#ef4444',
    position: [-15, -60] as LatLngExpression,
    description: 'South America, Caribbean, Mexico'
  },
]

interface WorldMapProps {
  theme: 'wire' | 'institute'
  section: 'wire' | 'institute'
  articleCounts?: Record<string, number>
}

export default function WorldMap({ theme, section, articleCounts }: WorldMapProps) {
  const [MapComponents, setMapComponents] = useState<any>(null)
  const [L, setL] = useState<any>(null)

  useEffect(() => {
    // Dynamically import to avoid SSR issues
    Promise.all([
      import('leaflet'),
      import('react-leaflet'),
    ]).then(([leaflet, reactLeaflet]) => {
      // Fix default marker icons
      delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })
      setL(leaflet.default)
      setMapComponents(reactLeaflet)
    })
  }, [])

  useEffect(() => {
    // Load Leaflet CSS dynamically
    if (typeof window !== 'undefined') {
      const existingLink = document.getElementById('leaflet-css')
      if (!existingLink) {
        const link = document.createElement('link')
        link.id = 'leaflet-css'
        link.rel = 'stylesheet'
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'
        document.head.appendChild(link)
      }
    }
  }, [])

  if (!MapComponents || !L) {
    return (
      <div className={`h-80 rounded-xl flex items-center justify-center ${
        theme === 'wire' 
          ? 'bg-wire-card border border-wire-border' 
          : 'bg-institute-card border border-institute-border'
      }`}>
        <p className={theme === 'wire' ? 'text-wire-muted text-sm' : 'text-institute-muted text-sm'}>
          Loading map...
        </p>
      </div>
    )
  }

  const { MapContainer, TileLayer, CircleMarker, Popup } = MapComponents

  const tileUrl = theme === 'wire'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

  const regionPath = section === 'wire' ? '/wire/region' : '/institute/region'

  return (
    <div className="h-80 rounded-xl overflow-hidden border border-wire-border">
      <MapContainer
        center={[20, 20] as LatLngExpression}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        attributionControl={false}
      >
        <TileLayer url={tileUrl} />
        {REGION_MARKERS.map(region => {
          const count = articleCounts?.[region.slug] ?? 0
          const radius = Math.max(12, Math.min(30, 12 + count * 3))
          return (
            <CircleMarker
              key={region.slug}
              center={region.position}
              radius={radius}
              pathOptions={{
                color: region.color,
                fillColor: region.color,
                fillOpacity: 0.6,
                weight: 2,
              }}
            >
              <Popup>
                <div style={{ minWidth: '140px' }}>
                  <strong style={{ color: region.color, fontSize: '14px' }}>
                    {region.name}
                  </strong>
                  <p style={{ color: '#666', fontSize: '12px', margin: '4px 0' }}>
                    {region.description}
                  </p>
                  <p style={{ fontSize: '12px', margin: '4px 0' }}>
                    {count} article{count !== 1 ? 's' : ''}
                  </p>
                  <a href={`${regionPath}/${region.slug}`}
                    style={{ color: region.color, fontSize: '12px' }}>
                    View coverage →
                  </a>
                </div>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>
    </div>
  )
}
