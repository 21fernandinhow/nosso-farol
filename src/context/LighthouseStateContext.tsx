"use client"
import { createContext, useContext, useEffect } from "react"
import { revalidateLighthouse } from "@/actions/revalidateLighthouse"

interface LighthouseState {
  effectiveIsLit: boolean
}

const LighthouseStateContext = createContext<LighthouseState | null>(null)

export const useLighthouseState = () => useContext(LighthouseStateContext)

export const LighthouseStateProvider = ({
  isLit,
  litAt,
  slug,
  children,
}: {
  isLit: boolean
  litAt: string | null
  slug: string
  children: React.ReactNode
}) => {
  const todayLocal = new Date()
  todayLocal.setHours(0, 0, 0, 0)
  const effectiveIsLit = isLit && litAt ? new Date(litAt) >= todayLocal : isLit

  useEffect(() => {
    if (!isLit || effectiveIsLit) return
    revalidateLighthouse(slug)
  }, [])

  return (
    <LighthouseStateContext.Provider value={{ effectiveIsLit }}>
      {children}
    </LighthouseStateContext.Provider>
  )
}
