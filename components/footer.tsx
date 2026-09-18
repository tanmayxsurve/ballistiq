'use client'

import Link from 'next/link'
import { Trophy, Mail, Globe, MessageCircle } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Trophy className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">Ballistiq</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Daily sports trivia games for passionate football fans.
            </p>
            <div className="flex gap-3">
              <a href="mailto:support@ballistiq.com" className="w-9 h-9 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors">
                <Mail className="w-4 h-4" />
              </a>
              <a href="/contact" className="w-9 h-9 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="/about" className="w-9 h-9 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Games */}
          <div>
            <h3 className="font-semibold mb-4">Games</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/games/pecking-order" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pecking Order
                </Link>
              </li>
              <li>
                <Link href="/games/checkout" className="text-muted-foreground hover:text-foreground transition-colors">
                  Checkout
                </Link>
              </li>
              <li>
                <Link href="/games/career-path" className="text-muted-foreground hover:text-foreground transition-colors">
                  Career Path
                </Link>
              </li>
              <li>
                <Link href="/games/link-up" className="text-muted-foreground hover:text-foreground transition-colors">
                  Link Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-muted-foreground hover:text-foreground transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2026 Ballistiq. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
