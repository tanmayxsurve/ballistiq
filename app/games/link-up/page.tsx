'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Trophy, Users, ArrowRight, Lightbulb } from 'lucide-react'

interface Player {
  id: string
  name: string
  clubs: string[]
}

interface LinkChallenge {
  id: string
  startPlayer: Player
  endPlayer: Player
  solution: Player[] // One possible solution
  maxLinks: number
}

export default function LinkUpGame() {
  const [challenge, setChallenge] = useState<LinkChallenge | null>(null)
  const [playerChain, setPlayerChain] = useState<Player[]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [suggestions, setSuggestions] = useState<Player[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [startTime] = useState(Date.now())
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  // Demo player database
  const playerDatabase: Player[] = [
    { id: '1', name: 'Lionel Messi', clubs: ['Barcelona', 'PSG', 'Inter Miami'] },
    { id: '2', name: 'Cristiano Ronaldo', clubs: ['Man United', 'Real Madrid', 'Juventus', 'Al Nassr'] },
    { id: '3', name: 'Neymar Jr', clubs: ['Barcelona', 'PSG', 'Al Hilal'] },
    { id: '4', name: 'Sergio Ramos', clubs: ['Real Madrid', 'PSG', 'Sevilla'] },
    { id: '5', name: 'Paul Pogba', clubs: ['Man United', 'Juventus'] },
    { id: '6', name: 'Kylian Mbappé', clubs: ['PSG', 'Real Madrid'] },
    { id: '7', name: 'Luka Modrić', clubs: ['Real Madrid', 'Tottenham'] },
    { id: '8', name: 'Gareth Bale', clubs: ['Tottenham', 'Real Madrid'] },
  ]

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

    // Demo challenge - connect Messi to Ronaldo
    const demoChallenge: LinkChallenge = {
      id: '1',
      startPlayer: playerDatabase[0], // Messi
      endPlayer: playerDatabase[1], // Ronaldo
      solution: [
        playerDatabase[0], // Messi
        playerDatabase[2], // Neymar (Barcelona with Messi, PSG)
        playerDatabase[3], // Sergio Ramos (PSG with Neymar, Real Madrid with Ronaldo)
        playerDatabase[1], // Ronaldo
      ],
      maxLinks: 5,
    }

    setChallenge(demoChallenge)
    setPlayerChain([demoChallenge.startPlayer])
  }, [])

  const handleInputChange = (value: string) => {
    setCurrentGuess(value)

    if (value.length >= 2) {
      // Find matching players
      const matches = playerDatabase.filter((p) =>
        p.name.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(matches.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }

  const addPlayerToChain = (player: Player) => {
    if (!challenge) return

    const lastPlayer = playerChain[playerChain.length - 1]

    // Check if players share a club
    const sharedClubs = lastPlayer.clubs.filter((club) => player.clubs.includes(club))

    if (sharedClubs.length === 0) {
      alert(`❌ ${player.name} never played with ${lastPlayer.name}!`)
      return
    }

    // Add to chain
    const newChain = [...playerChain, player]
    setPlayerChain(newChain)
    setCurrentGuess('')
    setSuggestions([])

    // Check if we reached the target
    if (player.id === challenge.endPlayer.id) {
      setIsComplete(true)
      setIsCorrect(true)

      // Calculate score: 100 - (10 per extra link) - (20 per hint)
      const linksUsed = newChain.length - 2 // Don't count start and end
      const optimalLinks = challenge.solution.length - 2
      const extraLinks = Math.max(0, linksUsed - optimalLinks)
      const finalScore = Math.max(10, 100 - extraLinks * 10 - hintsUsed * 20)

      setScore(finalScore)

      // Save score if logged in
      if (user) {
        saveScore(finalScore, newChain)
      }
    }
  }

  const removeLastPlayer = () => {
    if (playerChain.length > 1) {
      setPlayerChain(playerChain.slice(0, -1))
    }
  }

  const useHint = () => {
    if (!challenge || hintsUsed >= challenge.solution.length - 2) return

    const nextPlayerInSolution = challenge.solution[playerChain.length]
    alert(`💡 Hint: Try adding ${nextPlayerInSolution.name}`)
    setHintsUsed(hintsUsed + 1)
  }

  const giveUp = () => {
    setIsComplete(true)
    setIsCorrect(false)
    setScore(0)
  }

  const saveScore = async (finalScore: number, chain: Player[]) => {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      await supabase.from('game_attempts').insert({
        user_id: user.id,
        game_type_id: '4', // Link Up game type
        score: finalScore,
        completed: true,
        time_taken: Math.floor((Date.now() - startTime) / 1000),
        attempt_data: {
          links_used: chain.length - 2,
          hints_used: hintsUsed,
          chain: chain.map((p) => p.name),
        },
      })
    } catch (error) {
      console.error('Failed to save score:', error)
    }
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

  const getSharedClubs = (player1: Player, player2: Player) => {
    return player1.clubs.filter((club) => player2.clubs.includes(club))
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Link Up</h1>
        <p className="text-muted-foreground">
          Connect two players through shared teammates
        </p>
      </div>

      {!isComplete ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Connect the Players</span>
              <span className="text-sm text-muted-foreground">
                {playerChain.length - 1}/{challenge.maxLinks} links
              </span>
            </CardTitle>
            <CardDescription>
              Find players who played together at the same club
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Player Chain */}
            <div className="space-y-3">
              {playerChain.map((player, index) => (
                <div key={index}>
                  <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-lg border-2 border-primary">
                    <Users className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-semibold">{player.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {player.clubs.join(' • ')}
                      </div>
                    </div>
                    {index === playerChain.length - 1 && index > 0 && (
                      <Button
                        onClick={removeLastPlayer}
                        variant="ghost"
                        size="sm"
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  {index < playerChain.length - 1 && (
                    <div className="flex items-center gap-2 ml-6 my-2 text-sm text-green-600 dark:text-green-400">
                      <ArrowRight className="w-4 h-4" />
                      <span>
                        Shared: {getSharedClubs(playerChain[index], playerChain[index + 1]).join(', ')}
                      </span>
                    </div>
                  )}

                  {index === playerChain.length - 1 && player.id !== challenge.endPlayer.id && (
                    <div className="flex justify-center my-3">
                      <ArrowRight className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {/* Target Player */}
              {playerChain[playerChain.length - 1].id !== challenge.endPlayer.id && (
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg border-2 border-dashed">
                  <Users className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold">{challenge.endPlayer.name}</div>
                    <div className="text-sm text-muted-foreground">Target Player</div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            {playerChain[playerChain.length - 1].id !== challenge.endPlayer.id && (
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={currentGuess}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="Type player name..."
                    className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />

                  {/* Suggestions dropdown */}
                  {suggestions.length > 0 && (
                    <div className="absolute w-full mt-1 bg-background border rounded-lg shadow-lg z-10 max-h-60 overflow-auto">
                      {suggestions.map((player) => (
                        <button
                          key={player.id}
                          onClick={() => addPlayerToChain(player)}
                          className="w-full text-left px-4 py-3 hover:bg-muted border-b last:border-b-0"
                        >
                          <div className="font-semibold">{player.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {player.clubs.join(' • ')}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={useHint}
                    variant="outline"
                    className="gap-2"
                    disabled={hintsUsed >= challenge.solution.length - 2}
                  >
                    <Lightbulb className="w-4 h-4" />
                    Hint (-20 pts)
                  </Button>
                  <Button onClick={giveUp} variant="ghost">
                    Give Up
                  </Button>
                </div>

                {hintsUsed > 0 && (
                  <p className="text-sm text-muted-foreground text-center">
                    Hints used: {hintsUsed}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="text-center">
            {isCorrect ? (
              <>
                <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-2" />
                <CardTitle className="text-3xl">Connected! 🎉</CardTitle>
                <CardDescription>
                  You linked {challenge.startPlayer.name} to {challenge.endPlayer.name}!
                </CardDescription>
              </>
            ) : (
              <>
                <CardTitle className="text-3xl">Better luck next time!</CardTitle>
                <CardDescription>Here's one possible solution:</CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Show solution or user's chain */}
            <div>
              <h3 className="font-semibold mb-3">
                {isCorrect ? 'Your Solution:' : 'One Possible Solution:'}
              </h3>
              <div className="space-y-2">
                {(isCorrect ? playerChain : challenge.solution).map((player, index, arr) => (
                  <div key={index}>
                    <div className="flex items-center gap-4 p-3 bg-muted rounded-lg text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-semibold">{player.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {player.clubs.join(' • ')}
                        </div>
                      </div>
                    </div>
                    {index < arr.length - 1 && (
                      <div className="flex items-center gap-2 ml-6 my-1 text-xs text-muted-foreground">
                        <ArrowRight className="w-3 h-3" />
                        <span>via {getSharedClubs(arr[index], arr[index + 1]).join(', ')}</span>
                      </div>
                    )}
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
                  Links: {playerChain.length - 2} • Hints: {hintsUsed}
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
