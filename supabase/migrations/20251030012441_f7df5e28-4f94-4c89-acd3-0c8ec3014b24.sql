-- Create teams table to store comprehensive team data
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sport TEXT NOT NULL,
  league TEXT NOT NULL,
  conference TEXT,
  division TEXT,
  team_city TEXT NOT NULL,
  team_nickname TEXT NOT NULL,
  arena_name TEXT,
  arena_city TEXT,
  arena_state TEXT,
  primary_color TEXT,
  primary_hex_code TEXT,
  secondary_color TEXT,
  secondary_hex_code TEXT,
  tertiary_color TEXT,
  tertiary_hex_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(sport, team_city, team_nickname)
);

-- Enable Row Level Security
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (teams data is public)
CREATE POLICY "Teams are viewable by everyone" 
ON public.teams 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_teams_updated_at
BEFORE UPDATE ON public.teams
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for common queries
CREATE INDEX idx_teams_sport ON public.teams(sport);
CREATE INDEX idx_teams_league ON public.teams(league);
CREATE INDEX idx_teams_sport_league ON public.teams(sport, league);