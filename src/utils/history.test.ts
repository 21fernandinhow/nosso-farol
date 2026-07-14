import { buildHistoryGrid } from "./history"

describe("buildHistoryGrid", () => {
  beforeEach(() => {
    vi.setSystemTime(new Date("2026-07-13T12:00:00.000Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("retorna grid vazio quando o start é hoje (end é sempre ontem)", () => {
    const start = new Date("2026-07-13T00:00:00.000Z")
    expect(buildHistoryGrid([], start)).toEqual([])
  })

  it("nunca inclui o dia de hoje, mesmo que esteja em litDates", () => {
    const start = new Date("2026-07-12T00:00:00.000Z")
    const result = buildHistoryGrid(["2026-07-13"], start)
    expect(result).toEqual([{ date: "2026-07-12", lit: false }])
  })

  it("marca dias soltos e consecutivos corretamente", () => {
    const start = new Date("2026-07-09T00:00:00.000Z")
    const result = buildHistoryGrid(["2026-07-09", "2026-07-11", "2026-07-12"], start)
    expect(result).toEqual([
      { date: "2026-07-09", lit: true },
      { date: "2026-07-10", lit: false },
      { date: "2026-07-11", lit: true },
      { date: "2026-07-12", lit: true },
    ])
  })

  it("ignora datas em litDates fora do intervalo", () => {
    const start = new Date("2026-07-12T00:00:00.000Z")
    const result = buildHistoryGrid(["2026-01-01"], start)
    expect(result).toEqual([{ date: "2026-07-12", lit: false }])
  })
})
