-- Add razorpay_subscription_id to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS razorpay_subscription_id TEXT UNIQUE;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_razorpay_subscription
ON profiles(razorpay_subscription_id);

-- Update the profiles table comment
COMMENT ON COLUMN profiles.razorpay_subscription_id IS 'Razorpay subscription ID for Pro users';
