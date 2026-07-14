import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { connectDB } from "@/lib/mongodb"
import { Lighthouse } from "@/models/Lighthouse"
import { Signal } from "@/models/Signal"
import { POST } from "./route"

vi.mock("@/lib/mongodb", () => ({ connectDB: vi.fn() }))
vi.mock("@/models/Lighthouse", () => ({
  Lighthouse: { findOne: vi.fn() },
}))
vi.mock("@/models/Signal", () => ({
  Signal: { create: vi.fn() },
}))
vi.mock("bcryptjs", () => ({ default: { compare: vi.fn() } }))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))

const request = (body: unknown) =>
  new Request("http://localhost/api/lighthouses/para-ana/signal", {
    method: "POST",
    body: JSON.stringify(body),
  })

const call = (body: unknown, slug = "para-ana") =>
  POST(request(body), { params: Promise.resolve({ slug }) })

const findOneChain = (lighthouse: unknown) => ({
  select: vi.fn().mockResolvedValue(lighthouse),
})

describe("POST /api/lighthouses/[slug]/signal", () => {
  beforeEach(() => {
    vi.mocked(connectDB).mockReset()
    vi.mocked(Lighthouse.findOne).mockReset()
    vi.mocked(Signal.create).mockReset()
    vi.mocked(bcrypt.compare).mockReset()
    vi.mocked(revalidatePath).mockReset()
    vi.setSystemTime(new Date("2026-07-13T12:00:00.000Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("retorna 400 para payload inválido", async () => {
    const res = await call({ password: "" })
    expect(res.status).toBe(400)
  })

  it("retorna 404 quando o farol não existe", async () => {
    vi.mocked(Lighthouse.findOne).mockReturnValue(findOneChain(null) as never)

    const res = await call({ password: "senha" })
    expect(res.status).toBe(404)
  })

  it("retorna 401 quando a senha está incorreta", async () => {
    vi.mocked(Lighthouse.findOne).mockReturnValue(
      findOneChain({ passwordHash: "hash", litAt: null }) as never
    )
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

    const res = await call({ password: "errada" })
    expect(res.status).toBe(401)
  })

  it("retorna 409 quando o farol já está aceso hoje", async () => {
    const save = vi.fn()
    vi.mocked(Lighthouse.findOne).mockReturnValue(
      findOneChain({
        passwordHash: "hash",
        litAt: new Date("2026-07-13T02:00:00.000Z"),
        save,
      }) as never
    )
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

    const res = await call({ password: "senha", tz: 0 })
    const data = await res.json()

    expect(res.status).toBe(409)
    expect(data.litAt).toBe("2026-07-13T02:00:00.000Z")
    expect(save).not.toHaveBeenCalled()
    expect(Signal.create).not.toHaveBeenCalled()
  })

  it("acende o farol, cria o Signal e revalida as rotas em caso de sucesso", async () => {
    const save = vi.fn().mockResolvedValue(undefined)
    const lighthouse = {
      _id: "farol-id",
      passwordHash: "hash",
      litAt: new Date("2026-07-12T02:00:00.000Z"),
      save,
    }
    vi.mocked(Lighthouse.findOne).mockReturnValue(findOneChain(lighthouse) as never)
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)
    vi.mocked(Signal.create).mockResolvedValue({} as never)

    const res = await call({ password: "senha", tz: 0 }, "para-ana")
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.isLit).toBe(true)
    expect(lighthouse.litAt.toISOString()).toBe("2026-07-13T12:00:00.000Z")
    expect(save).toHaveBeenCalledTimes(1)
    expect(Signal.create).toHaveBeenCalledWith({ lighthouseId: "farol-id" })
    expect(revalidatePath).toHaveBeenCalledWith("/para-ana")
    expect(revalidatePath).toHaveBeenCalledWith("/api/lighthouses/para-ana/history")
    expect(revalidatePath).toHaveBeenCalledTimes(2)
  })

  it("considera o timezone informado ao calcular a meia-noite local", async () => {
    // tz=180 (UTC-3): meia-noite local de 2026-07-13 é 2026-07-13T03:00:00Z
    const save = vi.fn().mockResolvedValue(undefined)
    const lighthouse = {
      _id: "farol-id",
      passwordHash: "hash",
      litAt: new Date("2026-07-13T01:00:00.000Z"), // antes da meia-noite local, ainda é "ontem" localmente
      save,
    }
    vi.mocked(Lighthouse.findOne).mockReturnValue(findOneChain(lighthouse) as never)
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)
    vi.mocked(Signal.create).mockResolvedValue({} as never)

    const res = await call({ password: "senha", tz: 180 })

    expect(res.status).toBe(200)
    expect(save).toHaveBeenCalledTimes(1)
  })
})
