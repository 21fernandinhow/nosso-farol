"use client"

import { useState } from "react"
import { buildHistoryGrid } from "@/utils/history"

interface LighthouseHistoryProps {
  litDates: string[]
  startDate: string
}

const formatLabel = (date: string, lit: boolean): string => {
  const d = new Date(date + "T12:00:00Z")
  const formatted = d.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  return `${formatted} ·${lit ? " acendeu" : " não acendeu"}`
}

export const LighthouseHistory = ({ litDates, startDate }: LighthouseHistoryProps) => {
  const grid = buildHistoryGrid(litDates, new Date(startDate))
  const [label, setLabel] = useState<string | null>(null)

  if (grid.length === 0) {
    return <p className="text-sm opacity-50 py-4 text-center">Ainda não há histórico.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        role="img"
        aria-label="Histórico de acendimentos"
        style={{
          display: "grid",
          gridTemplateRows: "repeat(7, 12px)",
          gridAutoFlow: "column",
          gridAutoColumns: "12px",
          gap: "2px",
          overflowX: "auto",
        }}
      >
        {grid.map((day) => (
          <div
            key={day.date}
            className={`rounded-sm cursor-default ${day.lit ? "bg-primary" : "bg-base-300"}`}
            onMouseEnter={() => setLabel(formatLabel(day.date, day.lit))}
            onMouseLeave={() => setLabel(null)}
            aria-hidden="true"
          />
        ))}
      </div>
      <p className="text-xs opacity-50 h-4">{label ?? ""}</p>
    </div>
  )
}
