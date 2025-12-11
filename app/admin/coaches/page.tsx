import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import CoachManagement from '@/components/admin/CoachManagement';

export default async function CoachesPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/admin/login');
  }
  
  if (user.role !== 'admin') {
    redirect('/coach/dashboard');
  }
  
  return <CoachManagement user={user} />;
}
