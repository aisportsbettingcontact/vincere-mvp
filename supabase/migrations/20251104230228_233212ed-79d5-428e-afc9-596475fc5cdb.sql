-- Add DELETE policy to team_logos table to prevent unauthorized deletion
-- Team logos are reference data and should not be deleted by regular users
CREATE POLICY "Only prevent deletion of team logos"
ON public.team_logos
FOR DELETE
USING (false);