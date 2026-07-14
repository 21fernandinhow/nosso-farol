import { connectDB } from "@/lib/mongodb"
import { Signal } from "@/models/Signal"
import { GET } from "./route"

vi.mock("@/lib/mongodb", () => ({ connectDB: vi.fn() }))
vi.mock("@/models/Signal", () => ({
  Signal: { aggregate: vi.fn() },
}))

const validId = "507f1f77bcf86cd799439011"

const request = (query: string) =>
  new Request(`http://localhost/api/lighthouses/para-ana/history?${query}`)

describe("GET /api/lighthouses/[slug]/history", () => {
  beforeEach(() => {
    vi.mocked(connectDB).mockReset()
    vi.mocked(Signal.aggregate).mockReset()
  })

  it("retorna 400 quando faltam parâmetros", async () => {
    const res = await GET(request(`id=${validId}&tz=0`))
    expect(res.status).toBe(400)
  })

  it("retorna 400 quando o id não é um ObjectId válido", async () => {
    const res = await GET(request("start=2026-07-01&id=abc&tz=0"))
    expect(res.status).toBe(400)
  })

  it("retorna 400 quando o tz não é numérico", async () => {
    const res = await GET(request(`start=2026-07-01&id=${validId}&tz=abc`))
    expect(res.status).toBe(400)
  })

  it("retorna as datas acesas agregadas para os parâmetros válidos", async () => {
    vi.mocked(Signal.aggregate).mockResolvedValue([
      { _id: "2026-07-01" },
      { _id: "2026-07-03" },
    ] as never)

    const res = await GET(request(`start=2026-07-01&id=${validId}&tz=180`))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual({
      litDates: ["2026-07-01", "2026-07-03"],
      startDate: "2026-07-01",
    })

    const pipeline = vi.mocked(Signal.aggregate).mock.calls[0][0] as unknown[]
    expect(pipeline[1]).toEqual({
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "-03:00" } },
      },
    })
  })
})
