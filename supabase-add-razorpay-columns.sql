-- Add Razorpay columns to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS razorpay_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS razorpay_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
  ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;

-- Add indexes for Razorpay fields
CREATE INDEX IF NOT EXISTS idx_profiles_razorpay_customer ON profiles(razorpay_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_razorpay_subscription ON profiles(razorpay_subscription_id);
