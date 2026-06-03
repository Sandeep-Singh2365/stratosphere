import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminProfileForm from '@/components/admin/AdminProfileForm'

export const dynamic = 'force-dynamic'

export default async function AdminProfilePage() {
  const session = await auth()
  if (!session) redirect('/admin/login')

  const role = (session.user as unknown as { role?: string } | undefined)?.role
  if (role !== 'admin') redirect('/admin/login?error=unauthorized')

  const email = (session.user as unknown as { email?: string } | undefined)?.email ?? ''

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>
      <AdminProfileForm currentEmail={email} />
    </div>
  )
}

