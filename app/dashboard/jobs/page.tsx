import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getUserDetails, getUser } from '@/utils/supabase/queries';
import Jobs from '@/components/dashboard/jobs';

export default async function JobsPage() {
  const supabase = await createClient();
  const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase)
  ]);

  if (!user) {
    return redirect('/auth/signin');
  }

  return <Jobs user={user} userDetails={userDetails} />;
}