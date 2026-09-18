'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Trophy, User, LogOut, Crown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface Profile {
  is_pro: boolean
  username: string | null
}

export function Header() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project')) {
      // Supabase not configured yet
      return
    }

    // Import dynamically to avoid errors when env vars are missing
    import('@/lib/supabase/client').then(({ createClient }) => {
      const supabase = createClient()

      const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_pro, username')
            .eq('id', user.id)
            .single()

          setProfile(profile)
        }
      }

      getUser()

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })

      return () => subscription.unsubscribe()
    })
  }, [])

  const handleSignOut = async () => {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Trophy className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold">Ballistiq</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/games">
            <Button variant="ghost">Games</Button>
          </Link>
          <Link href="/leaderboard">
            <Button variant="ghost">Leaderboard</Button>
          </Link>
          {profile?.is_pro && (
            <Link href="/admin/challenges">
              <Button variant="ghost">Admin</Button>
            </Link>
          )}

          {user ? (
            <>
              {!profile?.is_pro && (
                <Link href="/pricing">
                  <Button variant="default" size="sm" className="gap-2">
                    <Crown className="w-4 h-4" />
                    Go Pro
                  </Button>
                </Link>
              )}
              {profile?.is_pro && (
                <span className="text-sm font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <Crown className="w-4 h-4 inline mr-1" />
                  PRO
                </span>
              )}
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
