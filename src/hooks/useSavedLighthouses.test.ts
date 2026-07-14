import { act, renderHook } from "@testing-library/react"
import { useSavedLighthouses } from "./useSavedLighthouses"

const STORAGE_KEY = "nosso-farol:lighthouses"

describe("useSavedLighthouses", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("começa vazio e hidrata a partir do localStorage", async () => {
    const { result } = renderHook(() => useSavedLighthouses())

    expect(result.current.hydrated).toBe(true)
    expect(result.current.list).toEqual([])
  })

  it("save adiciona um farol e persiste no localStorage", () => {
    const { result } = renderHook(() => useSavedLighthouses())

    act(() => result.current.save("para-ana", "Para Ana"))

    expect(result.current.list).toEqual([
      { slug: "para-ana", name: "Para Ana", savedAt: expect.any(String) },
    ])
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(stored).toEqual(result.current.list)
  })

  it("save substitui o registro existente com o mesmo slug", () => {
    const { result } = renderHook(() => useSavedLighthouses())

    act(() => result.current.save("para-ana", "Para Ana"))
    act(() => result.current.save("para-ana", "Novo nome"))

    expect(result.current.list).toHaveLength(1)
    expect(result.current.list[0].name).toBe("Novo nome")
  })

  it("remove tira o farol da lista e do localStorage", () => {
    const { result } = renderHook(() => useSavedLighthouses())

    act(() => result.current.save("para-ana", "Para Ana"))
    act(() => result.current.remove("para-ana"))

    expect(result.current.list).toEqual([])
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([])
  })

  it("isSaved reflete se o slug está salvo", () => {
    const { result } = renderHook(() => useSavedLighthouses())

    expect(result.current.isSaved("para-ana")).toBe(false)
    act(() => result.current.save("para-ana", "Para Ana"))
    expect(result.current.isSaved("para-ana")).toBe(true)
  })

  it("ignora e retorna lista vazia quando o localStorage tem JSON corrompido", () => {
    localStorage.setItem(STORAGE_KEY, "{ isso não é json")

    const { result } = renderHook(() => useSavedLighthouses())

    expect(result.current.list).toEqual([])
    expect(result.current.hydrated).toBe(true)
  })

  it("persiste entre instâncias diferentes do hook", () => {
    const first = renderHook(() => useSavedLighthouses())
    act(() => first.result.current.save("para-ana", "Para Ana"))

    const second = renderHook(() => useSavedLighthouses())
    expect(second.result.current.list).toEqual([
      { slug: "para-ana", name: "Para Ana", savedAt: expect.any(String) },
    ])
  })
})
