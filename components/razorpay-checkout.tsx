'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

declare global {
  interface Window {
    Razorpay: any
  }
}

interface CheckoutButtonProps {
  planType: 'monthly' | 'yearly'
  amount: number
  disabled?: boolean
}

export function RazorpayCheckoutButton({ planType, amount, disabled }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // DEV MODE: Test upgrade without payment
  const handleTestUpgrade = async () => {
    if (confirm('DEV MODE: Upgrade to Pro without payment?')) {
      setLoading(true)
      try {
        const response = await fetch('/api/razorpay/test-upgrade', {
          method: 'POST',
        })

        if (response.ok) {
          alert('✅ Successfully upgraded to Pro!')
          router.push('/games?upgraded=true')
          router.refresh()
        } else {
          const data = await response.json()
          alert('Error: ' + (data.error || 'Failed to upgrade'))
        }
      } catch (error) {
        alert('Error: ' + error)
      } finally {
        setLoading(false)
      }
    }
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleCheckout = async () => {
    setLoading(true)

    // Load Razorpay script
    const loaded = await loadRazorpayScript()
    if (!loaded) {
      alert('Failed to load Razorpay. Please check your connection.')
      setLoading(false)
      return
    }

    try {
      // Create order on backend (one-time payment)
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      // Configure Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: data.orderId,
        amount: data.amount,
        currency: data.currency,
        name: 'Ballistiq',
        description: `Ballistiq Pro - ${planType} subscription`,
        image: '/logo.png', // Add your logo
        handler: async function (response: any) {
          // Verify payment on backend
          const verifyResponse = await fetch('/api/razorpay/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })

          if (verifyResponse.ok) {
            router.push('/games?upgraded=true')
            router.refresh()
          } else {
            alert('Payment verification failed')
          }
        },
        prefill: {
          email: data.email || '',
        },
        theme: {
          color: '#3b82f6',
        },
        modal: {
          ondismiss: function () {
            setLoading(false)
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3 w-full">
      <Button
        className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
        onClick={handleCheckout}
        disabled={disabled || loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          '✨ Upgrade to Pro Now'
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Instant access • Cancel anytime
      </p>

      {/* DEV MODE: Test upgrade button */}
      {process.env.NODE_ENV === 'development' && (
        <Button
          variant="outline"
          className="w-full text-xs"
          onClick={handleTestUpgrade}
          disabled={loading}
        >
          🧪 Test Mode: Upgrade (No Payment)
        </Button>
      )}
    </div>
  )
}
