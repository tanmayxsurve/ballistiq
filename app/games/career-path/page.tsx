'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { ArrowRight, Trophy, Timer, CheckCircle, XCircle } from 'lucide-react'

interface Transfer {
  year: string
  club: string
  league: string
}

interface CareerPathChallenge {
  id: string
  playerName: string
  transfers: Transfer[]
  hints: string[]
}

export default function CareerPathGame() {
  const [challenge, setChallenge] = useState<CareerPathChallenge | null>(null)
  const [revealedTransfers, setRevealedTransfers] = useState(1)
  const [guess, setGuess] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [startTime] = useState(Date.now())
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Check auth
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project')) {
      import('@/lib/supabase/client').then(({ createClient }) => {
        const supabase = createClient()
        supabase.auth.getUser().then(({ data: { user } }) => {
          setUser(user)
        })
      })
    }

    // Demo challenge - in production, fetch from daily_challenges
    const demoChallenge: CareerPathChallenge = {
      id: '1',
      playerName: 'Cristiano Ronaldo',
      transfers: [
        { year: '2003-2009', club: 'Manchester United', league: 'Premier League' },
        { year: '2009-2018', club: 'Real Madrid', league: 'La Liga' },
        { year: '2018-2021', club: 'Juventus', league: 'Serie A' },
        { year: '2021-2022', club: 'Manchester United', league: 'Premier League' },
        { year: '2023-Present', club: 'Al Nassr', league: 'Saudi Pro League' },
      ],
      hints: [
        '5× Ballon d\'Or winner',
        'All-time Champions League top scorer',
        'Played for 3 of Europe\'s biggest clubs',
      ],
    }

    setChallenge(demoChallenge)
  }, [])

  const revealNextTransfer = () => {
    if (challenge && revealedTransfers < challenge.transfers.length) {
      setRevealedTransfers(revealedTransfers + 1)
    }
  }

  const submitGuess = () => {
    if (!challenge || !guess.trim()) return

    setAttempts(attempts + 1)

    // Check if guess is correct (case-insensitive, partial match)
    const normalizedGuess = guess.toLowerCase().trim()
    const normalizedAnswer = challenge.playerName.toLowerCase()

    if (normalizedAnswer.includes(normalizedGuess) || normalizedGuess.includes(normalizedAnswer)) {
      setIsCorrect(true)
      setIsComplete(true)

      // Calculate score: 100 points - (10 per revealed transfer) - (5 per wrong attempt)
      const baseScore = 100
      const transferPenalty = (revealedTransfers - 1) * 10
      const attemptPenalty = (attempts - 1) * 5
      const finalScore = Math.max(10, baseScore - transferPenalty - attemptPenalty)

      setScore(finalScore)

      // Save score if logged in
      if (user) {
        saveScore(finalScore)
      }
    } else {
      // Wrong guess - reveal next transfer as hint
      if (revealedTransfers < challenge.transfers.length) {
        setRevealedTransfers(revealedTransfers + 1)
      }
    }
  }

  const saveScore = async (finalScore: number) => {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      await supabase.from('game_attempts').insert({
        user_id: user.id,
        game_type_id: '2', // Career Path game type
        score: finalScore,
        completed: true,
        time_taken: Math.floor((Date.now() - startTime) / 1000),
        attempt_data: {
          transfers_revealed: revealedTransfers,
          attempts: attempts,
        },
      })
    } catch (error) {
      console.error('Failed to save score:', error)
    }
  }

  const giveUp = () => {
    setIsComplete(true)
    setIsCorrect(false)
    setScore(0)
  }

  const playAgain = () => {
    router.refresh()
  }

  if (!challenge) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading challenge...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Career Path</h1>
        <p className="text-muted-foreground">
          Guess the player from their career transfers
        </p>
      </div>

      {!isComplete ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Mystery Player</span>
              <span className="text-sm text-muted-foreground">
                Transfers Revealed: {revealedTransfers}/{challenge.transfers.length}
              </span>
            </CardTitle>
            <CardDescription>
              The fewer transfers you need, the higher your score!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Career Timeline */}
            <div className="space-y-3">
              {challenge.transfers.slice(0, revealedTransfers).map((transfer, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-muted rounded-lg animate-in fade-in slide-in-from-left duration-300"
                >
                  <div className="flex-shrink-0 w-20 text-sm font-semibold text-muted-foreground">
                    {transfer.year}
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold">{transfer.club}</div>
                    <div className="text-sm text-muted-foreground">{transfer.league}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Guess Input */}
            <div className="space-y-3">
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitGuess()}
                placeholder="Enter player name..."
                className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <div className="flex gap-2">
                <Button onClick={submitGuess} className="flex-1" disabled={!guess.trim()}>
                  Submit Guess
                </Button>
                {revealedTransfers < challenge.transfers.length && (
                  <Button onClick={revealNextTransfer} variant="outline">
                    Reveal Next Transfer (-10 pts)
                  </Button>
                )}
              </div>

              {attempts > 0 && (
                <p className="text-sm text-muted-foreground text-center">
                  Wrong guesses: {attempts} ({attempts * 5} points deducted)
                </p>
              )}
            </div>

            {/* Hints */}
            {attempts >= 2 && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Hints:</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {challenge.hints.slice(0, Math.floor(attempts / 2)).map((hint, index) => (
                    <li key={index}>• {hint}</li>
                  ))}
                </ul>
              </div>
            )}

            <Button onClick={giveUp} variant="ghost" className="w-full">
              Give Up
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="text-center">
            {isCorrect ? (
              <>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-2" />
                <CardTitle className="text-3xl">Correct! 🎉</CardTitle>
                <CardDescription>You guessed {challenge.playerName}!</CardDescription>
              </>
            ) : (
              <>
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-2" />
                <CardTitle className="text-3xl">Better luck next time!</CardTitle>
                <CardDescription>The answer was: {challenge.playerName}</CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Full Career Path */}
            <div>
              <h3 className="font-semibold mb-3">Full Career Path:</h3>
              <div className="space-y-2">
                {challenge.transfers.map((transfer, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 bg-muted rounded-lg text-sm"
                  >
                    <div className="w-20 font-semibold text-muted-foreground">
                      {transfer.year}
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">{transfer.club}</div>
                      <div className="text-xs text-muted-foreground">{transfer.league}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isCorrect && (
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold">
                  <Trophy className="w-8 h-8 text-amber-500" />
                  {score} Points
                </div>
                <p className="text-sm text-muted-foreground">
                  Transfers revealed: {revealedTransfers} • Attempts: {attempts}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={playAgain} className="flex-1">
                Play Again
              </Button>
              <Button onClick={() => router.push('/games')} variant="outline">
                All Games
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
