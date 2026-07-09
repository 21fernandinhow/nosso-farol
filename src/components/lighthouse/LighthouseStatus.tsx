"use client"

import { useState, useEffect } from "react"
import { formatStatus } from "@/utils/time"
import { useLighthouseState } from "@/context/LighthouseStateContext"

export const LighthouseStatus = () => {
  const context = useLighthouseState()
  const isLit = context?.effectiveIsLit ?? false
  const litAt = context?.effectiveLitAt ?? null
  const [text, setText] = useState(() => formatStatus(false, litAt))

  useEffect(() => {
    setText(formatStatus(isLit, litAt))
    if (!isLit) return
    const interval = setInterval(() => setText(formatStatus(isLit, litAt)), 60000)
    return () => clearInterval(interval)
  }, [isLit, litAt])

  return <span className="text-sm opacity-60">{text}</span>
}
