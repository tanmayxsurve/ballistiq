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
      <Card className="group hover:border-primary transition-all cursor-pointer h-full hover:shadow-lg hover:shadow-primary/5">
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Icon className="w-7 h-7 text-primary" />
            </div>
            {isNew && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/20">
                NEW
              </span>
            )}
            {isPro && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/20">
                PRO
              </span>
            )}
          </div>
          <CardTitle className="text-xl mb-2">{title}</CardTitle>
          <CardDescription className="leading-relaxed">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
            <span>Play now</span>
            <span className="text-xl">→</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
