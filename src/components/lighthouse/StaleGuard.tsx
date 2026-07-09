"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { revalidateLighthouse } from "@/actions/revalidateLighthouse"

interface Props {
  isLit: boolean
  litAt: string | null
  slug: string
}

export const StaleGuard = ({ isLit, litAt, slug }: Props) => {
  const router = useRouter()

  useEffect(() => {
    if (!isLit || !litAt) return
    const todayUTC = new Date()
    todayUTC.setUTCHours(0, 0, 0, 0)
    if (new Date(litAt) < todayUTC) {
      revalidateLighthouse(slug).then(() => router.refresh())
    }
  }, [])

  return null
}
