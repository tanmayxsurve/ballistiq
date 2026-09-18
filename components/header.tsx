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
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <span className="text-2xl font-bold">Ballistiq</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/games">
            <Button variant="ghost" className="font-medium">Games</Button>
          </Link>
          <Link href="/leaderboard">
            <Button variant="ghost" className="font-medium">Leaderboard</Button>
          </Link>
          {profile?.is_pro && (
            <Link href="/admin/challenges">
              <Button variant="ghost" className="font-medium">Admin</Button>
            </Link>
          )}

          {user ? (
            <>
              {!profile?.is_pro && (
                <Link href="/pricing">
                  <Button variant="default" size="sm" className="gap-2 ml-2 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all">
                    <Crown className="w-4 h-4" />
                    Go Pro
                  </Button>
                </Link>
              )}
              {profile?.is_pro && (
                <span className="text-sm font-bold px-3 py-1.5 ml-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
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
                <Button variant="ghost" className="font-medium">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="ml-2 shadow-md">Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
