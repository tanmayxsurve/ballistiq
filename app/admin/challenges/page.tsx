'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, Trash2, Eye } from 'lucide-react'

interface DailyChallenge {
  id: string
  challenge_date: string
  game_type: string
  data: any
  created_at: string
}

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<DailyChallenge[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    loadChallenges()
  }, [])

  const checkAuth = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)

      // Check if user is admin (you can customize this logic)
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_pro, email')
        .eq('id', user.id)
        .single()

      // For now, Pro users can be admins (customize this later)
      setIsAdmin(profile?.is_pro || false)
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/auth/login')
    }
  }

  const loadChallenges = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      const { data, error } = await supabase
        .from('daily_challenges')
        .select(`
          *,
          game_types (
            name,
            slug
          )
        `)
        .order('challenge_date', { ascending: false })
        .limit(30)

      if (error) throw error

      setChallenges(data || [])
    } catch (error) {
      console.error('Failed to load challenges:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteChallenge = async (id: string) => {
    if (!confirm('Delete this challenge?')) return

    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      const { error } = await supabase
        .from('daily_challenges')
        .delete()
        .eq('id', id)

      if (error) throw error

      setChallenges(challenges.filter(c => c.id !== id))
    } catch (error) {
      console.error('Failed to delete challenge:', error)
      alert('Failed to delete challenge')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>
              You need Pro membership to access the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/pricing')}>
              Upgrade to Pro
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Daily Challenges</h1>
          <p className="text-muted-foreground">
            Create and manage daily challenges for all games
          </p>
        </div>
        <Button onClick={() => router.push('/admin/challenges/new')}>
          <Plus className="w-4 h-4 mr-2" />
          New Challenge
        </Button>
      </div>

      {challenges.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No challenges yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first daily challenge to get started
            </p>
            <Button onClick={() => router.push('/admin/challenges/new')}>
              Create Challenge
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {challenges.map((challenge) => {
            const date = new Date(challenge.challenge_date)
            const isToday = date.toDateString() === new Date().toDateString()
            const isPast = date < new Date()

            return (
              <Card key={challenge.id} className={isToday ? 'border-primary' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {(challenge as any).game_types?.name || 'Unknown Game'}
                        </h3>
                        {isToday && (
                          <span className="px-2 py-1 text-xs font-bold bg-primary/15 text-primary border border-primary/20 rounded-full">
                            TODAY
                          </span>
                        )}
                        {!isToday && isPast && (
                          <span className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                            PAST
                          </span>
                        )}
                        {!isToday && !isPast && (
                          <span className="px-2 py-1 text-xs font-medium bg-amber-500/15 text-amber-500 border border-amber-500/20 rounded-full">
                            UPCOMING
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {date.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/challenges/${challenge.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteChallenge(challenge.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
