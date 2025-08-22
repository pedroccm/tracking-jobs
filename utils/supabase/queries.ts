import { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';

export const getUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
});

export const getUserDetails = cache(async (supabase: SupabaseClient) => {
  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .single();
  return userDetails;
});

export const getDashboardStats = cache(async (supabase: SupabaseClient, userId: string) => {
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', userId);

  const totalJobs = jobs?.length || 0;
  const activeApplications = jobs?.filter(job => 
    ['applied', 'screening', 'interview'].includes(job.status)
  ).length || 0;
  const interviews = jobs?.filter(job => job.status === 'interview').length || 0;
  const offers = jobs?.filter(job => job.status === 'offer').length || 0;
  const responseRate = totalJobs > 0 ? Math.round((activeApplications / totalJobs) * 100) : 0;

  return {
    totalJobs,
    activeApplications,
    interviews,
    offers,
    responseRate
  };
});

export const getRecentJobs = cache(async (supabase: SupabaseClient, userId: string) => {
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', userId)
    .order('applied_date', { ascending: false })
    .limit(5);
  
  return jobs || [];
});

export const getUpcomingInterviews = cache(async (supabase: SupabaseClient, userId: string) => {
  const today = new Date().toISOString().split('T')[0];
  
  const { data: interviews } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'interview')
    .gte('interview_date', today)
    .order('interview_date', { ascending: true })
    .limit(5);
  
  return interviews || [];
});
