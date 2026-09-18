import { Check, Crown } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RazorpayCheckoutButton } from '@/components/razorpay-checkout'

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <div className="mb-4">
          <span className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary">
            Simple, transparent pricing
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Start with free daily challenges or unlock unlimited games with Pro
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
        {/* Free Plan */}
        <Card className="border-2">
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
        <Card className="border-2 border-primary relative shadow-lg shadow-primary/10">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-1.5 rounded-full text-sm font-bold">
            Most Popular
          </div>
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
          <CardFooter className="pt-6">
            <RazorpayCheckoutButton
              planType="monthly"
              amount={49900}
            />
          </CardFooter>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="font-semibold text-lg mb-3">Do you accept international payments?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Yes! We accept all major international credit/debit cards (Visa, Mastercard, Amex) through Razorpay's secure payment gateway.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="font-semibold text-lg mb-3">How does billing work?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Pro is billed monthly at ₹499. You can cancel anytime and retain access until the end of your billing period.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="font-semibold text-lg mb-3">What payment methods do you accept?</h3>
            <p className="text-muted-foreground leading-relaxed">
              We accept credit cards, debit cards, UPI, net banking, and digital wallets through Razorpay's secure payment processing.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="font-semibold text-lg mb-3">Can I switch back to Free?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Yes! You can downgrade to Free at any time. You'll still have access to all daily challenges.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="font-semibold text-lg mb-3">Is my payment information secure?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Absolutely. We use Razorpay, India's leading payment gateway, which is PCI DSS compliant. We never store your card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
