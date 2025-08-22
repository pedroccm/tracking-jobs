import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getUserDetails, getUser } from '@/utils/supabase/queries';
import JobDetails from '@/components/dashboard/jobs/details';

interface Props {
  params: {
    id: string;
  };
}

export default async function JobDetailsPage({ params }: Props) {
  const supabase = await createClient();
  const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase)
  ]);

  if (!user) {
    return redirect('/auth/signin');
  }

  return <JobDetails user={user} userDetails={userDetails} jobId={params.id} />;
}