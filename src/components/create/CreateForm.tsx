"use client"

import { useRef, useState } from "react"
import { CreatedSuccess } from "./CreatedSuccess"

type State = "idle" | "loading" | "error"

export const CreateForm = () => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [description, setDescription] = useState("")
  const [state, setState] = useState<State>("idle")
  const [createdSlug, setCreatedSlug] = useState<string | null>(null)
  const [createdName, setCreatedName] = useState<string | null>(null)

  const handleOpen = () => {
    setName("")
    setPassword("")
    setDescription("")
    setState("idle")
    setCreatedSlug(null)
    setCreatedName(null)
    dialogRef.current?.showModal()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setState("loading")

    const res = await fetch("/api/lighthouses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        password,
        description: description.trim() || null,
      }),
    })

    if (res.ok) {
      const data = await res.json()
      setCreatedSlug(data.slug)
      setCreatedName(data.name)
    } else {
      setState("error")
    }
  }

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
                    disabled={state === "loading"}
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
