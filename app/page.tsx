import { GameCard } from '@/components/game-card'
import { TrendingUp, Shuffle, Route, Link2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Hero Section */}
      <section className="text-center mb-24 py-12 animate-fade-in">
        <Badge variant="success" className="mb-6 text-sm px-4 py-2">
          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          New games added weekly
        </Badge>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          Daily Sports Trivia
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          Test your football knowledge with 4 unique games. Play daily challenges for free or go Pro for unlimited access.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/games">
            <Button size="lg" className="text-base px-10 py-7 h-auto font-semibold shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-105">
              Play Now — Free
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline" className="text-base px-10 py-7 h-auto font-semibold hover:bg-accent/50 transition-all duration-300">
              View Pricing →
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mt-6">
          No credit card required • Play instantly
        </p>
      </section>

      {/* Games Grid */}
      <section className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Choose Your Game</h2>
          <p className="text-muted-foreground">Four unique ways to test your football knowledge</p>
        </div>
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
      <section className="grid md:grid-cols-3 gap-10 animate-slide-up">
        <div className="text-center p-8 rounded-2xl border border-border bg-card hover:bg-card/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
            <span className="text-4xl">🎯</span>
          </div>
          <h3 className="text-xl font-semibold mb-3">Daily Challenges</h3>
          <p className="text-muted-foreground leading-relaxed">
            Fresh puzzles every day. No account needed to play daily games.
          </p>
        </div>
        <div className="text-center p-8 rounded-2xl border border-border bg-card hover:bg-card/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
            <span className="text-4xl">🏆</span>
          </div>
          <h3 className="text-xl font-semibold mb-3">Compete & Win</h3>
          <p className="text-muted-foreground leading-relaxed">
            Challenge friends in multiplayer or climb the leaderboard.
          </p>
        </div>
        <div className="text-center p-8 rounded-2xl border border-border bg-card hover:bg-card/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
            <span className="text-4xl">⚡</span>
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
