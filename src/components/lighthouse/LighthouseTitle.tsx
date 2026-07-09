"use client"
import { useLighthouseState } from "@/context/LighthouseStateContext"

export const LighthouseTitle = ({ name }: { name: string }) => {
  const context = useLighthouseState()
  const isLit = context?.effectiveIsLit ?? false
  return (
    <h1 className={`font-serif text-4xl text-center transition-colors duration-700${isLit ? " text-[#fde68a]" : ""}`}>
      {name}
    </h1>
  )
}
