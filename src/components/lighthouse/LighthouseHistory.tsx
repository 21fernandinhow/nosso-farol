import { buildHistoryGrid } from "@/utils/history"

interface LighthouseHistoryProps {
  data: Array<{ _id: string; count: number }>
  startDate: string
}

const colorClass = (count: number): string => {
  if (count === 0) return "bg-base-300"
  if (count === 1) return "bg-primary/40"
  if (count === 2) return "bg-primary/70"
  return "bg-primary"
}

const formatTooltip = (date: string, count: number): string => {
  const d = new Date(date + "T12:00:00Z")
  const formatted = d.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  return `${formatted} · ${count} sinal${count !== 1 ? "is" : ""}`
}

export const LighthouseHistory = ({ data, startDate }: LighthouseHistoryProps) => {
  const grid = buildHistoryGrid(data, new Date(startDate))

  return (
    <div
      className="grid gap-0.5 overflow-x-auto py-1"
      style={{
        gridTemplateRows: "repeat(7, minmax(0, 1fr))",
        gridAutoFlow: "column",
        gridAutoColumns: "min-content",
      }}
    >
      {grid.map((day) => (
        <div
          key={day.date}
          className={`tooltip tooltip-top w-3 h-3 rounded-sm ${colorClass(day.count)}`}
          data-tip={formatTooltip(day.date, day.count)}
        />
      ))}
    </div>
  )
}
