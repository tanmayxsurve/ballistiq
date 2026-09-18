import { Check, Crown, Shield, Zap, Star, Award, CreditCard } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RazorpayCheckoutButton } from '@/components/razorpay-checkout'
import { TrustBadges } from '@/components/trust-badges'

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="text-center mb-16 animate-fade-in">
        <Badge variant="success" className="mb-4 text-sm px-4 py-1.5">
          <Shield className="w-3.5 h-3.5 mr-1.5" />
          Secure Payment • Cancel Anytime
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          Choose Your Plan
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Start with free daily challenges or unlock unlimited games with Pro
        </p>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-8 mt-8 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span><strong className="text-foreground">4.8/5</strong> from 1,200+ reviews</span>
          </div>
          <div className="hidden md:block w-px h-4 bg-border" />
          <div className="flex items-center gap-2 text-muted-foreground">
            <Award className="w-4 h-4 text-primary" />
            <span><strong className="text-foreground">10,000+</strong> active players</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20 animate-slide-up">
        {/* Free Plan */}
        <Card className="border-2 hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-8">
            <CardTitle className="text-2xl mb-2">Free</CardTitle>
            <CardDescription>Perfect for casual players</CardDescription>
            <div className="mt-6">
              <span className="text-5xl font-bold">₹0</span>
              <span className="text-muted-foreground ml-2">/forever</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-4">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <span>Daily challenges for all games</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <span>Compete on leaderboards</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <span>Track your progress</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <span>No account required</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="pt-6">
            <Button variant="outline" className="w-full h-12" disabled>
              Current Plan
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="border-2 border-primary relative shadow-2xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 transform hover:scale-[1.02]">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg">
            ⚡ Most Popular
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-lg pointer-events-none" />
          <CardHeader className="pb-8">
            <CardTitle className="text-2xl flex items-center gap-2 mb-2">
              <Crown className="w-6 h-6 text-amber-500" />
              Pro
            </CardTitle>
            <CardDescription>For serious sports fans</CardDescription>
            <div className="mt-6">
              <span className="text-5xl font-bold">₹499</span>
              <span className="text-muted-foreground ml-2">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-4">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <span className="font-semibold">Everything in Free, plus:</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <span>Unlimited game plays</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <span>Solo mode with custom challenges</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <span>Multiplayer matchmaking</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <span>Private games with friends</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <span>Ad-free experience</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <span>Advanced statistics</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <span>Early access to new games</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="pt-6 flex-col gap-4">
            <RazorpayCheckoutButton
              planType="monthly"
              amount={49900}
            />
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5" />
              <span>30-day money-back guarantee</span>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Trust Badges */}
      <div className="max-w-4xl mx-auto mb-20">
        <TrustBadges />
      </div>

      {/* Testimonials */}
      <div className="max-w-5xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Loved by Sports Fans</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                "Best sports trivia game I've played. The daily challenges keep me coming back every morning!"
              </p>
              <p className="text-sm font-semibold">Rahul K.</p>
              <p className="text-xs text-muted-foreground">Pro Member since 2025</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                "The multiplayer mode is addictive. Worth every rupee for the unlimited access!"
              </p>
              <p className="text-sm font-semibold">Priya M.</p>
              <p className="text-xs text-muted-foreground">Pro Member</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                "Great game variety and the payment was super smooth. Highly recommend going Pro!"
              </p>
              <p className="text-sm font-semibold">Arjun S.</p>
              <p className="text-xs text-muted-foreground">Pro Member</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-border bg-card hover:bg-card/80 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Is my payment information secure?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Absolutely. We use Razorpay, India's leading payment gateway, which is PCI DSS Level 1 compliant. Your card details are encrypted with 256-bit SSL and we never store them on our servers.
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card hover:bg-card/80 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We accept all major credit/debit cards (Visa, Mastercard, Amex, RuPay), UPI, net banking, and popular digital wallets. International cards are fully supported.
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card hover:bg-card/80 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">How does billing work?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Pro is billed monthly at ₹499. You can cancel anytime from your account settings and retain full access until the end of your current billing period. No hidden fees.
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card hover:bg-card/80 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <Crown className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Can I try before committing?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Yes! Start with our free tier to play daily challenges. When you're ready for unlimited access, upgrade to Pro with our 30-day money-back guarantee. No risk.
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card hover:bg-card/80 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">What if I want to cancel?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Cancel anytime with one click. No questions asked, no cancellation fees. You'll automatically switch back to the free tier at the end of your billing cycle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
