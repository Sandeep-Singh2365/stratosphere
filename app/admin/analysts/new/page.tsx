import AnalystForm from '@/components/admin/AnalystForm'

export const dynamic = 'force-dynamic'

export default function NewAnalystPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">New Analyst</h1>
      <AnalystForm />
    </div>
  )
}
