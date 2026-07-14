import { useState } from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SlugField } from "./SlugField"

const Wrapper = ({ onAvailabilityChange }: { onAvailabilityChange: (a: boolean | null) => void }) => {
  const [value, setValue] = useState("")
  return (
    <SlugField value={value} onChange={setValue} onAvailabilityChange={onAvailabilityChange} />
  )
}

describe("SlugField", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it("sanitiza a entrada para minúsculas e remove caracteres inválidos", async () => {
    const user = userEvent.setup({ delay: null })
    const onAvailabilityChange = vi.fn()
    render(<Wrapper onAvailabilityChange={onAvailabilityChange} />)

    await user.type(screen.getByPlaceholderText("ex: para-ana"), "Para Ana!!")

    expect(screen.getByPlaceholderText("ex: para-ana")).toHaveValue("paraana")
  })

  it("marca como inválido sem chamar a API quando tem menos de 3 caracteres", async () => {
    const user = userEvent.setup({ delay: null })
    const onAvailabilityChange = vi.fn()
    render(<Wrapper onAvailabilityChange={onAvailabilityChange} />)

    await user.type(screen.getByPlaceholderText("ex: para-ana"), "ab")
    await vi.advanceTimersByTimeAsync(500)

    expect(screen.getByText(/Apenas letras, números e hífens/)).toBeInTheDocument()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it("faz debounce de 500ms antes de checar disponibilidade e mostra disponível", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      json: async () => ({ available: true }),
    } as Response)
    const user = userEvent.setup({ delay: null })
    const onAvailabilityChange = vi.fn()
    render(<Wrapper onAvailabilityChange={onAvailabilityChange} />)

    await user.type(screen.getByPlaceholderText("ex: para-ana"), "para-ana")
    expect(global.fetch).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(500)

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/lighthouses/check?slug=para-ana"
    )
    await waitFor(() => expect(screen.getByText("✓ Disponível")).toBeInTheDocument())
    expect(onAvailabilityChange).toHaveBeenLastCalledWith(true)
  })

  it("mostra 'já está em uso' quando a API retorna indisponível", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      json: async () => ({ available: false }),
    } as Response)
    const user = userEvent.setup({ delay: null })
    const onAvailabilityChange = vi.fn()
    render(<Wrapper onAvailabilityChange={onAvailabilityChange} />)

    await user.type(screen.getByPlaceholderText("ex: para-ana"), "para-ana")
    await vi.advanceTimersByTimeAsync(500)

    await waitFor(() => expect(screen.getByText("✗ Já está em uso")).toBeInTheDocument())
    expect(onAvailabilityChange).toHaveBeenLastCalledWith(false)
  })
})
