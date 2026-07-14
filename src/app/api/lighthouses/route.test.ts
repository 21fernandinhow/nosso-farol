import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/mongodb"
import { generateUniqueSlug } from "@/lib/slug"
import { Lighthouse } from "@/models/Lighthouse"
import { POST } from "./route"

vi.mock("@/lib/mongodb", () => ({ connectDB: vi.fn() }))
vi.mock("@/lib/slug", () => ({ generateUniqueSlug: vi.fn() }))
vi.mock("@/models/Lighthouse", () => ({
  Lighthouse: { exists: vi.fn(), create: vi.fn() },
}))
vi.mock("bcryptjs", () => ({ default: { hash: vi.fn() } }))

const request = (body: unknown) =>
  new Request("http://localhost/api/lighthouses", {
    method: "POST",
    body: JSON.stringify(body),
  })

describe("POST /api/lighthouses", () => {
  beforeEach(() => {
    vi.mocked(connectDB).mockReset()
    vi.mocked(generateUniqueSlug).mockReset()
    vi.mocked(Lighthouse.exists).mockReset()
    vi.mocked(Lighthouse.create).mockReset()
    vi.mocked(bcrypt.hash).mockReset().mockResolvedValue("hashed-password" as never)
  })

  it("retorna 400 para payload inválido", async () => {
    const res = await POST(request({ name: "", password: "123" }))
    expect(res.status).toBe(400)
    expect(Lighthouse.create).not.toHaveBeenCalled()
  })

  it("retorna 409 quando o customSlug já está em uso", async () => {
    vi.mocked(Lighthouse.exists).mockResolvedValue({ _id: "1" } as never)

    const res = await POST(
      request({ name: "Ana", password: "senha123", customSlug: "para-ana" })
    )

    expect(res.status).toBe(409)
    expect(Lighthouse.create).not.toHaveBeenCalled()
  })

  it("cria o farol com o customSlug quando está disponível", async () => {
    vi.mocked(Lighthouse.exists).mockResolvedValue(null)
    vi.mocked(Lighthouse.create).mockResolvedValue({} as never)

    const res = await POST(
      request({ name: "Ana", password: "senha123", customSlug: "para-ana" })
    )
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data).toEqual({ slug: "para-ana", name: "Ana" })
    expect(generateUniqueSlug).not.toHaveBeenCalled()
    expect(bcrypt.hash).toHaveBeenCalledWith("senha123", 12)
    expect(Lighthouse.create).toHaveBeenCalledWith({
      name: "Ana",
      description: null,
      slug: "para-ana",
      passwordHash: "hashed-password",
    })
  })

  it("gera um slug automaticamente quando customSlug não é informado", async () => {
    vi.mocked(generateUniqueSlug).mockResolvedValue("ana")
    vi.mocked(Lighthouse.create).mockResolvedValue({} as never)

    const res = await POST(request({ name: "Ana", password: "senha123" }))
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data).toEqual({ slug: "ana", name: "Ana" })
    expect(generateUniqueSlug).toHaveBeenCalledWith("Ana")
    expect(Lighthouse.exists).not.toHaveBeenCalled()
  })
})
