import { NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Lighthouse } from "@/models/Lighthouse"
import { GET } from "./route"

vi.mock("@/lib/mongodb", () => ({ connectDB: vi.fn() }))
vi.mock("@/models/Lighthouse", () => ({
  Lighthouse: { exists: vi.fn() },
}))

const request = (slug: string) =>
  new NextRequest(`http://localhost/api/lighthouses/check?slug=${encodeURIComponent(slug)}`)

describe("GET /api/lighthouses/check", () => {
  beforeEach(() => {
    vi.mocked(connectDB).mockReset()
    vi.mocked(Lighthouse.exists).mockReset()
  })

  it("retorna available: false para slug fora do formato, sem consultar o banco", async () => {
    const res = await GET(request("ab"))
    const data = await res.json()

    expect(data).toEqual({ available: false })
    expect(connectDB).not.toHaveBeenCalled()
    expect(Lighthouse.exists).not.toHaveBeenCalled()
  })

  it("retorna available: false quando o slug já existe", async () => {
    vi.mocked(Lighthouse.exists).mockResolvedValue({ _id: "1" } as never)

    const res = await GET(request("para-ana"))
    const data = await res.json()

    expect(data).toEqual({ available: false })
  })

  it("retorna available: true quando o slug está livre", async () => {
    vi.mocked(Lighthouse.exists).mockResolvedValue(null)

    const res = await GET(request("para-ana"))
    const data = await res.json()

    expect(data).toEqual({ available: true })
  })
})
