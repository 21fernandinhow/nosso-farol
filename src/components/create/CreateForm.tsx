"use client"

import { useCallback, useRef, useState, type SyntheticEvent } from "react"
import { CreatedSuccess } from "./CreatedSuccess"
import { SlugField } from "./SlugField"

type State = "idle" | "loading" | "error" | "slug-taken"

export const CreateForm = () => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [description, setDescription] = useState("")
  const [customSlug, setCustomSlug] = useState("")
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
  const [state, setState] = useState<State>("idle")
  const [createdSlug, setCreatedSlug] = useState<string | null>(null)
  const [createdName, setCreatedName] = useState<string | null>(null)

  const handleOpen = () => {
    setName("")
    setPassword("")
    setDescription("")
    setCustomSlug("")
    setSlugAvailable(null)
    setState("idle")
    setCreatedSlug(null)
    setCreatedName(null)
    dialogRef.current?.showModal()
  }

  const handleAvailabilityChange = useCallback((available: boolean | null) => {
    setSlugAvailable(available)
  }, [])

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (slugAvailable === false) {
      setState("slug-taken")
      return
    }

    setState("loading")

    const res = await fetch("/api/lighthouses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        password,
        description: description.trim() || null,
        customSlug,
      }),
    })

    if (res.ok) {
      const data = await res.json()
      setCreatedSlug(data.slug)
      setCreatedName(data.name)
    } else if (res.status === 409) {
      setState("slug-taken")
    } else {
      setState("error")
    }
  }

  const submitDisabled =
    state === "loading" || !customSlug || slugAvailable !== true

  return (
    <>
      <button className="btn btn-primary btn-lg" onClick={handleOpen}>
        Criar meu farol
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          {createdSlug ? (
            <CreatedSuccess
              slug={createdSlug}
              name={createdName!}
              onClose={() => dialogRef.current?.close()}
            />
          ) : (
            <>
              <h3 className="font-bold text-lg mb-6">Criar um farol</h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm opacity-70">Nome do farol</label>
                  <input
                    type="text"
                    placeholder="ex: para minha avó Maria"
                    className="input input-bordered w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={80}
                    required
                    autoFocus
                  />
                </div>

                <SlugField
                  value={customSlug}
                  onChange={setCustomSlug}
                  onAvailabilityChange={handleAvailabilityChange}
                />

                <div className="flex flex-col gap-1">
                  <label className="text-sm opacity-70">Senha</label>
                  <input
                    type="password"
                    placeholder="Escolha uma senha para acender"
                    className="input input-bordered w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={4}
                    required
                  />
                  <p className="text-xs opacity-50">Guarde bem. Não pode ser recuperada.</p>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm opacity-70">
                    Descrição <span className="opacity-50">(opcional)</span>
                  </label>
                  <textarea
                    placeholder="Uma frase sobre este farol..."
                    className="textarea textarea-bordered w-full resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={256}
                    rows={3}
                  />
                </div>

                {state === "slug-taken" && (
                  <p className="text-error text-sm">Esta URL já está em uso.</p>
                )}
                {state === "error" && (
                  <p className="text-error text-sm">Algo deu errado. Tente novamente.</p>
                )}

                <div className="modal-action mt-0">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => dialogRef.current?.close()}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitDisabled}
                  >
                    {state === "loading" ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      "Criar"
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>fechar</button>
        </form>
      </dialog>
    </>
  )
}