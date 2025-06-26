-- Create app schema with tables and RLS policies
-- Based on backend Drizzle schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Accounts table (profiles linked to auth.users)
CREATE TABLE public.accounts (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  
  -- Optional profile fields
  dob TEXT,
  gender TEXT,
  language TEXT DEFAULT 'ro',
  last_name TEXT,
  first_name TEXT,
  avatar_url TEXT,
  privacy_settings JSONB DEFAULT '{}',
  is_phone_public BOOLEAN DEFAULT false,
  notification_preferences JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Vehicles table
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  
  -- Vehicle details
  brand TEXT,
  model TEXT,
  color TEXT,
  phase TEXT,
  vin_code TEXT,
  plate_type TEXT,
  plate_number TEXT,
  plate_country TEXT DEFAULT 'MD',
  plate_left_part TEXT,
  plate_right_part TEXT,
  manufacture_year INTEGER,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Claxon templates table
CREATE TABLE public.claxon_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  message_en TEXT NOT NULL,
  message_ro TEXT NOT NULL,
  message_ru TEXT NOT NULL,
  icon TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Claxons table
CREATE TABLE public.claxons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.claxon_templates(id),
  
  license_plate TEXT NOT NULL,
  type TEXT,
  custom_message TEXT,
  sender_language TEXT DEFAULT 'ro',
  
  -- Status
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX accounts_phone_idx ON public.accounts(phone);
CREATE INDEX accounts_email_idx ON public.accounts(email);

CREATE INDEX vehicles_user_id_idx ON public.vehicles(user_id);
CREATE INDEX vehicles_plate_number_idx ON public.vehicles(plate_number);
CREATE INDEX vehicles_vin_code_idx ON public.vehicles(vin_code);
CREATE INDEX vehicles_is_active_idx ON public.vehicles(is_active);

CREATE INDEX claxon_templates_category_idx ON public.claxon_templates(category);
CREATE INDEX claxon_templates_is_active_idx ON public.claxon_templates(is_active);

CREATE INDEX claxons_sender_id_idx ON public.claxons(sender_id);
CREATE INDEX claxons_recipient_id_idx ON public.claxons(recipient_id);
CREATE INDEX claxons_vehicle_id_idx ON public.claxons(vehicle_id);
CREATE INDEX claxons_template_id_idx ON public.claxons(template_id);
CREATE INDEX claxons_read_idx ON public.claxons(read);
CREATE INDEX claxons_type_idx ON public.claxons(type);
CREATE INDEX claxons_read_at_idx ON public.claxons(read_at);
CREATE INDEX claxons_sender_language_idx ON public.claxons(sender_language);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON public.accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_claxon_templates_updated_at BEFORE UPDATE ON public.claxon_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_claxons_updated_at BEFORE UPDATE ON public.claxons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claxon_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claxons ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Accounts policies
CREATE POLICY "Users can view their own profile" ON public.accounts
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.accounts
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.accounts
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Vehicles policies
CREATE POLICY "Users can view their own vehicles" ON public.vehicles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vehicles" ON public.vehicles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vehicles" ON public.vehicles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vehicles" ON public.vehicles
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Active vehicles are searchable by plate" ON public.vehicles
  FOR SELECT USING (is_active = true);

-- Claxon templates policies (read-only for authenticated users)
CREATE POLICY "Authenticated users can view active templates" ON public.claxon_templates
  FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);

-- Claxons policies
CREATE POLICY "Users can view claxons they sent" ON public.claxons
  FOR SELECT USING (auth.uid() = sender_id);

CREATE POLICY "Users can view claxons they received" ON public.claxons
  FOR SELECT USING (auth.uid() = recipient_id);

CREATE POLICY "Users can send claxons" ON public.claxons
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Recipients can update claxons (mark as read)" ON public.claxons
  FOR UPDATE USING (auth.uid() = recipient_id);

-- Function to handle account creation on signup
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

-- Trigger to automatically create account profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed some basic claxon templates
INSERT INTO public.claxon_templates (category, message_en, message_ro, message_ru, icon) VALUES
('parking', 'Please move your car, you are blocking me.', 'Vă rog să vă mutați mașina, mă blocați.', 'Пожалуйста, переместите машину, вы меня блокируете.', '🚗'),
('parking', 'You parked in my spot.', 'Ați parcat în locul meu.', 'Вы припарковались на моем месте.', '🅿️'),
('traffic', 'Your lights are off.', 'Luminile dumneavoastră sunt stinse.', 'Ваши фары выключены.', '💡'),
('traffic', 'You left your car unlocked.', 'Ați lăsat mașina deschisă.', 'Вы оставили машину незапертой.', '🔓'),
('courtesy', 'Thank you for being a good driver!', 'Mulțumesc că sunteți un șofer bun!', 'Спасибо за то, что вы хороший водитель!', '👍'),
('courtesy', 'Nice car!', 'Mașină frumoasă!', 'Красивая машина!', '✨');