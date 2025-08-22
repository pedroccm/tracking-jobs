import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getUserDetails, getUser } from '@/utils/supabase/queries';
import EditJob from '@/components/dashboard/jobs/edit';

interface Props {
  params: {
    id: string;
  };
}

export default async function EditJobPage({ params }: Props) {
  const supabase = await createClient();
  const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase)
  ]);

  if (!user) {
    return redirect('/auth/signin');
  }

  return <EditJob user={user} userDetails={userDetails} jobId={params.id} />;
}