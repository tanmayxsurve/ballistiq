import { Shield, Lock, CreditCard, Users } from 'lucide-react'

export function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-8 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-green-500" />
        <span>256-bit SSL Encryption</span>
      </div>
      <div className="flex items-center gap-2">
        <Lock className="w-5 h-5 text-green-500" />
        <span>PCI DSS Compliant</span>
      </div>
      <div className="flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-green-500" />
        <span>Secure Payments by Razorpay</span>
      </div>
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-primary" />
        <span>Join 10,000+ Players</span>
      </div>
    </div>
  )
}
