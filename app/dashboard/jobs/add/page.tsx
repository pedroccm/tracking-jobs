import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getUserDetails, getUser } from '@/utils/supabase/queries';
import AddJob from '@/components/dashboard/jobs/add';

export default async function AddJobPage() {
  const supabase = await createClient();
  const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase)
  ]);

  if (!user) {
    return redirect('/auth/signin');
  }

  return <AddJob user={user} userDetails={userDetails} />;
}