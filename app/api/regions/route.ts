import { NextResponse } from 'next/server'
import { getAllRegions } from '@/lib/queries'

export async function GET() {
  try {
    const regions = await getAllRegions()
    return NextResponse.json(regions)
  } catch (error) {
    console.error('Error fetching regions:', error)
    return NextResponse.json([], { status: 500 })
  }
}
