import { render, screen } from "@testing-library/react"
import { LighthouseStateProvider } from "@/context/LighthouseStateContext"
import { LighthouseStatus } from "./LighthouseStatus"

describe("LighthouseStatus", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.setSystemTime(new Date("2026-07-13T12:00:00.000Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("mostra 'ainda não houve sinais' quando nunca foi aceso", async () => {
    render(
      <LighthouseStateProvider litAt={null}>
        <LighthouseStatus />
      </LighthouseStateProvider>
    )

    expect(await screen.findByText("Ainda não houve sinais")).toBeInTheDocument()
  })

  it("mostra há quantos minutos foi aceso quando está aceso hoje", async () => {
    render(
      <LighthouseStateProvider litAt="2026-07-13T11:45:00.000Z">
        <LighthouseStatus />
      </LighthouseStateProvider>
    )

    expect(await screen.findByText("Aceso há 15 minutos")).toBeInTheDocument()
  })

  it("atualiza o texto a cada minuto enquanto aceso", async () => {
    render(
      <LighthouseStateProvider litAt="2026-07-13T11:45:00.000Z">
        <LighthouseStatus />
      </LighthouseStateProvider>
    )

    expect(await screen.findByText("Aceso há 15 minutos")).toBeInTheDocument()

    await vi.advanceTimersByTimeAsync(60_000)

    expect(await screen.findByText("Aceso há 16 minutos")).toBeInTheDocument()
  })
})
