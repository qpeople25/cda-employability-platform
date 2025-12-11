import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import AssignmentManager from '@/components/admin/AssignmentManager';

export default async function AssignmentsPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/admin/login');
  }
  
  if (user.role !== 'admin') {
    redirect('/coach/dashboard');
  }
  
  return <AssignmentManager user={user} />;
}
