import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getUserDetails, getUser, getDashboardStats, getRecentJobs, getUpcomingInterviews } from '@/utils/supabase/queries';
import DashboardMain from '@/components/dashboard/main';

export default async function DashboardMainPage() {
  const supabase = await createClient();
  const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase)
  ]);

  if (!user) {
    return redirect('/auth/signin');
  }

  const [dashboardStats, recentJobs, upcomingInterviews] = await Promise.all([
    getDashboardStats(supabase, user.id),
    getRecentJobs(supabase, user.id),
    getUpcomingInterviews(supabase, user.id)
  ]);

  return <DashboardMain 
    user={user} 
    userDetails={userDetails}
    dashboardStats={dashboardStats}
    recentJobs={recentJobs}
    upcomingInterviews={upcomingInterviews}
  />;
}
