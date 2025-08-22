-- ============================================
-- Job Tracking System - Database Schema
-- ============================================

-- ============================================
-- TABLES
-- ============================================

-- Jobs table - Main table for job applications
create table jobs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  company text not null,
  company_website text,
  job_url text,
  salary_min integer,
  salary_max integer,
  currency text default 'BRL',
  location text,
  work_type text check (work_type in ('remote', 'hybrid', 'onsite')),
  employment_type text check (employment_type in ('full-time', 'part-time', 'contract', 'freelance', 'internship')),
  description text,
  requirements text,
  status text default 'wishlist' check (status in ('wishlist', 'applied', 'screening', 'interview', 'technical', 'final', 'offer', 'rejected', 'withdrawn', 'archived')),
  applied_date date,
  deadline date,
  priority integer default 3 check (priority between 1 and 5),
  source text, -- LinkedIn, Indeed, site da empresa, etc.
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Job contacts - People associated with job applications
create table job_contacts (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references jobs(id) on delete cascade,
  name text not null,
  role text, -- Recruiter, HR Manager, Tech Lead, etc.
  email text,
  phone text,
  linkedin_url text,
  company text,
  notes text,
  created_at timestamp with time zone default now()
);

-- Job activities - Timeline of activities for each job
create table job_activities (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references jobs(id) on delete cascade,
  type text not null check (type in ('application', 'email', 'call', 'interview', 'follow-up', 'rejection', 'offer', 'note')),
  title text not null,
  description text,
  date timestamp with time zone default now(),
  scheduled_date timestamp with time zone,
  completed boolean default false,
  created_at timestamp with time zone default now()
);

-- Job documents - Files associated with job applications
create table job_documents (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references jobs(id) on delete cascade,
  name text not null,
  type text check (type in ('cv', 'cover_letter', 'portfolio', 'certificate', 'reference', 'other')),
  file_url text,
  file_size integer,
  file_type text,
  notes text,
  created_at timestamp with time zone default now()
);

-- Companies - Company information
create table companies (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  website text,
  industry text,
  size text check (size in ('startup', 'small', 'medium', 'large', 'enterprise')),
  location text,
  description text,
  culture_notes text,
  rating integer check (rating between 1 and 5),
  created_at timestamp with time zone default now()
);

-- Interview rounds - Detailed interview tracking
create table interview_rounds (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references jobs(id) on delete cascade,
  round_number integer not null,
  type text check (type in ('screening', 'technical', 'behavioral', 'panel', 'presentation', 'final')),
  interviewer_name text,
  interviewer_role text,
  date timestamp with time zone,
  duration_minutes integer,
  location text, -- Presencial, Zoom, Google Meet, etc.
  meeting_link text,
  status text default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  feedback text,
  rating integer check (rating between 1 and 5),
  next_steps text,
  created_at timestamp with time zone default now()
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Jobs table policies
alter table jobs enable row level security;
create policy "Users can view own jobs" on jobs for select using (auth.uid() = user_id);
create policy "Users can insert own jobs" on jobs for insert with check (auth.uid() = user_id);
create policy "Users can update own jobs" on jobs for update using (auth.uid() = user_id);
create policy "Users can delete own jobs" on jobs for delete using (auth.uid() = user_id);

-- Job contacts policies
alter table job_contacts enable row level security;
create policy "Users can manage contacts for own jobs" on job_contacts 
  for all using (exists (select 1 from jobs where jobs.id = job_contacts.job_id and jobs.user_id = auth.uid()));

-- Job activities policies
alter table job_activities enable row level security;
create policy "Users can manage activities for own jobs" on job_activities 
  for all using (exists (select 1 from jobs where jobs.id = job_activities.job_id and jobs.user_id = auth.uid()));

-- Job documents policies
alter table job_documents enable row level security;
create policy "Users can manage documents for own jobs" on job_documents 
  for all using (exists (select 1 from jobs where jobs.id = job_documents.job_id and jobs.user_id = auth.uid()));

-- Companies policies
alter table companies enable row level security;
create policy "Users can view own companies" on companies for select using (auth.uid() = user_id);
create policy "Users can insert own companies" on companies for insert with check (auth.uid() = user_id);
create policy "Users can update own companies" on companies for update using (auth.uid() = user_id);
create policy "Users can delete own companies" on companies for delete using (auth.uid() = user_id);

-- Interview rounds policies
alter table interview_rounds enable row level security;
create policy "Users can manage interview rounds for own jobs" on interview_rounds 
  for all using (exists (select 1 from jobs where jobs.id = interview_rounds.job_id and jobs.user_id = auth.uid()));

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Jobs table indexes
create index idx_jobs_user_id on jobs(user_id);
create index idx_jobs_status on jobs(status);
create index idx_jobs_company on jobs(company);
create index idx_jobs_applied_date on jobs(applied_date);
create index idx_jobs_created_at on jobs(created_at);

-- Job contacts indexes
create index idx_job_contacts_job_id on job_contacts(job_id);
create index idx_job_contacts_email on job_contacts(email);

-- Job activities indexes
create index idx_job_activities_job_id on job_activities(job_id);
create index idx_job_activities_type on job_activities(type);
create index idx_job_activities_date on job_activities(date);

-- Job documents indexes
create index idx_job_documents_job_id on job_documents(job_id);
create index idx_job_documents_type on job_documents(type);

-- Companies indexes
create index idx_companies_user_id on companies(user_id);
create index idx_companies_name on companies(name);

-- Interview rounds indexes
create index idx_interview_rounds_job_id on interview_rounds(job_id);
create index idx_interview_rounds_date on interview_rounds(date);
create index idx_interview_rounds_status on interview_rounds(status);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to auto-update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for jobs table
create trigger update_jobs_updated_at 
  before update on jobs 
  for each row execute procedure update_updated_at_column();

-- ============================================
-- REALTIME SUBSCRIPTIONS
-- ============================================

-- Enable realtime for job tracking tables
drop publication if exists supabase_realtime;
create publication supabase_realtime for table jobs, job_activities, interview_rounds;