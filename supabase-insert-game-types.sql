-- Insert game types if they don't exist
INSERT INTO game_types (slug, name, description, is_active) VALUES
  ('pecking-order', 'Pecking Order', 'Rank five players by a specific stat', true),
  ('career-path', 'Career Path', 'Guess the player from their transfer history', true),
  ('checkout', 'Checkout', 'Sports trivia meets darts scoring mechanics', true),
  ('link-up', 'Link Up', 'Connect two players through club teammates', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active;
