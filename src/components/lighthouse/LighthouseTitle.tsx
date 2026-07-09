"use client"
import { useLighthouseState } from "@/context/LighthouseStateContext"

interface Props {
  name: string
  isLit: boolean
}

export const LighthouseTitle = ({ name, isLit }: Props) => {
  const ctx = useLighthouseState()
  const effectiveIsLit = ctx?.effectiveIsLit ?? isLit
  return (
    <h1 className={`font-serif text-4xl text-center transition-colors duration-700${effectiveIsLit ? " text-[#fde68a]" : ""}`}>
      {name}
    </h1>
  )
}
