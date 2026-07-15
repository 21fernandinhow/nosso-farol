"use client"

import { useRef, useState } from "react"
import { LuFlame } from "react-icons/lu"
import { useLighthouseState } from "@/context/LighthouseStateContext"

interface LightButtonProps {
  slug: string
}

type State = "idle" | "loading" | "error" | "generic-error"

export const LightButton = ({ slug }: LightButtonProps) => {
  const context = useLighthouseState()
  const isLit = context?.effectiveIsLit ?? false
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [password, setPassword] = useState("")
  const [state, setState] = useState<State>("idle")

  const handleOpen = () => {
    setPassword("")
    setState("idle")
    dialogRef.current?.showModal()
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setState("loading")

    const res = await fetch(`/api/lighthouses/${slug}/signal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, tz: new Date().getTimezoneOffset() }),
    })

    if (res.ok || res.status === 409) {
      const data = await res.json()
      dialogRef.current?.close()
      context?.setLit(true, data.litAt)
    } else if (res.status === 401) {
      setState("error")
    } else {
      setState("generic-error")
    }
  }

  return (
    <>
      <button
        className="btn btn-ghost btn-circle tooltip tooltip-top"
        data-tip={"Acender"}
        onClick={handleOpen}
        disabled={isLit}
        aria-label={"Acender"}
      >
        <LuFlame size={20} />
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
            {state === "generic-error" && (
              <p className="text-error text-sm mt-2">Erro ao acender. Tente novamente.</p>
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
