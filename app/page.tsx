import { GameCard } from '@/components/game-card'
import { TrendingUp, Shuffle, Route, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-20 py-12">
        <div className="mb-4">
          <span className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-4">
            🏆 New games added weekly
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Daily Sports Trivia
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Test your football knowledge with 4 unique games. Play daily challenges for free or go Pro for unlimited access.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/games">
            <Button size="lg" className="text-base px-8 py-6 h-auto font-semibold">
              Play Now — Free
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline" className="text-base px-8 py-6 h-auto font-semibold">
              View Pricing
            </Button>
          </Link>
        </div>
      </section>

      {/* Games Grid */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-8">Choose Your Game</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GameCard
            title="Pecking Order"
            description="Rank five players by a specific stat like goals or appearances"
            slug="pecking-order"
            icon={TrendingUp}
            isNew={true}
          />
          <GameCard
            title="Checkout"
            description="Sports trivia meets darts scoring mechanics"
            slug="checkout"
            icon={Shuffle}
          />
          <GameCard
            title="Career Path"
            description="Guess the player from their transfer history"
            slug="career-path"
            icon={Route}
          />
          <GameCard
            title="Link Up"
            description="Connect two players through club teammates"
            slug="link-up"
            icon={Link2}
          />
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-10">
        <div className="text-center p-6 rounded-2xl border border-border bg-card">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎯</span>
          </div>
          <h3 className="text-xl font-semibold mb-3">Daily Challenges</h3>
          <p className="text-muted-foreground leading-relaxed">
            Fresh puzzles every day. No account needed to play daily games.
          </p>
        </div>
        <div className="text-center p-6 rounded-2xl border border-border bg-card">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🏆</span>
          </div>
          <h3 className="text-xl font-semibold mb-3">Compete & Win</h3>
          <p className="text-muted-foreground leading-relaxed">
            Challenge friends in multiplayer or climb the leaderboard.
          </p>
        </div>
        <div className="text-center p-6 rounded-2xl border border-border bg-card">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚡</span>
          </div>
          <h3 className="text-xl font-semibold mb-3">Unlimited Play</h3>
          <p className="text-muted-foreground leading-relaxed">
            Pro members get unlimited games and an ad-free experience.
          </p>
        </div>
      </section>
    </div>
  )
}
