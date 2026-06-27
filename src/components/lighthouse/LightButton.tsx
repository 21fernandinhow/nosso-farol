"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"

interface LightButtonProps {
  slug: string
  isLit: boolean
}

type State = "idle" | "loading" | "error"

export const LightButton = ({ slug, isLit }: LightButtonProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [password, setPassword] = useState("")
  const [state, setState] = useState<State>("idle")
  const router = useRouter()

  const handleOpen = () => {
    setPassword("")
    setState("idle")
    dialogRef.current?.showModal()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setState("loading")

    const res = await fetch(`/api/lighthouses/${slug}/signal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      dialogRef.current?.close()
      router.refresh()
    } else {
      setState("error")
    }
  }

  return (
    <>
      <button
        className="btn btn-ghost btn-circle text-xl"
        onClick={handleOpen}
        disabled={isLit}
        title={isLit ? "Farol já aceso" : "Acender o farol"}
        aria-label="Acender o farol"
      >
        💡
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Acender o farol</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Senha"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
              minLength={1}
            />
            {state === "error" && (
              <p className="text-error text-sm mt-2">Senha incorreta.</p>
            )}
            <div className="modal-action">
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
                  "Confirmar"
                )}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>fechar</button>
        </form>
      </dialog>
    </>
  )
}
