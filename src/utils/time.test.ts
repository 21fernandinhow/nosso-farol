import { formatStatus } from "./time"

describe("formatStatus", () => {
  beforeEach(() => {
    vi.setSystemTime(new Date("2026-07-13T12:00:00.000Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("retorna mensagem de nunca aceso quando não está aceso e litAt é null", () => {
    expect(formatStatus(false, null)).toBe("Ainda não houve sinais")
  })

  it("retorna 'hoje' quando o último sinal foi hoje mas já apagou", () => {
    expect(formatStatus(false, "2026-07-13T08:00:00.000Z")).toBe("Último sinal hoje")
  })

  it("retorna 'ontem' quando o último sinal foi ontem", () => {
    expect(formatStatus(false, "2026-07-12T08:00:00.000Z")).toBe("Último sinal ontem")
  })

  it("retorna a contagem de dias quando o último sinal foi há mais de um dia", () => {
    expect(formatStatus(false, "2026-07-08T08:00:00.000Z")).toBe("Último sinal há 5 dias")
  })

  it("retorna 'acabou de acender' quando aceso sem litAt", () => {
    expect(formatStatus(true, null)).toBe("Acabou de acender")
  })

  it("retorna 'acabou de acender' quando aceso há menos de 1 minuto", () => {
    expect(formatStatus(true, "2026-07-13T11:59:30.000Z")).toBe("Acabou de acender")
  })

  it("retorna minutos no singular quando aceso há 1 minuto", () => {
    expect(formatStatus(true, "2026-07-13T11:59:00.000Z")).toBe("Aceso há 1 minuto")
  })

  it("retorna minutos no plural quando aceso há vários minutos", () => {
    expect(formatStatus(true, "2026-07-13T11:45:00.000Z")).toBe("Aceso há 15 minutos")
  })

  it("retorna horas no singular quando aceso há 1 hora", () => {
    expect(formatStatus(true, "2026-07-13T11:00:00.000Z")).toBe("Aceso há 1 hora")
  })

  it("retorna horas no plural quando aceso há várias horas", () => {
    expect(formatStatus(true, "2026-07-13T08:00:00.000Z")).toBe("Aceso há 4 horas")
  })
})
