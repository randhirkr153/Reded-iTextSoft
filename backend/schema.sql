-- Run this in your Supabase SQL Editor

-- 1. Create Workers Table
CREATE TABLE public.workers (
    id UUID DEFAULT generate_uuid_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'On Leave', 'Busy')),
    assigned_task_id UUID, -- Will link to orders later
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Machines Table
CREATE TABLE public.machines (
    id UUID DEFAULT generate_uuid_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'Idle' CHECK (status IN ('Running', 'Idle', 'Maintenance')),
    usage_hours NUMERIC DEFAULT 0,
    assigned_order_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Orders Table
CREATE TABLE public.orders (
    id UUID DEFAULT generate_uuid_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Spinning', 'Weaving', 'Dyeing', 'Finished')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    assigned_machine_id UUID REFERENCES public.machines(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Add Constraints
ALTER TABLE public.workers 
ADD CONSTRAINT fk_assigned_task FOREIGN KEY (assigned_task_id) REFERENCES public.orders(id) ON DELETE SET NULL;

-- 5. Profiles Table (extends Supabase Auth)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'Worker' CHECK (role IN ('Admin', 'Manager', 'Worker')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (Default to closed, backend role key bypasses this)
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
