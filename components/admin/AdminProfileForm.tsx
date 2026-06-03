'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updateAdminProfileAction } from '@/app/actions/admin'

export default function AdminProfileForm(props: { currentEmail: string }) {
  const [email, setEmail] = useState(props.currentEmail)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fieldClass =
    'bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500'
  const labelClass = 'text-slate-300 text-sm font-medium block mb-1'

  const handleSubmit = async () => {
    setError('')
    setSuccess('')

    if (newPassword && newPassword !== confirmNewPassword) {
      setError('New passwords do not match')
      return
    }

    setLoading(true)
    try {
      await updateAdminProfileAction({
        currentPassword,
        newEmail: email,
        newPassword: newPassword || undefined,
      })
      setSuccess('Profile updated.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    } catch (e: unknown) {
      const msg =
        typeof e === 'object' && e !== null && 'message' in e
          ? String((e as Record<string, unknown>).message ?? 'An error occurred.')
          : 'An error occurred.'
      setError(msg)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <label className={labelClass}>Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass}>Current Password</label>
        <Input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="••••••••"
          className={fieldClass}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>New Password</label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="(optional)"
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>Confirm New Password</label>
          <Input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="(optional)"
            className={fieldClass}
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {success && <p className="text-green-400 text-sm">{success}</p>}

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8"
      >
        {loading ? 'Saving...' : 'Update Profile'}
      </Button>
    </div>
  )
}

