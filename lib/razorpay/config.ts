export const razorpayConfig = {
  keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  keySecret: process.env.RAZORPAY_KEY_SECRET!,
  webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET!,
  proMonthlyPrice: parseInt(process.env.NEXT_PUBLIC_PRO_MONTHLY_PRICE || '49900'), // ₹499 in paise
  proPriceId: process.env.NEXT_PUBLIC_PRO_PRICE_ID!,
}

export interface RazorpaySubscriptionOptions {
  plan_id: string
  customer_notify: 1 | 0
  quantity?: number
  total_count: number
  start_at?: number
  notes?: Record<string, string>
}

export interface RazorpayOrderOptions {
  amount: number // in paise
  currency: string
  receipt: string
  notes?: Record<string, string>
}
