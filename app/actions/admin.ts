'use server'

import bcrypt from 'bcryptjs'
import { auth } from '@/lib/auth'
import { sanitizeEmail } from '@/lib/sanitize'
import { getUserById, updateAdminCredentials } from '@/lib/queries/admin'

export async function updateAdminProfileAction(input: {
  currentPassword: string
  newEmail?: string
  newPassword?: string
}): Promise<{ success: true }> {
  const session = await auth()
  const role = (session?.user as unknown as { role?: string } | undefined)?.role
  const userId = (session?.user as unknown as { id?: string } | undefined)?.id

  if (!session || role !== 'admin' || !userId) {
    throw new Error('Unauthorized')
  }

  if (!input.currentPassword) {
    throw new Error('Current password is required')
  }

  const user = await getUserById(userId)
  if (!user?.password_hash) {
    throw new Error('User record is missing password hash')
  }

  const isValid = await bcrypt.compare(input.currentPassword, user.password_hash)
  if (!isValid) {
    throw new Error('Current password is incorrect')
  }

  const updates: { email?: string; password_hash?: string } = {}

  const newEmail = input.newEmail?.trim()
  if (newEmail && newEmail !== user.email) {
    updates.email = sanitizeEmail(newEmail)
  }

  const newPassword = input.newPassword?.trim()
  if (newPassword) {
    if (newPassword.length < 12) {
      throw new Error('New password must be at least 12 characters')
    }
    updates.password_hash = await bcrypt.hash(newPassword, 12)
  }

  if (Object.keys(updates).length === 0) {
    throw new Error('Nothing to update')
  }

  await updateAdminCredentials(userId, updates)
  return { success: true }
}

