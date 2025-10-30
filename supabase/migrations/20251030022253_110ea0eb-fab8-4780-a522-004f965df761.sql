-- Add team_abbreviation column to teams table
ALTER TABLE public.teams 
ADD COLUMN team_abbreviation text;

-- Create index on team_abbreviation for faster lookups
CREATE INDEX idx_teams_abbreviation ON public.teams(team_abbreviation);