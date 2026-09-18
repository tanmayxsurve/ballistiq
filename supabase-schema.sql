-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  is_pro BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  subscription_status TEXT,
  subscription_end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game types
CREATE TABLE public.game_types (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily challenges
CREATE TABLE public.daily_challenges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  game_type_id UUID REFERENCES game_types(id) ON DELETE CASCADE,
  challenge_date DATE UNIQUE NOT NULL,
  data JSONB NOT NULL, -- Game-specific challenge data
  solution JSONB NOT NULL, -- Correct answers
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User game attempts
CREATE TABLE public.game_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_type_id UUID REFERENCES game_types(id) ON DELETE CASCADE,
  daily_challenge_id UUID REFERENCES daily_challenges(id) ON DELETE SET NULL,
  score INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  time_taken INTEGER, -- seconds
  attempt_data JSONB, -- User's answers and game state
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leaderboards
CREATE TABLE public.leaderboard_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_type_id UUID REFERENCES game_types(id) ON DELETE CASCADE,
  daily_challenge_id UUID REFERENCES daily_challenges(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  rank INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, daily_challenge_id)
);

-- Multiplayer rooms
CREATE TABLE public.multiplayer_rooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  game_type_id UUID REFERENCES game_types(id) ON DELETE CASCADE,
  host_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_private BOOLEAN DEFAULT FALSE,
  room_code TEXT UNIQUE,
  max_players INTEGER DEFAULT 2,
  status TEXT DEFAULT 'waiting', -- waiting, in_progress, completed
  game_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ
);

-- Room participants
CREATE TABLE public.room_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_id UUID REFERENCES multiplayer_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'joined', -- joined, ready, playing, finished
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- Indexes
CREATE INDEX idx_profiles_stripe_customer ON profiles(stripe_customer_id);
CREATE INDEX idx_daily_challenges_date ON daily_challenges(challenge_date);
CREATE INDEX idx_game_attempts_user ON game_attempts(user_id);
CREATE INDEX idx_game_attempts_daily ON game_attempts(daily_challenge_id);
CREATE INDEX idx_leaderboard_daily ON leaderboard_entries(daily_challenge_id, score DESC);
CREATE INDEX idx_multiplayer_rooms_status ON multiplayer_rooms(status);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.multiplayer_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles: users can read all profiles but only update their own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Game attempts: users can only see their own
CREATE POLICY "Users can view own game attempts" ON game_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own game attempts" ON game_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Leaderboard: everyone can view
CREATE POLICY "Leaderboard is viewable by everyone" ON leaderboard_entries
  FOR SELECT USING (true);

-- Multiplayer rooms: viewable by all, manageable by host
CREATE POLICY "Rooms viewable by everyone" ON multiplayer_rooms
  FOR SELECT USING (true);

CREATE POLICY "Host can update room" ON multiplayer_rooms
  FOR UPDATE USING (auth.uid() = host_user_id);

-- Room participants
CREATE POLICY "Participants viewable by room members" ON room_participants
  FOR SELECT USING (true);

CREATE POLICY "Users can join rooms" ON room_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions
-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial game types
INSERT INTO game_types (slug, name, description) VALUES
  ('career-path', 'Career Path', 'Guess the footballer from their transfer history'),
  ('pecking-order', 'Pecking Order', 'Rank five footballers by a specific stat'),
  ('checkout', 'Checkout', 'Football trivia meets darts'),
  ('link-up', 'Link Up', 'Connect two players through club teammates');
