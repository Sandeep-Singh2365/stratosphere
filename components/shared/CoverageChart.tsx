'use client'
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell
} from 'recharts'

interface CoverageChartProps {
  data: { name: string; count: number; color: string }[]
  theme: 'wire' | 'institute'
  title: string
}

export default function CoverageChart({ data, theme, title }: CoverageChartProps) {
  const isWire = theme === 'wire'
  
  const tooltipStyle = {
    backgroundColor: isWire ? '#1e293b' : '#ffffff',
    border: `1px solid ${isWire ? '#334155' : '#e7e5e4'}`,
    borderRadius: '8px',
    color: isWire ? '#f1f5f9' : '#1c1917',
  }

  return (
    <div className={`rounded-xl p-5 border ${
      isWire 
        ? 'bg-wire-card border-wire-border' 
        : 'bg-institute-card border-institute-border'
    }`}>
      <h3 className={`text-sm font-semibold mb-4 uppercase tracking-wide ${
        isWire ? 'text-wire-muted' : 'text-institute-muted'
      }`}>
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="name" 
            tick={{ 
              fontSize: 10, 
              fill: isWire ? '#64748b' : '#78716c' 
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 10, fill: isWire ? '#64748b' : '#78716c' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={{ fill: isWire ? '#334155' : '#f5f0eb' }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
