"use client"

import { useEffect, useState } from "react"

interface SavedLighthouse {
  slug: string
  name: string
  savedAt: string
}

const STORAGE_KEY = "nosso-farol:lighthouses"

const readStorage = (): SavedLighthouse[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SavedLighthouse[]) : []
  } catch {
    return []
  }
}

const writeStorage = (list: SavedLighthouse[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {}
}

export const useSavedLighthouses = () => {
  const [list, setList] = useState<SavedLighthouse[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setList(readStorage())
    setHydrated(true)
  }, [])

  const save = (slug: string, name: string) => {
    const next = [
      ...list.filter((l) => l.slug !== slug),
      { slug, name, savedAt: new Date().toISOString() },
    ]
    setList(next)
    writeStorage(next)
  }

  const remove = (slug: string) => {
    const next = list.filter((l) => l.slug !== slug)
    setList(next)
    writeStorage(next)
  }

  const isSaved = (slug: string) => list.some((l) => l.slug === slug)

  return { list, save, remove, isSaved, hydrated }
}
