import { Lighthouse } from "@/models/Lighthouse"
import { generateUniqueSlug } from "./slug"

vi.mock("@/models/Lighthouse", () => ({
  Lighthouse: { exists: vi.fn() },
}))

const existsMock = vi.mocked(Lighthouse.exists)

describe("generateUniqueSlug", () => {
  beforeEach(() => {
    existsMock.mockReset()
  })

  it("normaliza acentos, maiúsculas e caracteres especiais", async () => {
    existsMock.mockResolvedValue(null)
    expect(await generateUniqueSlug("Para minha avó Maria!")).toBe("para-minha-avo-maria")
  })

  it("usa 'farol' como fallback quando o nome não gera nenhum caractere válido", async () => {
    existsMock.mockResolvedValue(null)
    expect(await generateUniqueSlug("!!!")).toBe("farol")
  })

  it("retorna o slug base quando está livre", async () => {
    existsMock.mockResolvedValue(null)
    expect(await generateUniqueSlug("Ana")).toBe("ana")
    expect(existsMock).toHaveBeenCalledTimes(1)
  })

  it("incrementa sufixo numérico em caso de colisão", async () => {
    existsMock
      .mockResolvedValueOnce({ _id: "1" } as never)
      .mockResolvedValueOnce({ _id: "2" } as never)
      .mockResolvedValueOnce(null)

    expect(await generateUniqueSlug("Ana")).toBe("ana-3")
    expect(existsMock).toHaveBeenNthCalledWith(1, { slug: "ana" })
    expect(existsMock).toHaveBeenNthCalledWith(2, { slug: "ana-2" })
    expect(existsMock).toHaveBeenNthCalledWith(3, { slug: "ana-3" })
  })

  it("lança erro quando esgota as 99 tentativas", async () => {
    existsMock.mockResolvedValue({ _id: "taken" } as never)

    await expect(generateUniqueSlug("Ana")).rejects.toThrow("Falha ao gerar slug único.")
  })
})
