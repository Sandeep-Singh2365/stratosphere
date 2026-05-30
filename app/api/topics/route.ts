import { NextResponse } from 'next/server'
import { getAllTopics } from '@/lib/queries'

export async function GET() {
  try {
    const topics = await getAllTopics()
    return NextResponse.json(topics)
  } catch (error) {
    console.error('Error fetching topics:', error)
    return NextResponse.json([], { status: 500 })
  }
}
