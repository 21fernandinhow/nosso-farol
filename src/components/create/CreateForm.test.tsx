import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { CreateForm } from "./CreateForm"

const fillRequiredFields = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByPlaceholderText("ex: para minha avó Maria"), "Ana")
  await user.type(screen.getByPlaceholderText("ex: para-ana"), "para-ana")
  await user.type(screen.getByPlaceholderText("Escolha uma senha para acender"), "senha123")
}

describe("CreateForm", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  const openAndAvailable = async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ available: true }),
    } as Response)
    const user = userEvent.setup({ delay: null })
    render(<CreateForm />)
    await user.click(screen.getByText("Criar meu farol"))
    await fillRequiredFields(user)
    await vi.advanceTimersByTimeAsync(500)
    await waitFor(() => expect(screen.getByText("✓ Disponível")).toBeInTheDocument())
    return user
  }

  it("o botão de criar fica desabilitado até slug preenchido e disponível", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ available: true }),
    } as Response)
    const user = userEvent.setup({ delay: null })
    render(<CreateForm />)
    await user.click(screen.getByText("Criar meu farol"))

    expect(screen.getByRole("button", { name: "Criar" })).toBeDisabled()

    await fillRequiredFields(user)
    expect(screen.getByRole("button", { name: "Criar" })).toBeDisabled()

    await vi.advanceTimersByTimeAsync(500)
    await waitFor(() => expect(screen.getByRole("button", { name: "Criar" })).toBeEnabled())
  })

  it("mostra a tela de sucesso quando a criação dá certo", async () => {
    const user = await openAndAvailable()

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ slug: "para-ana", name: "Ana" }),
    } as Response)

    await user.click(screen.getByRole("button", { name: "Criar" }))

    expect(await screen.findByText("Farol criado")).toBeInTheDocument()
    expect(screen.getByDisplayValue(/\/para-ana$/)).toBeInTheDocument()

    const body = JSON.parse(vi.mocked(global.fetch).mock.calls.at(-1)![1]!.body as string)
    expect(body).toEqual({
      name: "Ana",
      password: "senha123",
      description: null,
      customSlug: "para-ana",
    })
  })

  it("mostra erro de slug em uso quando a API retorna 409", async () => {
    const user = await openAndAvailable()

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({ error: "Esta URL já está em uso." }),
    } as Response)

    await user.click(screen.getByRole("button", { name: "Criar" }))

    expect(await screen.findByText("Esta URL já está em uso.")).toBeInTheDocument()
  })

  it("mostra erro genérico para outras falhas", async () => {
    const user = await openAndAvailable()

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: "Erro interno." }),
    } as Response)

    await user.click(screen.getByRole("button", { name: "Criar" }))

    expect(await screen.findByText("Algo deu errado. Tente novamente.")).toBeInTheDocument()
  })
})
