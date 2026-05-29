import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center 
      justify-center px-4 text-center">
      <p className="text-slate-500 text-xs tracking-widest uppercase 
        font-semibold mb-4">
        404 — Not Found
      </p>
      <h1 className="text-white font-bold text-4xl mb-4">
        Page not found
      </h1>
      <p className="text-slate-400 text-sm mb-8 max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Link href="/wire"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 
            rounded-lg text-sm font-medium transition-colors">
          Return to Wire
        </Link>
        <Link href="/institute"
          className="bg-amber-800 hover:bg-amber-700 text-white px-6 py-2 
            rounded-lg text-sm font-medium transition-colors">
          Return to Institute
        </Link>
      </div>
    </div>
  )
}
