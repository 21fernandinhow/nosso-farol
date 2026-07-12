export interface HistoryDay {
  date: string
  lit: boolean
}

export const buildHistoryGrid = (litDates: string[], startDate: Date): HistoryDay[] => {
  const set = new Set(litDates)
  const days: HistoryDay[] = []
  const end = new Date()
  end.setDate(end.getDate() - 1)
  const current = new Date(startDate)

  while (current <= end) {
    const y = current.getFullYear()
    const m = String(current.getMonth() + 1).padStart(2, "0")
    const d = String(current.getDate()).padStart(2, "0")
    const key = `${y}-${m}-${d}`
    days.push({ date: key, lit: set.has(key) })
    current.setDate(current.getDate() + 1)
  }

  return days
}
