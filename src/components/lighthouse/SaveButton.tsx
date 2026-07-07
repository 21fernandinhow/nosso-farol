"use client"

import { useEffect, useState } from "react"
import { LuBookmark, LuBookmarkCheck } from "react-icons/lu"
import { useSavedLighthouses } from "@/hooks/useSavedLighthouses"

interface SaveButtonProps {
  slug: string
  name: string
}

export const SaveButton = ({ slug, name }: SaveButtonProps) => {
  const { isSaved, save, remove, hydrated } = useSavedLighthouses()
  const [justSaved, setJustSaved] = useState(false)

  useEffect(() => {
    if (!justSaved) return
    const timer = setTimeout(() => setJustSaved(false), 2000)
    return () => clearTimeout(timer)
  }, [justSaved])

  if (!hydrated) return <div className="w-10 h-10" />

  const saved = isSaved(slug)

  const handleToggle = () => {
    if (saved) {
      remove(slug)
      setJustSaved(false)
    } else {
      save(slug, name)
      setJustSaved(true)
    }
  }

  return (
    <button
      onClick={handleToggle}
      className={`btn btn-ghost btn-circle tooltip tooltip-top${saved ? " text-primary" : ""}`}
      data-tip={saved ? "Remover" : "Salvar"}
      aria-label={saved ? "Remover" : "Salvar"}
    >
      {saved ? <LuBookmarkCheck size={20} /> : <LuBookmark size={20} />}
    </button>
  )
}
