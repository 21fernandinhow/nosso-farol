"use client"
import { createContext, useContext, useState, useEffect } from "react"

interface LighthouseState {
  effectiveIsLit: boolean
  effectiveLitAt: string | null
  setLit: (lit: boolean, litAt?: string) => void
}

const LighthouseStateContext = createContext<LighthouseState | null>(null)

export const useLighthouseState = () => useContext(LighthouseStateContext)

export const LighthouseStateProvider = ({
  litAt: litAtProp,
  children,
}: {
  litAt: string | null
  children: React.ReactNode
}) => {
  const [computed, setComputed] = useState(false)
  const [manualOverride, setManualOverride] = useState<boolean | null>(null)
  const [litAtOverride, setLitAtOverride] = useState<string | null>(null)

  useEffect(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    setComputed(litAtProp ? new Date(litAtProp) >= today : false)
  }, [litAtProp])

  const effectiveIsLit = manualOverride !== null ? manualOverride : computed
  const effectiveLitAt = litAtOverride ?? litAtProp

  const setLit = (lit: boolean, litAt?: string) => {
    setManualOverride(lit)
    if (litAt) setLitAtOverride(litAt)
  }

  return (
    <LighthouseStateContext.Provider value={{ effectiveIsLit, effectiveLitAt, setLit }}>
      {children}
    </LighthouseStateContext.Provider>
  )
}
