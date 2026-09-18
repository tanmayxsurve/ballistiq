'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save } from 'lucide-react'

interface GameType {
  id: string
  slug: string
  name: string
}

export default function NewChallengePage() {
  const [gameTypes, setGameTypes] = useState<GameType[]>([])
  const [selectedGame, setSelectedGame] = useState('')
  const [challengeDate, setChallengeDate] = useState('')
  const [challengeData, setChallengeData] = useState('')
  const [solution, setSolution] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadGameTypes()

    // Set default date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setChallengeDate(tomorrow.toISOString().split('T')[0])
  }, [])

  const loadGameTypes = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      const { data, error } = await supabase
        .from('game_types')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error

      setGameTypes(data || [])
    } catch (error) {
      console.error('Failed to load game types:', error)
    }
  }

  const createChallenge = async () => {
    if (!selectedGame || !challengeDate) {
      alert('Please select a game and date')
      return
    }

    let parsedData, parsedSolution
    try {
      parsedData = challengeData ? JSON.parse(challengeData) : {}
      parsedSolution = solution ? JSON.parse(solution) : {}
    } catch (e) {
      alert('Invalid JSON format in data or solution')
      return
    }

    setLoading(true)

    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      const { error } = await supabase
        .from('daily_challenges')
        .insert({
          game_type_id: selectedGame,
          challenge_date: challengeDate,
          data: parsedData,
          solution: parsedSolution,
        })

      if (error) throw error

      alert('Challenge created successfully!')
      router.push('/admin/challenges')
    } catch (error: any) {
      console.error('Failed to create challenge:', error)
      alert(error.message || 'Failed to create challenge')
    } finally {
      setLoading(false)
    }
  }

  const getExampleData = (gameSlug: string) => {
    const examples: Record<string, { data: any; solution: any }> = {
      'pecking-order': {
        data: {
          players: [
            { id: '1', name: 'Cristiano Ronaldo', stat: 450, team: 'Al Nassr' },
            { id: '2', name: 'Lionel Messi', stat: 672, team: 'Inter Miami' },
            { id: '3', name: 'Robert Lewandowski', stat: 344, team: 'Barcelona' },
            { id: '4', name: 'Kylian Mbappé', stat: 256, team: 'Real Madrid' },
            { id: '5', name: 'Erling Haaland', stat: 178, team: 'Man City' }
          ],
          statType: 'Career Goals'
        },
        solution: {
          correctOrder: ['2', '1', '3', '4', '5']
        }
      },
      'career-path': {
        data: {
          playerName: 'Cristiano Ronaldo',
          transfers: [
            { year: '2003-2009', club: 'Manchester United', league: 'Premier League' },
            { year: '2009-2018', club: 'Real Madrid', league: 'La Liga' },
            { year: '2018-2021', club: 'Juventus', league: 'Serie A' },
            { year: '2021-2022', club: 'Manchester United', league: 'Premier League' },
            { year: '2023-Present', club: 'Al Nassr', league: 'Saudi Pro League' }
          ],
          hints: [
            '5× Ballon d\'Or winner',
            'All-time Champions League top scorer'
          ]
        },
        solution: {
          playerName: 'Cristiano Ronaldo'
        }
      },
      'checkout': {
        data: {
          questions: [
            {
              question: 'Which country won the 2018 FIFA World Cup?',
              options: ['Brazil', 'France', 'Germany', 'Argentina'],
              correctAnswer: 1,
              difficulty: 'easy'
            }
          ]
        },
        solution: {
          answers: [1]
        }
      },
      'link-up': {
        data: {
          startPlayer: { name: 'Lionel Messi', clubs: ['Barcelona', 'PSG', 'Inter Miami'] },
          endPlayer: { name: 'Cristiano Ronaldo', clubs: ['Man United', 'Real Madrid', 'Juventus'] },
          maxLinks: 5
        },
        solution: {
          possibleSolution: ['Lionel Messi', 'Neymar', 'Sergio Ramos', 'Cristiano Ronaldo']
        }
      }
    }

    return examples[gameSlug] || { data: {}, solution: {} }
  }

  const loadExample = () => {
    const game = gameTypes.find(g => g.id === selectedGame)
    if (!game) return

    const example = getExampleData(game.slug)
    setChallengeData(JSON.stringify(example.data, null, 2))
    setSolution(JSON.stringify(example.solution, null, 2))
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => router.push('/admin/challenges')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Challenges
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create Daily Challenge</CardTitle>
          <CardDescription>
            Set up a new daily challenge for users to play
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Game Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Game Type
            </label>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a game...</option>
              {gameTypes.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Challenge Date
            </label>
            <input
              type="date"
              value={challengeDate}
              onChange={(e) => setChallengeDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Load Example Button */}
          {selectedGame && (
            <Button onClick={loadExample} variant="outline">
              Load Example Data
            </Button>
          )}

          {/* Challenge Data */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Challenge Data (JSON)
            </label>
            <textarea
              value={challengeData}
              onChange={(e) => setChallengeData(e.target.value)}
              placeholder='{"players": [...], "statType": "Career Goals"}'
              rows={12}
              className="w-full px-4 py-2 border rounded-lg bg-background font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Game-specific data in JSON format
            </p>
          </div>

          {/* Solution */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Solution (JSON)
            </label>
            <textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder='{"correctOrder": ["id1", "id2", "id3"]}'
              rows={6}
              className="w-full px-4 py-2 border rounded-lg bg-background font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Correct answer/solution in JSON format
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={createChallenge}
              disabled={loading || !selectedGame || !challengeDate}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Creating...' : 'Create Challenge'}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/admin/challenges')}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
