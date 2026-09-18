import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if already Pro
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_pro')
      .eq('id', user.id)
      .single()

    if (profile?.is_pro) {
      return NextResponse.json(
        { error: 'Already a Pro member' },
        { status: 400 }
      )
    }

    // Update user to Pro (DEV MODE - bypass payment)
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        is_pro: true,
        subscription_status: 'active',
        razorpay_payment_id: `test_payment_${Date.now()}`,
        razorpay_order_id: `test_order_${Date.now()}`,
        subscription_end_date: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(), // 30 days from now
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Database update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to upgrade account' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Test upgrade error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upgrade' },
      { status: 500 }
    )
  }
}
