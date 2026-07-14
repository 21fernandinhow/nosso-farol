import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MyLighthouses } from "./MyLighthouses"

const STORAGE_KEY = "nosso-farol:lighthouses"

const seed = (items: Array<{ slug: string; name: string; savedAt: string }>) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))

describe("MyLighthouses", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("não renderiza nada quando não há faróis salvos", () => {
    const { container } = render(<MyLighthouses />)
    expect(container).toBeEmptyDOMElement()
  })

  it("mostra a contagem e a lista ordenada por mais recente", async () => {
    seed([
      { slug: "primeiro", name: "Primeiro", savedAt: "2026-07-01T00:00:00.000Z" },
      { slug: "segundo", name: "Segundo", savedAt: "2026-07-10T00:00:00.000Z" },
    ])
    const user = userEvent.setup()
    render(<MyLighthouses />)

    expect(await screen.findByText("2")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /Meus faróis/ }))

    const items = screen.getAllByRole("link")
    expect(items.map((el) => el.textContent)).toEqual(["Segundo", "Primeiro"])
  })

  it("remove um farol da lista", async () => {
    seed([{ slug: "primeiro", name: "Primeiro", savedAt: "2026-07-01T00:00:00.000Z" }])
    const user = userEvent.setup()
    render(<MyLighthouses />)

    await user.click(await screen.findByRole("button", { name: /Meus faróis/ }))
    await user.click(screen.getByLabelText("Remover Primeiro"))

    expect(screen.queryByText("Primeiro")).not.toBeInTheDocument()
  })
})
