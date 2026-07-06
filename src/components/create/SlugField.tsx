"use client"

import { useEffect, useState } from "react"

interface SlugFieldProps {
  value: string
  onChange: (value: string) => void
  onAvailabilityChange: (available: boolean | null) => void
}

type Status = "idle" | "checking" | "available" | "taken" | "invalid"

const slugRegex = /^[a-z0-9-]{3,40}$/

export const SlugField = ({ value, onChange, onAvailabilityChange }: SlugFieldProps) => {
  const [status, setStatus] = useState<Status>("idle")

  useEffect(() => {
    if (!value) {
      setStatus("idle")
      onAvailabilityChange(null)
      return
    }
    if (!slugRegex.test(value)) {
      setStatus("invalid")
      onAvailabilityChange(false)
      return
    }
    setStatus("checking")
    onAvailabilityChange(null)
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/lighthouses/check?slug=${encodeURIComponent(value)}`)
        const data = await res.json()
        setStatus(data.available ? "available" : "taken")
        onAvailabilityChange(data.available ? true : false)
      } catch {
        setStatus("idle")
        onAvailabilityChange(null)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [value, onAvailabilityChange])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
    onChange(sanitized)
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm opacity-70">URL personalizada</label>
      <label className="input input-bordered w-full flex items-center gap-1 pr-3">
        <span className="text-sm opacity-40 select-none">/</span>
        <input
          type="text"
          placeholder="ex: para-ana"
          className="grow bg-transparent outline-none"
          value={value}
          onChange={handleChange}
          maxLength={40}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
        {status === "checking" && (
          <span className="loading loading-spinner loading-xs opacity-40" />
        )}
      </label>
      {status === "available" && (
        <p className="text-success text-xs">✓ Disponível</p>
      )}
      {status === "taken" && (
        <p className="text-error text-xs">✗ Já está em uso</p>
      )}
      {status === "invalid" && (
        <p className="text-error text-xs">Apenas letras, números e hífens (mín. 3 caracteres)</p>
      )}
    </div>
  )
}