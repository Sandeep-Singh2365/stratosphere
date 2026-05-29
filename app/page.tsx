'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function LandingPage() {
  const [hovered, setHovered] = useState<'wire' | 'institute' | null>(null)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Wire half */}
      <div
        className="relative flex flex-col items-center justify-center 
          cursor-pointer transition-all duration-500 ease-in-out"
        style={{
          flexBasis: hovered === 'wire' ? '60%' 
            : hovered === 'institute' ? '40%' : '50%',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        }}
        onMouseEnter={() => setHovered('wire')}
        onMouseLeave={() => setHovered(null)}
      >
        <div className="text-center px-8 max-w-sm">
          <p className="text-blue-400 text-xs tracking-widest uppercase 
            font-semibold mb-4">
            Daily Intelligence
          </p>
          <h1 className="text-white font-bold text-4xl md:text-5xl 
            tracking-wide uppercase mb-2">
            Stratosphere
          </h1>
          <p className="text-blue-400 font-medium text-xl mb-6 
            tracking-wider">
            Wire
          </p>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Real-time geopolitical analysis. Breaking developments 
            from every theater of global affairs.
          </p>
          <Link
            href="/wire"
            className="inline-block bg-blue-600 hover:bg-blue-500 
              text-white px-8 py-3 rounded-lg font-medium text-sm 
              transition-colors tracking-wide"
          >
            Enter Wire →
          </Link>
        </div>
        {/* Vertical divider line */}
        <div className="absolute right-0 top-0 h-full w-px 
          bg-slate-600 opacity-50" />
      </div>

      {/* Institute half */}
      <div
        className="relative flex flex-col items-center justify-center 
          cursor-pointer transition-all duration-500 ease-in-out"
        style={{
          flexBasis: hovered === 'institute' ? '60%' 
            : hovered === 'wire' ? '40%' : '50%',
          background: 'linear-gradient(135deg, #fafaf9 0%, #f5f0eb 100%)',
        }}
        onMouseEnter={() => setHovered('institute')}
        onMouseLeave={() => setHovered(null)}
      >
        <div className="text-center px-8 max-w-sm">
          <p className="text-amber-700 text-xs tracking-widest uppercase 
            font-semibold mb-4">
            Strategic Research
          </p>
          <h1 className="text-stone-900 font-serif font-bold 
            text-4xl md:text-5xl tracking-wide uppercase mb-2">
            Stratosphere
          </h1>
          <p className="text-amber-800 font-serif font-medium text-xl 
            mb-6 tracking-wider">
            Institute
          </p>
          <p className="text-stone-500 text-sm leading-relaxed mb-8">
            Long-form policy research and strategic forecasting 
            for scholars, diplomats, and decision-makers.
          </p>
          <Link
            href="/institute"
            className="inline-block bg-amber-800 hover:bg-amber-700 
              text-white px-8 py-3 rounded-lg font-medium text-sm 
              transition-colors tracking-wide font-serif"
          >
            Enter Institute →
          </Link>
        </div>
      </div>
    </div>
  )
}
