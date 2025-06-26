-- Rename users table to accounts and update all references

-- First, drop existing constraints and policies that reference users
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view their own vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Users can insert their own vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Users can update their own vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Users can delete their own vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Users can view claxons they sent" ON public.claxons;
DROP POLICY IF EXISTS "Users can view claxons they received" ON public.claxons;
DROP POLICY IF EXISTS "Users can send claxons" ON public.claxons;
DROP POLICY IF EXISTS "Recipients can update claxons (mark as read)" ON public.claxons;

-- Drop the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Rename the table
ALTER TABLE public.users RENAME TO accounts;

-- Update foreign key constraints
ALTER TABLE public.vehicles DROP CONSTRAINT IF EXISTS vehicles_user_id_fkey;
ALTER TABLE public.vehicles ADD CONSTRAINT vehicles_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.accounts(id) ON DELETE CASCADE;

ALTER TABLE public.claxons DROP CONSTRAINT IF EXISTS claxons_sender_id_fkey;
ALTER TABLE public.claxons ADD CONSTRAINT claxons_sender_id_fkey 
  FOREIGN KEY (sender_id) REFERENCES public.accounts(id) ON DELETE CASCADE;

ALTER TABLE public.claxons DROP CONSTRAINT IF EXISTS claxons_recipient_id_fkey;
ALTER TABLE public.claxons ADD CONSTRAINT claxons_recipient_id_fkey 
  FOREIGN KEY (recipient_id) REFERENCES public.accounts(id) ON DELETE CASCADE;

-- Rename indexes
DROP INDEX IF EXISTS users_phone_idx;
DROP INDEX IF EXISTS users_email_idx;
CREATE INDEX accounts_phone_idx ON public.accounts(phone);
CREATE INDEX accounts_email_idx ON public.accounts(email);

-- Update trigger name
DROP TRIGGER IF EXISTS update_users_updated_at ON public.accounts;
CREATE TRIGGER update_accounts_updated_at 
  BEFORE UPDATE ON public.accounts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Recreate RLS policies for accounts table
CREATE POLICY "Users can view their own profile" ON public.accounts
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.accounts
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.accounts
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Recreate other policies (they should still work with the renamed table)
CREATE POLICY "Users can view their own vehicles" ON public.vehicles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vehicles" ON public.vehicles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vehicles" ON public.vehicles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vehicles" ON public.vehicles
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view claxons they sent" ON public.claxons
  FOR SELECT USING (auth.uid() = sender_id);

CREATE POLICY "Users can view claxons they received" ON public.claxons
  FOR SELECT USING (auth.uid() = recipient_id);

CREATE POLICY "Users can send claxons" ON public.claxons
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Recipients can update claxons (mark as read)" ON public.claxons
  FOR UPDATE USING (auth.uid() = recipient_id);

-- Recreate the function and trigger for account creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.accounts (id, phone, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.phone, ''),
    COALESCE(NEW.email, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();