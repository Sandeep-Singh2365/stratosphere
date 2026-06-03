import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { signOut } from '@/lib/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect('/admin/login')

  // Defense-in-depth: even if middleware is bypassed/misconfigured,
  // never render the admin shell unless the user is an admin.
  const role = (session.user as any)?.role
  if (role !== 'admin') redirect('/admin/login?error=unauthorized')

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-800 border-r border-slate-700 
        flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-white font-bold text-sm tracking-widest 
            uppercase">
            Stratosphere
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">Admin</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {[
            { href: '/admin', label: 'Dashboard' },
            { href: '/admin/articles', label: 'Articles' },
            { href: '/admin/articles/new', label: 'New Article' },
            { href: '/admin/analysts', label: 'Analysts' },
            { href: '/admin/analysts/new', label: 'New Analyst' },
            { href: '/admin/subscribers', label: 'Subscribers' },
            { href: '/admin/profile', label: 'Profile' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-lg text-slate-300 
                hover:bg-slate-700 hover:text-white text-sm transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-700">
          <p className="text-slate-400 text-xs px-3 mb-2 truncate">
            {(session.user as any)?.email}
          </p>
          <form
            action={async () => {
              'use server'
              await signOut({ redirectTo: '/admin/login' })
            }}
          >
            <button
              type="submit"
              className="w-full text-left px-3 py-2 rounded-lg 
                text-slate-400 hover:bg-slate-700 hover:text-white 
                text-sm transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
