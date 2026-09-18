import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const gameSlug = searchParams.get('game')
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

    const supabase = await createClient()

    let query = supabase
      .from('daily_challenges')
      .select(`
        id,
        challenge_date,
        data,
        game_types (
          id,
          slug,
          name
        )
      `)
      .eq('challenge_date', date)

    if (gameSlug) {
      query = query.eq('game_types.slug', gameSlug)
    }

    const { data, error } = await query.single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'No challenge found for this date' },
          { status: 404 }
        )
      }
      throw error
    }

    // Don't send the solution to the client
    return NextResponse.json({
      id: data.id,
      challengeDate: data.challenge_date,
      game: data.game_types,
      data: data.data,
    })
  } catch (error: any) {
    console.error('Failed to fetch daily challenge:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch challenge' },
      { status: 500 }
    )
  }
}
