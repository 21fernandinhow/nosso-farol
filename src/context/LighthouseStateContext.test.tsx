import { act, render, screen } from "@testing-library/react"
import { LighthouseStateProvider, useLighthouseState } from "./LighthouseStateContext"

const Consumer = () => {
  const state = useLighthouseState()
  return (
    <div>
      <span data-testid="isLit">{String(state?.effectiveIsLit)}</span>
      <span data-testid="litAt">{String(state?.effectiveLitAt)}</span>
      <button onClick={() => state?.setLit(true, "2026-07-13T10:00:00.000Z")}>
        acender
      </button>
    </div>
  )
}

describe("LighthouseStateProvider", () => {
  beforeEach(() => {
    vi.setSystemTime(new Date("2026-07-13T12:00:00.000Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("considera aceso quando litAt é de hoje", async () => {
    render(
      <LighthouseStateProvider litAt="2026-07-13T02:00:00.000Z">
        <Consumer />
      </LighthouseStateProvider>
    )

    expect(await screen.findByTestId("isLit")).toHaveTextContent("true")
  })

  it("considera apagado quando litAt é de um dia anterior", async () => {
    render(
      <LighthouseStateProvider litAt="2026-07-12T23:00:00.000Z">
        <Consumer />
      </LighthouseStateProvider>
    )

    expect(await screen.findByTestId("isLit")).toHaveTextContent("false")
  })

  it("considera apagado quando litAt é null", async () => {
    render(
      <LighthouseStateProvider litAt={null}>
        <Consumer />
      </LighthouseStateProvider>
    )

    expect(await screen.findByTestId("isLit")).toHaveTextContent("false")
  })

  it("setLit sobrepõe o valor computado e atualiza litAt", async () => {
    render(
      <LighthouseStateProvider litAt={null}>
        <Consumer />
      </LighthouseStateProvider>
    )

    await screen.findByTestId("isLit")
    act(() => screen.getByText("acender").click())

    expect(screen.getByTestId("isLit")).toHaveTextContent("true")
    expect(screen.getByTestId("litAt")).toHaveTextContent("2026-07-13T10:00:00.000Z")
  })
})
