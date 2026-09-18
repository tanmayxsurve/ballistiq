import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LucideIcon } from 'lucide-react'

interface GameCardProps {
  title: string
  description: string
  slug: string
  icon: LucideIcon
  isNew?: boolean
  isPro?: boolean
}

export function GameCard({ title, description, slug, icon: Icon, isNew, isPro }: GameCardProps) {
  return (
    <Link href={`/games/${slug}`}>
      <Card className="group hover:border-primary transition-all duration-300 cursor-pointer h-full hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300 shadow-lg shadow-primary/10">
              <Icon className="w-7 h-7 text-primary" />
            </div>
            {isNew && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/30 shadow-sm">
                NEW
              </span>
            )}
            {isPro && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-500 border border-amber-500/30 shadow-sm">
                PRO
              </span>
            )}
          </div>
          <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">{title}</CardTitle>
          <CardDescription className="leading-relaxed">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
            <span>Play now</span>
            <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
