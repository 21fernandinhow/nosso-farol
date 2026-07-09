"use server"
import { revalidatePath } from "next/cache"

export const revalidateLighthouse = async (slug: string) => {
  revalidatePath(`/${slug}`)
}
