'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { TrendingUp, Trophy, Timer } from 'lucide-react'

interface Player {
  id: string
  name: string
  stat: number
  team: string
}

export default function PeckingOrderGame() {
  const [players, setPlayers] = useState<Player[]>([])
  const [orderedPlayers, setOrderedPlayers] = useState<Player[]>([])
  const [score, setScore] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [startTime] = useState(Date.now())
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if Supabase is configured
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

    // Load daily challenge
    loadDailyChallenge()
  }, [])

  const loadDailyChallenge = async () => {
    try {
      const response = await fetch('/api/daily-challenge?game=pecking-order')

      if (response.ok) {
        const challenge = await response.json()
        const challengePlayers = challenge.data.players || []

        // Shuffle for display
        setPlayers([...challengePlayers].sort(() => Math.random() - 0.5))
        return
      }
    } catch (error) {
      console.log('No daily challenge, using demo data')
    }

    // Fallback to demo data if no daily challenge
    const demoPlayers: Player[] = [
      { id: '1', name: 'Cristiano Ronaldo', stat: 450, team: 'Al Nassr' },
      { id: '2', name: 'Lionel Messi', stat: 672, team: 'Inter Miami' },
      { id: '3', name: 'Robert Lewandowski', stat: 344, team: 'Barcelona' },
      { id: '4', name: 'Kylian Mbappé', stat: 256, team: 'Real Madrid' },
      { id: '5', name: 'Erling Haaland', stat: 178, team: 'Man City' },
    ]

    setPlayers([...demoPlayers].sort(() => Math.random() - 0.5))
  }

  const handleDragStart = (e: React.DragEvent, player: Player) => {
    e.dataTransfer.setData('playerId', player.id)
  }

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    const playerId = e.dataTransfer.getData('playerId')
    const player = players.find(p => p.id === playerId)

    if (player && !orderedPlayers.find(p => p.id === playerId)) {
      const newOrdered = [...orderedPlayers]
      newOrdered.splice(index, 0, player)
      setOrderedPlayers(newOrdered)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const removePlayer = (playerId: string) => {
    setOrderedPlayers(orderedPlayers.filter(p => p.id !== playerId))
  }

  const submitAnswer = async () => {
    if (orderedPlayers.length !== 5) return

    // Calculate score (points for each correct position)
    const sortedPlayers = [...players].sort((a, b) => b.stat - a.stat)
    let calculatedScore = 0
    orderedPlayers.forEach((player, index) => {
      if (sortedPlayers[index].id === player.id) {
        calculatedScore += 20 // 20 points per correct position
      }
    })

    setScore(calculatedScore)
    setIsComplete(true)

    // Save to database if user is logged in and Supabase is configured
    if (user) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (supabaseUrl && !supabaseUrl.includes('your-project')) {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const timeTaken = Math.floor((Date.now() - startTime) / 1000)

        await supabase.from('game_attempts').insert({
          user_id: user.id,
          game_type_id: '1',
          score: calculatedScore,
          completed: true,
          time_taken: timeTaken,
          attempt_data: { order: orderedPlayers.map(p => p.id) }
        })
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Pecking Order</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Rank these five footballers by their career goals (highest to lowest)
        </p>
      </div>

      {!isComplete ? (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Available Players */}
          <Card>
            <CardHeader>
              <CardTitle>Players</CardTitle>
              <CardDescription>Drag players to rank them</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {players.filter(p => !orderedPlayers.find(op => op.id === p.id)).map(player => (
                <div
                  key={player.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, player)}
                  className="p-4 border rounded-lg cursor-move hover:border-primary transition-colors bg-card"
                >
                  <p className="font-semibold">{player.name}</p>
                  <p className="text-sm text-muted-foreground">{player.team}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Ranking Area */}
          <Card>
            <CardHeader>
              <CardTitle>Your Ranking</CardTitle>
              <CardDescription>1st (most goals) to 5th (least goals)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[0, 1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragOver={handleDragOver}
                  className="p-4 border-2 border-dashed rounded-lg min-h-[70px] flex items-center justify-between"
                >
                  {orderedPlayers[index] ? (
                    <>
                      <div>
                        <span className="font-bold text-primary mr-3">#{index + 1}</span>
                        <span className="font-semibold">{orderedPlayers[index].name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePlayer(orderedPlayers[index].id)}
                      >
                        Remove
                      </Button>
                    </>
                  ) : (
                    <span className="text-muted-foreground">Drop player here (#{index + 1})</span>
                  )}
                </div>
              ))}

              <Button
                className="w-full mt-6"
                onClick={submitAnswer}
                disabled={orderedPlayers.length !== 5}
              >
                Submit Answer
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              Game Complete!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <p className="text-5xl font-bold text-primary mb-2">{score}/100</p>
              <p className="text-muted-foreground">Each correct position = 20 points</p>
            </div>

            <div className="space-y-3 mb-6">
              <h3 className="font-semibold text-lg">Correct Order:</h3>
              {[...players].sort((a, b) => b.stat - a.stat).map((player, index) => (
                <div key={player.id} className="p-3 border rounded-lg flex justify-between items-center">
                  <div>
                    <span className="font-bold text-primary mr-3">#{index + 1}</span>
                    <span className="font-semibold">{player.name}</span>
                  </div>
                  <span className="text-muted-foreground">{player.stat} goals</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button className="flex-1" onClick={() => router.push('/games')}>
                Play More Games
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => window.location.reload()}>
                Play Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
