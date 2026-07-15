"use client"

import { useEffect, useState } from "react"
import { LuShare2 } from "react-icons/lu"

interface ShareButtonProps {
  name: string
}

export const ShareButton = ({ name }: ShareButtonProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: "Um sinal silencioso de que alguém pensou em você.",
          url,
        })
      } catch {
        // usuário cancelou o compartilhamento nativo — sem ação
      }
      return
    }
    await navigator.clipboard.writeText(url)
  }

  return (
    <button
      onClick={handleShare}
      className="btn btn-ghost btn-circle tooltip tooltip-top"
      data-tip="Compartilhar"
      aria-label="Compartilhar"
    >
      <LuShare2 size={20} />
    </button>
  )
}
