-- Location: supabase/migrations/20250921090344_disaster_response_platform.sql
-- Schema Analysis: Fresh project - no existing schema detected
-- Integration Type: Complete disaster response platform setup
-- Dependencies: None - creating complete schema

-- 1. Types and Enums
CREATE TYPE public.user_role AS ENUM ('victim', 'volunteer', 'ngo-admin');
CREATE TYPE public.request_status AS ENUM ('pending', 'in-progress', 'completed', 'cancelled');
CREATE TYPE public.request_type AS ENUM ('emergency', 'food', 'water', 'shelter', 'medical', 'transportation', 'clothing');
CREATE TYPE public.priority_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.communication_type AS ENUM ('sms', 'call', 'whatsapp', 'email');

-- 2. Core Tables (no foreign keys)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'victim'::public.user_role,
    phone TEXT,
    address TEXT,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT true,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Dependent Tables
CREATE TABLE public.disaster_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    request_type public.request_type NOT NULL,
    priority public.priority_level DEFAULT 'medium'::public.priority_level,
    status public.request_status DEFAULT 'pending'::public.request_status,
    location_address TEXT,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    people_affected INTEGER DEFAULT 1,
    assigned_volunteer_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.disaster_requests(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    communication_type public.communication_type DEFAULT 'sms'::public.communication_type,
    twilio_sid TEXT,
    sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ
);

CREATE TABLE public.volunteer_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    volunteer_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    request_id UUID REFERENCES public.disaster_requests(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    UNIQUE(volunteer_id, request_id)
);

CREATE TABLE public.request_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.disaster_requests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    status public.request_status NOT NULL,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Essential Indexes
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_location ON public.user_profiles(location_lat, location_lng);
CREATE INDEX idx_disaster_requests_requester ON public.disaster_requests(requester_id);
CREATE INDEX idx_disaster_requests_assigned ON public.disaster_requests(assigned_volunteer_id);
CREATE INDEX idx_disaster_requests_status ON public.disaster_requests(status);
CREATE INDEX idx_disaster_requests_priority ON public.disaster_requests(priority);
CREATE INDEX idx_disaster_requests_location ON public.disaster_requests(location_lat, location_lng);
CREATE INDEX idx_communications_request ON public.communications(request_id);
CREATE INDEX idx_volunteer_assignments_volunteer ON public.volunteer_assignments(volunteer_id);
CREATE INDEX idx_volunteer_assignments_request ON public.volunteer_assignments(request_id);
CREATE INDEX idx_request_updates_request ON public.request_updates(request_id);

-- 5. Functions (MUST BE BEFORE RLS POLICIES)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'victim')::public.user_role
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_request_status()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert update record
    INSERT INTO public.request_updates (request_id, user_id, status, message)
    VALUES (NEW.id, auth.uid(), NEW.status, 'Status changed to ' || NEW.status);
    
    -- Update timestamp
    NEW.updated_at = CURRENT_TIMESTAMP;
    
    RETURN NEW;
END;
$$;

-- 6. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disaster_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_updates ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies
-- Pattern 1: Core user table (user_profiles) - Simple only, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2: Simple user ownership for disaster_requests
CREATE POLICY "users_manage_own_requests"
ON public.disaster_requests
FOR ALL
TO authenticated
USING (requester_id = auth.uid())
WITH CHECK (requester_id = auth.uid());

-- Volunteers can view assigned requests
CREATE POLICY "volunteers_view_assigned_requests"
ON public.disaster_requests
FOR SELECT
TO authenticated
USING (assigned_volunteer_id = auth.uid());

-- NGO admins can view all requests
CREATE POLICY "admins_view_all_requests"
ON public.disaster_requests
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'ngo-admin'
  )
);

-- Pattern 2: Communications - users can see sent/received messages
CREATE POLICY "users_view_communications"
ON public.communications
FOR SELECT
TO authenticated
USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "users_send_communications"
ON public.communications
FOR INSERT
TO authenticated
WITH CHECK (sender_id = auth.uid());

-- Pattern 2: Volunteer assignments
CREATE POLICY "volunteers_manage_assignments"
ON public.volunteer_assignments
FOR ALL
TO authenticated
USING (volunteer_id = auth.uid())
WITH CHECK (volunteer_id = auth.uid());

-- Pattern 2: Request updates
CREATE POLICY "users_create_updates"
ON public.request_updates
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_view_related_updates"
ON public.request_updates
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.disaster_requests dr
    WHERE dr.id = request_id 
    AND (dr.requester_id = auth.uid() OR dr.assigned_volunteer_id = auth.uid())
  )
  OR
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'ngo-admin'
  )
);

-- 8. Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_request_status_change
  BEFORE UPDATE OF status ON public.disaster_requests
  FOR EACH ROW 
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.update_request_status();

-- 9. Mock Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    volunteer_uuid UUID := gen_random_uuid();
    victim_uuid UUID := gen_random_uuid();
    request1_uuid UUID := gen_random_uuid();
    request2_uuid UUID := gen_random_uuid();
    request3_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@disasterconnect.org', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "ngo-admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (volunteer_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'volunteer@disasterconnect.org', crypt('volunteer123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Volunteer User", "role": "volunteer"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (victim_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'victim@disasterconnect.org', crypt('victim123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Victim User", "role": "victim"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create disaster requests
    INSERT INTO public.disaster_requests (id, requester_id, title, description, request_type, priority, status, location_address, location_lat, location_lng, people_affected, assigned_volunteer_id)
    VALUES
        (request1_uuid, victim_uuid, 'Emergency Shelter Needed', 'House damaged in flood, family of 4 needs immediate shelter', 'shelter', 'critical', 'in-progress', '123 Main St, Disaster City', 40.7128, -74.0060, 4, volunteer_uuid),
        (request2_uuid, victim_uuid, 'Food Supplies Required', 'Need food supplies for elderly couple, unable to leave home', 'food', 'high', 'pending', '456 Oak Ave, Disaster City', 40.7580, -73.9855, 2, null),
        (request3_uuid, victim_uuid, 'Medical Assistance', 'Diabetic patient needs insulin and medical attention', 'medical', 'critical', 'pending', '789 Pine St, Disaster City', 40.7505, -73.9934, 1, null);

    -- Create volunteer assignment
    INSERT INTO public.volunteer_assignments (volunteer_id, request_id, assigned_at, accepted_at)
    VALUES (volunteer_uuid, request1_uuid, now(), now());

    -- Create request updates
    INSERT INTO public.request_updates (request_id, user_id, status, message)
    VALUES 
        (request1_uuid, volunteer_uuid, 'in-progress', 'Volunteer assigned and en route to location'),
        (request2_uuid, victim_uuid, 'pending', 'Request created - awaiting volunteer assignment');

    -- Create communications
    INSERT INTO public.communications (request_id, sender_id, recipient_id, message, communication_type)
    VALUES
        (request1_uuid, volunteer_uuid, victim_uuid, 'I am on my way to help with your shelter request. ETA 30 minutes.', 'sms'),
        (request1_uuid, victim_uuid, volunteer_uuid, 'Thank you so much! We will be waiting at the address provided.', 'sms');

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;