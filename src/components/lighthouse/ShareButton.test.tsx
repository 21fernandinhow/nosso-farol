import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ShareButton } from "./ShareButton"

describe("ShareButton", () => {
  afterEach(() => {
    // @ts-expect-error -- limpa o mock entre testes
    delete navigator.share
    vi.restoreAllMocks()
  })

  it("chama navigator.share com título, texto e url quando disponível", async () => {
    const share = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "share", { value: share, configurable: true })

    const user = userEvent.setup()
    render(<ShareButton name="Para Ana" />)

    await user.click(await screen.findByLabelText("Compartilhar"))

    expect(share).toHaveBeenCalledWith({
      title: "Para Ana",
      text: "Um sinal silencioso de que alguém pensou em você.",
      url: window.location.href,
    })
  })

  it("ignora silenciosamente quando o usuário cancela o compartilhamento nativo", async () => {
    const share = vi.fn().mockRejectedValue(new Error("cancelado"))
    Object.defineProperty(navigator, "share", { value: share, configurable: true })

    const user = userEvent.setup()
    render(<ShareButton name="Para Ana" />)

    await user.click(await screen.findByLabelText("Compartilhar"))

    expect(share).toHaveBeenCalled()
  })

  it("copia a url para a área de transferência quando navigator.share não está disponível", async () => {
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined)

    const user = userEvent.setup()
    render(<ShareButton name="Para Ana" />)

    await user.click(await screen.findByLabelText("Compartilhar"))

    expect(writeText).toHaveBeenCalledWith(window.location.href)
  })
})
