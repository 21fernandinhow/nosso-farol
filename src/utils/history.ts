export interface HistoryDay {
  date: string
  lit: boolean
}

export const buildHistoryGrid = (litDates: string[], startDate: Date): HistoryDay[] => {
  const set = new Set(litDates)
  const days: HistoryDay[] = []
  const end = new Date()
  const current = new Date(startDate)

  while (current <= end) {
    const key = current.toISOString().slice(0, 10)
    days.push({ date: key, lit: set.has(key) })
    current.setDate(current.getDate() + 1)
  }

  return days
}
