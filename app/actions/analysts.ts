'use server'
import { sql } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createAnalystAction(data: {
  name: string; slug: string; title: string; bio: string;
  photo_url?: string; twitter?: string; linkedin?: string;
}) {
  await sql`
    INSERT INTO analysts (name, slug, title, bio, photo_url, twitter, linkedin)
    VALUES (
      ${data.name}, ${data.slug}, ${data.title}, ${data.bio},
      ${data.photo_url || null}, ${data.twitter || null}, 
      ${data.linkedin || null}
    )
  `
  revalidatePath('/admin/analysts')
}

export async function deleteAnalystAction(id: string) {
  await sql`DELETE FROM analysts WHERE id = ${id}`
  revalidatePath('/admin/analysts')
}
