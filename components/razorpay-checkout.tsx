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
    <div className="space-y-2">
      <Button
        className="w-full"
        onClick={handleCheckout}
        disabled={disabled || loading}
      >
        {loading ? 'Processing...' : 'Upgrade to Pro'}
      </Button>

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
