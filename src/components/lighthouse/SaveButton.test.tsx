import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SaveButton } from "./SaveButton"

describe("SaveButton", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("mostra estado 'salvar' quando o farol ainda não está salvo", async () => {
    render(<SaveButton slug="para-ana" name="Ana" />)
    expect(await screen.findByLabelText("Salvar")).toBeInTheDocument()
  })

  it("alterna para 'remover' ao salvar e persiste no localStorage", async () => {
    const user = userEvent.setup()
    render(<SaveButton slug="para-ana" name="Ana" />)

    await user.click(await screen.findByLabelText("Salvar"))

    expect(await screen.findByLabelText("Remover")).toBeInTheDocument()
    expect(localStorage.getItem("nosso-farol:lighthouses")).toContain("para-ana")
  })

  it("remove o farol salvo ao clicar novamente", async () => {
    const user = userEvent.setup()
    render(<SaveButton slug="para-ana" name="Ana" />)

    await user.click(await screen.findByLabelText("Salvar"))
    await user.click(await screen.findByLabelText("Remover"))

    expect(await screen.findByLabelText("Salvar")).toBeInTheDocument()
    expect(localStorage.getItem("nosso-farol:lighthouses")).not.toContain("para-ana")
  })
})
