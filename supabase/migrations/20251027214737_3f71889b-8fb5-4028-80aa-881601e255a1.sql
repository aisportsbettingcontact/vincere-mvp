-- Add verification status columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;

-- Update the trigger function to track verification status
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, username, phone, email_verified, phone_verified)
  VALUES (
    gen_random_uuid(),
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'phone',
    COALESCE(new.email_confirmed_at IS NOT NULL, false),
    false  -- Phone verification will be handled separately
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    email_verified = COALESCE(EXCLUDED.email_verified, public.profiles.email_verified),
    phone_verified = COALESCE(EXCLUDED.phone_verified, public.profiles.phone_verified);
  RETURN new;
END;
$$;