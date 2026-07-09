"use client"

import { useState, useEffect } from "react"
import { formatStatus } from "@/utils/time"
import { useLighthouseState } from "@/context/LighthouseStateContext"

interface LighthouseStatusProps {
  isLit: boolean
  litAt: string | null
}

export const LighthouseStatus = ({ isLit: isLitProp, litAt }: LighthouseStatusProps) => {
  const ctx = useLighthouseState()
  const isLit = ctx?.effectiveIsLit ?? isLitProp
  const [text, setText] = useState(() => formatStatus(isLit, litAt))

  useEffect(() => {
    setText(formatStatus(isLit, litAt))
    if (!isLit) return
    const interval = setInterval(() => setText(formatStatus(isLit, litAt)), 60000)
    return () => clearInterval(interval)
  }, [isLit, litAt])

  return <span className="text-sm opacity-60">{text}</span>
}
