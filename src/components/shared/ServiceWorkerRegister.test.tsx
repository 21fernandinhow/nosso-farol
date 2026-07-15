import { render } from "@testing-library/react"
import { ServiceWorkerRegister } from "./ServiceWorkerRegister"

describe("ServiceWorkerRegister", () => {
  afterEach(() => {
    // @ts-expect-error -- limpa o mock entre testes
    delete navigator.serviceWorker
  })

  it("registra o service worker quando o navegador tem suporte", () => {
    const register = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "serviceWorker", { value: { register }, configurable: true })

    render(<ServiceWorkerRegister />)

    expect(register).toHaveBeenCalledWith("/sw.js")
  })

  it("não faz nada quando o navegador não suporta service worker", () => {
    expect(() => render(<ServiceWorkerRegister />)).not.toThrow()
  })
})
