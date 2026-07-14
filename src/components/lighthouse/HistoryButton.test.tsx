import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { HistoryButton } from "./HistoryButton"

describe("HistoryButton", () => {
  beforeEach(() => {
    vi.setSystemTime(new Date("2026-07-13T12:00:00.000Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it("mostra o spinner enquanto carrega e depois o histórico", async () => {
    let resolveFetch!: (value: Response) => void
    global.fetch = vi.fn().mockReturnValue(
      new Promise<Response>((resolve) => {
        resolveFetch = resolve
      })
    )
    const user = userEvent.setup()
    render(
      <HistoryButton slug="para-ana" startDate="2026-07-01" lighthouseId="507f1f77bcf86cd799439011" />
    )

    await user.click(screen.getByLabelText("Histórico de sinais"))

    expect(document.querySelector(".loading-spinner")).toBeInTheDocument()

    resolveFetch({
      json: async () => ({ litDates: ["2026-07-01"], startDate: "2026-07-01" }),
    } as Response)

    expect(await screen.findByLabelText("Histórico de acendimentos")).toBeInTheDocument()
    expect(document.querySelector(".loading-spinner")).not.toBeInTheDocument()
  })

  it("não refaz a busca ao abrir o modal uma segunda vez", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ litDates: [], startDate: "2026-07-13" }),
    } as Response)
    const user = userEvent.setup()
    render(
      <HistoryButton slug="para-ana" startDate="2026-07-13" lighthouseId="507f1f77bcf86cd799439011" />
    )

    const button = screen.getByLabelText("Histórico de sinais")
    await user.click(button)
    await screen.findByText("Ainda não há histórico.")
    await user.click(button)

    expect(global.fetch).toHaveBeenCalledTimes(1)
  })
})
