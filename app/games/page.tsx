import { GameCard } from '@/components/game-card'
import { TrendingUp, Shuffle, Route, Link2 } from 'lucide-react'

export default function GamesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">All Games</h1>
        <p className="text-lg text-muted-foreground">
          Choose a game and play today's daily challenge for free
        </p>
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
    </div>
  )
}
