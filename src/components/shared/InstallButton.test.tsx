import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { InstallButton } from "./InstallButton"

const setMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  })
}

const setUserAgent = (ua: string) => {
  Object.defineProperty(navigator, "userAgent", { value: ua, configurable: true })
}

describe("InstallButton", () => {
  beforeEach(() => {
    localStorage.clear()
    setMatchMedia(false)
    setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
  })

  it("não renderiza em modo standalone", () => {
    setMatchMedia(true)
    render(<InstallButton />)
    expect(screen.queryByLabelText("Instalar aplicativo")).not.toBeInTheDocument()
  })

  it("não renderiza se o usuário já dispensou o prompt", () => {
    localStorage.setItem("nosso-farol:install-dismissed", "true")
    render(<InstallButton />)
    expect(screen.queryByLabelText("Instalar aplicativo")).not.toBeInTheDocument()
  })

  it("renderiza o botão quando não está standalone nem dispensado", async () => {
    render(<InstallButton />)
    expect(await screen.findByLabelText("Instalar aplicativo")).toBeInTheDocument()
  })

  it("mostra instruções do Safari/iOS quando o userAgent é de iPhone", async () => {
    setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
    )
    const user = userEvent.setup()
    render(<InstallButton />)

    await user.click(await screen.findByLabelText("Instalar aplicativo"))

    expect(screen.getByText("Adicionar à Tela de Início")).toBeInTheDocument()
  })

  it("mostra instruções do Android quando o userAgent é de Android", async () => {
    setUserAgent(
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36"
    )
    const user = userEvent.setup()
    render(<InstallButton />)

    await user.click(await screen.findByLabelText("Instalar aplicativo"))

    expect(screen.getByText("Instale com um clique:")).toBeInTheDocument()
  })

  it("mostra instruções genéricas para outras plataformas", async () => {
    const user = userEvent.setup()
    render(<InstallButton />)

    await user.click(await screen.findByLabelText("Instalar aplicativo"))

    expect(screen.getByText(/abra o menu/)).toBeInTheDocument()
  })

  it("dispensar salva o flag no localStorage e esconde o botão", async () => {
    const user = userEvent.setup()
    render(<InstallButton />)

    await user.click(await screen.findByLabelText("Instalar aplicativo"))
    await user.click(screen.getByText("Agora não"))

    expect(localStorage.getItem("nosso-farol:install-dismissed")).toBe("true")
    expect(screen.queryByLabelText("Instalar aplicativo")).not.toBeInTheDocument()
  })

  it("exibe o botão 'Instalar app' e dispara o prompt nativo quando beforeinstallprompt é capturado", async () => {
    const prompt = vi.fn()
    const user = userEvent.setup()
    render(<InstallButton />)
    await screen.findByLabelText("Instalar aplicativo")

    const event = new Event("beforeinstallprompt", { cancelable: true }) as Event & { prompt: () => void }
    event.prompt = prompt
    window.dispatchEvent(event)

    await user.click(await screen.findByLabelText("Instalar aplicativo"))
    await user.click(await screen.findByRole("button", { name: "Instalar app" }))

    expect(prompt).toHaveBeenCalled()
  })
})
