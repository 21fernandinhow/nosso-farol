import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { LighthouseStateProvider } from "@/context/LighthouseStateContext"
import { LightButton } from "./LightButton"

const renderWithProvider = (litAt: string | null) =>
  render(
    <LighthouseStateProvider litAt={litAt}>
      <LightButton slug="para-ana" />
    </LighthouseStateProvider>
  )

describe("LightButton", () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("fica desabilitado quando o farol já está aceso", async () => {
    renderWithProvider(new Date().toISOString())

    expect(await screen.findByLabelText("Acender")).toBeDisabled()
  })

  it("fecha o modal e acende ao ter sucesso", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ isLit: true, litAt: "2026-07-13T10:00:00.000Z" }),
    } as Response)
    const user = userEvent.setup()
    renderWithProvider(null)

    await user.click(await screen.findByLabelText("Acender"))
    await user.type(screen.getByPlaceholderText("Senha"), "senha123")
    await user.click(screen.getByRole("button", { name: "Confirmar" }))

    expect(await screen.findByLabelText("Acender")).toBeDisabled()
  })

  it("mostra senha incorreta em caso de 401", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: "Senha incorreta." }),
    } as Response)
    const user = userEvent.setup()
    renderWithProvider(null)

    await user.click(await screen.findByLabelText("Acender"))
    await user.type(screen.getByPlaceholderText("Senha"), "errada")
    await user.click(screen.getByRole("button", { name: "Confirmar" }))

    expect(await screen.findByText("Senha incorreta.")).toBeInTheDocument()
  })

  it("mostra erro genérico para outras falhas", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: "Erro interno." }),
    } as Response)
    const user = userEvent.setup()
    renderWithProvider(null)

    await user.click(await screen.findByLabelText("Acender"))
    await user.type(screen.getByPlaceholderText("Senha"), "senha123")
    await user.click(screen.getByRole("button", { name: "Confirmar" }))

    expect(await screen.findByText("Erro ao acender. Tente novamente.")).toBeInTheDocument()
  })

  it("considera 409 (já aceso) como sucesso e fecha o modal", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 409,
      json: async () => ({ error: "O farol já está aceso hoje.", litAt: "2026-07-13T10:00:00.000Z" }),
    } as Response)
    const user = userEvent.setup()
    renderWithProvider(null)

    await user.click(await screen.findByLabelText("Acender"))
    await user.type(screen.getByPlaceholderText("Senha"), "senha123")
    await user.click(screen.getByRole("button", { name: "Confirmar" }))

    expect(await screen.findByLabelText("Acender")).toBeDisabled()
  })
})
