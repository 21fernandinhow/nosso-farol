export interface HistoryDay {
  date: string
  count: number
}

export const buildHistoryGrid = (
  apiData: Array<{ _id: string; count: number }>,
  startDate: Date
): HistoryDay[] => {
  const map = new Map(apiData.map((d) => [d._id, d.count]))
  const days: HistoryDay[] = []
  const end = new Date()
  const current = new Date(startDate)

  while (current <= end) {
    const key = current.toISOString().slice(0, 10)
    days.push({ date: key, count: map.get(key) ?? 0 })
    current.setDate(current.getDate() + 1)
  }

  return days
}
