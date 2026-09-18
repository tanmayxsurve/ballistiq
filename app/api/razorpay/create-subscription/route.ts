import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Razorpay from 'razorpay'
import { razorpayConfig } from '@/lib/razorpay/config'

const razorpay = new Razorpay({
  key_id: razorpayConfig.keyId,
  key_secret: razorpayConfig.keySecret,
})

export async function POST(request: NextRequest) {
  try {
    const { planType } = await request.json()

    // Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single()

    // Create subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: razorpayConfig.proPriceId, // Create plan in Razorpay dashboard first
      customer_notify: 1,
      total_count: planType === 'yearly' ? 12 : 1, // 12 months for yearly
      notes: {
        user_id: user.id,
        plan_type: planType,
      },
    })

    return NextResponse.json({
      subscriptionId: subscription.id,
      email: profile?.email || user.email,
    })
  } catch (error: any) {
    console.error('Razorpay subscription error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create subscription' },
      { status: 500 }
    )
  }
}
