"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { revalidateLighthouse } from "@/actions/revalidateLighthouse"

interface LighthouseState {
  effectiveIsLit: boolean
  setLit: (lit: boolean) => void
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
  const computedIsLit = isLit && litAt ? new Date(litAt) >= todayLocal : isLit

  const [manualOverride, setManualOverride] = useState<boolean | null>(null)
  const effectiveIsLit = manualOverride !== null ? manualOverride : computedIsLit

  useEffect(() => {
    if (!isLit || computedIsLit) return
    revalidateLighthouse(slug)
  }, [])

  return (
    <LighthouseStateContext.Provider value={{ effectiveIsLit, setLit: setManualOverride }}>
      {children}
    </LighthouseStateContext.Provider>
  )
}
